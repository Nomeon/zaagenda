import { writable } from 'svelte/store';

export const toggled = writable(false);
export const isMobile = writable(false);
export const title = writable('');

const { subscribe, set } = writable<User | null>(null);

export const userStore = {
    subscribe,
    set: (newUser: User) => set(newUser),
}