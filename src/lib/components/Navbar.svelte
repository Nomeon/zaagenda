<script lang='ts'>
    import { signIn, signOut } from "@auth/sveltekit/client"
    import { toggled, isMobile, title } from '../../routes/stores';
    import { page } from '$app/stores';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import Header from './Header.svelte';

    let width: number;

    function toggleNav() {
        $toggled ? $toggled = false : $toggled = true;
    }

    function handleResize() {
        if (width <= 768) { $toggled = false}
    }

    const opacity = tweened($toggled ? 1 : 0.2, {
        duration: 500,
        easing: cubicOut
    });

    $: if ($toggled) {
        $opacity = 1;
    } else {
        $opacity = 0.2;
    }

</script>

<nav class='h-24 flex justify-between relative z-30 font-semibold box-border'>
    <div class='w-1/4 flex items-center justify-center z-20' id='logo'>
    {#if $page.data.session?.user?.image ?? false}
        <a href='/account'>
            <img src={$page.data.session?.user?.image} alt='user profile' class='w-10 h-10 rounded-md' referrerpolicy="no-referrer" />
        </a> 
    {:else}
        <button type="button" on:click={() => signIn("google")} data-sveltekit-preload-data="off" class='flex items-center cursor-pointer w-8 h-8 text-light1 hover:text-accent'>
            <iconify-icon icon="vaadin:pills" width="2rem" height="2rem"></iconify-icon>
        </button>
    {/if}
    </div> 
    {#if $toggled === true && width <= 768}
        <div id='navunderlay' class='h-24  w-full z-10 absolute top-0'/>
    {/if}
    <div class='bg-dark1/20 backdrop-blur-sm w-3/4 flex justify-center max-md:h-screen max-md:border-b-2 max-md:w-screen max-md:fixed max-md:flex-col max-md:transition-transform max-md:duration-500 max-md:ease-in-out {$toggled === true ? "max-md:translate-y-0" : "max-md:-translate-y-[calc(100%-6rem)]"}' id='mobile'>
        <div class='w-2/3 flex items-center gap-8 max-md:basis-3/5 max-md:gap-16 max-md:flex-col justify-center max-md:w-full' id='links'>
            <a on:click={toggleNav} href='/' class='text-3xl md:text-2xl text-light1 hover:text-accent'>HOME</a>
            <a on:click={toggleNav} href='/raves' class='text-3xl md:text-2xl text-light1 hover:text-accent'>RAVES</a>
            <a on:click={toggleNav} href='/groups' class='text-3xl md:text-2xl text-light1 hover:text-accent'>GROUPS</a>
            <a on:click={toggleNav} href='/about' class='text-3xl md:text-2xl text-light1 hover:text-accent'>ABOUT</a>
        </div>
        <div class='w-1/2 flex items-center gap-8 justify-center max-md:w-full max-md:gap-16' id='socials'>
            {#if $page.data.session}
                <button type="button" on:click|preventDefault={() => signOut({ callbackUrl: '/'})} data-sveltekit-preload-data="off" class='flex items-center cursor-pointer w-10 h-10 text-light1 hover:text-accent'>
                    <iconify-icon icon="material-symbols:logout-sharp" width="2.5rem" height="2.5rem" />
                </button>
            {:else}
                <button type="button" on:click|preventDefault={() => signIn("google")} data-sveltekit-preload-data="off" class='flex items-center cursor-pointer w-10 h-10 text-light1 hover:text-accent'>
                    <iconify-icon icon="material-symbols:login-sharp" width="2.5rem" height="2.5rem" />
                </button>
            {/if}
            <a href='https://open.spotify.com/playlist/0qOFLLUh5jmsxTVLQrKspp?si=6c98f1713f4741bd' class='flex items-center cursor-pointer w-10 h-10 text-light1 hover:text-accent'>
                <iconify-icon icon="mdi:spotify" width="2.5rem" height="2.5rem"></iconify-icon>
            </a>
        </div>
    </div>
    {#if !$toggled && $isMobile && $title}
        <Header title={$title}/>
    {/if}
    <button class="bg-transparent flex md:hidden z-20 items-center relative justify-center w-1/4" type="button" on:click={toggleNav}>
		<div id="menu-toggle" class={$toggled ? 'toggled' : ''}>
			<div id="icon" class="relative h-[0.2rem] w-[1.8rem] transition-all duration-200 {$toggled ? 'bg-transparent before:bg-accent after:bg-accent after:rotate-45 before:-rotate-45' : 'bg-light1 before:bg-light1 after:bg-light1'}"/>
		</div>
</nav>
<svelte:window bind:innerWidth={width} on:resize={handleResize}/>