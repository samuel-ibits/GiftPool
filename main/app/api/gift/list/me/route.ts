import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";
import { ok, serverError } from "@/lib/response";
import { requireAuth } from "@/lib/middleware/requireAuth";

export async function GET(req: NextRequest) {
    try {
        const user = requireAuth(req);
        await dbConnect();
        const gifts = await Gift.find({ user: user.sub });

        return ok(gifts);
    } catch (error) {
        console.error("Error fetching gift list:", error);
        return serverError("Failed to fetch gifts");
    }
}
