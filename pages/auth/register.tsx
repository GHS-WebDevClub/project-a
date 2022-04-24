/**
 * Custom NextAuth.js Login page
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/25/2022
 * Final URL of this page will be something like: https://app.project-a.io/login
 */

import styled from "styled-components";
import Logo from "../../components/Logo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Container from "../../components/LoginFlow/Container";
import RegisterForm from "../../components/LoginFlow/RegisterForm";

/**TODO
 * - Add Button components to design system, then re-incorporate. These buttons are placeholders.
 * - Add support for larger screen sizes than mobile
 * - Add support for larger screen sizes than mobile
 */

/**TIMEOUT
 * <CellPhoneSVG>
        <Image src="/amico.svg" alt="CellPhone Drawing BG" layout="fill" />
      </CellPhoneSVG>
 */

export default function Login() {
  const { data: session, status } = useSession();
  //get callbackUrl from request query
  const router = useRouter();

  if (status === "loading") return "Loading...";

  return (
    <Container>
      <Logo />
      <Title>Register</Title>
      <p>We need to get to know you a bit better</p>
      <RegisterForm />
    </Container>
  );
}

const Title = styled.h1`
  margin: 0 auto;
  width: fit-content;
  color: #f2f2f7;
  margin-top: 2rem;
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
