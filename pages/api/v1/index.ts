// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData, ResponseUni } from '../../../types/api/ResponseData.type'
import apiLogger, { ApiMsg } from '../../../utils/api/Logger'


export default (req: NextApiRequest, res: NextApiResponse<ResponseUni<object>>) => {
  if (req.method == "GET") {
    res.status(200).json(new ResponseUni([], req.url || null, {
      result: {
        apiVersion: "v1.0.0",
        docs: "",
        requestID: new ApiMsg("", undefined, "/api/v1").uuid
      }
    }))
  }
}