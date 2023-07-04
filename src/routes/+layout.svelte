<script lang='ts'>
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
    import { isMobile, height } from "./stores";
    import { useMediaQuery } from "svelte-breakpoints";
    import Navbar from "$lib/components/Navbar.svelte";
    import Background from "$lib/components/Background.svelte";
    
    const mobile = useMediaQuery('(max-width: 768px)');
    $: $mobile, $isMobile = $mobile;

</script>
  
<div id='body-div' style='height: {$height}px;' class='grid-rows-[6rem_1fr] grid gap-0 text-slate-100'>
    <Navbar />
    <main class='flex flex-col justify-center w-full m-0'>
        <slot />
    </main>
    <Background />
</div>
<svelte:window bind:innerHeight={$height} />