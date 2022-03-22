/**
 * GET & POST
 *
 * Created by Aubin Spitzer (@aubincspitzer) on 03/16/2022
 *
 * Based on:
 * GET /users/<username>/notes - gets notes sorted various ways (for all courses)(should be fitlerable. ex: only those with due dates)(TODO aubin)
 * POST /users/<username>/notes - Submits a new note with data to server (TODO aubin)
 */

import { Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ResponseData } from "../../../../../../types/api/ResponseData.type";
import Note, {
  NoteBodyType,
  NoteConstructorType,
} from "../../../../../../types/db/note.type";
import checkSessionUsername from "../../../../../../utils/api/v1/checkSessionUsername";
import clientPromise from "../../../../../../utils/db/connect";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!(req.method == "GET" || req.method == "POST"))
    return res.status(405).json({ error: "Method not allowed" });

  //Check session
  const session = await getSession({ req });
  if (!session)
    return res
      .status(401)
      .json({ error: "You must be signed in to access this content." });

  const db = (await clientPromise).db();
  const { username } = req.query;

  if (typeof username !== "string")
    return res.status(400).json({ error: "Missing username!" });

  if (!(await checkSessionUsername(req, username, db, session)))
    //We can't have this check in production (too many DB requests per one API request), username should be stored in session eventually (WIP)
    return res
      .status(403)
      .json({ error: "Access to this content is forbidden." });

  switch (req.method) {
    case "GET":
      const notes = await getNotes(db, username);

      if (!notes)
        res
          .status(500)
          .json({ error: `Error retrieving ${username}'s notes!` });

      res.status(200).json({ result: notes });

      break;
    case "POST":
      if (!req.body)
        return res.status(400).json({ error: "Malformed request" });

      const note = await createNote(req.body as NoteBodyType, username, db);

      if (!note)
        return res.status(500).json({ error: "Internal Server Error" });

      res.status(200).json({ result: "OK 200" });
      break;
  }
}

async function getNotes(db: Db, username: string) {
  try {
    const notes = await db
      .collection("notes")
      .find(
        { "meta.author": username },
        {
          projection: {
            title: 1,
            details: 1,
            "meta.courseId": 1,
            "meta.completedAt": 1,
          },
        }
      )
      .toArray();

    return notes;
  } catch (err) {
    console.log(err);
    return;
  }
}

async function createNote(
  body: NoteBodyType,
  username: string,
  db: Db
): Promise<Note | undefined> {
  try {
    //Add serverside information and assign new type
    const data: NoteConstructorType = body as NoteConstructorType;
    data.meta.author = username;
    data.details.personalPriorityScore = 100;
    //Create new Note using note class
    const note = new Note(data);
    //Insert new note to database
    await db.collection("notes").insertOne(note);
    return note;
  } catch (err) {
    //Handle errors including in, database, missing fields in req.body, class constructor, etc.
    console.log(err);
  }
}
