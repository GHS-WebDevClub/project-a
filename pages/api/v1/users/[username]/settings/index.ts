// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { useRouter } from 'next/router';
import { getSession } from "next-auth/react";
import { UserSettings } from '../../../../../../types/api/UserObject.type';
import clientPromise from '../../../../../../utils/db/connect';
import { ResponseDataT } from '../../../../../../types/api/ResponseData.type';
import Member from '../../../../../../types/db/member.type';
import { ProfileType } from '../../../../../../types/db/profile.type';

export default (req: NextApiRequest, res: NextApiResponse<ResponseDataT<ProfileType>>) => {
  switch (req.method) {
    case "GET": getSettings(req, res); break;
    case "POST": postSettings(req, res); break;
    default: {
      res.status(404).send({error: 404});
    }
  }
}

async function getSettings(req: NextApiRequest, res: NextApiResponse<ResponseDataT<ProfileType>>) {
  try {
    const db = (await clientPromise).db();
    const {username} = req.query;
    const user = await db.collection("members").findOne(
        { username: username }
      );
    const prof = (user as Member).profile;

    res.status(200).send({result: prof});
  } catch (err) {
    console.log(err);
    res.status(500).send({error: "internal server error!"});
  }

}

function postSettings(req: NextApiRequest, res: NextApiResponse<ResponseDataT<ProfileType>>) {
  const newSettings: ProfileType = req.body;
  // todo: send to database?
  res.status(500).send({error: "Not implemented!"});
}