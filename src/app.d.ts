// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare module '$env/static/private' {
	export const GITHUB_ID: string;
	export const GITHUB_SECRET: string;
	export const DISCORD_ID: string;
	export const DISCORD_SECRET: string;
}

declare module '*';

export {};
