import { Profile } from "@/lib/models/Profile";
import { User } from "@/lib/models/User";
import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/requireAuth";

export async function GET(req: NextRequest) {
  try {
    const decoded = requireAuth(req);

    await dbConnect();

    // Fetch profile and populate user data
    // Note: We need to fetch both because some data is in User and some in Profile
    const profile = await Profile.findOne({ user: decoded.sub });
    const userAccount = await User.findById(decoded.sub);

    if (!userAccount) {
      return NextResponse.json(
        { message: "User account not found" },
        { status: 404 }
      );
    }

    // Construct the user object to return
    const userData = {
      _id: userAccount._id,
      email: userAccount.email,
      username: userAccount.username,
      role: userAccount.role,
      phoneNumber: userAccount.phoneNumber,
      // Profile data (if exists)
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      bio: profile?.bio || "",
      address: profile?.address || "",
      avatar: profile?.profilePicture || "",
      // Computed name
      name: profile?.firstName && profile?.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : (userAccount.username || userAccount.email.split('@')[0]),
    };

    return NextResponse.json({ user: userData });
  } catch (err: any) {
    const message =
      err.message === "Unauthorized" ? "Unauthorized" : "Invalid token";
    const status = message === "Unauthorized" ? 401 : 403;

    return NextResponse.json({ message }, { status });
  }
}
