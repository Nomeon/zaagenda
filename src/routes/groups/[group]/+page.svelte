<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";

    export let data: PageData;
    let group = data.groupObject;
    let raves: Rave[] = [];

    onMount(async() => {
        if (group.rave_ids !== undefined) {
            raves = await getRaves(group.rave_ids)
        }
    })

    async function getRaves(ids: string[]) {
        const JSONids = encodeURIComponent(JSON.stringify(ids))
        const url = `/api/raves?ids=${JSONids}`
        const response = await fetch(url);
        const raves = await response.json();
        return raves;
    }
</script>

{#if group}
    <h1 class='text-4xl text-accent'>{group.group_name}</h1>
    {#each raves as rave}
        <h2 class='text-2xl text-accent'>{rave.event}</h2>
    {/each}
{/if}