/**
 * Returns Array<Course> containing courses for a specific member based on the username in URL
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/08/2022
 *
 * Based on:
 * GET /users/<username>/courses - returns array of user's classes (DONE aubin)
 */

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ResponseDataT } from "../../../../../../types/api/ResponseData.type";
import { Course } from "../../../../../../types/db/course.type";
import checkSessionUsername from "../../../../../../utils/api/v1/checkSessionUsername";
import { getCoursesByUsername } from "../../../../../../utils/api/v1/courses";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataT<Array<Course>>>
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  //Get username from URL
  const { username } = req.query;

  if (typeof username !== "string") return res.status(400).json({ error: 400 });

  //Check session
  const session = await getSession({ req });
  if (!session)
    return res
      .status(401)
      .json({ error: "You must be signed in to access this content." });

  if (!(await checkSessionUsername(req, username, undefined, session)))
    //We can't have this check in production (too many DB requests per one API request), username should be stored in session eventually (WIP)
    return res
      .status(403)
      .json({ error: "Access to this content is forbidden." });

  //To allow adding of more methods later
  switch (req.method) {
    //Retrieve courses a member is currently enrolled in from database
    case "GET":
      //Get courses for member from DB
      const courses = await getCoursesByUsername(username);
      if (!courses)
        return res.status(500).json({ error: "Internal server error!" });
      return res.status(200).json({ result: courses });
  }
}
