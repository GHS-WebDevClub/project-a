/**
 * Handles a user's registration data to add them to the database as a Member;
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 04/21/2022
 *
 * Based On:
 * POST /users/ - registers a new Member using form submitted fields of username, Full Name (could be one string or object of first and last), phone number, and should accept an optional CourseID array (for later frontend implementations)
 * This route needs a session and should create the Member in the database with the same ObjectId as the corresponding User / session.
 */

import parsePhoneNumber from "libphonenumber-js";
import { Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ApiError } from "../../../../types/api/ApiError/ApiError.type";
import { ResponseUni } from "../../../../types/api/ResponseData.type";
import Member from "../../../../types/db/member.type";
import clientPromise from "../../../../utils/db/connect";

export interface RegistrationBodyType {
  uname: string;
  dname: string;
  phone?: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseUni<string>>
) => {
  //Check session
  const session = await getSession({ req });
  if (!session)
    return res
      .status(401)
      .json(new ResponseUni([ApiError.fromCode("auth-001")], req.url));

  //Check Method
  if (!(req.method == "POST"))
    return res
      .status(405)
      .json(new ResponseUni([ApiError.fromCode("req-001")], req.url));

  const data = await validateFormData(req.body);

  if (typeof data == "string")
    return res
      .status(200)
      .json(new ResponseUni([new ApiError("req-003", data)], req.url));

  try {
    const newMember = new Member(
      data.uname,
      {
        public: { displayName: data?.dname },
        private: { phone: data.phone, email: session.user.email },
      },
      session.user._id
    );

    const members = (await clientPromise).db().collection("members");

    //Check member doesn't already exist
    if (await memberExists(session.user._id, newMember.username, members))
      return res
        .status(200)
        .json(new ResponseUni([ApiError.fromCode("dat-002")], req.url));

    //Create member
    await members.insertOne(newMember);
    return res
      .status(200)
      .json(new ResponseUni([], req.url, newMember.username));
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json(new ResponseUni([ApiError.fromCode("srv-001")], req.url));
  }
};

async function validateFormData(
  body: any
): Promise<RegistrationBodyType | string> {
  //Check data types
  if (!(typeof body.uname == "string")) return "Username missing!";
  if (!(typeof body.dname == "string")) return "Full Name missing!";

  //Check string lengths
  if (body.uname.length < 2 || body.uname > 24)
    return "Username must be 2-24 characters";
  if (body.dname.length < 3 && body.dname.length > 64)
    return "Display Name must be at least 3 characters";

  const phone = parsePhoneNumber(body.phone);

  //phone is optional but check if it is valid
  if (phone && !phone.isValid) return "Phone Number invalid!";

  //Create new object to ensure no extra properties are included
  let data: RegistrationBodyType = {
    uname: body.uname.toLowerCase(), //All usernames should be lowercase
    dname: body.dname,
    phone: phone?.number,
  };

  return data;
}

/**
 * Checks if a member exists in DB based on proposed username and current SessionID
 *
 * @param id SessionID
 * @param username new Member's proposed username
 * @param members MongoDB "members" collection
 * @returns boolean
 */
async function memberExists(id: string, username: string, members: Collection) {
  const existingMemberByUsername = await members.findOne({
    username: username,
  });
  const existingMemberById = await members.findOne({ _id: id });

  if (existingMemberById || existingMemberByUsername) return true;
}
