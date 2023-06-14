<script lang='ts'>
    // @ts-ignore
    import FaSpotify from 'svelte-icons/fa/FaSpotify.svelte'
    import FaCapsules from 'svelte-icons/fa/FaCapsules.svelte'
    import FaSignInAlt from 'svelte-icons/fa/FaSignInAlt.svelte'
    import FaSignOutAlt from 'svelte-icons/fa/FaSignOutAlt.svelte'
    import { signIn, signOut } from "@auth/sveltekit/client"
    import { toggled } from './stores';
    import { page } from '$app/stores';

    let width: number;

    function toggleNav() {
        $toggled ? $toggled = false : $toggled = true;
    }

    function handleResize() {
        if (width <= 768) { $toggled = false}
    }

</script>

<nav class='h-24 flex justify-between bg-dark1 border-b-accent border-b-2 relative z-30 backdrop-blur font-semibold box-border'>
    <div class='w-1/4 flex items-center justify-center z-20 gap-4 max-md:w-1/2 max-md:px-12 max-md:justify-start' id='logo'>
    {#if $page.data.session?.user?.image ?? false}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <a href='/account'>
            <img src={$page.data.session?.user?.image} alt='profile picture' class='w-8 h-8 rounded-full max-md:w-12 max-md:h-12' />
        </a> 
    {:else}
        <a href='/' class='w-6 flex items-center cursor-pointer max-md:w-8 text-light1 hover:text-accent'>
            <FaCapsules />
        </a>
    {/if}
    </div>
    <!-- Banner for dropdown effect CHECK FOR DESKTOP -->
    {#if $toggled === true && width <= 768}
        <div id='navunderlay' class='h-24 bg-dark1 w-full z-10 absolute top-0'/>
    {/if}
    <div class={`w-3/4 flex justify-center max-md:h-screen max-md:bg-dark1 max-md:border-b-2 max-md:border-accent max-md:w-screen max-md:fixed max-md:flex-col max-md:transition-transform max-md:duration-500 max-md:ease-in-out ${$toggled === true ? 'max-md:translate-y-0' : 'max-md:-translate-y-[calc(100%-6rem)]'}`} id='mobile'>
        <div class='w-2/3 flex items-center gap-8 max-md:basis-3/5 max-md:gap-16 max-md:flex-col justify-center max-md:w-full' id='links'>
            <a on:click={toggleNav} href='/' class='text-4xl md:text-2xl text-light1 hover:text-accent'>HOME</a>
            <a on:click={toggleNav} href='/raves' class='text-4xl md:text-2xl text-light1 hover:text-accent'>RAVES</a>
            <a on:click={toggleNav} href='/about' class='text-4xl md:text-2xl text-light1 hover:text-accent'>ABOUT</a>
        </div>
        <div class='w-1/3 flex items-center gap-8 justify-center max-md:w-full max-md:gap-16' id='socials'>
            {#if $page.data.session}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click|preventDefault={() => signOut()} data-sveltekit-preload-data="off" class='w-6 flex items-center cursor-pointer max-md:w-8 text-light1 hover:text-accent'>
                    <FaSignOutAlt />
                </div>
            {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click|preventDefault={() => signIn()} data-sveltekit-preload-data="off" class='w-6 flex items-center cursor-pointer max-md:w-8 text-light1 hover:text-accent'>
                    <FaSignInAlt />
                </div>
            {/if}
            <a href='https://open.spotify.com/playlist/0qOFLLUh5jmsxTVLQrKspp?si=6c98f1713f4741bd' class='w-6 flex items-center cursor-pointer max-md:w-8 text-light1 hover:text-accent'>
                <FaSpotify />
            </a>
        </div>
    </div>
    <button class="bg-transparent flex md:hidden z-20 items-center relative justify-center px-12" type="button" on:click={toggleNav}>
		<div id="menu-toggle" class={$toggled ? 'toggled' : ''}>
			<div id="icon" class="relative h-[0.2rem] w-[1.8rem] transition-all duration-200 {$toggled ? 'bg-transparent before:bg-accent after:bg-accent after:rotate-45 before:-rotate-45' : 'bg-light1 before:bg-light1 after:bg-light1'}"/>
		</div>
</nav>
<svelte:window bind:innerWidth={width} on:resize={handleResize}/>
<style>
	#menu-toggle.toggled > #icon:before {
		top: 0px;
	}
	#menu-toggle.toggled > #icon:after {
		bottom: 0px;
	}
	#icon:before,
	#icon:after {
		height: 0.2rem;
		left: 0px;
		position: absolute;
		transition: all 0.25s;
		width: 1.8rem;
	}
	#icon:before {
		top: -0.55rem;
	}
	#icon:after {
		bottom: -0.55rem;
	}
</style>