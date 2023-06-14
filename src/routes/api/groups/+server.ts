import { ObjectId } from "mongodb";
import db from "../db";

export async function GET(request: Request): Promise<Response> {
    const collection = db.collection("groups");
    const url = new URL(request.url);
    const name = url.searchParams.get("name") || "";
    const id = url.searchParams.get("id") || "";

    const query: { name?: string } = {};
    let group;

    if (name !== "") {
        query.name = name;
        group = await collection.find(query).toArray();
    } else if (id !== "") {
        let o_id = new ObjectId(id);
        group = await collection.find({ _id: o_id }).toArray();
    }

    return new Response(JSON.stringify(group));
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