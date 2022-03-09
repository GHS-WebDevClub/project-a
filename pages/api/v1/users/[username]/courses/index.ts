import { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../../../../types/api/ResponseData.type";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!(req.method == "POST" || req.method == "GET"))
    return res.status(404).json({ error: 404 });

  switch (req.method) {
    case "GET":
      break;
    case "POST":
      break;
  }
}
