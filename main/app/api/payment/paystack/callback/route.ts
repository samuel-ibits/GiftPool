import axios from "axios";
import connectDB from "@/lib/db";
import { ok, badRequest, serverError, notFound } from "@/lib/response";
import { Wallet } from "@/lib/models/Wallet";
import { addFunds, deductFunds } from "@/lib/wallet";
import { getUserFromUuid } from "@/lib/utils";
import { Iuser } from "@/lib/types/auth";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
        return badRequest("Missing reference");
    }


    try {
        await connectDB();

        // Step 1: Verify payment
        const { data } = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const payment = data?.data;
        console.log("Payment verification result:", payment);
        if (!payment || payment.status !== "success") {
            return badRequest("Payment not successful");
        }

        const { type, amount, uuid, orderId } = payment.metadata;

        const user: Iuser = await getUserFromUuid(uuid);

        if (!user._id) {
            badRequest("Missing order ID from payment metadata");
        }

        if (type == "wallet") {
            console.log("Adding funds to wallet for user:", user);
            const wallet = await Wallet.findOne({ user: user._id });

            // 1. Check if the reference is already recorded
            const isDuplicate = wallet.transactions.some((tx: { reference?: string }) => tx.reference === reference);

            if (isDuplicate) {
                return serverError('Transaction already processed');
            }
            const funds = await addFunds({ amount, userId: user._id, reference });
            return ok(funds, "Funds  processed successfully");
        }
        if (type == "gift") {
            console.log("Deducting funds for gift order:", orderId);
            const result = await deductFunds({
                amount,
                userId: user._id,
                reference,
            });

            if (!result) {
                return serverError("Failed to process gift order");
            }

            return ok(result, "Gift order processed successfully");
        }


    } catch (err: unknown) {
        console.error("Verification failed:", err);
        return serverError()
    }
}
