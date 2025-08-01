// components/PaymentModal.tsx

import React, { useState } from "react";

interface PaymentModalProps {
  authorizationUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  authorizationUrl,
  isOpen,
  onClose,
}) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-[90%] w-[90%] overflow-hidden rounded-xl bg-white shadow-lg">
        {/* Close Button */}
        <button
          className="absolute right-3 top-3 z-10 rounded-full border border-gray-300 bg-white p-2 text-gray-600 shadow-md hover:text-red-600"
          onClick={onClose}
          disabled={isIframeLoading}
        >
          ✕
        </button>

        {/* Loading Spinner */}
        {isIframeLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-indigo-600 border-opacity-75"></div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          src={authorizationUrl}
          className="relative z-0 h-full w-full border-none"
          onLoad={() => setIsIframeLoading(false)}
        />
      </div>
    </div>
  );
};

export default PaymentModal;
