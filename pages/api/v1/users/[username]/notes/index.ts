/**
 * GET & POST
 *
 * Created by Aubin Spitzer (@aubincspitzer) on 03/16/2022
 *
 * Based on:
 * GET /users/<username>/notes - gets notes sorted various ways (for all courses)(should be fitlerable. ex: only those with due dates)(TODO aubin)
 * POST /users/<username>/notes - Submits a new note with data to server (TODO aubin)
 */

import { Db, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ResponseData } from "../../../../../../types/api/ResponseData.type";
import clientPromise from "../../../../../../utils/db/connect";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  //Check session
  if (!(await getSession({ req })))
    return res
      .status(401)
      .json({ error: "You must be signed in to access this content." });

  if (!(req.method == "GET" || req.method == "POST"))
    return res.status(405).json({ error: "Method not allowed" });

  const db = (await clientPromise).db();
  const { username } = req.query;

  if (typeof username !== "string")
    return res.status(400).json({ error: "Missing username!" });

  switch (req.method) {
    case "GET":
      const { assigned } = req.query;
      const isAssigned = (typeof assigned == "string" && assigned == "true");

      const notes = await getNotes(db, username, isAssigned);

      

      break;
    case "POST":
      res.status(500).json({ error: "Not implemented yet!" });
      break;
  }
}

async function getNotes(db: Db, username: string, assigned: boolean) {
  try {
    const notes = db.collection("notes").find({
      meta: { authorId: new ObjectId(username) },
      details: assigned ? { dueAt: { $exists: true } } : {},
    });
  }catch(err) {

  }
}