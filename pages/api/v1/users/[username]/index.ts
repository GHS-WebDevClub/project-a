import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseData } from '../../../../../types/api/ResponseData.type';
import type { UserObject } from '../../../../../types/api/UserObject.type';
import { getSession } from "next-auth/react";
import { Db } from "mongodb";
import clientPromise from "../../../../../utils/db/connect";


export default async (
    req: NextApiRequest, 
    res: NextApiResponse<ResponseData>
    ) =>{
        //Validate session
        if (!(await getSession({ req })))
            return res.status(401).json({ error: "You must be signed in to access this content." });

        //If logged in, check if method is valid for this API path:
        if(req.method === 'GET' || req.method === 'POST') {
            const db = (await clientPromise)

            switch (req.method) {
                case "GET":
                    /*if username exists in the users collection
                        return contents of object with the matching name field 
                    else return error*/
                case "POST":
                    /*
                    This API method would be called by the application after a user has filled out a name, email, and password.
                    If the name or email exist already, this should be terminated.

                    if object exists in the users collection with name || email
                        throw error and terminate process (Already in use)
                    else create new object with params
                    */
            }
        }else return res.status(404)
};