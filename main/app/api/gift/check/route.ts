import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gift from "@/lib/models/Gift";
import GiftClaim from "@/lib/models/GiftClaim";
import { notFound, ok, serverError, badRequest } from "@/lib/response";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { slug } = body;

        if (!slug) {
            return badRequest("Slug is required");
        }

        await dbConnect();

        // Step 1: Find the gift
        const gift = await Gift.findOne({ slug });
        if (!gift) {
            return notFound("No gift found");
        }

        // Step 2: Get expected participant configuration
        const expectedParticipant = gift.expectedParticipant || {
            choice: ["name", "email"],
            allowRepeat: false,
        };

        // Step 3: Validate required fields are present
        const requiredFields = expectedParticipant.choice || ["name", "email"];
        const missingFields: string[] = [];

        for (const field of requiredFields) {
            if (!body[field] || !body[field].trim()) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            return badRequest(`Missing required fields: ${missingFields.join(", ")}`);
        }

        // Step 4: Validate field formats
        for (const field of requiredFields) {
            const value = body[field].trim();

            if (field === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return badRequest("Invalid email format");
                }
            }

            if (field === "nin" && value.length !== 11) {
                return badRequest("NIN must be exactly 11 digits");
            }

            if (field === "bvn" && value.length !== 11) {
                return badRequest("BVN must be exactly 11 digits");
            }
        }

        // Step 5: Verify against expected values if they exist
        if (expectedParticipant.name && body.name) {
            if (expectedParticipant.name.toLowerCase() !== body.name.trim().toLowerCase()) {
                return badRequest("Name does not match expected recipient");
            }
        }

        if (expectedParticipant.email && body.email) {
            if (expectedParticipant.email.toLowerCase() !== body.email.trim().toLowerCase()) {
                return badRequest("Email does not match expected recipient");
            }
        }

        if (expectedParticipant.nin && body.nin) {
            if (expectedParticipant.nin !== body.nin.trim()) {
                return badRequest("NIN does not match expected recipient");
            }
        }

        if (expectedParticipant.bvn && body.bvn) {
            if (expectedParticipant.bvn !== body.bvn.trim()) {
                return badRequest("BVN does not match expected recipient");
            }
        }

        if (expectedParticipant.secretCode && body.secretCode) {
            if (expectedParticipant.secretCode !== body.secretCode.trim()) {
                return badRequest("Invalid secret code");
            }
        }

        // Step 6: Check if already claimed (if repeat not allowed)
        if (!expectedParticipant.allowRepeat) {
            const queryConditions: any = { giftId: gift._id };

            // Check based on provided verification fields
            if (body.email) {
                queryConditions.email = body.email.trim().toLowerCase();
            } else if (body.nin) {
                queryConditions.nin = body.nin.trim();
            } else if (body.bvn) {
                queryConditions.bvn = body.bvn.trim();
            }

            const existingClaim = await GiftClaim.findOne(queryConditions);

            if (existingClaim) {
                return badRequest("You have already claimed this gift");
            }
        }

        // Step 7: Check if gift has reached maximum claims (splits)
        const totalClaims = await GiftClaim.countDocuments({ giftId: gift._id });
        if (totalClaims >= gift.splits) {
            return badRequest("This gift has reached maximum claims");
        }

        // Step 8: Create or retrieve pending GiftClaim
        const claimData = {
            giftId: gift._id,
            giftName: gift.title,
            email: body.email?.trim().toLowerCase() || "",
            name: body.name?.trim() || "Participant",
            claimed: false,
            claimDetails: {
                secretCode: body.secretCode?.trim(),
                nin: body.nin?.trim(),
                bvn: body.bvn?.trim(),
                name: body.name?.trim(),
            }
        };

        // If we have an email (mandatory for claim record), ensure record exists
        if (claimData.email) {
            await GiftClaim.findOneAndUpdate(
                { email: claimData.email, giftId: gift._id, claimed: false },
                { $set: claimData },
                { upsert: true, new: true }
            );
        }

        // Step 9: Return success with gift data
        return ok({
            message: "Verification successful",
            gift: {
                id: gift._id,
                title: gift.title,
                description: gift.description,
                imageUrl: gift.image,
                value: `$${(gift.amount / gift.splits).toFixed(2)}`,
                duration: gift.duration,
                giftBag: gift.giftBag,
                expectedParticipant: {
                    choice: expectedParticipant.choice,
                    allowRepeat: expectedParticipant.allowRepeat,
                },
            },
        });
    } catch (error) {
        console.error("Gift check error:", error);
        return serverError("Internal Server Error");
    }
}