/**
 * Handles everything related to user SSO / OAuth (Authentication)
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/24/2022
 * Based on example from https://next-auth.js.org/getting-started/example
 */

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../utils/db/connect";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
  throw new Error(`Missing "NextAuth-Google" env variables!`);

export default NextAuth({
  //Persist users in database
  adapter: MongoDBAdapter(clientPromise),
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  //Override default, auto-generated auth pages
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token, user }) {

      session.user._id = user.id;
      return session;
    },
  },
});
