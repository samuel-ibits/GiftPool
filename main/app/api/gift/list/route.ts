import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";
import { ok, serverError } from "@/lib/response";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const gifts = await Gift.find();

        return ok(gifts);
    } catch (error) {
        console.error("Error fetching gift list:", error);
        return serverError("Failed to fetch gifts");
    }
}
