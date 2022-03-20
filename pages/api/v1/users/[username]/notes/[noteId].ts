/**
 * Based on:
 * GET /users/<username>/notes/<noteId> - Retrieve a specific note from specific user based on noteId (WIP aubin)
 * PATCH /users/<username>/notes/<noteId> - Update a specific note from specific user based on noteId, (should onl update user-editable content) (WIP aubin)
 * DELETE /users/<username>/notes/<noteId> - Delete a specific note from specific user based on noteId (WIP aubin)
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/19/2022
 */

import { Db, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ResponseData } from "../../../../../../types/api/ResponseData.type";
import { NoteBodyType } from "../../../../../../types/db/note.type";
import checkSessionUsername from "../../../../../../utils/api/v1/checkSessionUsername";
import clientPromise from "../../../../../../utils/db/connect";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!(req.method == "GET" || req.method == "PATCH" || req.method == "DELETE"))
    return res.status(405).json({ error: "Method not allowed" });
  //Check session
  const session = await getSession({ req });
  if (!session)
    return res
      .status(401)
      .json({ error: "You must be signed in to access this content." });

  const db = (await clientPromise).db();
  const { username, noteId } = req.query;

  if (typeof username !== "string" || typeof noteId !== "string")
    return res.status(400).json({ error: 400 });

  if (!(await checkSessionUsername(req, username, db, session)))
    //We can't have this check in production (too many DB requests per one API request), username should be stored in session eventually (WIP)
    return res
      .status(403)
      .json({ error: "Access to this content is forbidden." });

  switch (req.method) {
    case "GET":
      const note = await getNote(db, noteId);
      if (!note) return res.status(404).json({ error: "Note not found!" });
      return res.status(200).json({ result: note });
    case "PATCH":
      const body = req.body as NoteBodyType;
      
    case "DELETE":
  }

  //Server did not handle the request above
  return res.status(500).json({ error: "Internal Server Error" });
}

async function getNote(db: Db, noteId: string) {
  try {
    return await db.collection("notes").findOne({ _id: new ObjectId(noteId) });
  } catch (err) {
    console.log(err);
  }
}
