import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";
import { ok, serverError } from "@/lib/response";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/middleware/requireAuth";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const user = requireAuth(req);

        const {
            title,
            description,
            image,
            amount = 0,
            splits = 1,
            verified = false,
            duration = 1,
            dispense = Date.now(),
            slug,
        } = body;

        if (!title || !amount) {
            return serverError("Missing required fields");
        }

        let gift;

        // If slug exists and matches a gift, update it
        if (slug) {
            gift = await Gift.findOneAndUpdate(
                { slug },
                {
                    $set: {
                        user: user.sub,
                        title,
                        description,
                        image,
                        amount,
                        splits,
                        verified,
                        duration,
                        dispense,
                    },
                },
                { new: true }
            );
        }

        // If no gift found or no slug, create a new one
        if (!gift) {
            gift = new Gift({
                user: user.sub,
                title,
                description,
                image,
                amount,
                splits,
                verified,
                duration,
                dispense,
                slug, // If slug was passed, include it. Otherwise Mongoose can generate one or leave it null.
            });

            await gift.save();
        }

        return ok(gift, "Gift created or updated successfully");

    } catch (error) {
        console.error("Error creating or updating gift:", error);
        return serverError("Internal server error: " + error);
    }
}
