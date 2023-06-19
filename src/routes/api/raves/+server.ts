import { ObjectId } from "mongodb";
import db from "$lib/db";

export async function GET(request: Request): Promise<Response> {
    try {
        const groupCol = db.collection("groups");
        const raveCol = db.collection("raves");
        const url = new URL(request.url);
        const id = url.searchParams.get("id") || "";

        if (id) {
            const groups = await groupCol.find({ user_ids: new ObjectId(id) }).toArray();
            let raveList: { name?: string | undefined; raves?: Object[] | undefined; amount?: number | undefined }[] = [];
          
            await Promise.all(groups.map(async (element) => {
              let rave_ids = element.rave_ids;
              let raves = await raveCol.find({ _id: { $in: rave_ids } }).toArray();
              if (raves) {
                let ravesObj: { name?: string, raves?: Object[], group_members?: string[] } = {};
                ravesObj.name = element.group_name;
                ravesObj.raves = raves;
                ravesObj.group_members = element.user_ids;
                raveList = [...raveList, ravesObj];
              }
            }));
            return new Response(JSON.stringify(raveList), { status: 200 });
        } 

        return new Response("Groups Not Found", { status: 404 })
    
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 })
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