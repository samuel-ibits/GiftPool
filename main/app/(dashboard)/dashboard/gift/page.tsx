import Gift from "@/lib/models/Gift";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import { cookies } from "next/headers";

interface GiftType {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  createdAt: string;
}

async function getGifts() {
  // const token = localStorage.getItem("access-token");
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/gift/list/me`,
    {
      headers: {
        Cookie: `access-token=${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    console.log(res);
  }

  const data = await res.json();
  console.log(data);
  return data.data || [];
}

export default async function GiftPage() {
  const gifts = await getGifts();
  console.log(gifts);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gift List</h1>
        <a
          href="/dashboard/gift/create"
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Create a Giveaway
        </a>
      </div>

      <ul className="grid gap-6">
        {gifts.map((gift) => (
          <li key={gift._id} className="rounded border p-4 shadow">
            <h2 className="text-lg font-semibold">{gift.title}</h2>
            <p className="text-sm text-gray-600">{gift.description}</p>
            <img
              src={gift.image}
              alt={gift.title}
              className="mt-2 h-40 w-full rounded object-cover"
            />
            <p className="mt-2 font-medium">Price: ${gift.amount}</p>
            <p className="text-xs text-gray-400">Created: {gift.createdAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
