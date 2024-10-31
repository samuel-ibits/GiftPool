// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import clientPromise from "../../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { email, password } = req.body;
        const client = await clientPromise;
        const db = client.db();

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").insertOne({ email, password: hashedPassword });

        res.status(200).json({ message: "User registered" });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
export default handler;