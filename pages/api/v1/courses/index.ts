/**
 * Handles Creation and (while in development, ) listing of all courses
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/28/2022
 */

import { Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ApiError } from "../../../../types/api/ApiError/ApiError.type";
import { ResponseUni } from "../../../../types/api/ResponseData.type";
import { Course } from "../../../../types/db/course.type";
import apiLogger, { ApiMsg } from "../../../../utils/api/Logger";
import { getCourses } from "../../../../utils/api/v1/courses";
import clientPromise from "../../../../utils/db/connect";

/**
 * GET => Array of Courses
 * POST => String Course ObjectID
 */
export type CourseResult = Course[] | string;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseUni<CourseResult>>
) => {
  const url = req.url || null;

  //Check session
  if (!(await getSession({ req })))
    return res
      .status(401)
      .json(new ResponseUni([ApiError.fromCode("auth-001")], url));

  //Check method
  if (!(req.method == "GET" || req.method == "POST"))
    return res.status(405).json(new ResponseUni([ApiError.fromCode("req-001")], url))

  const db = (await clientPromise).db();

  switch (req.method) {
    case "GET":
      const courses = await getCourses(db);
      if (!courses)
        return res.status(500).json(new ResponseUni([ApiError.fromCode("srv-001", "Failed to retrieve courses!")], url));

      return res.status(200).json(new ResponseUni([], url, courses));
    case "POST":
      const data = req.body;
      const course = await createCourse(db, data);
      if (!course)
        return res.status(500).json(new ResponseUni([ApiError.fromCode("srv-001", "Failed to create course!")], url));

      return res.status(200).json(new ResponseUni([], url, course._id.toString()))
  }
};

//Create req.body as new course in database
async function createCourse(db: Db, data: any) {
  try {
    const course = new Course(data.displayName);
    await db.collection("courses").insertOne(course);
    await db.collection("courses").createIndex({ displayName: "text" });
    return course;
  } catch (err) {
    console.log(err);
    apiLogger(
      new ApiMsg(
        `Failed to create new course ${data._id?.toString()}`,
        "MAJ",
        "POST /api/v1/courses/"
      )
    );
    return;
  }
}
