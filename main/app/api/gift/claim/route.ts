import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";
import { notFound, serverError } from "@/lib/response";
import { ok } from "assert";

export async function POST(request: Request) {
    try {
        const { email, name, phone, wallet, account } = await request.json();
        await dbConnect();

        // Update gift record with claim info
        const result = await Gift.findOneAndUpdate(
            { email, name, claimed: false },
            {
                $set: {
                    claimed: true,
                    claimDetails: {
                        phone,
                        wallet,
                        account,
                        claimedAt: new Date(),
                    }
                }
            },
            { returnDocument: "after" }
        );

        if (!result.value) {
            return notFound("Gift not found or already claimed");
        }

        return ok("Claim submitted successfully");
    } catch (error) {
        console.error("Claim submission error:", error);
        return serverError("Internal Server Error");
    }
}
