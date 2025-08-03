// app/dashboard/gift/details/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Gift = {
  title: string;
  image: string;
  description: string;
  amount: number;
  splits: number;
  dispense: string;
};

export default function GiftDetailsPage() {
  const { slug } = useParams();
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const res = await fetch(`/api/gift/details/${slug}`);
        const data = await res.json();
        console.log("Gift data:", data);

        if (res.ok) {
          setGift(data.data);
        } else {
          console.error("Failed to fetch gift:", data.message);
        }
      } catch (err) {
        console.error("Error fetching gift details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchGift();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-t-4 border-indigo-600 border-opacity-75"></div>
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="p-6 text-center text-gray-500">
        Gift not found or an error occurred.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">{gift.title}</h1>
      <img
        src={gift?.image}
        alt={gift.title}
        className="mb-4 h-64 w-full rounded-md object-cover"
      />
      <p className="mb-2 text-gray-700">{gift.description}</p>
      <p className="text-sm text-gray-600">
        Amount: <strong>{gift.amount}</strong> | Splits:{" "}
        <strong>{gift.splits}</strong>
      </p>
      <p className="text-sm text-gray-600">
        Dispense Date:{" "}
        <strong>{new Date(gift.dispense).toLocaleDateString()}</strong>
      </p>
    </div>
  );
}
