import { SvelteKitAuth } from '@auth/sveltekit'
import { GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'
import { connect, getDB } from '$lib/db'
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import Google from '@auth/core/providers/google'
import type { Db } from 'mongodb';

let db: Db;

connect().then(():void => {
    console.log("MongoDB started");
}).catch((e) => {
    console.log("MongoDB failed to start");
    console.log(e);
});

async function authorization({ event, resolve }: any) {
    if (event.url.pathname.includes("groups") || event.url.pathname.includes("raves")) {
        const session = await event.locals.getSession();
        if (!session) {
            throw redirect(303, "/")
        }
    }
    return resolve(event);
}

function delay(milliseconds: number){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export const handle: Handle = sequence(
    SvelteKitAuth({
        providers: [
            Google({ 
                clientId: GOOGLE_ID, 
                clientSecret: GOOGLE_SECRET,
            })
        ],
        callbacks: {
            async signIn({ profile }: any) {
                db = getDB();
                delay(500); // Dit moet echt beter kunnen...
                const collection = db.collection("users");
                const existingUser = await collection.findOne({ email: profile.email })
                if (existingUser) {
                    return true;
                } else {
                    const code = await generateCode();
                    await collection.insertOne({ name: profile.name, email: profile.email, image: profile.picture, code: code })
                    return true;
                }
            }
        }
    }),
    authorization
);

async function generateCode(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    let isCodeUnique = false;
  
    while (!isCodeUnique) {
        code = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        const collection = db.collection("users");
        const existingUser = await collection.findOne({ code: code })
        if (!existingUser) {
            isCodeUnique = true;
        }
    }
    return code;
}