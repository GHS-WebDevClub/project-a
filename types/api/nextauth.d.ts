import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      _id: ObjectId;
      email: string;
      phone: string;
      image: string;
      emailVerified?: boolean;
      username?: string;
    };
  }
}
