/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/30/2022
 *
 * Based on:
 * PUT /users/<username>/settings/<setting_slug> - Updates specific user preference (TODO Aubin / C34A)
 */

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ApiError } from "../../../../../../types/api/ApiError/ApiError.type";
import { ResponseUni } from "../../../../../../types/api/ResponseData.type";
import clientPromise from "../../../../../../utils/db/connect";

/**
 * Update setting slug
 */
export type UpdateSettingResponse = string;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseUni<UpdateSettingResponse>>
) => {
  const url = req.url || null;

  if (!(req.method == "PUT"))
    return res.status(405).json(new ResponseUni([ApiError.fromCode("req-001")], url));

  const session = await getSession({ req });
  if (!session)
    return res
      .status(401)
      .json(new ResponseUni([ApiError.fromCode("auth-001")], url));

  const { username, slug } = req.query;

  if (typeof username !== "string" || typeof slug !== "string" || req.body == null)
    return res.status(400).json(new ResponseUni([ApiError.fromCode("req-002")], url));

  const member = await updateSetting(slug, req.body, username)

  if (!member) return res.status(500).json(new ResponseUni([ApiError.fromCode("srv-001")], url))

  return res.status(200).json(new ResponseUni([], url, slug));
};

//TODO: data validation
async function updateSetting(key: string, value: any, username: string) {
  switch (key) {
    case "display-name": return await updateMember(username, { displayName: value })
    case "phone": return await updateMember(username, { phone: value })
    case "email": return await updateMember(username, { email: value })
    case "image": return await updateMemberImage()
    default: return false
  }
}

async function updateMember(username: string, data: Object): Promise<boolean> {
  try {
    const db = (await clientPromise).db();

    const ok = (await db.collection("members").findOneAndUpdate({ username: username }, { $set: data }, { returnDocument: "after" })).ok

    return ok == 1 ? true : false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateMemberImage() {
  /**
   * TODO: MinIO research, S3 research, Test cluster, create MinIO client and interactions
   * 
   * Yay object storage~!
   * 
   * 1. Stores uploaded image data in an S3 cluster / bucket
   * 2. Returns reference ID for said image
   * 3. Returns public-facing URL for image access.
   * 4. Stores URL in Member object in DB
   */
}