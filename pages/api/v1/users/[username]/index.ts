import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseData } from "../../../../../types/api/ResponseData.type";
import type { UserObject } from "../../../../../types/api/UserObject.type";
import { getSession } from "next-auth/react";
import { Db } from "mongodb";
import clientPromise from "../../../../../utils/db/connect";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  //Validate session
  if (!(await getSession({ req })))
    return res
      .status(401)
      .json({ error: "You must be signed in to access this content." });

  //If logged in, check if method is valid for this API path:
  if (req.method === "GET" || req.method === "POST") {

    switch (req.method) {
      case "GET":
        const { username } = req.query;

        if (!(typeof username === "string")) //If the request is formatted incorrectly, throw error
          return res.status(400).json({ error: "Malformed request!" });

        const collection = (await clientPromise).db().collection("members");
        const member = await collection.findOne(
          { username: username },
          { projection: { username: 1, _id: 0 } }
        );
        /*if (!member) //If nothing matches the request, throw an error
          return res.status(200).json({ error: "Internal server error" });*/
        return res.status(200).json({ result: member ? member : {}});
      case "POST":
        /*
        This API method would be called by the application after a user has filled out a displayname, email, and username.
        If the name or email exist already, this should be terminated.

        if object exists in the users collection with name || email
            throw error and terminate process (Already in use)
        else create new object with params
        */
        break;
    }
  } else return res.status(404);
};
