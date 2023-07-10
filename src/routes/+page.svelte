<script>
    import { goto } from "$app/navigation";
	import CustomButton from "$lib/components/CustomButton.svelte";
	import { title } from "./stores";

	$: title.set('')
</script>

<svelte:head>
	<title>Zaag | Home</title>
	<meta name="description" content="Zaagplanner | Create groups and plan your next raves" />
</svelte:head>

<div class="flex flex-col gap-8 items-center justify-center text-4xl h-full w-full font-medium">
	<h1 id='depth' class='font-bold'>ZAAGPLANNER</h1>
	<h2 id='depth' class="text-lg text-light1 text-center mx-16">Check your upcoming raves or edit your groups:</h2>
	<div class='flex gap-8'>
		<CustomButton type='button' on:click={() => goto('/raves')} text='RAVES' />
		<CustomButton type='button' on:click={() => goto('/groups')} text='GROUPS' />
	</div>
</div>