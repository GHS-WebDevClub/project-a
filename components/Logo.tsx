import styled from "styled-components";
import Image from "next/image";

export default function Logo() {
  return (
    <LogoSVG>
      <Image src="/Logo.svg" alt="Logo" layout="fill" />
    </LogoSVG>
  );
}

const LogoSVG = styled.div`
  margin: 0 auto;
  position: relative;
  height: 3rem;
  width: 3rem;
`;
