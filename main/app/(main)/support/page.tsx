import React from "react";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Page - GiftPool",
  keywords: ["support", "contact", "help", "GiftPool"],
  authors: [{ name: "GiftPool Team", url: "https://giftpool.live" }],
  description: "This is Support page for GiftPool, where you can find help and contact us for any issues or inquiries.",
  // other metadata
};

const SupportPage = () => {
  return (
    <div className="pb-20 pt-40">
      <Contact />
    </div>
  );
};

export default SupportPage;
