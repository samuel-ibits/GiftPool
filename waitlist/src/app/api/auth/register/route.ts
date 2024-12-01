// pages/api/auth/register/route.ts

// import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb";

interface RegisterRequestBody {
    email: string;
    password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { email, password }: RegisterRequestBody = await request.json();

        const client = await clientPromise;
        const db = client.db();

        // Hash the password using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user document
        const result = await db.collection("users").insertOne({
            email,
            password: hashedPassword,
        });

        // Return a success response
        return NextResponse.json(
            {
                message: "User created successfully",
                data: result,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);

        // Return an error response
        return NextResponse.json(
            {
                message: "User account creation failed",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
