import { ObjectId } from "mongodb";
import { getDB } from "$lib/db";

const db = getDB();

export async function GET(request: Request): Promise<Response> {
    try {
        const collection = db.collection("users");
        const url = new URL(request.url);
        const id = url.searchParams.get("id") || "";
        const email = url.searchParams.get("email") || "";
        const JSONids = url.searchParams.get("ids") || "";
        let ids: string[] = [];
        
        if (JSONids !== "") {
            ids = JSON.parse(decodeURIComponent(JSONids))
        }
        const query: { id?: string; name?: string; email?: string; ids?: [] } = {};
        let user;
    
        if (id) {
            const o_id = new ObjectId(id);
            user = await collection.find({ _id: o_id }).toArray();
        } else if (email) {
            query.email = email;
            user = await collection.find(query).toArray();
        } else if (ids) {
            let o_ids: ObjectId[] = [];
            ids.forEach((element: string) => {
                o_ids.push(new ObjectId(element))        
            });
            user = await collection.find({ _id: {$in: o_ids }}).toArray();
        }
        return new Response(JSON.stringify(user));
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", {status: 500})
    }
}

export async function PUT({ request }: any): Promise<Response> {
    try {
        const collection = db.collection("users");
        const body = await request.json();
        const { id, name } = body;

        if (name) {
            collection.updateOne({ _id: new ObjectId(id) }, { $set: { name } });
        }
        return new Response(JSON.stringify({ id, name }));
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", {status: 500})
    }
}


export async function POST({ request }: any): Promise<Response> {
    const collection = db.collection("users");
    const body = await request.json();
    const { name, email, image } = body;

    if (name && email) {
        collection.insertOne({ name, email, image });
    }
    return new Response(JSON.stringify({ name, email, image }));
}