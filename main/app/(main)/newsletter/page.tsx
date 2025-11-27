"use client";
import { useState } from "react";
import { useToast } from "@/components/ToastProvider";

const NewsletterPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleSubscribe = async () => {
    setLoading(true);
    setMessage("");

    // show loading toast
    const toastId = toast.loading("Subscribing...");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Successfully subscribed!", { id: toastId });
        setMessage("Successfully subscribed!");
      } else {
        toast.error(data.error || "Failed to subscribe.", { id: toastId });
        setMessage(data.error || "Failed to subscribe.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", { id: toastId });
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Subscribe to our Newsletter</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleSubscribe} disabled={loading || !email}>
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default NewsletterPage;
