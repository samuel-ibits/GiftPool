import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";
import GiftClaim from "@/lib/models/GiftClaim";
import { notFound, ok, serverError } from "@/lib/response";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await context.params;

        // Get the gift by slug with specific fields
        const gift = await Gift.findOne({ slug }).select({
            title: 1,
            description: 1,
            image: 1,
            amount: 1,
            currency: 1,
            slug: 1,
            splits: 1,
            dispense: 1,
            duration: 1,
            giftBag: 1,
            "expectedParticipant.choice": 1,
            "expectedParticipant.allowRepeat": 1,
            "expectedParticipant.private": 1,
            "expectedParticipant.name": 1,
            "expectedParticipant.email": 1,
            "expectedParticipant.nin": 1,
            "expectedParticipant.bvn": 1,
            "expectedParticipant.secretCode": 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            verified: 1,
            user: 1,

        }).lean();

        if (!gift || Array.isArray(gift)) return notFound("Gift not found");

        // Find all claims related to the gift (public info only)
        const claims = await GiftClaim.find({ gift: (gift as { _id: unknown })._id })
            .select("claimDetails.claimedAt -_id") // Only show when it was claimed, not who claimed it specifically unless intended
            .lean();

        return ok({ ...gift, claims });
    } catch (error) {
        console.error("Error fetching gift and claims:", error);
        return serverError("Failed to fetch gift details");
    }
}
