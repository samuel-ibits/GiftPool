import React from "react";

type PaymentModalProps = {
  authorizationUrl: string;
  isOpen: boolean;
  onClose: () => void;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  authorizationUrl,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-[90vh] w-full max-w-2xl overflow-hidden rounded-md bg-white shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
        >
          Close
        </button>

        <iframe
          src={authorizationUrl}
          title="Payment"
          className="h-full w-full border-0"
        ></iframe>
      </div>
    </div>
  );
};

export default PaymentModal;
