import { Collection, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../../types/api/ResponseData.type";
import { Course } from "../../../../types/db/course.type";
import { Teacher } from "../../../../types/db/teacher.type";
import apiLogger, { ApiMsg } from "../../../../utils/api/Logger";
import clientPromise from "../../../../utils/db/connect";

export default async function Search(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    const { q } = req.query;
    if (!(typeof q === "string"))
      return res.status(400).json({ error: "Malformed request" });
    const searchResults = await getCourses(q);
    if (!searchResults)
      return res.status(500).json({ error: "Failed to retrieve courses." });
    res.status(200).json({ result: searchResults });
  } else res.status(404).json({ error: "404 not found" });
}

export type SearchCourseResultType = {
  id: string;
  displayName: string;
  isVerified: boolean;
  primaryTeacher?: string;
};

async function getCourses(
  query: string
): Promise<Array<SearchCourseResultType> | undefined> {
  const searchQuery = { $text: { $search: query } };
  try {
    const collection = (await clientPromise).db().collection("courses");
    const courses = await collection
      .find(searchQuery)
      .limit(15)
      .project({ _id: 1, displayName: 1, verification: 1 })
      .toArray();

    //Courses array formatted as a <SearchCourseResultType>
    const results: Array<SearchCourseResultType> = await Promise.all(
      courses.map(async (course) => {
        return {
          id: (course as Course)._id.toString(),
          displayName: (course as Course).displayName,
          isVerified: (course as Course).verification.verifiedAt ? true : false,
          primaryTeacher: await getTeacherName(course as Course, collection),
        };
      })
    );
    return results;
  } catch (err) {
    console.log(err);
    apiLogger(
      new ApiMsg(
        `Failed to retrieve courses based on search query: ${query}`,
        "MAJ",
        "GET /api/v1/courses/search"
      )
    );
    return;
  }
}

async function getTeacherName(
  course: Course,
  coll: Collection
): Promise<string | undefined> {
  if (course.teachers && course.teachers.length > 0) {
    const teacher = await coll.findOne({
      _id: new ObjectId(course.teachers[0]),
    });
    return (teacher as Teacher)?.profile.displayName;
  } else return;
}
