import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    token?: string;
  }

  interface User {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}