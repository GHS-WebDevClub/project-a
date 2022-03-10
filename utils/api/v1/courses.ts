import { Db } from "mongodb";
import { Course } from "../../../types/db/course.type";
import Member from "../../../types/db/member.type";
import clientPromise from "../../db/connect";
import apiLogger, { ApiMsg } from "../Logger";

//Retrieve all courses from database
export async function getCourses(db?: Db): Promise<undefined | Array<any>> {
  try {
    const collection = db
      ? db.collection("courses")
      : (await clientPromise).db().collection("courses");
    const courses = await collection.find().toArray();
    return courses;
  } catch (err) {
    console.log(err);
    apiLogger(
      new ApiMsg(
        "Failed to retrieve all courses from database!",
        "MAJ",
        "GET /api/v1/courses/"
      )
    );
    return;
  }
}

export async function getCoursesByUsername(
  username: string,
  db?: Db
): Promise<undefined | Array<Course>> {
  const collection = db
    ? db.collection("courses")
    : (await clientPromise).db().collection("courses");

  try {
    //Get member document from DB
    const member = await collection.findOne({ username: username });
    //Get all courses matching IDs stored in the Member "courses" array
    const courses = await collection
      .find({ _id: { $in: (member as Member).courses } })
      .toArray();
    return courses as Course[];
  } catch (err) {
    console.log(err);
    apiLogger(
      new ApiMsg(
        "Failed to retrieve all courses from database!",
        "MAJ",
        "GET /api/v1/users/[username]/courses"
      )
    );
    return;
  }
}
