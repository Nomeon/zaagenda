import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/core/providers/github'
import Discord from '@auth/core/providers/discord'
import Google from '@auth/core/providers/google'
import { GITHUB_ID, GITHUB_SECRET, DISCORD_ID, DISCORD_SECRET, GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'
import { redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks';


async function authorization({ event, resolve }: any) {
  if (event.url.pathname.includes("groups") || event.url.pathname.includes("raves")) {
    const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, "/")
    }
  }
  return resolve(event);
}

export const handle = sequence(
  SvelteKitAuth({
    providers: [
      // @ts-ignore
      GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
      // @ts-ignore
      Discord({ clientId: DISCORD_ID, clientSecret: DISCORD_SECRET }),
      // @ts-ignore
      Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })],
    theme: {
      colorScheme: "dark",
      brandColor: "#ff4533"
    }
  }),
  authorization
)