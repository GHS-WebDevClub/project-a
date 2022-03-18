/**
 * GET & POST
 *
 * Created by Aubin Spitzer (@aubincspitzer) on 03/16/2022
 *
 * Based on:
 * GET /users/<username>/notes - gets notes sorted various ways (for all courses)(should be fitlerable. ex: only those with due dates)(TODO aubin)
 * POST /users/<username>/notes - Submits a new note with data to server (TODO aubin)
 */

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ResponseData } from "../../../../../../types/api/ResponseData.type";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  //Check session
  if (!(await getSession({ req })))
    return res
      .status(401)
      .json({ error: "You must be signed in to access this content." });

  switch (req.method) {
    case "GET":
      res.status(500).json({ error: "Not implemented yet!" });
      break;
    case "POST":
      res.status(500).json({ error: "Not implemented yet!" });
      break;
  }
}
