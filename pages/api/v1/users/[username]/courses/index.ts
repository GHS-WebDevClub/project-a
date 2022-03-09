/**
 * Returns Array<Course> containing courses for a specific member based on the username in URL
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/08/2022
 */

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ResponseData } from "../../../../../../types/api/ResponseData.type";
import checkSessionUsername from "../../../../../../utils/api/v1/checkSessionUsername";
import { getCoursesByUsername } from "../../../../../../utils/api/v1/courses";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!(req.method == "POST" || req.method == "GET"))
    return res.status(404).json({ error: 404 });

  switch (req.method) {
    //Retrieve courses a member is currently enrolled in from database
    case "GET":
      //Get username from URL
      const { username } = req.query;

      if (typeof username !== "string")
        return res.status(400).json({ error: "Malformed request!" });

      //Check if session matches username in URL
      const member = await checkSessionUsername(req, username);
      if (!member) return res.status(403).json({ error: "Permission denied!" });

      //Get courses for member, send them in API response
      const courses = await getCoursesByUsername(username);
      if (!courses)
        return res.status(500).json({ error: "Internal server error!" });
      return res.status(200).json({ result: courses });
    case "POST":
      //Enroll a specific user in a class based on class ID
      break;
  }
}
