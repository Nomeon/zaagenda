import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import db from '$lib/db';

/** @type {import('@sveltejs/kit').PageServerLoad}*/
export async function load({ params }: { params: { rave: string } }) {
    if (params) {
        const id = params.rave;
        const collection = db.collection("raves");
        const rave_id = new ObjectId(id);
        const rave = await collection.find({ _id: rave_id }).next();
        let raveObject: { _id?: string; event?: string; date?:Date; attendees?: Array<string>; tickets?: Array<string>} = {};
    
        if (rave) {
            raveObject._id = id
            raveObject.event = rave.event
            const attendees_length = rave.attendees.length
            if (attendees_length > 0) {
                raveObject.attendees = rave.attendees.map((e: { toString: () => any; }) => e.toString())
            }
            const tickets_length = rave.tickets.length
            if (tickets_length > 0) {
                raveObject.tickets = rave.tickets.map((e: { toString: () => any; }) => e.toString())
            }
        }
        
        return {
            raveObject
        };
    }

    throw error(404, 'Not found');
}