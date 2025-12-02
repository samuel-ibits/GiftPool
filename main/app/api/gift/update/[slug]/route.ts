import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/requireAuth";
import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const decoded = requireAuth(req);
        const { slug } = await params;
        const body = await req.json();

        await dbConnect();

        // Find the gift and verify ownership
        const gift = await Gift.findOne({ slug });

        if (!gift) {
            return NextResponse.json(
                { message: "Gift not found" },
                { status: 404 }
            );
        }

        // Verify the user owns this gift
        if (gift.user.toString() !== decoded.sub) {
            return NextResponse.json(
                { message: "Unauthorized to edit this gift" },
                { status: 403 }
            );
        }

        // Update allowed fields
        const allowedFields = [
            "title",
            "description",
            "amount",
            "splits",
            "duration",
            "dispense",
            "giftBag",
        ];

        allowedFields.forEach((field) => {
            if (body[field] !== undefined) {
                gift[field] = body[field];
            }
        });

        await gift.save();

        return NextResponse.json({
            success: true,
            message: "Gift updated successfully",
            data: gift,
        });
    } catch (err: any) {
        console.error("Error updating gift:", err);
        const message =
            err.message === "Unauthorized" ? "Unauthorized" : "Failed to update gift";
        const status = message === "Unauthorized" ? 401 : 500;
        return NextResponse.json({ message }, { status });
    }
}
