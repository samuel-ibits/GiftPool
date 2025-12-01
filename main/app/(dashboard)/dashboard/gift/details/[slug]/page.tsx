"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type GiftBagItemDetails = {
  enabled: boolean;
  networks?: string[];
  types?: string[];
  banks?: string[];
};

type GiftBag = {
  airtime: GiftBagItemDetails;
  data: GiftBagItemDetails;
  giftCard: GiftBagItemDetails;
  bank: GiftBagItemDetails;
  random: {
    enabled: boolean;
  };
};

type Gift = {
  _id: string;
  user: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  amount: number;
  splits: number;
  duration: number;
  dispense: string;
  verified: boolean;
  giftBag: GiftBag;
  createdAt: string;
  updatedAt: string;
};

export default function GiftDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
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
    <div className="mx-auto max-w-4xl p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-1 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>

      <div className="rounded-lg border bg-white p-6 shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">{gift.title}</h1>

        <img
          src={gift.image}
          alt={gift.title}
          className="mb-6 h-80 w-full rounded-lg object-cover"
        />

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold text-gray-700">Description</h2>
          <p className="text-gray-600">{gift.description}</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-2xl font-bold text-indigo-600">${gift.amount}</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Number of Splits</p>
            <p className="text-2xl font-bold text-indigo-600">{gift.splits}</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Amount per Split</p>
            <p className="text-2xl font-bold text-green-600">
              ${(gift.amount / gift.splits).toFixed(2)}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Duration</p>
            <p className="text-2xl font-bold text-indigo-600">{gift.duration} days</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Dispense Date</p>
            <p className="text-lg font-semibold text-gray-700">
              {new Date(gift.dispense).toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Verified Status</p>
            <p className={`text-lg font-semibold ${gift.verified ? 'text-green-600' : 'text-yellow-600'}`}>
              {gift.verified ? '✓ Verified' : '⏳ Pending'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-700">Gift Bag Options</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className={`rounded-lg border p-3 ${gift.giftBag.airtime.enabled ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <p className="font-medium">Airtime</p>
              <p className="text-sm text-gray-600">
                {gift.giftBag.airtime.enabled ? '✓ Enabled' : '✗ Disabled'}
              </p>
              {gift.giftBag.airtime.networks && gift.giftBag.airtime.networks.length > 0 && (
                <p className="text-xs text-gray-500">Networks: {gift.giftBag.airtime.networks.join(', ')}</p>
              )}
            </div>

            <div className={`rounded-lg border p-3 ${gift.giftBag.data.enabled ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <p className="font-medium">Data</p>
              <p className="text-sm text-gray-600">
                {gift.giftBag.data.enabled ? '✓ Enabled' : '✗ Disabled'}
              </p>
              {gift.giftBag.data.networks && gift.giftBag.data.networks.length > 0 && (
                <p className="text-xs text-gray-500">Networks: {gift.giftBag.data.networks.join(', ')}</p>
              )}
            </div>

            <div className={`rounded-lg border p-3 ${gift.giftBag.giftCard.enabled ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <p className="font-medium">Gift Card</p>
              <p className="text-sm text-gray-600">
                {gift.giftBag.giftCard.enabled ? '✓ Enabled' : '✗ Disabled'}
              </p>
              {gift.giftBag.giftCard.types && gift.giftBag.giftCard.types.length > 0 && (
                <p className="text-xs text-gray-500">Types: {gift.giftBag.giftCard.types.join(', ')}</p>
              )}
            </div>

            <div className={`rounded-lg border p-3 ${gift.giftBag.bank.enabled ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <p className="font-medium">Bank Transfer</p>
              <p className="text-sm text-gray-600">
                {gift.giftBag.bank.enabled ? '✓ Enabled' : '✗ Disabled'}
              </p>
              {gift.giftBag.bank.banks && gift.giftBag.bank.banks.length > 0 && (
                <p className="text-xs text-gray-500">Banks: {gift.giftBag.bank.banks.join(', ')}</p>
              )}
            </div>

            <div className={`rounded-lg border p-3 ${gift.giftBag.random.enabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
              <p className="font-medium">Random Selection</p>
              <p className="text-sm text-gray-600">
                {gift.giftBag.random.enabled ? '✓ Enabled' : '✗ Disabled'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-500 md:grid-cols-2">
            <p>
              <span className="font-medium">Created:</span>{' '}
              {new Date(gift.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Last Updated:</span>{' '}
              {new Date(gift.updatedAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Gift ID:</span> {gift._id}
            </p>
            <p>
              <span className="font-medium">Slug:</span> {gift.slug}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
