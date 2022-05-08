// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { useRouter } from 'next/router';
import { getSession } from "next-auth/react";
// import { UserSettings } from '../../../../../../types/api/UserObject.type';
import clientPromise from '../../../../../../utils/db/connect';
import { ResponseUni } from '../../../../../../types/api/ResponseData.type';
import Member from '../../../../../../types/db/member.type';
import { ProfileType, PublicProfile, PrivateProfile } from '../../../../../../types/db/profile.type';
import { ApiError } from '../../../../../../types/api/ApiError/ApiError.type';

export type MemberProfileResponse = {
  public: ProfileType["public"];
  private?: ProfileType["private"];
}

export default (req: NextApiRequest, res: NextApiResponse<ResponseUni<MemberProfileResponse>>) => {
  switch (req.method) {
    // case "GET": getSettings(req, res); break;
    case "POST": postSettings(req, res); break;
    default: {
      res.status(404).send(new ResponseUni([new ApiError("404", "Resource not found")], req.url || null));
    }
  }
}

// async function getSettings(req: NextApiRequest, res: NextApiResponse<ResponseDataT<ProfileType>>) {
//   try {
//     const db = (await clientPromise).db();
//     const {username} = req.query;
//     const user = await db.collection("members").findOne(
//         { username: username }
//       );
//     if (user) {
//       const prof = (user as Member).profile;

//       res.status(200).send({result: prof});
//     } else {
//       res.status(404).send({error: `user '${username}' not found!`});
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({error: "internal server error!"});
//   }

// }

async function postSettings(req: NextApiRequest, res: NextApiResponse<ResponseDataT<ProfileType>>) {
  const newSettings: ProfileType = req.body;
  try {
    const db = (await clientPromise).db();
    const { username } = req.query;
    const user = await db.collection("members").findOne({ username: username });
    if (user) {

    } else {
      res.status(404).send({ error: `user '${username}' not found!` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "internal server error!" });
  }
}