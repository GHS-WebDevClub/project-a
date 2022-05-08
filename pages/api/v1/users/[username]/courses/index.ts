/**
 * Returns Array<Course> containing courses for a specific member based on the username in URL
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/08/2022
 *
 * Based on:
 * GET /users/<username>/courses - returns array of user's classes (DONE aubin)
 * POST /users/<username>/courses - adds new course to a member
 */

import { Db, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ApiError } from "../../../../../../types/api/ApiError/ApiError.type";
import {
  ResponseUni,
} from "../../../../../../types/api/ResponseData.type";
import { Course } from "../../../../../../types/db/course.type";
import checkSessionUsername from "../../../../../../utils/api/v1/checkSessionUsername";
import { getCoursesByUsername } from "../../../../../../utils/api/v1/courses";
import clientPromise from "../../../../../../utils/db/connect";

export type MemberCourseResponse = string | Array<Course>;

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseUni<MemberCourseResponse>>
) {
  const path = req.url || null;

  //Check method
  if (!(req.method == "GET" || req.method == "POST"))
    return res
      .status(405)
      .json(new ResponseUni([ApiError.fromCode("req-001")], path));

  const { username } = req.query;
  const courseId = req.body;

  //Check request
  if (typeof username !== "string" || typeof courseId !== "string")
    return res
      .status(400)
      .json(new ResponseUni([ApiError.fromCode("req-002")], path));

  //Check session
  const session = await getSession({ req });
  if (!session)
    return res
      .status(401)
      .json(new ResponseUni([ApiError.fromCode("auth-001")], path));

  const db = (await clientPromise).db();

  //Check session matches username
  if (!(await checkSessionUsername(req, username, db, session)))
    return res
      .status(403)
      .json(new ResponseUni([ApiError.fromCode("auth-002")], path));

  switch (req.method) {
    case "GET":
      const courses = await getCoursesByUsername(username);
      if (!courses)
        return res
          .status(500)
          .json(new ResponseUni([ApiError.fromCode("srv-001")], path));
      return res.status(200).json(new ResponseUni([], path, courses));
    case "POST":
      const updateResult = await enrollMember(db, username, courseId);
      if (!updateResult || !updateResult.acknowledged)
        return res
          .status(500)
          .json(new ResponseUni([ApiError.fromCode("srv-001")], path));
      return res.status(200).json(new ResponseUni([], path, courseId));
  }
}

async function enrollMember(db: Db, username: string, courseId: string) {
  try {
    //Check that the course exists in DB
    const course = db
      .collection("courses")
      .findOne({ _id: new ObjectId(courseId) });
    if (!course) return;
    //note: $push adds item to array, $addToSet checks if it already exists in array, then adds if not.
    const member = await db
      .collection("members")
      .updateOne(
        { username: username },
        { $addToSet: { courses: new ObjectId(courseId) } }
      );
    return member;
  } catch (err) {
    console.log(err);
  }
}
