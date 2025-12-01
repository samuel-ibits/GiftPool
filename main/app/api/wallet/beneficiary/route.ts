import { Wallet } from "@/lib/models/Wallet";
import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/requireAuth";

export async function GET(req: NextRequest) {
    try {
        const decoded = requireAuth(req);
        await dbConnect();

        const wallet = await Wallet.findOne({ user: decoded.sub });

        if (!wallet) {
            return NextResponse.json({ beneficiaries: [] });
        }

        return NextResponse.json({ beneficiaries: wallet.beneficiary });
    } catch (err: any) {
        const message =
            err.message === "Unauthorized" ? "Unauthorized" : "Failed to fetch beneficiaries";
        const status = message === "Unauthorized" ? 401 : 500;
        return NextResponse.json({ message }, { status });
    }
}

export async function POST(req: NextRequest) {
    try {
        const decoded = requireAuth(req);
        const body = await req.json();
        const { name, accountNumber, bank, accountType } = body;

        if (!name || !accountNumber || !bank) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await dbConnect();

        const wallet = await Wallet.findOneAndUpdate(
            { user: decoded.sub },
            {
                $push: {
                    beneficiary: {
                        name,
                        accountNumber,
                        bank,
                        accountType,
                    },
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({
            message: "Beneficiary added successfully",
            beneficiaries: wallet.beneficiary
        });

    } catch (err: any) {
        const message =
            err.message === "Unauthorized" ? "Unauthorized" : "Failed to add beneficiary";
        const status = message === "Unauthorized" ? 401 : 500;
        return NextResponse.json({ message }, { status });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const decoded = requireAuth(req);
        const { searchParams } = new URL(req.url);
        const accountNumber = searchParams.get("accountNumber");

        if (!accountNumber) {
            return NextResponse.json(
                { message: "Account number required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const wallet = await Wallet.findOneAndUpdate(
            { user: decoded.sub },
            {
                $pull: {
                    beneficiary: { accountNumber },
                },
            },
            { new: true }
        );

        if (!wallet) {
            return NextResponse.json(
                { message: "Wallet not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Beneficiary deleted successfully",
            beneficiaries: wallet.beneficiary
        });

    } catch (err: any) {
        const message =
            err.message === "Unauthorized" ? "Unauthorized" : "Failed to delete beneficiary";
        const status = message === "Unauthorized" ? 401 : 500;
        return NextResponse.json({ message }, { status });
    }
}
