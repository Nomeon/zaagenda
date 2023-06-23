<script lang='ts'>
	import { onMount } from 'svelte';
	import Vignette from '$lib/components/Vignette.svelte';
	import rave from '$lib/images/raveRaves.webp';
	import { height, userStore } from '../stores';
    import { page } from '$app/stores';
    import RaveCardV3 from '$lib/components/RaveCardV3.svelte';
    import Checkbox from '$lib/components/Checkbox.svelte';
    import Background from '$lib/components/Background.svelte';
    import Background2 from '$lib/components/Background2.svelte';

	let raveList: RaveList = [];
	let activeRaveList: RaveList = [];
	$: activeRaveList, sortRaveList();

	onMount(async () => {
		const getUserRaves = async () => {
			if (!$userStore) {
				const { name, email } = $page.data.session?.user || {};
				if (name && email) {
					const userArr = await getUser('', name, email);
					const user = userArr[0]
					$userStore = user
				}
			}
			return await getRaves()
		}
		raveList = await getUserRaves()
		if (raveList) {
			activeRaveList = [...raveList]
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
		if (id) {
			const url = `/api/raves?id=${id}`
			const response = await fetch(url);
			let raves = await response.json();
			raves.forEach((group: { name: string; raves: Rave[]; group_members: string[] }) => {
				group.raves.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			});
			return raves
		}
	}

	function sortRaveList() {
		activeRaveList.sort((a, b) => {
			const aDate = new Date(a.raves[a.raves.length - 1].date)
			const bDate = new Date(b.raves[b.raves.length - 1].date)
			return bDate.getTime() - aDate.getTime()
		})
	}

</script>

<svelte:head>
	<title>Zaag | Raves</title>
	<meta name="description" content="Check out your raves here" />
</svelte:head>

<div class="-z-10 absolute">
	<Background width={window.innerWidth} height={window.innerHeight}/>
	<!-- <Background2 width={window.innerWidth} height={window.innerHeight}/> -->
</div>
<div id='scrollable' style="height: calc({$height}px - 6rem);" class='overflow-y-scroll w-screen flex flex-col items-center pb-8  opacity-70'>
    <div id='header' class='sticky top-0 w-full h-24 min-h-[6rem] flex items-center justify-center bg-gradient-to-b from-[#000] from-85% mb-4 opacity-70'>
        <h1 class='text-3xl font-semibold font-mono'>RAVES</h1>
    </div>

	{#if raveList}
		<ul class='flex w-11/12 items-center justify-center gap-4 mb-4 font-bold'>
			{#each raveList as group}
				<Checkbox bind:group={activeRaveList} value={group} checked={activeRaveList.includes(group)} />
			{/each}
		</ul>
		{#each activeRaveList as raveGroup}
			{#each raveGroup.raves as rave}
				<RaveCardV3 rave={rave} raveGroup={raveGroup} link={`/raves/${rave._id}`}/>
			{/each}
		{/each}
	{/if}
</div>