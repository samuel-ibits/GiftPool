// pages/login.tsx
'use client'
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/compat/router';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router?.push("/");
    } else {
      console.error("Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
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
            Login
          </button>
        </form>
        <div className="mt-6 text-center space-y-4">
          <button
            onClick={() => signIn("google")}
            className="w-full bg-gray-100 py-2 rounded-md text-gray-700 hover:bg-gray-200"
          >
            Login with Google
          </button>
          <button
            onClick={() => signIn("twitter")}
            className="w-full bg-gray-100 py-2 rounded-md text-gray-700 hover:bg-gray-200"
          >
            Login with Twitter
          </button>
          <button
            onClick={() => signIn("facebook")}
            className="w-full bg-gray-100 py-2 rounded-md text-gray-700 hover:bg-gray-200"
          >
            Login with Facebook
          </button>
        </div>
        <p className="text-center text-gray-600 mt-4">
          New to GiftPool? <a href="/auth/register" className="text-purple-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
