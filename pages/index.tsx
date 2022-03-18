import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  })

  if(status === "loading") return "Loading..."

  return (
    <>You've reached /index.tsx</>
  );
}
