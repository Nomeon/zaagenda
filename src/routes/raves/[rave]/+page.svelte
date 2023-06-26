<script lang='ts'>
    import { height } from "../../stores";
    import type { PageData } from "./$types";
    export let data: PageData;
    let rave = data.raveObject;
</script>

<svelte:head>
	<title>Zaag | Rave page</title>
	<meta name="description" content="Zaagplanner | Create groups and plan your next raves" />
</svelte:head>

<div id='scrollable' style="height: calc({$height}px - 3rem);" class='w-screen flex flex-col items-center pt-8 pb-36'>
    <h1 class='text-light1 font-bold text-xl'>{rave.event}</h1>
    <h2 class='text-light1 text-md m-8 text-center'>Kun je nog niet bewerken, moet ik nog implementen lul.</h2>
</div>