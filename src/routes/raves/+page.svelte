<script lang='ts'>
	import { onMount } from 'svelte';
	import { height, userStore } from '../stores';
	import { page } from '$app/stores';
	import RaveCardV3 from '$lib/components/RaveCardV3.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Header from '$lib/components/Header.svelte';
	import Dialog from '$lib/components/Dialog.svelte';


	let raveList: RaveList = [];
	let activeRaveList: RaveList = [];
	$: activeRaveList, sortRaveList();

	let dialog: Dialog;
	let formGroup: string;
	let formEvent: string;
	let formDateStart: string;
	let formDateEnd: string;
	let formAttendees:	string[];
	let formTickets: string[];

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

	function addRaveToGroup(id: string, event: string, dateStart: string, dateEnd: string, attendees: string[], tickets: string[]) {

	}

</script>

<svelte:head>
	<title>Zaag | Raves</title>
	<meta name="description" content="Check out your raves here" />
</svelte:head>

<div id='scrollable' style="height: calc({$height}px - 6rem);" class='overflow-y-scroll w-screen flex flex-col items-center pb-8'>
	<Header title='Raves' />
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
	<div class='absolute bottom-0 h-24 flex items-center overflow-hidden justify-center bg-gradient-to-t from-[#000] from-85% z-20 w-full'>
        <button class="relative bg-[#000] border overflow-hidden py-2 px-12 text-sm rounded-lg md:text-xl before:bg-light1" id='btn' on:click={() => dialog.showModal()}><span class="mix-blend-difference">ADD</span></button>
    </div>
	
    <Dialog bind:dialog >
        <div class='text-md p-8'>
            <form method="dialog" on:submit={() => addRaveToGroup(formGroup, formEvent, formDateStart, formDateEnd, formAttendees, formTickets)} class='text-lg'>
                <div class='flex flex-col'>
                    <label for="name">Event</label>
                    <input type="text" id="name" name="name" bind:value={formEvent} required class='mb-8 py-1 px-2 rounded-sm'/>

					<label for="dateStart">Date Start</label>
					<input type="datetime-local" id="dateStart" name="dateStart" bind:value={formDateStart} required class='text-light1 mb-8 py-1 px-2 rounded-sm'/>

					<label for="dateEnd">Date End</label>
					<input type="datetime-local" id="dateEnd" name="dateEnd" bind:value={formDateEnd} required class='text-light1 mb-8 py-1 px-2 rounded-sm'/>
                </div>
                <div class='flex gap-8 justify-center'>
					<button class="relative bg-[#000] border overflow-hidden py-2 px-12 text-sm rounded-lg md:text-xl before:bg-light1" id='btn' on:click={() => dialog.close()}><span class="mix-blend-difference">CLOSE</span></button>
					<button class="relative bg-[#000] border overflow-hidden py-2 px-12 text-sm rounded-lg md:text-xl before:bg-light1" id='btn' type='submit'><span class="mix-blend-difference">CONFIRM</span></button>
				</div>
			</form>
        </div>
    </Dialog>
</div>