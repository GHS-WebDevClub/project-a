/**
 * Handles GET and POST API requests to /api/v1/users/[username]
 *
 * Created by Jack Sanford (@bedrock206) on 03/07/2022
 */

import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDataT } from "../../../../../types/api/ResponseData.type";
import type { UserObject } from "../../../../../types/api/UserObject.type";
import { getSession } from "next-auth/react";
import { Db } from "mongodb";
import clientPromise from "../../../../../utils/db/connect";
import Member from "../../../../../types/db/member.type";

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ResponseDataT<string | Object>>
) => {
    //Validate session
    if (!(await getSession({ req })))
        return res
            .status(401)
            .json({ error: "You must be signed in to access this content." });

    //If logged in, check if method is valid for this API path:
    if (req.method === "GET" || req.method === "POST") {
        switch (req.method) {
            case "GET": {
                const { username } = req.query;

                if (!(typeof username === "string"))
                    //If the request is formatted incorrectly, throw error
                    return res
                        .status(400)
                        .json({ error: "Malformed request!" });

                const collection = (await clientPromise)
                    .db()
                    .collection("members");
                const member = await collection.findOne(
                    { username: username },
                    { projection: { _id: 0, profile: 1 } }
                );
                return res.status(200).json({ result: member ? member : {} });
            }
            case "POST":
                {
                    const { username } = req.query;

                    if (!(typeof username === "string"))
                        //If the request is formatted incorrectly, throw error
                        return res
                            .status(400)
                            .json({ error: "Malformed request!" });

                    const collection = (await clientPromise)
                        .db()
                        .collection("members");
                    const member = await collection.findOne(
                        { username: username },
                        { projection: { _id: 0, profile: 1 } })
                    if (!(member === null))  return res.status(500).json({ error: "User already exists!"}) //If you get a result back, the user already exists
                    return res.status(200).json({result: `${req.query.username} is not a user that exists yet`})

                }
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
