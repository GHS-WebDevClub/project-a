/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 04/14/2022
 *
 * Component for collecting first-time user info after initial O-auth flow succeeds
 * Collects info, then POSTs to member registration API route
 */

import { TextInput, IconButton } from "@ghs-wdc/storybook";
import styled from "styled-components";
import React, { FormEvent, useEffect, useState } from "react";
import { ResponseUni } from "../../types/api/ResponseData.type";
import { RegistrationBodyType } from "../../pages/api/v1/users";

type StateType = IIndexable & {
  uname?: string;
  fname?: string;
  lname?: string;
  phone?: string;
};

interface IIndexable {
  [key: string]: string;
}

/**
 * @returns new Member's ObjectID as string
 */
type ApiResponse = ResponseUni<string>;

export default function RegisterForm() {
  const [formData, setFormData] = useState<StateType>({
    uname: "",
    fname: "",
    lname: "",
    phone: "",
  });
  const [formErrors, setFormErrors] =
    useState<{
      uname?: string;
      fname?: string;
      lname?: string;
      phone?: string;
    }>();
  const [formStatus, setFormStatus] =
    useState<"ready" | "loading" | "success" | "fail">("ready"); //NTS could add disabled state to status instead of sep. prop on IconButton

  function handleInputChange(e: FormEvent<HTMLInputElement>) {
    const target = e.currentTarget;
    const name = target.name;
    const val = target.value;

    if (val == "" && name !== "phone")
      return setFormErrors((prevState) => ({
        ...prevState,
        [name]: "This field is required.",
      }));

    if (val == formData[name]) return;

    //Create new object so that useState causes a re-render (without spreading into a new one, it doesn't)
    setFormData((prevState) => ({
      ...prevState,
      [name]: val,
      uname: getUsername(),
    }));
    setFormErrors((prevState) => ({ ...prevState, [name]: "" }));

    function getUsername() {
      if (name == "uname") return val;
      if (formData.uname) return formData.uname;
      if (formData.fname && name == "lname")
        return (formData.fname + val).toLowerCase();
      if (name == "fname" && formData.lname)
        return (val + formData.lname).toLowerCase();
      return "";
    }
  }

  async function handleSubmit() {
    setFormStatus("loading");

    if (!(formData.uname && formData.fname && formData.lname))
      return setFormStatus("fail");

    try {
      const newMemberBody: RegistrationBodyType = {
        dname: `${formData.fname} ${formData.lname}`,
        uname: formData.uname,
        phone: formData.phone,
      };

      const res = await fetch("/api/v1/users", {
        body: JSON.stringify(newMemberBody),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = (await res.json()) as ResponseUni<string>;

      if (data.errors.length > 0) {
        data.errors.forEach((err) =>
          console.log(`API ERR: ${err.code} - ${err.detail}`)
        );
        return setFormStatus("fail");
      }

      if (!(data.data || typeof data.data == "string" || res.ok))
        return setFormStatus("fail");

      return setFormStatus("success");
    } catch (err) {
      console.log(err);
      setFormStatus("fail");
    }
  }

  return (
    <Form
      action="/api/v1/users/"
      method="POST"
      id="register"
      onSubmit={(e) => {
        e.preventDefault();
        return handleSubmit();
      }}
    >
      <fieldset>
        <legend>Full Name</legend>
        <NameContainer>
          <TextInput
            id="fname"
            name="fname"
            onBlur={handleInputChange}
            placeholder="First Name"
            error={formErrors?.fname ? true : false}
            required={true}
          />
          <TextInput
            id="lname"
            name="lname"
            onBlur={handleInputChange}
            placeholder="Last Name"
            error={formErrors?.lname ? true : false}
            required={true}
          />
        </NameContainer>
      </fieldset>
      <fieldset>
        <legend>Username</legend>
        <TextInput
          id="uname"
          name="uname"
          onBlur={handleInputChange}
          onInput={({ currentTarget }) => {
            setFormData((prevState) => ({
              ...prevState,
              uname: currentTarget.value,
            }));
            setFormErrors((pS) => ({ ...pS, uname: "" }));
          }}
          placeholder={formData.uname ? formData.uname : "Username"}
          defaultValue={formData.uname}
          error={formErrors?.uname ? true : false}
          required={true}
        />
      </fieldset>
      <fieldset>
        <legend>Phone Number</legend>
        <TextInput
          id="phone"
          name="phone"
          type="tel"
          pattern="^\+?\d{0,13}"
          minLength={10}
          onBlur={handleInputChange}
          placeholder="Phone"
          error={formErrors?.phone ? true : false}
        />
      </fieldset>
      <IconButton
        primary
        disabled={
          formData.fname && formData.lname && formData.uname ? false : true
        }
        status={formStatus}
        animationCallback={async () => setFormStatus("ready")}
      />
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  height: 20rem;
  margin-top: 2rem;

  label {
    align-self: flex-start;
    color: #f2f2f7;
  }
`;

const NameContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
`;
