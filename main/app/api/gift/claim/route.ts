import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";
import { notFound, serverError, ok } from "@/lib/response";
import GiftClaim from "@/lib/models/GiftClaim";
// import { splitEngine } from "@/lib/splitEngine";
export async function POST(request: Request) {
    try {
        const { email, phone, wallet, bankName, accountNumber } = await request.json();
        await dbConnect();

        // Update gift record with claim info

        const result = await GiftClaim.findOneAndUpdate(
            { email, claimed: false },
            {
                $set: {
                    claimed: true,
                    claimDetails: {
                        phone,
                        wallet,
                        bank: { bankName, accountNumber },
                        claimedAt: new Date(),
                    }
                }
            },
            { returnDocument: "after" }
        );
        console.log("Claim result:", result);
        if (!result) {
            return notFound("Gift not found or already claimed");
        }
        //proceed to split engine
        // await splitEngine(result);
        return ok(result, "Claim submitted successfully");
    } catch (error) {
        console.error("Claim submission error:", error);
        return serverError("Internal Server Error");
    }
}
