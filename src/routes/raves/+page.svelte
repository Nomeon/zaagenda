<script lang='ts'>
	import { onMount } from 'svelte';
	import Vignette from '$lib/components/Vignette.svelte';
	import rave from '$lib/images/raveRaves.webp';
	import { height, userStore } from '../stores';
    import { page } from '$app/stores';
    import RaveCard from '$lib/components/RaveCard.svelte';

	let raveList: RaveList = [];
	let activeRaveList: RaveList = []

	onMount(async () => {
		if ($userStore !== null) {
			raveList = await getRaves()
		} else {
			const name: string | null |undefined = $page.data.session?.user?.name
			const email: string | null |undefined = $page.data.session?.user?.email
			if (name !== undefined && email !== undefined && name !== null && email !== null) {
				const userArr = await getUser('', name, email);
				const user = userArr[0]
				$userStore = user
				raveList = await getRaves()
				// activeRaveList = await getRaves()
			}
		}
	})

	async function getUser(id: string, name: string, email: string) {
        const url = `/api/users?name=${name}&email=${email}&id=${id}`
		const response = await fetch(url);
		const user = await response.json();
        return user
	}

	async function getRaves() {
		const id = $userStore?._id
		if (id !== null) {
			const url = `/api/raves?id=${id}`
			const response = await fetch(url);
			const raves = await response.json();
			return raves
		}
	}

</script>

<svelte:head>
	<title>Zaag | Raves</title>
	<meta name="description" content="Check out your raves here" />
</svelte:head>

<Vignette image={rave} />
<div id='scrollable' style="height: calc({$height}px - 6rem);" class='overflow-y-scroll w-screen flex flex-col items-center pb-8'>
    <div id='header' class='sticky top-0 w-full h-24 min-h-[6rem] flex items-center justify-center bg-[#000]'>
        <h1 class='text-3xl font-semibold'>RAVES</h1>
    </div>
	<ul class='items center w-full border-b border-t border-accent divide-x-2 divide-accent flex sticky'>
		{#each raveList as group}
			<li class='w-full p-2'><input type=checkbox bind:group={activeRaveList} value={group} on:change={() => console.log(activeRaveList)}>
				{group.name}
			</li>
		{/each}
	</ul>
	{#each activeRaveList as groupie}
		<h1>{groupie.name}</h1>
		{#each groupie.raves as rave}
		<RaveCard raveName={rave.event ? rave.event : "undefined"} raveDate={new Date()} raveDescription={rave.event ? rave.event : "undefined"} group={["Wytse", "Thomas","Stijn"]}></RaveCard>
			<!-- <h3>{typeof rave.date}</h3> -->
		{/each}
		<!-- <a in:fade href={`/groups/${rave._id}`} id='btn' class='relative overflow-hidden flex border border-light1 before:bg-light1 bg-[#000] min-h-[6rem] w-4/6'>
            <div class='flex flex-col justify-evenly ml-4 mix-blend-difference'>
                <div class='absolute top-4 right-4 h-8 w-8 text-accent'>
                    <MdCallMade />
                </div>
                <p class='text-3xl'>{group.name}</p>
                <div class='flex text-lg'>
                    <p class='flex gap-2'>
                        {#if group.users.length === 2}
                            {group.users.join(" & ")}
                        {:else if group.users.length < 4}
                            {group.users.join(", ")}
                        {:else}
                            {group.users.slice(0, 2).join(", ")} <p class='text-accent'> +{group.users.length - 2}</p>
                        {/if}
                    </p>
                </div>
            </div>
        </a> -->




	{/each}
</div>