import dbConnect from "@/lib/dbConnect";
import { HttpHandler } from "@/lib/HttpResponse";
import quota from "@/models/quota";
import { parse } from "date-fns";
import Randomstring from "randomstring";

export async function POST(req) {
    await dbConnect()

    try {
        let params = await req.json()

        params = params.quota.map(data => {
            return {
                "_id": Randomstring.generate(),
                ...data,
                "datetime": parse(data?.datetime, 'yyyy-MM-dd HH:mm:ss', new Date()).toISOString()
            }
        })

        let response = { code: 0, content: null, message: "Success" }
        let insert = await quota.insertMany(params)

        if(!insert) response = { code: -1, ...response, message: "Failed adding quota usage" }

        return Response.json(response)
    } catch (e) {
        let response = { code: -1, content: null, message: "Failed add new quota usage" }

        return Response.json(response)
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const offset = searchParams.get("offset")
    const limit = searchParams.get("limit")
    const sort = searchParams.get("sort")

    await dbConnect()

    try {
        let filter = (search) ? { search } : {}
        const count = await quota.countDocuments(filter)
        const data = await quota.find(filter).limit(limit).skip(offset).sort(sort)
        return await HttpHandler(Response, { count, results: data })
    } catch(e) {
        let response = { code: -1, content: null, message: e }

        return Response.json(response)
    }
}