/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/28/2022
 *
 * Describes the data structure for classes (groups / places to organize notes)
 * All classes should have at least one teacher, identified by a string ID, they do not need to have an acct.
 * Verification for the forseeable future will be done manually and this will show who (of platform admin) verified and when.
 * slug used for URLs, no standardized format yet.
 */

import { ObjectId } from "mongodb";
import { Teacher } from "./teacher.type";
import { DateTime } from "luxon";

export type courseVerificationType = {
  verifiedAt?: string;
  verifiedBy?: ObjectId;
};

export class Course {
  _id: ObjectId;
  slug: string;
  displayName: string;
  teachers?: Array<ObjectId>;
  verification: courseVerificationType;
  createdAt: string;
  lastModifiedAt: string;

  constructor(
    displayName: string,
    teachers?: Array<Teacher>,
    verifiedBy?: ObjectId
  ) {
    this._id = new ObjectId();
    this.displayName = displayName;
    this.slug = displayName
      .replace(/[^A-Za-z0-9_-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    this.teachers = teachers?.map((teacher) => teacher._id);
    this.createdAt = DateTime.now().toISO();
    this.lastModifiedAt = this.createdAt;
    this.verification = verifiedBy
      ? { verifiedAt: this.createdAt, verifiedBy: verifiedBy }
      : {};
  }
}
