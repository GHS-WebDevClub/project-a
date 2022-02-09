// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseData } from '../../../types/api/ResponseData.type'
import apiLogger, { ApiMsg } from '../../../utils/api/Logger'

export default (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  if(req.method == "GET") {
      res.status(200).json({ result: {
          apiVersion: "v1.0.0",
          docs: "",
          requestID: new ApiMsg("", undefined, "/api/v1").uuid
      } })
  }
}