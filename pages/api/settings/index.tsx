// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string,
  note_auto_sharing: boolean,
  local_storage: boolean,
  sync_calendar: boolean,
  timezone: string,
  // what else should be in settings?
} | string; // string used for errors

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // todo: authentication
  switch (req.method) {
    case "GET": getSettings(req, res); break;
    case "POST": postSettings(req, res); break;
    default: {
      res.status(500).send("internal server error");
    }
  }
}

function getSettings(req: NextApiRequest, res: NextApiResponse<Data>) {
  // todo: get from database?
  res.status(200).json({
    name: "Winnie the Pooh",
    note_auto_sharing: true,
    local_storage: false,
    sync_calendar: false,
    timezone: "America/Los_Angeles",
  });
}

function postSettings(req: NextApiRequest, res: NextApiResponse<Data>) {
  const newSettings: Data = req.body;
  // todo: send to database?
  console.log(newSettings);
}