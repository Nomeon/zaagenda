<script>
	import Vignette from '$lib/components/Vignette.svelte';
	import rave2 from '$lib/images/rave2.webp';
</script>

<svelte:head>
	<title>Zaag | Raves</title>
	<meta name="description" content="Check out your raves here" />
</svelte:head>

<div class="flex flex-col gap-4 md:gap-8 items-center justify-center text-4xl md:text-6xl h-full w-full font-medium">
	<Vignette image={rave2} />
	<h1 id='depth' class='font-bold'>RAVES</h1>
</div>