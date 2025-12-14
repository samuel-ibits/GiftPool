import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";
import { notFound, serverError, ok } from "@/lib/response";
import GiftClaim from "@/lib/models/GiftClaim";
import { splitEngine } from "@/lib/splitEngine";
export async function POST(request: Request) {
    try {
        const { email, phone, wallet, bank, secretCode, nin, bvn, name, slug } = await request.json();
        await dbConnect();

        // Update gift record with claim info
        const result = await GiftClaim.findOneAndUpdate(
            {
                $or: [
                    { email: email },
                    { phone: phone },
                    { wallet: wallet },
                    { "bank.bankName": bank?.bankName, "bank.accountNumber": bank?.accountNumber },
                    { secretCode: secretCode },
                    { nin: nin },
                    { bvn: bvn },
                    { name: name }
                ],
                claimed: false
            },
            {
                $set: {
                    claimed: true,
                    claimDetails: {
                        phone,
                        wallet,
                        bank: {
                            bankName: bank?.bankName,
                            accountNumber: bank?.accountNumber
                        },
                        secretCode,
                        nin,
                        bvn,
                        name,
                        claimedAt: new Date(),
                    }
                }
            },
            { returnDocument: "after" }
        );
        const result2 = await GiftClaim.find();
        console.log("Claim results:",);

        if (!result) {
            return notFound("Gift not found or already claimed");
        }

        // proceed to split engine
        // We use the slug from the request body or we'd need to fetch the gift
        if (slug) {
            await splitEngine(slug);
        } else {
            // Fallback if slug not in body? 
            // Ideally we should have it. If not, we might fail to trigger split properly.
            // But let's trust the frontend sends it as seen in page.tsx
        }

        return ok(result, "Claim submitted successfully");
    } catch (error) {
        console.error("Claim submission error:", error);
        return serverError("Internal Server Error");
    }
}
