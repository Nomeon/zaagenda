import { ObjectId } from "mongodb";
import db from "$lib/db";

export async function GET(request: Request): Promise<Response> {
    try {
        const collection = db.collection("groups");
        const url = new URL(request.url);
        const name = url.searchParams.get("name") || "";
        const id = url.searchParams.get("id") || "";
        const user = url.searchParams.get("user_id") || "";
        
        const query: { [key: string]: any } = {};
    
        if (id) {
            query._id = new ObjectId(id);
        } else if (user) {
            query.user_ids = new ObjectId(user);
        } else if (name) {
            query.group_name = name;
        }
    
        const groups = await collection.find(query).toArray();
    
        return new Response(JSON.stringify(groups));
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", {status: 500})
    }
}

export async function POST({ request }: any): Promise<Response> {
    const collection = db.collection("groups");
    const body = await request.json();
    const { name, emails } = body;

    if (name && emails && emails.length > 0) {
        collection.insertOne({ name, emails });
    }

    return new Response(JSON.stringify({ name }));
}