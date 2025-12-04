// components/PaymentModal.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

interface PaymentModalProps {
  authorizationUrl: string;
  isOpen: boolean;
  onClose: () => void;
  giftSlug: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  authorizationUrl,
  isOpen,
  onClose,
  giftSlug,
}) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal closes
      setPaymentSuccess(false);
      setIsIframeLoading(true);
      return;
    }

    // Listen for messages from iframe (if Paystack sends any)
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from Paystack
      if (event.data && typeof event.data === "string") {
        if (event.data.includes("success") || event.data.includes("completed")) {
          setPaymentSuccess(true);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Poll iframe URL to detect success page
    const checkIframeUrl = setInterval(() => {
      try {
        if (iframeRef.current?.contentWindow) {
          const iframeUrl = iframeRef.current.contentWindow.location.href;
          if (iframeUrl.includes("/success")) {
            setPaymentSuccess(true);
            clearInterval(checkIframeUrl);
          }
        }
      } catch (e) {
        // Cross-origin access will throw error, which is expected
        // We can't access iframe URL if it's on different domain
      }
    }, 500);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(checkIframeUrl);
    };
  }, [isOpen]);

  useEffect(() => {
    if (paymentSuccess && giftSlug) {
      // Redirect to gift details after 2 seconds
      const timer = setTimeout(() => {
        router.push(`/dashboard/gift/details/${giftSlug}`);
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, giftSlug, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-[90%] w-[90%] overflow-hidden rounded-xl bg-white shadow-lg">
        {/* Close Button */}
        {!paymentSuccess && (
          <button
            className="absolute right-3 top-3 z-10 rounded-full border border-gray-300 bg-white p-2 text-gray-600 shadow-md hover:text-red-600"
            onClick={onClose}
            disabled={isIframeLoading}
          >
            ✕
          </button>
        )}

        {/* Loading Spinner */}
        {isIframeLoading && !paymentSuccess && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-indigo-600 border-opacity-75"></div>
          </div>
        )}

        {/* Success Screen */}
        {paymentSuccess && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-8 text-center">
            <div className="animate-bounce">
              <CheckCircle className="h-24 w-24 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-green-700">
              Payment Successful!
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Your gift has been funded successfully.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Redirecting to gift details...
            </p>
            <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-green-200">
              <div className="h-full w-full animate-pulse bg-green-600"></div>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          ref={iframeRef}
          src={authorizationUrl}
          className="relative z-0 h-full w-full border-none"
          onLoad={() => setIsIframeLoading(false)}
        />
      </div>
    </div>
  );
};

export default PaymentModal;
