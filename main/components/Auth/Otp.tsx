"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ToastProvider";

interface OtpVerifyProps {
  email: string;
  length?: number;
  onSuccess?: () => void;
}



export default function OtpVerify({
  email = "user@example.com",
  length = 6,
  onSuccess,
}: OtpVerifyProps) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const toast = useToast();

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (!otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < length) newOtp[i] = char;
    });
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length !== length) {
      toast.error("Please enter the complete OTP code");
      return;
    }

    const toastId = toast.loading("Verifying your code...");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      toast.dismiss(toastId);

      // ❌ Backend rejected
      if (!res.ok) {
        toast.error(data?.message || "Invalid OTP code. Try again.");
        setOtp(Array(length).fill(""));
        inputRefs.current[0]?.focus();
        return;
      }

      // ✔️ toast.success
      toast.success("Email verified toast.successfully! 🎉");

      // optional: set user context or redirect
      onSuccess?.();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const toastId = toast.loading("Sending new code...");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok) {
        toast.error(data?.message || "Failed to resend code. Please try again.");
        return;
      }

      toast.success("New code sent to your email!");
      setOtp(Array(length).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30"
          >
            <svg
              className="h-8 w-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white"
          >
            Verify Your Email
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-center text-gray-600 dark:text-gray-400"
          >
            We sent a {length}-digit code to{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {email}
            </span>
          </motion.p>

          {/* OTP Input Fields */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 flex justify-center gap-2"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <motion.input
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => e.key === "Backspace" && handleBackspace(i)}
                disabled={loading}
                className="h-14 w-12 rounded-lg border-2 border-gray-300 bg-white text-center text-2xl font-semibold text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-800 sm:w-14"
              />
            ))}
          </motion.div>

          {/* Verify Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handleSubmit}
            disabled={loading || otp.some((d) => !d)}
            className="mb-4 h-12 w-full rounded-lg bg-blue-600 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none dark:disabled:bg-gray-700"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </motion.button>

          {/* Resend Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={loading}
                className="font-medium text-blue-600 hover:underline disabled:no-underline disabled:opacity-50 dark:text-blue-400"
              >
                Resend
              </button>
            </p>
          </motion.div>
        </div>

        {/* Helper Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          Check your spam folder if you don't see the email
        </motion.p>
      </motion.div>
    </div>
  );
}
