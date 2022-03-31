/**
 * Based on:
 * GET /users/<username>/notes/<noteId> - Retrieve a specific note from specific user based on noteId (WIP aubin)
 * PATCH /users/<username>/notes/<noteId> - Update a specific note from specific user based on noteId, (should onl update user-editable content) (WIP aubin)
 * DELETE /users/<username>/notes/<noteId> - Delete a specific note from specific user based on noteId (WIP aubin)
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/19/2022
 */

import { DateTime } from "luxon";
import { Db, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ResponseDataT } from "../../../../../../types/api/ResponseData.type";
import Note, { NoteBodyType } from "../../../../../../types/db/note.type";
import checkSessionUsername from "../../../../../../utils/api/v1/checkSessionUsername";
import clientPromise from "../../../../../../utils/db/connect";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataT<Note | ObjectId>>
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
    case "GET": {
      const note = await getNote(db, noteId);
      if (!note)
        return res.status(500).json({ error: "Error retrieving note!" });
      return res.status(200).json({ result: note as Note });
    }
    case "PATCH": {
      const body = req.body as NoteBodyType;
      const note = await updateNote(db, noteId, body);
      if (!note) return res.status(500).json({ error: "Error updating note!" });

      return res.status(200).json({ result: note as Note });
    }
    case "DELETE":
      const note = await deleteNote(db, noteId);
      if (!note) return res.status(500).json({ error: "Failed to delete note!" })
      return res.status(200).json({ result: note._id })
  }
}

async function getNote(db: Db, noteId: string) {
  try {
    return await db.collection("notes").findOne({ _id: new ObjectId(noteId) });
  } catch (err) {
    console.log(err);
  }
}

async function updateNote(db: Db, noteId: string, noteBody: NoteBodyType) {
  try {
    const update = await createUpdate(noteBody);

    const note = await db
      .collection("notes")
      .findOneAndUpdate(
        { _id: new ObjectId(noteId) },
        { $set: { ...update } },
        { returnDocument: "after" }
      );

    return note.value;
  } catch (err) {
    console.log(err);
  }
}

//Delete note based on ObjectID string
async function deleteNote(db: Db, noteId: string) {
  try {
    const note = (await db.collection("notes").findOneAndDelete({ _id: new ObjectId(noteId) })).value;
    return note;
  } catch (err) {
    console.log(err);
  }
}

//I hate this function with a passion, pls help me find another way
//NTS: try for ... in
async function createUpdate(note: NoteBodyType) {
  try {
    let update: any = {
      title: note.title
    }

    //Due date set/updated
    if (note.details?.dueAt) {
      update["details.dueAt"] = note.details.dueAt;
      update["details.type"] = "assignment";
    }
    //Due date removed
    else if (note.details?.dueAt == null) {
      update['details.dueAt'] = null;
      update["details.type"] = "note";
    }
    //Images array updated
    if (note.images &&
      Array.isArray(note.images) &&
      (typeof note.images[0] == "string" || note.images.length == 0)) {
      update["details.images"] = note.images
    };
    //Note string updated
    if (note.note && typeof note.note == "string") {
      update["details.note"] = note.note
    };
    //Shared members array updated
    if (note.details?.sharedWith &&
      Array.isArray(note.details.sharedWith) &&
      (typeof note.details.sharedWith[0] == "string" || note.details.sharedWith.length == 0)) {
      update["details.sharedWith"] = note.details.sharedWith
    };
    //Time-to-complete updated
    if (note.details?.timeToComplete &&
      typeof note.details.timeToComplete == "number") {
      update["details.timeToComplete"] = note.details.timeToComplete;
    }
    //Change assigned course
    if (note.meta?.courseId &&
      typeof note.meta.courseId == "string") {
      update["meta.courseId"] = new ObjectId(note.meta.courseId);
    }

    //update time to reflect these changes
    update["meta.lastModifiedAt"] = DateTime.now().toISO();

    return update;
  } catch (err) {
    console.log(err);
  }
}

