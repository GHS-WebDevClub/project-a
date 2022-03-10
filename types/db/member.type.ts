/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/07/2022
 *
 * Describes the data structure for members (users after completing post-auth registration)
 *
 */

import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { ProfileType } from "./profile.type";

export default class Member {
  _id: ObjectId;
  username: string;
  courses: Array<ObjectId>;
  joinedAt: string;
  lastLoggedInAt?: string;
  profile: ProfileType;
  constructor(username: string, profile: ProfileType) {
    this._id = new ObjectId();
    this.username = username;
    this.courses = [];
    this.joinedAt = DateTime.now().toISO();
    this.profile = profile;
  }
}
