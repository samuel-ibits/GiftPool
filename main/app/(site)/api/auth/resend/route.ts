import { NextResponse } from "next/server";
import { connectToDatabase } from '@/lib/mongoose';
import { User } from "@/models/user";
import { generateOtp } from "@/lib/otp";
import { resendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  await connectToDatabase();

  const admin = await User.findOne({ email });

  if (!admin) {
    return NextResponse.json({ message: "Admin not found" }, { status: 404 });
  }

  const otp = generateOtp();

  admin.verificationCode = otp;
  await admin.save();

  await resendOtpEmail(email, otp);

  return NextResponse.json(
    { message: "OTP sent successfully" },
    { status: 200 }
  );
}
