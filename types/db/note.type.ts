/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/16/2022
 * In compliance with the Milanote as of 03/17/2022 10:49PM
 *
 * Describes the data structure for notes (stored independent of courses, since some may be un-grouped)
 *
 */

import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { ThemeProvider } from "styled-components";
import { ProfileType } from "./profile.type";

export type NoteDetailsType = {
  type: "assignment" | "note"; //May add "journal" type in the future
  dueAt?: string;
  timeToComplete?: number;
  personalPriorityScore?: number;
  sharedWith?: Array<string>;
};

export type NoteMetaType = {
  author: string;
  courseId?: ObjectId;
  createdAt: string;
  lastModifiedAt: string;
  completedAt?: string;
};

//Submitted from client
export type NoteBodyType = {
  title: string;
  images?: Array<string>;
  note?: string;
  meta?: {
    courseId?: string;
  };
  details?: {
    dueAt?: string;
    timeToComplete?: number;
    sharedWith?: Array<string>;
  };
};

//Required for constructor, but not submitted by client.
export interface NoteConstructorType extends NoteBodyType {
  details: NoteBodyType["details"] & {
    personalPriorityScore: number;
  };
  meta: NoteBodyType["meta"] & { author: string };
}

export default class Note {
  _id: ObjectId;
  title: string;
  //String ID of some kind TBD, we will most likely store images in a S3-bucket style system
  images?: Array<string>;
  note?: string;
  details: NoteDetailsType;
  meta: NoteMetaType;

  constructor({ title, images, note, meta, details }: NoteConstructorType) {
    this._id = new ObjectId();
    this.title = title;
    this.images = images;
    this.note = note;
    (this.details = {
      type: details.dueAt ? "assignment" : "note",
      dueAt: details.dueAt,
      timeToComplete: details.timeToComplete,
      personalPriorityScore: details.personalPriorityScore,
      sharedWith: details.sharedWith,
    }),
      (this.meta = {
        author: meta.author,
        courseId: meta.courseId ? new ObjectId(meta.courseId) : undefined,
        createdAt: DateTime.now().toISO(),
        lastModifiedAt: DateTime.now().toISO(),
        completedAt: undefined,
      });
  }
}
