/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/28/2022
 *
 * Describes a teacher's profile (to be associated with classes)
 */

import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { ProfileType } from "./profile.type";

export type verifiedCoursesType = Array<{
  courseId: ObjectId;
  verifiedAt: string;
  verifiedBy: ObjectId;
}>;

export class Teacher {
  _id: ObjectId;
  profile: ProfileType;
  verifCourses: Array<verifiedCoursesType>;
  createdAt: string;
  lastModifiedAt: string;

  constructor(
    profile: ProfileType,
    initialVerifCourses?: Array<verifiedCoursesType>
  ) {
    this._id = new ObjectId();
    this.profile = profile;
    this.createdAt = DateTime.now().toISO();
    this.lastModifiedAt = this.createdAt;
    this.verifCourses = initialVerifCourses || [];
  }
}
