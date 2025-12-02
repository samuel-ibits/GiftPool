import { NextRequest, NextResponse } from "next/server";
import { splitEngine } from "@/lib/splitEngine";

/**
 * Cron endpoint to run the split engine
 * This should be called by a cron service (e.g., Vercel Cron, GitHub Actions, or external cron)
 * 
 * Security: Add authorization header check in production
 */
export async function GET(req: NextRequest) {
    try {
        // Optional: Add authorization check
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log("Running split engine cron job...");
        const results = await splitEngine();

        return NextResponse.json({
            success: true,
            message: "Split engine executed successfully",
            results,
        });
    } catch (error) {
        console.error("Cron job error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

/**
 * Manual trigger endpoint (for testing)
 * POST with { giftId: "..." } to process a specific gift
 */
export async function POST(req: NextRequest) {
    try {
        const { giftId } = await req.json();

        if (!giftId) {
            return NextResponse.json(
                { error: "giftId is required" },
                { status: 400 }
            );
        }

        const { processSingleGift } = await import("@/lib/splitEngine");
        const result = await processSingleGift(giftId);

        return NextResponse.json({
            success: true,
            message: "Gift processed successfully",
            result,
        });
    } catch (error) {
        console.error("Manual trigger error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
