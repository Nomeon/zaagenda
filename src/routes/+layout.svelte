<script lang='ts'>
    import { isMobile, height } from "./stores";
    import { useMediaQuery } from "svelte-breakpoints";
    import Navbar from "$lib/components/Navbar.svelte";
    import Background from "$lib/components/Background.svelte";
    import "../app.css";
    
    const mobile = useMediaQuery('(max-width: 768px)');
    $: $mobile, $isMobile = $mobile;

</script>
  
<div id='body-div' style='height: {$height}px;' class='grid-rows-[6rem_1fr] grid gap-0'>
    <Navbar />
    <main class='flex flex-col justify-center w-full m-0 bg-black text-light1'>
        <slot />
    </main>
    <Background />
</div>
<svelte:window bind:innerHeight={$height} />

<style lang="postcss">
    :global(body) {
		font-family: "Roboto", sans-serif;
		overflow: hidden;
	}
</style>