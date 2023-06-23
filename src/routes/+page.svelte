<svelte:head>
	<title>Zaag | Home</title>
	<meta name="description" content="Zaagplanner | Create groups and plan your next raves" />
</svelte:head>

<div class="flex flex-col gap-8 md:gap-8 items-center justify-center text-4xl md:text-6xl h-full w-full font-medium">
	<h1 id='depth' class='font-bold'>ZAAGPLANNER</h1>
	<h2 id='depth' class="text-lg text-light1 text-center mx-16">Check your upcoming raves or edit your groups:</h2>
	<div class='flex gap-8'>
		<a href='/raves' id="btn" class="bg-[#000] border overflow-hidden py-1 px-6 relative text-sm md:text-xl before:bg-light1"><span class="mix-blend-difference">RAVES</span></a>
		<a href='/groups' id="btn" class="bg-[#000] border overflow-hidden py-1 px-6 relative text-sm md:text-xl before:bg-light1"><span class="mix-blend-difference">GROUPS</span></a>	
	</div>
</div>