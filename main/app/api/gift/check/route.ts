import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";
import GiftClaim from "@/lib/models/GiftClaim";
import { notFound, ok, serverError, badRequest } from "@/lib/response";

export async function POST(request: Request) {
    try {
        const { email, name, slug } = await request.json();
        if (!email || !name || !slug) return badRequest("Name, Slug and email are required");

        await dbConnect();

        // Step 1: Check if gift exists and is unclaimed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        const gift = await Gift.findOne({ slug });
        if (!gift) return notFound("No gift found");

        // Step 2: Check if already claimed
        const existingClaim = await GiftClaim.findOne({
            email,
            giftId: gift._id,
        });

        if (existingClaim) return badRequest("Gift already claimed");

        // Step 3: Create the claim
        const giftClaim = await GiftClaim.create({
            name,
            email,
            giftId: gift._id,
            giftName: gift.name || "Unnamed Gift",
            claimDetails: {
                claimedAt: new Date(),
            },
        });

        return ok({
            message: "Gift successfully claimed",
            claim: giftClaim,
            gift
        });
    } catch (error) {
        console.error("Gift claim error:", error);
        return serverError("Internal Server Error");
    }
}
