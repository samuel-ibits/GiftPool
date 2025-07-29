import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ObjectId } from "mongodb";
import Gift from "@/lib/models/Gift";
import { notFound, ok, serverError } from "@/lib/response";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const giftId = params.id;
        const db = await dbConnect();

        const gift = await Gift.findOne({ _id: new ObjectId(giftId) });

        if (!gift) {
            return notFound("Gift not found");
        }

        return ok(gift);
    } catch (error) {
        console.error("Error fetching gift details:", error);
        return serverError("Failed to fetch gift details");
    }
}
