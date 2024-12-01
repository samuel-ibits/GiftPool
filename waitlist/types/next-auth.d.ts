// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        userId: string; // Add custom properties to session
    }
    interface User {
        id: string; // Ensure user ID is recognized as a string
    }
}
