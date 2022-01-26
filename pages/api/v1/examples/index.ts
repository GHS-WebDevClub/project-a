import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "GET") {
    res.status(200).end("Base route for API examples");
  }
};
