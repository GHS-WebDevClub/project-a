import { ObjectId } from "mongodb";

export type UserObject = {
    _id: ObjectId;
    username: string;
    joinedAt: string;
    lastLoggedAt: string;
    profile: UserSettings;
}

export type UserSettings = {
    name: string;
    email?: string;
    phone?: string;
    image?: string;
}