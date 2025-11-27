"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

function UnsubscribeForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const toast = useToast();

  const handleUnsubscribe = async () => {
    if (!email) {
      toast.error("No email provided. Please use a valid unsubscribe link.");
      setStatus("No email provided. Please use a valid unsubscribe link.");
      return;
    }

    setLoading(true);
    setStatus(null);

    // show loading toast
    const toastId = toast.loading("Processing unsubscribe...");

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Successfully unsubscribed from the newsletter.", {
          id: toastId,
        });
        setStatus("✅ Successfully unsubscribed from the newsletter.");
      } else {
        toast.error(`❌ ${data.message || "Failed to unsubscribe."}`, {
          id: toastId,
        });
        setStatus(`❌ ${data.message || "Failed to unsubscribe."}`);
      }
    } catch (err) {
      toast.error("❌ An unexpected error occurred. Please try again.", {
        id: toastId,
      });
      setStatus("❌ An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md p-4 text-center">
      <h1 className="mb-4 text-2xl font-semibold">Newsletter Unsubscribe</h1>

      <button
        onClick={handleUnsubscribe}
        disabled={loading || !email}
        aria-busy={loading}
        className={`rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 ${
          loading || !email ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        {loading ? "Processing..." : "Unsubscribe"}
      </button>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </main>
  );
}

export default function NewsletterUnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md p-4 text-center">Loading...</div>
      }
    >
      <UnsubscribeForm />
    </Suspense>
  );
}
