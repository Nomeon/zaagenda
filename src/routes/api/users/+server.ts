import { ObjectId } from "mongodb";
import db from "$lib/db";

export async function GET(request: Request): Promise<Response> {
    try {
        const collection = db.collection("users");
        const url = new URL(request.url);
    
        const id = url.searchParams.get("id") || "";
        const name = url.searchParams.get("name") || "";
        const email = url.searchParams.get("email") || "";
    
        const query: { id?: string; name?: string; email?: string } = {};
        let user;
    
        if (id) {
            const o_id = new ObjectId(id);
            user = await collection.find({ _id: o_id }).toArray();
        } else if (name || email) {
            if (name && email) {
                query.name = name;
                query.email = email;
                user = await collection.find(query).toArray();
            } else if (email && name === "") {
                query.email = email;
                user = await collection.find(query).toArray();
            }
        }
        return new Response(JSON.stringify(user));
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