import { SvelteKitAuth } from '@auth/sveltekit'
import { NEXT_PUBLIC_GOOGLE_ID, NEXT_PUBLIC_GOOGLE_SECRET, NEXT_PUBLIC_AUTH_SECRET } from '$env/static/private'
import { redirect, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks';
import { connect, getDB } from '$lib/db'
import Google from '@auth/core/providers/google'

let db: { collection: (arg0: string) => any; };

connect().then(():void => {
  db = getDB();
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

export const handle: Handle = sequence(
  SvelteKitAuth({
    // @ts-ignore
    providers: [Google({ clientId: NEXT_PUBLIC_GOOGLE_ID, clientSecret: NEXT_PUBLIC_GOOGLE_SECRET })],
    secret: NEXT_PUBLIC_AUTH_SECRET,
    callbacks: {
      async signIn({ profile }: any) {
        const collection = db.collection("users");
        const checkExistingUser = await collection.findOne({ email: profile.email })
        if (checkExistingUser) {
          return true;
        } else {
          collection.insertOne({ name: profile.name, email: profile.email, image: profile.picture })
          return true;
        }
      }
    }
  }),
//   authorization
)