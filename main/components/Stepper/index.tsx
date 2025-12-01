"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import slugify from "slugify";
import PaymentModal from "../Payment";

export default function GiftingStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState("");
  const [duration, setDuration] = useState("");
  const [dispenseOption, setDispenseOption] = useState("immediately");
  const [splits, setSplits] = useState<number | null>(null);
  const [giftLink, setGiftLink] = useState("your-link");
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // base64 or URL
  const [amount, setAmount] = useState<number | null>(null);
  const [dispense, setDispense] = useState("");
  const [verified, setVerified] = useState<boolean>(false);
  const { token } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dispenseOption === "immediately") {
      setDispense(new Date().toISOString());
    }
  }, [dispenseOption]);

  const steps = [
    { id: 1, title: "Gift Details" },
    { id: 2, title: "Gift Amount" },
    { id: 3, title: "Timing" },
    { id: 4, title: "Share & Track" },
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview image locally
    setImagePreview(URL.createObjectURL(file));

    // Prepare form data
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      console.log("Upload successful:", data.data.url);

      // Optionally save the returned image URL
      setImage(data.data.url); // adjust based on your API response
    } catch (err) {
      console.error("Upload error:", err.message);
    }
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value ? e.target.value : 0);
  };

  const isPastDate = (date) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return new Date(date).setHours(0, 0, 0, 0) < today;
  };

  const handleSubmitGift = async () => {
    try {
      const res = await fetch("/api/gift/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          title,
          description,
          image,
          amount,
          splits,
          duration,
          dispense,
          verified,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        //  console.log("Gift created successfully!");
        setGiftLink(data.data.slug);
        setSlug(data.data.slug);
        console.log("Created Gift:", slug, data);

        return slug || data.data.slug;
      } else {
        console.log("Failed to create gift: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Something went wrong!");
    }
  };

  const paynow = async () => {
    setIsLoading(true);

    try {
      const slug = await handleSubmitGift();
      if (!slug) {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let randomSuffix = "";
        for (let i = 0; i < 6; i++) {
          randomSuffix += chars.charAt(Math.floor(Math.random() * 6));
        }
        console.log("Random Suffix:", randomSuffix);
        const slug = slugify(`${title}-${randomSuffix}`, {
          lower: true,
          strict: true,
        });
        setSlug(slug);
      }
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
          // window.open(data.data.authorization_url, "_blank");
          setPaymentUrl(data.data.data.authorization_url);
          setModalOpen(true);
          setIsLoading(false);
          // setCurrentStep((prev) => Math.min(steps.length, prev + 1));
        }
      } else {
        setIsLoading(false);
        console.log("Failed to create gift: " + data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Payment initialization error:", error);
      console.log("Failed to initialize payment. Please try again.");
    }
  };
  console.log("token", token);
  return (
    <div className="mx-auto max-w-4xl p-6">

      {/* Stepper Content */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        {currentStep === 1 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Gift Details</h2>
            <div className="mb-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mb-4 h-64 w-full rounded-md object-cover"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center rounded-md bg-gray-100">
                  <span className="text-gray-500">Image Preview</span>
                </div>
              )}
              <input
                type="file"
                className="h-12 w-full rounded-md border px-4"
                onChange={(e) => handleImageUpload(e)}
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                type="text"
                className="h-12 w-full rounded-md border px-4"
                placeholder="Enter title"
                value={title !== null ? title : ""}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                className="h-24 w-full rounded-md border px-4"
                placeholder="Enter description"
                value={description !== null ? description : ""}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Gift Amount</h2>
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <input
                type="number"
                className=" h-12 w-full rounded-md border px-4"
                placeholder="Enter gift amount"
                value={amount !== null ? amount : ""}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              {/* <button
                onClick={paynow}
                className="w-full rounded-md bg-green-600 px-6 py-2 text-white sm:w-auto"
              >
                Pay Now
              </button> */}
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">
                Number of Splits
              </label>
              <input
                type="number"
                className="h-12 w-full rounded-md border px-4"
                placeholder="Enter number of participants"
                value={splits !== null ? splits : ""}
                onChange={(e) => setSplits(Number(e.target.value))}
              />
            </div>
            {amount && splits && (
              <div className="mt-4 rounded-md bg-gray-100 p-4">
                <p className="text-sm">
                  Each participant will receive:{" "}
                  <strong>
                    {isNaN(amount / splits)
                      ? "Invalid amount or splits"
                      : (amount / splits).toFixed(2)}{" "}
                    currency
                  </strong>
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Timing</h2>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Gifting Duration In Days
              </label>
              <input
                type="number"
                className="h-12 w-full rounded-md border px-4"
                placeholder="Enter gifting duration"
                onChange={handleDurationChange}
              />
              {duration && (
                <p className="mt-1 text-sm text-gray-500">{duration} days</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Dispense Time
              </label>
              <select
                className="mb-4 h-12 w-full rounded-md border px-4"
                onChange={(e) => setDispenseOption(e.target.value)}
              >
                <option value="immediately">Immediately</option>
                <option value="schedule">Choose Date & Time</option>
                <option value="task" disabled>
                  After Task is Done (Coming Soon)
                </option>
              </select>
              {dispenseOption === "schedule" && (
                <input
                  type="date"
                  className="h-12 w-full rounded-md border px-4"
                  onChange={(e) => setDispense(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                />
              )}
            </div>

            <PaymentModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              authorizationUrl={paymentUrl}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Share & Track</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Share your gift link with friends and family:
              </p>
              <div className="mt-4 flex flex-col items-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <input
                  type="text"
                  className=" h-12 w-full rounded-md border px-4"
                  value={
                    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/gift/participate/` +
                    giftLink
                  }
                  readOnly
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/gift/participate/` +
                      giftLink,
                    );
                    setCopied(true); // Update feedback
                    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
                  }}
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white sm:w-auto"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
              {copied && (
                <p className="mt-2 text-green-600">Link copied to clipboard!</p>
              )}
            </div>
            <div className="mt-6 flex flex-wrap justify-center space-x-4 sm:justify-start sm:space-x-4">
              <a
                href="https://facebook.com"
                className="mb-2 text-blue-600 hover:underline sm:mb-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com"
                className="mb-2 text-blue-400 hover:underline sm:mb-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              <a
                href="https://instagram.com"
                className="mb-2 text-pink-600 hover:underline sm:mb-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                className="mb-2 text-blue-700 hover:underline sm:mb-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Stepper Controls */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          className="rounded-md bg-gray-100 px-6 py-2 disabled:opacity-50"
          disabled={currentStep === 1 || isLoading}
        >
          Previous
        </button>
        {currentStep < steps.length ? (
          <button
            onClick={() => {
              if (currentStep === 3) {
                paynow();
              } else {
                setCurrentStep((prev) => Math.min(steps.length, prev + 1));
              }
            }}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading && currentStep === 3 ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              (currentStep === 3 ? "Pay Now" : "Next")
            )}
          </button>
        ) : (
          <button
            onClick={() => console.log("Tracking Gifting...")}
            className="rounded-md bg-indigo-600 px-6 py-2 text-white"
          >
            Track Gifting
          </button>
        )}
      </div>
    </div>
  );
}
