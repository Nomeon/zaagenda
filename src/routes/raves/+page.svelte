<script lang='ts'>
	import Vignette from '$lib/components/Vignette.svelte';
	import rave from '$lib/images/raveRaves.webp';
	import { fade } from 'svelte/transition';
	import { height } from '../stores';

	let raveList: Rave[] = [];

</script>

<svelte:head>
	<title>Zaag | Raves</title>
	<meta name="description" content="Check out your raves here" />
</svelte:head>

<Vignette image={rave} />
<div id='scrollable' style="height: calc({$height}px - 6rem);" class='overflow-y-scroll w-screen flex flex-col gap-8 items-center pb-8'>
    <div id='header' class='sticky top-0 w-full h-24 min-h-[6rem] flex items-center justify-center bg-gradient-to-b from-[#000] from-85%'>
        <h1 class='text-3xl font-semibold'>RAVES</h1>
    </div>
    {#each raveList as rave}
        <h1>{rave.event}</h1>
    {/each}
</div>