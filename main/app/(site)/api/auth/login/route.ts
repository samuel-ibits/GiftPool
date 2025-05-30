import { NextRequest, NextResponse } from "next/server";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { User } from "@/models/user";
import { connectToDatabase } from '@/lib/mongoose';


async function verifyPassword(input: string, hashed: string) {
  return bcrypt.compare(input, hashed);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const { email, password } = body;

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "Account does not exist. Create an account." },
      { status: 404 }
    );
  }
  if (!(await verifyPassword(password, user.password))) {
    return NextResponse.json(
      { message: "Wrong Password. Reset it if you forgot it." },
      { status: 401 }
    );
  }

  const accessToken = signAccessToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role || "admin",
  });

  const { token: refreshToken, jti: newJTI } = signRefreshToken(
    user._id.toString()
  );

  user.refreshTokenJTI = newJTI;
  await user.save();

  const accessCookie = `access-token=${accessToken}; HttpOnly; Path=/; Max-Age=900; ${process.env.NODE_ENV === "production" ? "Secure; SameSite=Lax;" : ""
    }`;

  const refreshCookie = `refresh-token=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; ${process.env.NODE_ENV === "production" ? "Secure; SameSite=Lax;" : ""
    }`;

  const response = new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Use response.headers.append() for multiple Set-Cookie values
  response.headers.append("Set-Cookie", accessCookie);
  response.headers.append("Set-Cookie", refreshCookie);

  return response;
}
