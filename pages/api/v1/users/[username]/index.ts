import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseData } from '../../../../../types/api/ResponseData.type';
import type { UserObject } from '../../../../../types/api/UserObject.type';
import type { getSession } from "next-auth/react";

export default function username(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if(req.method === 'GET') {
        //send info from MongoDB
        const { username } = req.query;
        res.status(200).json({ result: `user: ${username}` })
    }else if(req.method === 'POST') {
        //post new user to API
    }else {
        //Error for no known method
    }

};