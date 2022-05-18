
import styled from "styled-components";
import Logo from "../../components/Logo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextResponse } from "next/server";
import Container from "../../components/LoginFlow/Container";

export default function Home() {
    const {data: session, status} = useSession();

    const router = useRouter();

    if (status === "loading") return "Loading...";
    if (status === "unauthenticated")
        return NextResponse.redirect("/auth/login");

    return (
        <Container>
            <p>
                home page
            </p>
        </Container>
    );
}