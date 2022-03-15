// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { useRouter } from 'next/router';
import { getSession } from "next-auth/react";
import { UserSettings } from '../../../../../../types/api/UserObject.type';

type Response = UserSettings  // GET success response
              | {err: string} // failure
              | "OK";         // POST success

export default (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case "GET": getSettings(req, res); break;
    case "POST": postSettings(req, res); break;
    default: {
      res.status(500).send({err: "internal server error"});
    }
  }
}

function getSettings(req: NextApiRequest, res: NextApiResponse<Response>) {
  res.status(500).send({err: "Not implemented!"});
}

function postSettings(req: NextApiRequest, res: NextApiResponse<Response>) {
  const newSettings: UserSettings = req.body;
  // todo: send to database?
  res.status(500).send({err: "Not implemented!"});
}