import { SvelteKitAuth } from '@auth/sveltekit'
import Google from '@auth/core/providers/google'
import { GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'
import { redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks';
import { connect, getDB } from '$lib/db'

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
    if (!session?.user) {
      throw redirect(303, "/")
    }
  }
  return resolve(event);
}

export const handle = sequence(
  SvelteKitAuth({
    providers: [
      // @ts-ignore
      Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })],
    theme: {
      colorScheme: "dark",
      brandColor: "#ff4533"
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }: any) {
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
  authorization
)