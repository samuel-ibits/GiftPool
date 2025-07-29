"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Gift {
  giftBag: any;
  id: string;
  title: string;
  description: string;
  value?: string;
  category?: string;
  duration: number;
}

interface ClaimData {
  phone: string;
  wallet: string;
  accountNumber: string;
  bankName: string;
}

export default function ParticipatePage() {
  const params = useParams();
  const slug = params?.id as string;

  const [step, setStep] = useState<"lookup" | "claim" | "done">("lookup");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        // If random is enabled, ignore individual flags
        enabledOptions = allOptions;
      } else {
        // Otherwise, choose only enabled ones
        if (gift.giftBag.airtime?.enabled) enabledOptions.push("airtime");
        if (gift.giftBag.bank?.enabled) enabledOptions.push("bank");
        if (gift.giftBag.giftCard?.enabled) enabledOptions.push("giftCard");
      }

      if (enabledOptions.length > 0) {
        const randomOption: "airtime" | "bank" | "giftCard" =
          enabledOptions[Math.floor(Math.random() * enabledOptions.length)];
        setSelectedOption(randomOption);
        console.log("Selected gift bag option:", randomOption);
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

  const handleLookup = async () => {
    // Clear previous errors
    setError("");

    // Validation
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
      console.log("Lookup result:", data);
      if (data?.data?.gift) {
        setGift(data.data.gift);
        setStep("claim");
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
    // Clear previous errors
    setError("");

    // Validation
    // if (!claim.phone.trim()) {
    //   setError("Please enter your phone number");
    //   return;
    // }

    // if (!validatePhone(claim.phone)) {
    //   setError("Please enter a valid phone number");
    //   return;
    // }

    // if (!claim.wallet.trim()) {
    //   setError("Please enter your wallet address");
    //   return;
    // }

    // if (!claim.account.trim()) {
    //   setError("Please enter your account number");
    //   return;
    // }

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
          slug: slug, // Include the campaign ID
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

  const resetForm = () => {
    setStep("lookup");
    setEmail("");
    setName("");
    setGift(null);
    setError("");
    setClaim({
      phone: "",
      wallet: "",
      accountNumber: "",
      bankName: "",
    });
  };
  console.log(step, gift, claim);
  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        🎁 Participate in Gift Draw
      </h1>

      {/* Error Display */}
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {step === "lookup" && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleLookup}
            disabled={loading || !name.trim() || !email.trim()}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Checking..." : "Check for Gift"}
          </button>
        </div>
      )}

      {step === "claim" && gift && (
        <div className="space-y-4">
          <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
            <h2 className="mb-2 text-lg font-semibold text-green-800">
              🎉 Congratulations! You've won:
            </h2>
            <div className="text-green-700">
              <p className="font-medium">{gift.title}</p>
              <p className="mt-1 text-sm">{gift.description}</p>
              {gift.value && (
                <p className="mt-1 text-sm">Value: {gift.value}</p>
              )}
            </div>
          </div>
          {selectedOption === "airtime" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                className="w-full rounded-md border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Wallet Address *
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Bank Name*
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                value={claim.bankName}
                onChange={(e) =>
                  setClaim((prev) => ({ ...prev, bankName: e.target.value }))
                }
                placeholder="Enter your bank name"
                disabled={loading}
              />
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Account Number *
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
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
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setStep("lookup")}
              disabled={loading}
              className="flex-1 rounded-md bg-gray-500 px-4 py-3 text-white transition-colors duration-200 hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-400"
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
              className={`flex-1 rounded-md px-4 py-3 text-white transition-colors duration-200
    ${
      loading ||
      !(
        claim.phone?.trim() ||
        claim.wallet?.trim() ||
        claim.accountNumber?.trim()
      )
        ? "cursor-not-allowed bg-gray-400"
        : "bg-green-600 hover:bg-green-700"
    }`}
            >
              {loading ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="space-y-4 text-center">
          <div className="rounded-md border border-green-200 bg-green-50 p-6">
            <h2 className="mb-2 text-xl font-semibold text-green-700">
              ✅ Claim Submitted Successfully!
            </h2>
            <p className="text-green-600">
              Thank you for participating! We will contact you in{" "}
              {gift?.duration} days regarding your gift.
            </p>
          </div>

          <button
            onClick={resetForm}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Submit Another Claim
          </button>
        </div>
      )}
    </div>
  );
}
