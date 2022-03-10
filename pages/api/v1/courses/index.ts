/**
 * Handles Creation and (while in development, ) listing of all courses
 *
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/28/2022
 */

import { Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ResponseData } from "../../../../types/api/ResponseData.type";
import { Course } from "../../../../types/db/course.type";
import apiLogger, { ApiMsg } from "../../../../utils/api/Logger";
import { getCourses } from "../../../../utils/api/v1/courses";
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
    const db = (await clientPromise).db();

    switch (req.method) {
      case "GET":
        const courses = await getCourses(db);
        if (!courses)
          return res.status(500).json({ error: "Failed to retrieve courses!" });

        return res.status(200).json({ result: courses });
      case "POST":
        console.log("yo");
        const data = JSON.parse(req.body);
        const course = await createCourse(db, data);
        if (!course)
          return res.status(500).json({ error: "Failed to create course!" });
      //TODO: Add support for course details to be updated / figure out how this will work.
    }
  } else res.status(404).json({ error: 404 });
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
