import { Db } from "mongodb";
import { Course } from "../../../../types/db/course.type";
import Member from "../../../../types/db/member.type";
import apiLogger, { ApiMsg } from "../../Logger";

//Retrieve all courses from database
export async function getCourses(db: Db): Promise<undefined | Array<any>> {
  try {
    const courses = await db.collection("courses").find().toArray();
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
  db: Db,
  username: string
): Promise<undefined | Array<Course>> {
  try {
    //Get member document from DB
    const member = await db
      .collection("members")
      .findOne({ username: username });
    //Get all courses matching IDs stored in the Member "courses" array
    const courses = await db
      .collection("courses")
      .find({ _id: { $in: (member as Member).courses } })
      .toArray();
    return courses as Course[];
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
