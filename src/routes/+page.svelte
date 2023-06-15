<script>
	import rave from '$lib/images/rave.webp';
</script>

<svelte:head>
	<title>Zaag | Home</title>
	<meta name="description" content="Zaagplanner home page" />
</svelte:head>

<div class="flex flex-col gap-4 md:gap-8 items-center justify-center text-4xl md:text-6xl h-full w-full font-medium">
	<div id='vignette' class='fixed top-0 left-0 w-full h-full z-10 shadow-[inset_0_0_600px_rgba(0,0,0,1)]'>
	</div>
	<img alt="The Rave" src={rave} class="object-cover fixed top-0 left-0 w-full h-full" />
	<h1 id='depth' class='z-10 font-bold'>ZAAGPLANNER</h1>
	<h2 id='depth' class="text-xl md:text-3xl text-light1 z-10">Check the upcoming raves</h2>
	<a href='/groups' id="btn" class="bg-[#000] border overflow-hidden py-1 px-6 relative text-sm md:text-xl z-10"><span class="mix-blend-difference">PLANNER</span></a>
</div>

<style>
	#btn:before {
		background: #fff;
		content: '';
		inset: 0;
		position: absolute;
		transform: translateX(var(--btnprog, -100%));
		transition: transform 0.1s ease-out;
	}

	#btn:hover:before {
		--btnprog: 0;
	}

	h2 {
		text-shadow: 1px 1px 5px black;
	}
	#depth {
        text-shadow: 1px 1px 5px black;
    }
</style>
