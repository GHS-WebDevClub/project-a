import { Db } from "mongodb";
import { Course } from "../../../types/db/course.type";
import Member from "../../../types/db/member.type";
import clientPromise from "../../db/connect";
import apiLogger, { ApiMsg } from "../Logger";

//Retrieve all courses from database
export async function getCourses(db?: Db): Promise<undefined | Array<Course>> {
  try {
    const collection = db
      ? db.collection("courses")
      : (await clientPromise).db().collection("courses");
    const courses = await collection.find().toArray();
    return courses as Array<Course>;
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

export async function getCourseByName(displayName: string, db?: Db): Promise<undefined | any> {
  try {
    const collection = db
      ? db.collection("courses")
      : (await clientPromise).db().collection("courses");
    const course = collection.findOne({ displayName: displayName });
    return course;
  } catch (err) {
    console.log(err);
    apiLogger(
      new ApiMsg(
        `Failed to retrieve the course '${displayName}' from the database!`,
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
  const database = db
    ? db
    : (await clientPromise).db()

  try {
    //Get member document from DB
    const member = await database.collection("members").findOne({ username: username });
    //Get all courses matching IDs stored in the Member "courses" array

    const courses = await database.collection("courses")
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
