import { SvelteKitAuth } from '@auth/sveltekit'
import Google from '@auth/core/providers/google'
import { GITHUB_ID, GITHUB_SECRET, DISCORD_ID, DISCORD_SECRET, GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'
import { redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks';


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
    }
  }),
  authorization
)