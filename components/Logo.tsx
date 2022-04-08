import styled from "styled-components";

export default function Logo() {
  return (
    <LogoSVG>
      <img src="/Logo.svg" alt="Logo" />
    </LogoSVG>
  );
}

const LogoSVG = styled.div`
  margin: 0 auto;
  position: relative;
  height: 3rem;
  width: 3rem;
`;
