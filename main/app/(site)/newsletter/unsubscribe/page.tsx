'use client';
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const NewsletterUnsubscribePage = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus("No email provided. Please use a valid unsubscribe link.");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Successfully unsubscribed from the newsletter.");
      } else {
        setStatus(`❌ ${data.message || "Failed to unsubscribe."}`);
      }
    } catch (err) {
      setStatus("❌ An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 text-center">
      <h1 className="text-2xl font-semibold mb-4">Newsletter Unsubscribe</h1>

      <button
        onClick={handleUnsubscribe}
        disabled={loading || !email}
        aria-busy={loading}
        className={`px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition ${
          loading || !email ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : "Unsubscribe"}
      </button>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </main>
  );
};

export default NewsletterUnsubscribePage;
