/**
 * Custom NextAuth.js Login page
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/25/2022
 * Final URL of this page will be something like: https://app.project-a.io/login
 */

import styled from "styled-components";
import Image from "next/image";
import Logo from "../components/Logo";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**TODO
 * - Add Button components to design system, then re-incorporate. These buttons are placeholders.
 * - Add support for larger screen sizes than mobile
 */

/**TIMEOUT
 * <CellPhoneSVG>
        <Image src="/amico.svg" alt="CellPhone Drawing BG" layout="fill" />
      </CellPhoneSVG>
 */

export default function Login() {
  //Load next-auth session
  const { data: session, status } = useSession();
  //get callbackUrl from request query
  const router = useRouter();
  const { query } = router;
  const callbackUrl = query.callbackUrl as string;

  useEffect(() => {
    if (session && callbackUrl) router.push(callbackUrl);
  }, [session]);

  if (status === "loading") return "Loading...";

  return (
    <Container>
      <Logo />
      <Title>Sign In</Title>
      <ButtonContainer>
        <Button onClick={() => signIn("google", { redirect: true })}>
          Google
        </Button>
        <Button onClick={() => signIn("discord")}>Discord</Button>
        <Button onClick={() => signIn("github")}>Github</Button>
      </ButtonContainer>
      <Text>
        Not convinced? <a href="#">Learn More.</a>
      </Text>
    </Container>
  );
}

const Container = styled.div`
  background: #1c1c1e;
  min-height: 100vh;
  padding: 2rem 0;
`;

const Title = styled.h1`
  margin: 0 auto;
  width: fit-content;
  color: #ffff;
  margin-top: 5vh;
`;

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 20rem;
  height: 30vh;
  padding: 2rem;
  justify-content: space-evenly;
  max-width: 30rem;
  margin: 0 auto;
`;

const Button = styled.button`
  min-width: 10rem;
  width: 100%;
  height: 2.5rem;
  background: #3a3a3c;
  border: none;
  border-radius: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: #ffff;
  font-weight: 700;
  cursor: pointer;
`;

const Text = styled.p`
  position: relative;
  margin: 0 auto;
  width: fit-content;
  color: #a1a1a1;

  a {
    text-decoration: underline;
  }
`;

const CellPhoneSVG = styled.div`
  position: fixed;
  width: 100%;
  height: 60vh;
  top: 40vh;
  opacity: 35%;
`;
