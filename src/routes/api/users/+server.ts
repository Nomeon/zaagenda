import db from "../db";

export async function GET(request: Request): Promise<Response> {
    const collection = db.collection("users");
    const url = new URL(request.url);

    const id = url.searchParams.get("id") || "";
    const name = url.searchParams.get("name") || "";
    const email = url.searchParams.get("email") || "";

    const query: { id?: string; name?: string; email?: string } = {};
    let user;

    if (id) {
        if (name && email) {
            query.name = name;
            query.email = email;
            user = await collection.find(query).toArray();
        } else if (email && name === "") {
            query.email = email;
            user = await collection.find(query).toArray();
        }
    } else {
        user = await collection.find(query).toArray();
    }

    return new Response(JSON.stringify(user));
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