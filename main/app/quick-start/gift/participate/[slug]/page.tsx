"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Gift, Share2 } from "lucide-react";

interface GiftData {
  giftBag: any;
  id: string;
  title: string;
  description: string;
  value?: string;
  category?: string;
  duration: number;
  imageUrl?: string;
}

interface ClaimData {
  phone: string;
  wallet: string;
  accountNumber: string;
  bankName: string;
}

export default function ParticipatePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [step, setStep] = useState<"envelope" | "verify" | "reveal" | "claim" | "done">("envelope");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [claim, setClaim] = useState<ClaimData>({
    phone: "",
    wallet: "",
    accountNumber: "",
    bankName: "",
  });
  const [selectedOption, setSelectedOption] = useState<
    "airtime" | "bank" | "giftCard" | null
  >(null);

  useEffect(() => {
    if (gift) {
      let enabledOptions: Array<"airtime" | "bank" | "giftCard"> = [];

      const allOptions: Array<"airtime" | "bank" | "giftCard"> = [
        "airtime",
        "bank",
        "giftCard",
      ];

      if (gift.giftBag.random?.enabled) {
        enabledOptions = allOptions;
      } else {
        if (gift.giftBag.airtime?.enabled) enabledOptions.push("airtime");
        if (gift.giftBag.bank?.enabled) enabledOptions.push("bank");
        if (gift.giftBag.giftCard?.enabled) enabledOptions.push("giftCard");
      }

      if (enabledOptions.length > 0) {
        const randomOption: "airtime" | "bank" | "giftCard" =
          enabledOptions[Math.floor(Math.random() * enabledOptions.length)];
        setSelectedOption(randomOption);
      }
    }
  }, [gift]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleEnvelopeOpen = () => {
    setEnvelopeOpened(true);
    setTimeout(() => {
      setStep("verify");
    }, 800);
  };

  const handleVerify = async () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/gift/check", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          slug: slug,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data?.data?.gift) {
        setGift(data.data.gift);
        setStep("reveal");
      } else {
        setError(
          "No gift found for this user. Please check your name and email.",
        );
      }
    } catch (err) {
      console.error("Lookup error:", err);
      setError("Error checking for gift. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/gift/claim", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          phone: claim.phone.trim(),
          wallet: claim.wallet.trim(),
          bank: {
            accountNumber: claim.accountNumber.trim(),
            bankName: claim.bankName.trim(),
          },
          slug: slug,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`,
        );
      }

      const data = await res.json();
      setStep("done");
    } catch (err) {
      console.error("Claim submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit claim. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "I received a gift!",
      text: `I just claimed my gift: ${gift?.title}! Check if you have one too.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const resetForm = () => {
    setStep("envelope");
    setEmail("");
    setName("");
    setGift(null);
    setError("");
    setEnvelopeOpened(false);
    setClaim({
      phone: "",
      wallet: "",
      accountNumber: "",
      bankName: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full">

        {/* Envelope Opening Screen */}
        {step === "envelope" && (
          <div className="text-center">
            <div
              onClick={handleEnvelopeOpen}
              className={`relative cursor-pointer transition-all duration-800 ${envelopeOpened ? "scale-110 opacity-0" : "scale-100 opacity-100"
                }`}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-12 hover:shadow-3xl transition-shadow">
                <div className="relative">
                  {/* Envelope */}
                  <div className={`transition-transform duration-500 ${envelopeOpened ? "-translate-y-12" : ""
                    }`}>
                    <div className="w-48 h-32 mx-auto bg-gradient-to-br from-red-400 to-pink-500 rounded-lg relative overflow-hidden shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-br from-red-500 to-pink-600 transform origin-top transition-transform duration-500"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                          transform: envelopeOpened ? "rotateX(180deg)" : "rotateX(0deg)"
                        }}
                      ></div>
                      <Gift className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                  </div>
                </div>
                <h1 className="mt-8 text-3xl font-bold text-gray-800 mb-4">
                  🎁 You've Received a Gift!
                </h1>
                <p className="text-gray-600 mb-6">
                  Someone special sent you a surprise
                </p>
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:scale-105 transition-transform">
                  Tap to Open
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Screen */}
        {step === "verify" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Confirm Your Identity
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Please verify you're the gift recipient
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-400 bg-red-50 p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || !name.trim() || !email.trim()}
                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
            </div>
          </div>
        )}

        {/* Gift Reveal Screen */}
        {step === "reveal" && gift && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
            {/* Gift Image */}
            {gift.imageUrl && (
              <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <img
                  src={gift.imageUrl}
                  alt={gift.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}

            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  🎉 Congratulations!
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {gift.title}
                </h2>
                <p className="text-gray-600 mb-3">
                  {gift.description}
                </p>
                {gift.value && (
                  <p className="text-lg font-semibold text-purple-600">
                    Value: {gift.value}
                  </p>
                )}
              </div>

              <button
                onClick={() => setStep("claim")}
                className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white font-bold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Claim Your Gift 🎁
              </button>
            </div>
          </div>
        )}

        {/* Claim Details Screen */}
        {step === "claim" && gift && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Claim Your Gift
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Enter your receiving details
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-400 bg-red-50 p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {selectedOption === "airtime" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    value={claim.phone}
                    onChange={(e) =>
                      setClaim((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="Enter your phone number"
                    disabled={loading}
                  />
                </div>
              )}

              {selectedOption === "giftCard" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Address *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    value={claim.wallet}
                    onChange={(e) =>
                      setClaim((prev) => ({ ...prev, wallet: e.target.value }))
                    }
                    placeholder="Enter your wallet address"
                    disabled={loading}
                  />
                </div>
              )}

              {selectedOption === "bank" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      value={claim.bankName}
                      onChange={(e) =>
                        setClaim((prev) => ({ ...prev, bankName: e.target.value }))
                      }
                      placeholder="Enter your bank name"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      value={claim.accountNumber}
                      onChange={(e) =>
                        setClaim((prev) => ({
                          ...prev,
                          accountNumber: e.target.value,
                        }))
                      }
                      placeholder="Enter your account number"
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setStep("reveal")}
                  disabled={loading}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-700 font-semibold transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitClaim}
                  disabled={
                    loading ||
                    !(
                      claim.phone?.trim() ||
                      claim.wallet?.trim() ||
                      claim.accountNumber?.trim()
                    )
                  }
                  className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Submitting..." : "Submit Claim"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {step === "done" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Claim Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for participating! We will contact you in{" "}
              <span className="font-semibold text-purple-600">{gift?.duration} days</span>{" "}
              regarding your gift.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleShare}
                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Your Gift
              </button>

              <button
                onClick={resetForm}
                className="w-full rounded-lg border-2 border-gray-300 px-6 py-3 text-gray-700 font-semibold transition-colors duration-200 hover:bg-gray-50"
              >
                Submit Another Claim
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}