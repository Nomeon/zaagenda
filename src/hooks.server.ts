import { SvelteKitAuth } from '@auth/sveltekit'
import { GOOGLE_ID, GOOGLE_SECRET, NEXTAUTH_SECRET } from '$env/static/private'
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
            clientId: GOOGLE_ID, 
            clientSecret: GOOGLE_SECRET,
        })
    ],
    secret: NEXTAUTH_SECRET,
    trustHost: true,
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