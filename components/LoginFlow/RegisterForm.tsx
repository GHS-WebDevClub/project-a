/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 04/14/2022
 * 
 * Component for collecting first-time user info after initial O-auth flow succeeds
 * Collects info, then POSTs to member registration API route
 */

import Container from "../PageContainer";
import { TextInput, IconButton } from "@ghs-wdc/storybook"
import styled from "styled-components";
import React, { FormEvent, useEffect, useState } from "react";

type StateType = IIndexable & { uname?: string, fname?: string, lname?: string, phone?: string };

interface IIndexable {
    [key: string]: string;
}

export default function RegisterForm() {
    const [formState, setFormState] = useState<StateType>({ "uname": "", "fname": "", "lname": "", "phone": "" });

    function handleInputChange(e: FormEvent<HTMLInputElement>) {
        const target = e.currentTarget;
        const name = target.name;
        let newValue = target.value;

        //no change despite un-focus of input field
        if (newValue == formState[name]) return;

        //Create new object so that useState causes a re-render (without spreading into a new one, it doesn't)
        const newState = { ...formState };

        newState[name] = newValue;

        if (newState.fname && newState.lname && !newState.uname) {
            const uname = (newState.fname + newState.lname).toLowerCase();
            newState.uname = uname;
        }

        setFormState(newState);
    }

    function handleSubmit() {
        /**
         * TODO:
         * - Submittal of Data to api route
         * - Discuss switching API route to POST /users instead of POST /users/<username>
         * - Figure out how to use the animationCallback from IconButton
         */
    }

    return (
        <Form action="/api/v1/users/" method="POST" id="register" onSubmit={(e) => e.preventDefault()}>
            <NameContainer>
                {/**
                 * Using onBlur instead of onChange since React emits onInput events as onChange events.
                 * (This way I can still have vanilla onChange-like functionality)
                 */}
                <TextInput id="fname" name="fname" onBlur={handleInputChange} placeholder="First" />
                <TextInput id="lname" name="lname" onBlur={handleInputChange} placeholder="Last" />
            </NameContainer>
            <TextInput id="uname" name="uname" onBlur={handleInputChange} placeholder={formState.uname ? formState.uname : "Username"} defaultValue={formState.uname} />
            <TextInput id="phone" name="phone" onBlur={handleInputChange} placeholder="Phone" />
            <IconButton primary disabled={(formState.fname && formState.lname && formState.uname) ? false : true} />
        </Form>
    );
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: 20rem;
`;

const NameContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    width: 100%;
`;