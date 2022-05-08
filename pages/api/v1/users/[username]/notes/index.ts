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
import { ApiError } from "../../../../../../types/api/ApiError/ApiError.type";
import { ResponseDataT, ResponseUni } from "../../../../../../types/api/ResponseData.type";
import Note, {
  NoteBodyType,
  NoteConstructorType,
} from "../../../../../../types/db/note.type";
import checkSessionUsername from "../../../../../../utils/api/v1/checkSessionUsername";
import clientPromise from "../../../../../../utils/db/connect";

export type MemberNotesResponse = Note[] | string;

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseUni<MemberNotesResponse>>
) {
  const url = req.url || null;

  if (!(req.method == "GET" || req.method == "POST"))
    return res.status(405).json(new ResponseUni([ApiError.fromCode("req-001")], url));

  //Check session
  const session = await getSession({ req });
  if (!session)
    return res
      .status(401)
      .json(new ResponseUni([ApiError.fromCode("auth-001")], url));

  const db = (await clientPromise).db();
  const { username } = req.query;

  if (typeof username !== "string")
    return res.status(400).json(new ResponseUni([ApiError.fromCode("req-002")], url));

  if (!(await checkSessionUsername(req, username, db, session)))
    //We can't have this check in production (too many DB requests per one API request), username should be stored in session eventually (WIP)
    return res
      .status(403)
      .json(new ResponseUni([ApiError.fromCode("auth-002")], url));

  switch (req.method) {
    case "GET":
      const notes = await getNotes(db, username);

      if (!notes)
        res
          .status(500)
          .json(new ResponseUni([ApiError.fromCode("srv-001")], url));

      res.status(200).json(new ResponseUni([], url, notes as Note[]));

      break;
    case "POST":
      if (!req.body)
        return res.status(400).json(new ResponseUni([ApiError.fromCode("req-003")], url));

      const note = await createNote(req.body as NoteBodyType, username, db);

      if (!note)
        return res.status(500).json(new ResponseUni([ApiError.fromCode("srv-001")], url));

      res.status(200).json(new ResponseUni([], url, note._id.toString()));
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
    const noteData = formatNoteData(body as NoteBodyType, username);
    //Create new Note using note class
    const note = new Note(noteData as NoteConstructorType);
    //Insert new note to database
    await db.collection("notes").insertOne(note);
    return note;
  } catch (err) {
    //Handle errors including in, database, missing fields in req.body, class constructor, etc.
    console.log(err);
  }
}

function formatNoteData(data: NoteBodyType, username: string) {
  //Add serverside information TODO: sanitization?
  let noteData: any = {
    ...data,
  };
  if (!noteData.meta) { noteData.meta = { author: username }; }
  else noteData.meta.author = username;
  if (data.details && data.details.dueAt) { //should be calc'd server-side with given info, if it's an assignment (for now placeholder: 100)
    noteData.details.personalPriorityScore = 100;
  } else if (!noteData.details) noteData.details = {};
  console.log(noteData)
  return noteData;
}