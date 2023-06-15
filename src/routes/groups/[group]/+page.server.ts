import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import db from '$lib/db';

/** @type {import('@sveltejs/kit').PageServerLoad}*/
export async function load({ params }) {
    if (params) {
        const id = params.group;
        const collection = db.collection("groups");
        const group_id = new ObjectId(id);
        const group = await collection.find({ _id: group_id }).next();
        let groupObject: { _id?: string; group_name?: string; user_ids?: Array<string>; rave_ids?: Array<string>} = {};
    
        // Convert ObjectIds to string as return needs to be serializable.
        if (group) {
            groupObject._id = id
            groupObject.group_name = group.group_name
            const user_length = group.user_ids.length
            if (user_length > 0) {
                groupObject.user_ids = group.user_ids.map((e: { toString: () => any; }) => e.toString())
            }
            const rave_length = group.rave_ids.length
            if (rave_length > 0) {
                groupObject.rave_ids = group.rave_ids.map((e: { toString: () => any; }) => e.toString())
            }
        }
        
        return {
            groupObject
        };
    }

    throw error(404, 'Not found');
}