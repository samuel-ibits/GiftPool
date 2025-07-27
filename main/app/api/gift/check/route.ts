import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ObjectId } from "mongodb";
import Gift from "@/lib/models/Gift";
import { notFound, ok, serverError } from "@/lib/response";

export async function POST(request: Request) {
    try {
        const { email, name } = await request.json();
        await dbConnect();

        const gift = await Gift.findOne({
            email,
            name,
            claimed: false
        });

        if (!gift) {
            return notFound("No gift found");
        }

        return ok(gift);
    } catch (error) {
        console.error("Gift check error:", error);
        return serverError("Internal Server Error");
    }
}
