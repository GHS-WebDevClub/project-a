/**
 * Checks if session matches a given username; true -> Member, false -> undefined
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/08/2022
 */

import { Collection, Db, ObjectId } from "mongodb";
import { NextApiRequest } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Member from "../../../types/db/member.type";
import clientPromise from "../../db/connect";
import apiLogger, { ApiMsg } from "../Logger";

export default async function checkSessionUsername(
  req: NextApiRequest,
  username: string,
  db?: Db,
  session?: Session
): Promise<undefined | true> {
  try {
    /** Checks if session matches username using one of two ways:
     *  1. compares username to username potentially stored in session, if it's not:
     *  2. loads member using session id, and compares username
     *
     *  returns true if matches, undefined if not
     */

    //use given session or load from req object
    const sessionUser = (session ? session : await getSession({ req }))?.user;

    //no session, exit
    if (!sessionUser) return


    //check if username is already stored in session, and matches
    if (sessionUser.username == username) return true;

    //load DB
    const database = db ? db : (await clientPromise).db();

    //get Member using session id (queries database)
    const member = await getMemberfromDB(sessionUser._id, database);

    //Checks if member username matches, then saves it to session if it does
    if (member?.username == username) return true;
  } catch (err) {
    console.log(err);
    apiLogger(
      new ApiMsg(
        `Failed to check session against username ${username}`,
        "MAJ",
        req.url
      )
    );
  }
}

async function getMemberfromDB(
  sessionId: string,
  db: Db
): Promise<Member | null> {
  //Finds member by sessionId
  const member = await db.collection("members").findOne({ _id: sessionId });

  //typecasts document to Member
  return member as Member;
}