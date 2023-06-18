import { ObjectId } from "mongodb";
import db from "$lib/db";
import crypto from 'crypto';
import { CRYPTO_KEY } from "$env/static/private";

export async function GET(request: Request): Promise<Response> {
    try {
        const collection = db.collection("users");
        const url = new URL(request.url);
    
        const id = url.searchParams.get("id") || "";
        const name = url.searchParams.get("name") || "";
        const email = url.searchParams.get("email") || "";
        const JSONids = url.searchParams.get("ids") || "";
        let ids: string[] = [];

        // Encrpytion? 
        // if (email) {
        //     const algorithm = 'aes-256-cbc';
        //     const key = CRYPTO_KEY;
        //     const iv = crypto.randomBytes(16);
    
        //     const cipher = crypto.createCipheriv(algorithm, key, iv);
        //     let encrypted = cipher.update(email, 'utf8', 'hex');
        //     encrypted += cipher.final('hex');
        //     console.log(encrypted);
            
        //     const decipher = crypto.createDecipheriv(algorithm, key, iv);
        //     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        //     decrypted += decipher.final('utf8');
        //     console.log(decrypted);
        // }
        
        if (JSONids !== "") {
            ids = JSON.parse(decodeURIComponent(JSONids))
        }
        const query: { id?: string; name?: string; email?: string; ids?: [] } = {};
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

export async function POST({ request }: any): Promise<Response> {
    const collection = db.collection("users");
    const body = await request.json();
    const { name, email } = body;

    if (name && email) {
        collection.insertOne({ name, email });
    }
    return new Response(JSON.stringify({ name, email }));
}