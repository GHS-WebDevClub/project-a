import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from 'mongodb'
import { Course } from '../../../../../../types/db/course.type'
import { ResponseData } from "../../../../../../types/api/ResponseData.type";
import clientPromise from "../../../../../../utils/db/connect";
import {Db} from 'mongodb'
import apiLogger, {ApiMsg} from "../../../../../../utils/api/Logger";
import { useRouter } from 'next/router'
import courses from "../../../courses";

export default async function course(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if(req.method === 'GET') {
        const db = (await clientPromise).db()
        const router = useRouter()
        const { username } = router.query
        
        if(typeof username != "string") return res.status(400).json({
            error: "malformed request",
        });

        //send info from MongoDB
        var courseInfo = await getCourses(db, username)//get the course info from the database

        res.status(200).json({ result: `courseInfo: ${courseInfo}` })
    }else if(req.method === 'POST') {

        //post new user to API
    }else {
        //Error for no known method
    }

};

async function getCourses(db: Db, username:string): Promise<undefined | Array<Course>> {

    try {

        const member = await db.collection("member").findOne({username: username})
        
        if(!member) return

        return member.courses

    } catch(err) {
        console.log(err)
        apiLogger(
            new ApiMsg(
                'Failed to retrieve user courses from the database!',
                'MAJ',
                'GET /user/[username]/courses'
            )
        )
        return;
    }
    return undefined;
} 