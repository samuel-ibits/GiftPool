// pages/register.tsx
'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Backend API logic for registering user
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) router.push("/login");
    else console.error("Failed to register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-purple-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-purple-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => signIn("google")}
            className="w-full bg-gray-100 py-2 rounded-md text-gray-700 hover:bg-gray-200"
          >
            Sign Up with Google
          </button>
        </div>
        <p className="text-center text-gray-600 mt-4">
          Already have an account? <a href="/login" className="text-purple-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
