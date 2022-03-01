/**
 * Handles Creation and (in-development) listing of all classes
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/28/2022
 */

import { Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ResponseData } from "../../../../types/api/ResponseData.type";
import { Class } from "../../../../types/db/class.type";
import clientPromise from "../../../../utils/db/connect";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  //Check session
  if (!(await getSession({ req })))
    return res
      .status(401)
      .json({ error: "You must be signed in to access this content." });

  //Handle logged-in state
  if (req.method == "GET" || req.method == "POST") {
    const db = (await clientPromise).db(process.env.API_VERSION || "v1");

    switch (req.method) {
      case "GET":
        //TODO: Retrieve all classes from DB, and send on res object
        break;
      case "POST":
        const newClass: Class = JSON.parse(req.body);
        await createClass(db, newClass);
        break;
      //TODO: Add support for class details to be updated / figure out how this will work.
    }
  } else res.status(404).json({ error: 404 });
};

async function createClass(db: Db, newClass: Class) {
  //TODO: Create class in Database here
}
