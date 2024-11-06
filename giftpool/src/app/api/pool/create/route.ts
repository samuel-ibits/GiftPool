import { NextResponse } from "next/server";
import mongoose from "mongoose";
import RaisePool from "@/models/RaisePool";
import clientPromise from "@/lib/mongodb";

// Define the request interface for type safety
interface RaisePoolRequestBody {
    type: "public" | "private";
    targetAmount: number;
    title: string;
    description: string;
    image?: string;
    websiteLink: string;
    socials: {
        x?: string;
        instagram?: string;
        facebook?: string;
        linkedin?: string;
    };
    duration: number;
    creatorId: string; // Easier handling as string, then convert to ObjectId
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        console.log('data', await request.json());

        const body: RaisePoolRequestBody = await request;
        console.log(body);

        await clientPromise; // Ensure MongoDB connection is established

        // Convert `creatorId` to a MongoDB ObjectId
        const creatorObjectId = new mongoose.Types.ObjectId(body.creatorId);

        // Create a new instance of the RaisePool model
        const newRaisePool = new RaisePool({
            ...body,
            creatorId: creatorObjectId,
            status: "active",
        });

        // Save the new pool document to the database
        const result = await newRaisePool.save();

        // Respond with a success message
        return NextResponse.json(
            {
                message: "Raise pool created successfully",
                data: result,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating raise pool:", error);

        // Respond with an error message if something goes wrong
        return NextResponse.json(
            {
                message: "Failed to create raise pool",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
