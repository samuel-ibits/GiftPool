"use client";
import { useSearchParams } from "next/navigation";
import Otp from "@/components/Auth/Otp";

export default function VerifyOtpPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";

  return (
    <div className="mx-auto max-w-md pt-24">
      <Otp
        length={6}
        email={email}
        // onComplete={async (otp) => {
        //   const res = await fetch("/api/auth/verify", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ otp, email }),
        //   });

        //   const data = await res.json();
        //   if (!res.ok) {
        //     alert(data.message || "Invalid OTP");
        //     return;
        //   }

        //   alert("Account verified!");
        //   window.location.href = "/dashboard";
        // }}
      />
    </div>
  );
}
