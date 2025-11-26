import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ObjectId } from "mongodb";
import Gift from "@/lib/models/Gift";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const gift = await Gift.findOne({ _id: new ObjectId(params.id) });

        if (!gift) {
            return NextResponse.json(
                { message: "Gift not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(gift, { status: 200 });
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            { message: "Failed to fetch gift details" },
            { status: 500 }
        );
    }
}
