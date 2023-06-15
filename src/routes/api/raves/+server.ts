import { ObjectId } from "mongodb";
import db from "$lib/db";

export async function GET(request: Request): Promise<Response> {
    try {
        const collection = db.collection("raves");
        const url = new URL(request.url);
        const JSONids = url.searchParams.get("ids") || "";
        const ids = JSON.parse(decodeURIComponent(JSONids))

        let o_ids: ObjectId[] = [];

        if (ids) {
            ids.forEach((element: string) => {
                o_ids.push(new ObjectId(element))        
            });
        } 
        const raves = await collection.find({ _id: {$in: o_ids }}).toArray();
    
        return new Response(JSON.stringify(raves));
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", {status: 500})
    }
}

export async function POST({ request }: any): Promise<Response> {
    const collection = db.collection("users");
    const body = await request.json();
    const { name, email } = body;

    if (name && email) {
        collection.insertOne({ name, email });
    }
    return new Response(JSON.stringify({ name, email }));
}