import { SvelteKitAuth } from '@auth/sveltekit'
import { NEXT_PUBLIC_GOOGLE_ID, NEXT_PUBLIC_GOOGLE_SECRET, NEXT_PUBLIC_AUTH_SECRET } from '$env/static/private'
import { connect, getDB } from '$lib/db'
import Google from '@auth/core/providers/google'
import type { Handle } from '@sveltejs/kit';
import type mongoose from 'mongoose';

let db: mongoose.mongo.Db;

(async () => {
    try {
      await connect();
      db = getDB();
      console.log("Mongoose connected");
    } catch (e) {
      console.log("Mongoose failed to start");
      console.error(e);
    }
})();

export const handle: Handle = SvelteKitAuth({

    providers: [
        // @ts-ignore
        Google({ 
            clientId: NEXT_PUBLIC_GOOGLE_ID, 
            clientSecret: NEXT_PUBLIC_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
        })
    ],
    secret: NEXT_PUBLIC_AUTH_SECRET,
    callbacks: {
      async signIn({ user, account, profile, email, credentials }: any) {
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
});

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