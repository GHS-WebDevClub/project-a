/**
 * Checks if session matches a given username; true -> Member, false -> undefined
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/08/2022
 */

import { Db } from "mongodb";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import Member from "../../../types/db/member.type";
import clientPromise from "../../db/connect";
import apiLogger, { ApiMsg } from "../Logger";

export default async function checkSessionUsername(
  req: NextApiRequest,
  username: string,
  db?: Db
): Promise<undefined | Member> {
  try {
    //Gets ObjectId from session
    const sessionId = (await getSession({ req }))?.user._id;
    //Database "members" collection
    const collection = db
      ? db.collection("members")
      : (await clientPromise).db().collection("members");
    //Finds member by sessionId
    const member = await collection.findOne({ _id: sessionId });

    //Checks if member exists and has a username matching the given one
    if (member && (member as Member).username == username)
      return member as Member;
    else return;
  } catch (err) {
    console.log(err);
    apiLogger(
      new ApiMsg(
        `Failed to check session against username ${username}`,
        "MAJ",
        req.url
      )
    );
    return;
  }
}
