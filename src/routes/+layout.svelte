<script>
    import { isMobile, height } from "./stores";
    import { useMediaQuery } from "svelte-breakpoints";
    import { page } from "$app/stores";
    import Navbar from "./Navbar.svelte";
    import "../app.css";
    
    const mobile = useMediaQuery('(max-width: 768px)');
    $: $mobile, $isMobile = $mobile;

</script>
  
<div id='body-div' style='height: {$height}px;' class='grid-rows-[6rem_1fr] grid gap-0'>
    <Navbar />
    <main class='flex flex-col justify-center w-full m-0 bg-black text-light1'>
        <slot />
    </main>
</div>
<svelte:window bind:innerHeight={$height} />

<style lang="postcss">
    :global(body) {
		font-family: "Space Mono", monospace;
		overflow: hidden;
	}

	:root {
		--date-input-width: 12rem;
		--date-picker-highlight-border: theme('colors.accent');
		--date-picker-background: #000;
		--date-picker-foreground: #fff;
		--date-picker-highlight-shadow: rgba(255, 255, 255, 0);
	}
</style>