// pages/gift/success.tsx

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function GiftSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 px-4 text-center">
      <CheckCircle className="mb-6 h-20 w-20 text-green-600" />
      <h1 className="mb-4 text-3xl font-bold text-green-700">
        Your gift has been funded successfully!
      </h1>
      <p className="mb-8 text-gray-600">
        Thank you for using our platform. You can view your funded gift on your
        dashboard.
      </p>
      {/* <Link href="/dashboard">
        <p className="rounded-md bg-green-600 px-6 py-3 text-white transition hover:bg-green-700">
          Go to Dashboard
        </p>
      </Link> */}
    </div>
  );
}
