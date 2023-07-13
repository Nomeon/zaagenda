<script lang="ts">
    import { isMobile, toggled } from "./stores";
    import { useMediaQuery } from "svelte-breakpoints";
    import Navbar from "$lib/components/Navbar.svelte";
    // import Background from "$lib/components/Background.svelte";
    import Flower from "$lib/components/Flower.svelte";
    import "../app.css";

    const mobile = useMediaQuery("(max-width: 768px)");
    $: $mobile, ($isMobile = $mobile);
</script>

<div id="body-div" class="grid-rows-[6rem_1fr] grid gap-0 h-[100dvh]">

    <Navbar />
    <main class="flex flex-col justify-center w-full m-0 text-light1" id="{$toggled ? "fadeOUT" : "fadeIN"}">
        <slot />
    </main>
    <!-- <Background /> -->
    <Flower />
</div>