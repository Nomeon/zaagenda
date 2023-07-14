import { error } from '@sveltejs/kit';
import { getDB } from '$lib/db';
import { ObjectId } from 'mongodb';

const db = getDB();

/** @type {import('@sveltejs/kit').PageServerLoad}*/
export async function load({ params }: { params: { rave: string } }) {
    if (params) {
        const id = params.rave;
        const collection = db.collection("raves");
        const rave_id = new ObjectId(id);
        const rave = await collection.find({ _id: rave_id }).next();
        let raveObject: Rave = {
            _id: id,
            event: '',
            startDate: '',
            endDate: ''
        };
        if (rave) {
            raveObject.event = rave.event
            const attendees_length = rave.attendees.length
            if (attendees_length > 0) {
                raveObject.attendees = rave.attendees.map((e: { toString: () => any; }) => e.toString())
            }
            const tickets_length = rave.tickets.length
            if (tickets_length > 0) {
                raveObject.tickets = rave.tickets.map((e: { toString: () => any; }) => e.toString())
            }
            raveObject.startDate = rave.startDate
            raveObject.endDate = rave.endDate
        }
        
        return {
            raveObject
        };
    }

    throw error(404, 'Not found');
}