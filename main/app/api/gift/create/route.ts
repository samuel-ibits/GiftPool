import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db"; // make sure this connects to your MongoDB
import Gift from "@/lib/models/Gift";
import { ok, serverError } from "@/lib/response";

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/requireAuth";

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        await dbConnect();
        const body = await req.json();
        const user = requireAuth(req)

        const {
            title,
            description,
            image,
            amount,
            splits,
            verified = false,
            duration = 0,
            dispense = "manual",
        } = body;

        if (!title || !amount || !splits) {
            return serverError("Missing required fields");
        }

        const gift = new Gift({
            user: user.sub,
            title,
            description,
            image,
            amount,
            splits,
            verified,
            duration,
            dispense,
        });

        await gift.save();
        return ok(gift, "Gift created successfully");

    } catch (error) {
        console.error("Error creating gift:", error);
        return serverError("Internal server error" + error);
    }
}
