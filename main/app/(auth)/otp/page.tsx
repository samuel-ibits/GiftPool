"use client";
import { useSearchParams } from "next/navigation";
import Otp from "@/components/Auth/Otp";
import { Suspense } from "react";

function VerifyOtpContent() {
  const params = useSearchParams();
  const email = params.get("email") || "";

  return (
    <div className="mx-auto max-w-md pt-24">
      <Otp length={6} email={email} />
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
