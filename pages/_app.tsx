import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import PageContainer from "../components/PageContainer";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <PageContainer>
        <Component {...pageProps} />
      </PageContainer>
    </SessionProvider>
  );
}
export default MyApp;
