import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/requireAuth";
import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const decoded = requireAuth(req);
        const { slug } = params;

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
                { message: "Unauthorized to delete this gift" },
                { status: 403 }
            );
        }

        await Gift.deleteOne({ slug });

        return NextResponse.json({
            success: true,
            message: "Gift deleted successfully",
        });
    } catch (err: any) {
        console.error("Error deleting gift:", err);
        const message =
            err.message === "Unauthorized" ? "Unauthorized" : "Failed to delete gift";
        const status = message === "Unauthorized" ? 401 : 500;
        return NextResponse.json({ message }, { status });
    }
}
