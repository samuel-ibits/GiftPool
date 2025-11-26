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

        // Get the gift by slug
        const gift = await Gift.findOne({ slug }).lean();
        if (!gift || Array.isArray(gift)) return notFound("Gift not found");

        // Find all claims related to the gift
        const claims = await GiftClaim.find({ gift: (gift as { _id: unknown })._id }).lean();

        return ok({ ...gift, claims });
    } catch (error) {
        console.error("Error fetching gift and claims:", error);
        return serverError("Failed to fetch gift details");
    }
}
