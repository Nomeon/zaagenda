import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/core/providers/github'
import Discord from '@auth/core/providers/discord'
import { GITHUB_ID, GITHUB_SECRET, DISCORD_ID, DISCORD_SECRET } from '$env/static/private'


export const handle = SvelteKitAuth({

    providers: [
        // @ts-ignore
        GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
        // @ts-ignore
        Discord({ clientId: DISCORD_ID, clientSecret: DISCORD_SECRET })],
      theme: {
        colorScheme: "dark",
        brandColor: "#ff4533"
    }
});