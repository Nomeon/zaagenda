<script lang='ts'>
	import { title } from "../stores";

	$: title.set('About')
</script>

<svelte:head>
	<title>Zaag | About</title>
	<meta name="description" content="Zaagplanner | About us" />
</svelte:head>

<div class="flex flex-col gap-8 items-center justify-center text-4xl h-full w-full font-medium">
	<h1 id='depth' class=' font-bold'>ABOUT</h1>
	<h2 id='depth' class="text-xl text-light1 text-center mx-16">Website to keep track of raves, tickets, and attendance</h2>
    <p id='depth' class='text-lg text-light1 text-justify mx-16'>We always forget who is coming/has tickets, and who still needs to get them. So now we have a website that we probably won't keep up to date which will solve absolutely nothing, but atleast we got a website you know.</p>
</div>