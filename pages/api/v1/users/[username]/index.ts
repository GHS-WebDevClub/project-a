/**
 * Handles GET API requests to /api/v1/users/[username]
 *
 * Created by Jack Sanford (@bedrock206) on 03/07/2022
 *
 * Rewritten by Aubin Spitzer (@aubincspitzer) on 04/20/2022 (lul 420)
 * Based on:
 * GET /users/<username> - returns specifc user object with username, displayname, UUID, email | This route should be session-protected.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseUni } from "../../../../../types/api/ResponseData.type";
//import type { UserObject } from "../../../../../types/api/UserObject.type";
import { getSession } from "next-auth/react";
import clientPromise from "../../../../../utils/db/connect";
import Member from "../../../../../types/db/member.type";
import {
  PrivateProfile,
  PublicProfile,
} from "../../../../../types/db/profile.type";
import checkSessionUsername from "../../../../../utils/api/v1/checkSessionUsername";
import { ApiError } from "../../../../../types/api/ApiError/ApiError.type";

export type DynMemberProfileType =
  | (PublicProfile & (PrivateProfile | null))
  | null;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseUni<DynMemberProfileType>>
) => {
  //Check session
  if (!(await getSession({ req })))
    return res
      .status(401)
      .json(new ResponseUni([ApiError.fromCode("auth-001")], req.url));

  //Check Method
  if (!(req.method == "GET"))
    return res
      .status(405)
      .json(new ResponseUni([ApiError.fromCode("req-001")], req.url));

  //Check username from URL param
  const { username } = req.query;
  if (!(typeof username === "string"))
    return res
      .status(400)
      .json(new ResponseUni([ApiError.fromCode("req-002")], req.url));

  //Check if username matches session
  const inclPrivProf = await checkSessionUsername(req, username);

  //Get member from DB by username
  const collection = (await clientPromise).db().collection("members");
  const member = (await collection.findOne(
    { username: username },
    { projection: { _id: 0, profile: 1 } }
  )) as Member | null;

  //Check member exists
  if (!member)
    return res
      .status(200)
      .json(new ResponseUni([ApiError.fromCode("dat-001")], req.url, null));

  //Generate dynamic profile data based on permissions
  const privProf = inclPrivProf ? member.profile.private : {};
  const dynMemberProf = { ...member.profile.public, ...privProf };

  return res.status(200).json(new ResponseUni([], req.url, dynMemberProf));
};
