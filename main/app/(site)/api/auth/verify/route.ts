import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { verifyOtpAndGenerateToken } from "@/lib/otp";
import type { VerifiedAdmin } from "@/types/auth";
import { sendWelcomeEmail } from "@/lib/mailer";
import { connectToDatabase } from '@/lib/mongoose';
import { Profile } from "@/models/profile";

export async function POST(req: Request) {
  const { otp } = await req.json();

  try {
    const { accessToken, refreshToken, user }: VerifiedAdmin =
      await verifyOtpAndGenerateToken(otp);

    await connectToDatabase();

    const newProfile = new Profile({
      user: user.id,
      email: user.email,
      username: user.username,
    });

    await newProfile.save();

    const accessCookie = serialize("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes
      path: "/",
    });

    const refreshCookie = serialize("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    const response = new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Use response.headers.append() for multiple Set-Cookie values
    response.headers.append("Set-Cookie", accessCookie);
    response.headers.append("Set-Cookie", refreshCookie);

    await sendWelcomeEmail(user.email);

    return response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Unknown error" },
      { status: 500 }
    );
  }
}
