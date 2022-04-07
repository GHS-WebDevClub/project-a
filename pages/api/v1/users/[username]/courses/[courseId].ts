/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/21/2022
 * 
 * Based on:
 * POST /users/<username>/courses/<courseId>/ - Enroll a member in a specific course (WIP aubin)
 * DELETE /users/<username>/courses/<courseId>/ - Disenroll a member in a specific course (WIP aubin)
 */

import { Db, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ResponseDataT } from "../../../../../../types/api/ResponseData.type";
import checkSessionUsername from "../../../../../../utils/api/v1/checkSessionUsername";
import clientPromise from "../../../../../../utils/db/connect";

export default async function (req: NextApiRequest, res: NextApiResponse<ResponseDataT<string>>) {
    if (!(req.method == "POST" || req.method == "DELETE")) return res.status(405).json({ error: "Method not allowed" });

    //Check session
    const session = await getSession({ req });
    if (!session)
        return res
            .status(401)
            .json({ error: "You must be signed in to access this content." });

    const db = (await clientPromise).db();
    const { username, courseId } = req.query;

    if (typeof username !== "string" || typeof courseId !== "string")
        return res.status(400).json({ error: 400 });

    if (!(await checkSessionUsername(req, username, db, session)))
        //We can't have this check in production (too many DB requests per one API request), username should be stored in session eventually (WIP)
        return res
            .status(403)
            .json({ error: "Access to this content is forbidden." });

    switch (req.method) {
        case "POST": {
            const updateResult = await enrollMember(db, username, courseId);
            if (!updateResult || !updateResult.acknowledged) return res.status(500).json({ error: "Failed to enroll in course!" });
            return res.status(200).json({ result: courseId })
        }
        case "DELETE": {
            const updateResult = await disenrollMember(db, username, courseId);
            if (!updateResult || !updateResult.acknowledged) return res.status(500).json({ error: "Failed to disenroll from course!" });
            return res.status(200).json({ result: courseId })
        }
    }
}

async function enrollMember(db: Db, username: string, courseId: string) {
    try {
        //Check that the course exists in DB
        const course = db.collection("courses").findOne({ _id: new ObjectId(courseId) });
        if (!course) return;
        //note: $push adds item to array, $addToSet checks if it already exists in array, then adds if not.
        const member = await db.collection("members").updateOne({ username: username }, { $addToSet: { courses: new ObjectId(courseId) } });
        return member;
    } catch (err) {
        console.log(err);
    }
}

async function disenrollMember(db: Db, username: string, courseId: string) {
    try {
        const member = await db.collection("members").updateOne({ username: username }, { $pull: { courses: new ObjectId(courseId) } });
        return member;
    } catch (err) {
        console.log(err);
    }
}