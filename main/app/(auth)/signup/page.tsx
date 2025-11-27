import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giftpool | Sign Up",
  description: "The Sign Up page for Giftpool application.",
  // other metadata
};

export default function Register() {
  return (
    <>
      <Signup />
    </>
  );
}
