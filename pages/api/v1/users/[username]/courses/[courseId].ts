/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/21/2022
 *
 * Based on:
 * DELETE /users/<username>/courses/<courseId>/ - Disenroll a member in a specific course (WIP aubin)
 */

import { Db, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ApiError } from "../../../../../../types/api/ApiError/ApiError.type";
import {
    ResponseDataT,
    ResponseUni,
} from "../../../../../../types/api/ResponseData.type";
import checkSessionUsername from "../../../../../../utils/api/v1/checkSessionUsername";
import clientPromise from "../../../../../../utils/db/connect";

/**
 * ID of Course Disenrolled in
 */
export type MemberDisenrollmentResp = string;

export default async function (
    req: NextApiRequest,
    res: NextApiResponse<ResponseUni<MemberDisenrollmentResp>>
) {
    const path = req.url || null;

    if (req.method !== "DELETE")
        return res
            .status(405)
            .json(new ResponseUni([ApiError.fromCode("req-001")], path));

    //Check session
    const session = await getSession({ req });
    if (!session)
        return res
            .status(401)
            .json(new ResponseUni([ApiError.fromCode("auth-001")], path));

    const { username, courseId } = req.query;

    //Check request
    if (typeof username !== "string" || typeof courseId !== "string")
        return res
            .status(400)
            .json(new ResponseUni([ApiError.fromCode("req-002")], path));

    const db = (await clientPromise).db();

    //Check username matches session
    if (!(await checkSessionUsername(req, username, db, session)))
        return res
            .status(403)
            .json(new ResponseUni([ApiError.fromCode("auth-002")], path));

    switch (req.method) {
        case "DELETE": {
            const updateResult = await disenrollMember(db, username, courseId);
            if (!updateResult || !updateResult.acknowledged)
                return res
                    .status(500)
                    .json(new ResponseUni([ApiError.fromCode("srv-001")], path));
            return res.status(200).json(new ResponseUni([], path, courseId));
        }
    }
}

async function disenrollMember(db: Db, username: string, courseId: string) {
    try {
        const member = await db
            .collection("members")
            .updateOne(
                { username: username },
                { $pull: { courses: new ObjectId(courseId) } }
            );
        return member;
    } catch (err) {
        console.log(err);
    }
}
