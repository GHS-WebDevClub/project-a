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
import {
  ResponseUni,
} from "../../../../../types/api/ResponseData.type";
//import type { UserObject } from "../../../../../types/api/UserObject.type";
import { getSession } from "next-auth/react";
import clientPromise from "../../../../../utils/db/connect";
import Member from "../../../../../types/db/member.type";
import { ApiError } from "../../../../../types/api/ResponseData.type";
import {
  PrivateProfile,
  PublicProfile,
} from "../../../../../types/db/profile.type";
import checkSessionUsername from "../../../../../utils/api/v1/checkSessionUsername";

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
      .json(
        new ResponseUni(
          [
            new ApiError(
              "auth-001",
              "You must be signed in to access this content.",
              "401 Unauthorized - Missing Session"
            ),
          ],
          req.url
        )
      );

  //Check Method
  if (!(req.method == "GET"))
    return res
      .status(404)
      .json(
        new ResponseUni(
          [
            new ApiError(
              "req-001",
              `400 Bad Request`,
              `400 Bad Request - Invalid Method "${req.method}"`
            ),
          ],
          req.url
        )
      );

  const { username } = req.query;

  //Check username from URL
  if (!(typeof username === "string"))
    return res
      .status(400)
      .json(
        new ResponseUni(
          [
            new ApiError(
              "req-002",
              "Invalid API request",
              "400 Bad Request - Invalid or missing URL parameter"
            ),
          ],
          req.url
        )
      );

  //Store if username matches session
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
      .json(
        new ResponseUni(
          [
            new ApiError(
              "dat-001",
              `The user ${username} could not be found!`,
              `200 OK - Item "${username}" does not exist in the Database`
            ),
          ],
          req.url,
          null
        )
      );

  //Generate dynamic profile data based on permissions
  const privProf = inclPrivProf ? member.profile.private : {};
  const dynMemberProf = { ...member.profile.public, ...privProf };

  return res.status(200).json(new ResponseUni([], req.url, dynMemberProf));
};
