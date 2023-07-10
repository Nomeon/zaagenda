import { ObjectId } from "mongodb";
import { getDB } from "$lib/db";

const db = getDB();

export async function GET(request: Request): Promise<Response> {
    try {
        const groupCol = db.collection("groups");
        const raveCol = db.collection("raves");
        const url = new URL(request.url);
        const id = url.searchParams.get("id") || "";

        if (id) {
            const groups = await groupCol.find({ user_ids: new ObjectId(id) }).toArray();
            let raveList: { name?: string | undefined; raves?: Object[] | undefined; amount?: number | undefined }[] = [];
          
            await Promise.all(groups.map(async (element: Group) => {
              let rave_ids = element.rave_ids;
              let raves = await raveCol.find({ _id: { $in: rave_ids } }).toArray();
              if (raves) {
                let ravesObj: { group_id?: string, name?: string, raves?: Object[], group_members?: string[] } = {};
                ravesObj.group_id = element._id?.toString();
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
    try {
        const collection = db.collection("raves");
        const body = await request.json();
        const { event, startDate, endDate, attendees, tickets } = body;
        const startDateJSON = new Date(startDate);
        const endDateJSON = new Date(endDate);

        if (!event || !startDateJSON || !endDateJSON) {
            return new Response("Bad Request", { status: 400 });
        }
        let response;
        if (attendees && tickets) {
            response = await collection.insertOne({ event: event, startDate: startDateJSON, endDate: endDateJSON, attendees: attendees.map((id: string) => new ObjectId(id)), tickets: tickets.map((id: string) => new ObjectId(id))});
        } else if (attendees) {
            response = await collection.insertOne({ event: event, startDate: startDateJSON, endDate: endDateJSON, attendees: attendees.map((id: string) => new ObjectId(id))});
        } else if (tickets) {
            response = await collection.insertOne({ event: event, startDate: startDateJSON, endDate: endDateJSON, tickets: tickets.map((id: string) => new ObjectId(id))});
        } else {
            response = await collection.insertOne({ event: event, startDate: startDateJSON, endDate: endDateJSON});
        }
        const { insertedId } = response;
        return new Response(JSON.stringify(insertedId), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 })
    }
}

export async function PUT({ request }: any): Promise<Response> {
    try {
        const collection = db.collection("raves");
        const body = await request.json();
        const { id, attendees, tickets } = body;

        if (id && attendees && tickets) {
            collection.updateOne({ _id: new ObjectId(id) }, { $set: { attendees: attendees.map((id: string) => new ObjectId(id)), tickets: tickets.map((id: string) => new ObjectId(id)) }});
        } else if (id && attendees) {
            collection.updateOne({ _id: new ObjectId(id) }, { $set: { attendees: attendees.map((id: string) => new ObjectId(id)) }});
        } else if (id && tickets) {
            collection.updateOne({ _id: new ObjectId(id) }, { $set: { tickets: tickets.map((id: string) => new ObjectId(id)) }});
        }

        return new Response(JSON.stringify(body), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 })
    }
}

export async function DELETE({ request }: any): Promise<Response> {
    try {
        const collection = db.collection("raves");
        const body = await request.json();
        const { id } = body;

        if (id) {
            collection.deleteOne({ _id: new ObjectId(id) });
            const groupcollection = db.collection("groups");
            groupcollection.updateMany({}, { $pull: { rave_ids: new ObjectId(id) } });
        } else {
            return new Response("Bad Request", { status: 400 });
        }
        return new Response(JSON.stringify(body), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 })
    }
}