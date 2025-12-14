"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PaymentModal from "@/components/Payment";
import { useAuth } from "@/context/AuthContext";
import { Copy, Check, Users, Shield, Calendar, DollarSign } from "lucide-react";

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

type ExpectedParticipant = {
  name?: string;
  email?: string;
  nin?: string;
  bvn?: string;
  secretCode?: string;
  choice?: string[];
  allowRepeat?: boolean;
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
  status: string;
  giftBag: GiftBag;
  expectedParticipant?: ExpectedParticipant;
  createdAt: string;
  updatedAt: string;
};

export default function GiftDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const { token } = useAuth();

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
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto max-w-md rounded-lg bg-red-50 p-8 border border-red-200">
          <p className="text-red-600 font-medium">Gift not found or an error occurred.</p>
        </div>
      </div>
    );
  }

  async function paynow(slug: string) {
    try {
      const res = await fetch("/api/payment/purchase", {
        method: "POST",
        headers: {
          Cookie: `access-token=${token}`,
        },
        body: JSON.stringify({
          type: "gift",
          orderId: slug,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.data && data.data.data.authorization_url) {
          setPaymentUrl(data.data.data.authorization_url);
          setModalOpen(true);
        }
      } else {
        console.log("Failed to create gift: " + data.message);
      }
    } catch (err) {
      console.error("Error creating gift:", err);
      throw new Error("Function not implemented.");
    }
  }

  const getVerificationFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      name: "Name",
      email: "Email",
      nin: "NIN",
      bvn: "BVN",
      secretCode: "Secret Code"
    };
    return labels[field] || field;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-purple-600 hover:text-purple-800 transition-colors font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
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
          Back to Gifts
        </button>

        {/* Header Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-800">{gift.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${gift.status === 'funded' ? 'bg-green-100 text-green-700' :
                  gift.status === 'dispensed' ? 'bg-blue-100 text-blue-700' :
                    gift.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                  }`}>
                  {gift?.status?.charAt(0).toUpperCase() + gift?.status?.slice(1)}
                </span>
              </div>
              <p className="text-gray-500 text-sm">Gift ID: {gift._id}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/dashboard/gift/edit/${gift.slug}`)}
                className="rounded-lg bg-purple-600 px-5 py-2.5 text-white hover:bg-purple-700 transition-colors font-medium"
              >
                Edit Gift
              </button>
              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this gift?")) {
                    try {
                      const res = await fetch(`/api/gift/delete/${gift.slug}`, {
                        method: "DELETE",
                      });
                      if (res.ok) {
                        alert("Gift deleted successfully!");
                        router.push("/dashboard/gift");
                      } else {
                        const data = await res.json();
                        alert(data.message || "Failed to delete gift");
                      }
                    } catch (error) {
                      console.error("Error deleting gift:", error);
                      alert("An error occurred while deleting the gift");
                    }
                  }
                }}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-white hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Gift Image */}
          <img
            src={gift.image}
            alt={gift.title}
            className="mb-6 h-80 w-full rounded-xl object-cover shadow-md"
          />

          <div className="mb-6">
            <h2 className="mb-3 text-xl font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-2xl">📝</span> Description
            </h2>
            <p className="text-gray-600 leading-relaxed">{gift.description}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-purple-600" />
              <p className="text-sm text-gray-500 font-medium">Total Amount</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">${gift.amount}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-green-600" />
              <p className="text-sm text-gray-500 font-medium">Splits</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{gift.splits}</p>
            <p className="text-xs text-gray-500 mt-1">${(gift.amount / gift.splits).toFixed(2)} each</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              <p className="text-sm text-gray-500 font-medium">Duration</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{gift.duration || 1}</p>
            <p className="text-xs text-gray-500 mt-1">{gift.duration == 1 ? "day" : "days"}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-orange-600" />
              <p className="text-sm text-gray-500 font-medium">Verification</p>
            </div>
            <p className={`text-lg font-bold ${gift.verified ? 'text-green-600' : 'text-orange-600'}`}>
              {gift.verified ? '✓ Verified' : '⏳ Pending'}
            </p>
          </div>
        </div>

        {/* Expected Participant Configuration */}
        {gift.expectedParticipant && (
          <div className="rounded-2xl bg-white p-8 shadow-xl mb-6">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800 flex items-center gap-3">
              <Shield className="w-7 h-7 text-purple-600" />
              Participant Verification Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Required Verification Fields</h3>
                  <div className="flex flex-wrap gap-2">
                    {gift.expectedParticipant.choice && gift.expectedParticipant.choice.length > 0 ? (
                      gift.expectedParticipant.choice.map((field) => (
                        <span
                          key={field}
                          className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {getVerificationFieldLabel(field)}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No specific fields required</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Allow Repeat Claims</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${gift.expectedParticipant.allowRepeat
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                      }`}>
                      {gift.expectedParticipant.allowRepeat ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Security Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {gift.expectedParticipant.secretCode && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Secret code required for verification</span>
                    </div>
                  )}
                  {gift.expectedParticipant.nin && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>NIN verification enabled</span>
                    </div>
                  )}
                  {gift.expectedParticipant.bvn && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>BVN verification enabled</span>
                    </div>
                  )}
                  {!gift.expectedParticipant.secretCode && !gift.expectedParticipant.nin && !gift.expectedParticipant.bvn && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Basic verification only</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gift Bag Options */}
        <div className="rounded-2xl bg-white p-8 shadow-xl mb-6">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800 flex items-center gap-3">
            🎁 Gift Bag Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`rounded-xl border-2 p-5 transition-all ${gift.giftBag.airtime.enabled
              ? 'border-green-400 bg-green-50 shadow-md'
              : 'border-gray-200 bg-gray-50'
              }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800">📱 Airtime</p>
                {gift.giftBag.airtime.enabled ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <span className="text-gray-400 text-sm">Disabled</span>
                )}
              </div>
              {gift.giftBag.airtime.networks && gift.giftBag.airtime.networks.length > 0 && (
                <p className="text-xs text-gray-600">Networks: {gift.giftBag.airtime.networks.join(', ')}</p>
              )}
            </div>

            <div className={`rounded-xl border-2 p-5 transition-all ${gift.giftBag.data.enabled
              ? 'border-green-400 bg-green-50 shadow-md'
              : 'border-gray-200 bg-gray-50'
              }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800">📶 Data</p>
                {gift.giftBag.data.enabled ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <span className="text-gray-400 text-sm">Disabled</span>
                )}
              </div>
              {gift.giftBag.data.networks && gift.giftBag.data.networks.length > 0 && (
                <p className="text-xs text-gray-600">Networks: {gift.giftBag.data.networks.join(', ')}</p>
              )}
            </div>

            <div className={`rounded-xl border-2 p-5 transition-all ${gift.giftBag.giftCard.enabled
              ? 'border-green-400 bg-green-50 shadow-md'
              : 'border-gray-200 bg-gray-50'
              }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800">🎟️ Gift Card</p>
                {gift.giftBag.giftCard.enabled ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <span className="text-gray-400 text-sm">Disabled</span>
                )}
              </div>
              {gift.giftBag.giftCard.types && gift.giftBag.giftCard.types.length > 0 && (
                <p className="text-xs text-gray-600">Types: {gift.giftBag.giftCard.types.join(', ')}</p>
              )}
            </div>

            <div className={`rounded-xl border-2 p-5 transition-all ${gift.giftBag.bank.enabled
              ? 'border-green-400 bg-green-50 shadow-md'
              : 'border-gray-200 bg-gray-50'
              }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800">🏦 Bank Transfer</p>
                {gift.giftBag.bank.enabled ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <span className="text-gray-400 text-sm">Disabled</span>
                )}
              </div>
              {gift.giftBag.bank.banks && gift.giftBag.bank.banks.length > 0 && (
                <p className="text-xs text-gray-600">Banks: {gift.giftBag.bank.banks.join(', ')}</p>
              )}
            </div>

            <div className={`rounded-xl border-2 p-5 transition-all ${gift.giftBag.random.enabled
              ? 'border-blue-400 bg-blue-50 shadow-md'
              : 'border-gray-200 bg-gray-50'
              }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800">🎲 Random</p>
                {gift.giftBag.random.enabled ? (
                  <Check className="w-5 h-5 text-blue-600" />
                ) : (
                  <span className="text-gray-400 text-sm">Disabled</span>
                )}
              </div>
              <p className="text-xs text-gray-600">
                {gift.giftBag.random.enabled ? 'Randomly assigns gift types' : 'Manual selection'}
              </p>
            </div>
          </div>
        </div>

        <PaymentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          authorizationUrl={paymentUrl}
          giftSlug={gift.slug}
        />

        {/* Payment/Share Section */}
        {gift.status === 'pending' ? (
          <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 p-8 shadow-xl text-white mb-6">
            <h2 className="mb-3 text-2xl font-semibold">💰 Fund This Gift</h2>
            <p className="mb-6 text-yellow-50">
              This gift is currently pending. Fund it now to activate and share!
            </p>
            <button
              onClick={() => { paynow(gift.slug) }}
              className="flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-yellow-600 font-bold transition-all hover:bg-yellow-50 hover:scale-105 shadow-lg"
            >
              Fund This Gift Now
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-8 shadow-xl text-white mb-6">
            <h2 className="mb-4 text-2xl font-semibold">🔗 Share This Gift</h2>
            <p className="mb-6 text-purple-100">
              Share this link with friends and family to participate in this gift:
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/quick-start/gift/participate/${gift.slug}`}
                className="flex-1 rounded-lg border-2 border-white/30 bg-white/20 backdrop-blur px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                onClick={() => {
                  const link = `${window.location.origin}/quick-start/gift/participate/${gift.slug}`;
                  navigator.clipboard.writeText(link);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-purple-600 font-semibold transition-all hover:bg-purple-50 hover:scale-105"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-700">Created:</span>{' '}
              {new Date(gift.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Updated:</span>{' '}
              {new Date(gift.updatedAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium text-gray-700">Dispense Date:</span>{' '}
              {new Date(gift.dispense).toLocaleString()}
            </div>
            <div>
              <span className="font-medium text-gray-700">Slug:</span> {gift.slug}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}