import { Profile } from "@/lib/models/Profile";
import { User } from "@/lib/models/User";
import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/requireAuth";

export async function PUT(req: NextRequest) {
    try {
        const decoded = requireAuth(req);
        const body = await req.json();
        const { firstName, lastName, bio, address, phoneNumber } = body;

        await dbConnect();

        // Update User model (phoneNumber)
        const userAccount = await User.findByIdAndUpdate(
            decoded.sub,
            { phoneNumber },
            { new: true }
        );

        if (!userAccount) {
            return NextResponse.json(
                { message: "User account not found" },
                { status: 404 }
            );
        }

        // Update or Create Profile model
        const profile = await Profile.findOneAndUpdate(
            { user: decoded.sub },
            {
                firstName,
                lastName,
                bio,
                address,
                user: decoded.sub,
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Construct the user object to return (same structure as /api/auth/me)
        const userData = {
            _id: userAccount._id,
            email: userAccount.email,
            username: userAccount.username,
            role: userAccount.role,
            phoneNumber: userAccount.phoneNumber,
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            bio: profile.bio || "",
            address: profile.address || "",
            avatar: profile.profilePicture || "",
            name: profile.firstName && profile.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : (userAccount.username || userAccount.email.split('@')[0]),
        };

        return NextResponse.json({
            message: "Profile updated successfully",
            user: userData
        });

    } catch (err: any) {
        console.error("Profile update error:", err);
        const message =
            err.message === "Unauthorized" ? "Unauthorized" : "Failed to update profile";
        const status = message === "Unauthorized" ? 401 : 500;

        return NextResponse.json({ message }, { status });
    }
}
