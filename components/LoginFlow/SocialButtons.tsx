import { signIn } from "next-auth/react"
import styled from "styled-components";

export default function SocialButtons() {
    return (
        <ButtonContainer>
            <Button onClick={() => signIn("google")}>
                Google
            </Button>
            <Button onClick={() => signIn("github")}>
                Github
            </Button>
            <Button onClick={() => signIn("discord")}>
                Discord
            </Button>
        </ButtonContainer>
    );
}

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