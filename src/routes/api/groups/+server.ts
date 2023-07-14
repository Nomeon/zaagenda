import { getDB } from "$lib/db";
import { ObjectId } from "mongodb";


export async function GET(request: Request): Promise<Response> {
    try {
        const db = getDB();
        const collection = db.collection("groups");
        const url = new URL(request.url);
        const name = url.searchParams.get("name") || "";
        const id = url.searchParams.get("id") || "";
        const user = url.searchParams.get("user_id") || "";
        const rave = url.searchParams.get("rave_id") || "";
        
        const query: { [key: string]: any } = {};
    
        if (id) {
            query._id = new ObjectId(id);
        } else if (user) {
            query.user_ids = new ObjectId(user);
        } else if (name) {
            query.group_name = name;
        } else if (rave) {
            query.rave_ids = new ObjectId(rave);
        }
    
        const groups = await collection.find(query).toArray();
        if (groups.length === 0) {
            return new Response(JSON.stringify("Not Found"), { status: 404 });
        }
        return new Response(JSON.stringify(groups), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 })
    }
}

export async function POST({ request }: any): Promise<Response> {
    try {
        const db = getDB();
        const collection = db.collection("groups");
        const body = await request.json();
        const { group_name, user_ids } = body;
    
        if (!group_name || (user_ids.length === 0)) {
            return new Response("Bad Request", { status: 400 });
        }
        const { insertedId } = await collection.insertOne({ group_name: group_name, user_ids: user_ids.map((id: string) => new ObjectId(id)), rave_ids: [] });
        return new Response(JSON.stringify(insertedId.toString()), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 })
    }
}

export async function PUT({ request }: any): Promise<Response> {
    try {
        const db = getDB();
        const collection = db.collection("groups");
        const body = await request.json();
        const { id, user_ids, rave_ids } = body;

        if (id && user_ids && rave_ids) {
            collection.updateOne({ _id: new ObjectId(id) }, { $addToSet: { user_ids: { $each: user_ids.map((id: string) => new ObjectId(id)) }, rave_ids: { $each: rave_ids.map((id: string) => new ObjectId(id)) }}});
        } else if (id && user_ids) {
            collection.updateOne({ _id: new ObjectId(id) }, { $addToSet: { user_ids: { $each: user_ids.map((id: string) => new ObjectId(id)) }}});
        } else if (id && rave_ids) {
            collection.updateOne({ _id: new ObjectId(id) }, { $addToSet: { rave_ids: { $each: rave_ids.map((id: string) => new ObjectId(id)) }}});
        }

        return new Response(JSON.stringify(body), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 })
    }
}

export async function DELETE({ request }: any): Promise<Response> {
    try {
        const db = getDB();
        const collection = db.collection("groups");
        const body = await request.json();
        const { id, users, raves } = body;

        if (id && !users && !raves) {
            collection.deleteOne({ _id: new ObjectId(id) });
        } else if (id && (users.length > 0)) {
            collection.updateOne({ _id: new ObjectId(id) }, { $pullAll: { user_ids: users.map((id: string) => new ObjectId(id)) }});
        } else if (id && (raves.length > 0)) {
            collection.updateOne({ _id: new ObjectId(id) }, { $pullAll: { rave_ids: raves.map((id: string) => new ObjectId(id)) }});
        }

        return new Response(JSON.stringify(body), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 })
    }
}