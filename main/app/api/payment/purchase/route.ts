import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/response";
import { requireAuth } from "@/lib/middleware/requireAuth";
import { Wallet } from "@/lib/models/Wallet";
import { initializePayment2 } from "@/lib/paystack";
import { deductFunds } from "@/lib/wallet";
import { getUserFromUserid } from "@/lib/utils";
import { metadata } from "@/app/(main)/page";
import Gift from "@/lib/models/Gift";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const user = requireAuth(request);
        const userDetails = await getUserFromUserid(user.sub);
        const uuid = userDetails.uuid;

        if (!body.type || !body.orderId) {
            return badRequest("Type and orderId are required");
        }

        if (body.type == "gift") {
            const gift = await Gift.findOne({ slug: body.orderId });
            if (!gift) {
                return badRequest("Gift not found");
            }
            const paymentInit = await initializePayment2(
                user.email,
                gift.amount,
                {
                    type: 'gift',
                    amount: gift.amount,
                    items: [],
                    uuid,
                    orderId: body.orderId
                }

            );
            return ok({
                success: true,
                message: "Payment initialized",
                data: paymentInit,
            });
        }
    } catch (error) {
        console.error("Failed to initialize payment:", error);
        return serverError("Failed to initialize payment: " + error);
    }
}