/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 03/30/2022
 *
 * Based on:
 * PUT /users/<username>/settings/<setting_slug> - Updates specific user preference (TODO Aubin / C34A)
 */

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ResponseDataT } from "../../../../../../types/api/ResponseData.type";
import clientPromise from "../../../../../../utils/db/connect";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataT<string>>
) => {
  if (!(req.method == "PUT"))
    return res.status(405).json({ error: "Method not allowed" });
    
  const session = await getSession({ req });
  if (!session)
    return res
      .status(401)
      .json({ error: "You must be signed in to access this content." });

  const db = (await clientPromise).db();
  const { username, slug } = req.query;

  if (typeof username !== "string" || typeof slug !== "string")
    return res.status(400).json({ error: 400 });

  
};
