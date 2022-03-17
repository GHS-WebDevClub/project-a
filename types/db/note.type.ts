/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/16/2022
 *
 * Describes the data structure for notes (stored independent of their assigned courses)
 *
 */

 import { DateTime } from "luxon";
 import { ObjectId } from "mongodb";
 import { ProfileType } from "./profile.type";
 
export type NoteDetailsType = {
    type: "assignment" | "note" | "journal";
    dueAt?: string;
    timeToComplete?: number;
    personalPriorityScore?: number;
    sharedWith?: Array<ObjectId>;
}

export type NoteMetaType = {
    authorId: ObjectId;
    courseId?: ObjectId
    createdAt: string;
    lastModifiedAt: string;
}

 export default class Note {
   _id: ObjectId;
   title: string;
   images?: Array<string>;
   note?: string;
   details?: NoteDetailsType;
   meta: NoteMetaType;

   constructor(title: string, authorId: string, dueAt?: string, timeToComplete?: number, personalPriorityScore?: ) {
    this._id = new ObjectId();
    this.title = title;

   }
 }
 