<script lang='ts'>
	import { onMount } from 'svelte';
	import { height, userStore } from '../stores';
	import { page } from '$app/stores';
	import RaveCardV3 from '$lib/components/RaveCardV3.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Header from '$lib/components/Header.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Loading from '$lib/components/Loading.svelte';
    import Button from '$lib/components/Button.svelte';
	//  @ts-ignore
	import MultiSelect from 'svelte-multiselect';


	let raveList: RaveList = [];
	let activeRaveList: RaveList = [];
	$: activeRaveList, sortRaveList();
	let groupOptions: string[] = [];
	let attendeesOptions: string[] = [];
	let ticketsOptions: string[] = [];

	let loaded: boolean;
	let dialog: Dialog;
	let formGroup: string;
	let formEvent: string;
	let formDateStart: string;
	let formDateEnd: string;
	let formAttendees:	string[];
	let formTickets: string[];

	$: formGroup, resetMultiSelect();

	onMount(async () => {
		loaded = false
		const getUserRaves = async () => {
			if (!$userStore) {
				const { name, email } = $page.data.session?.user || {};
				if (name && email) {
					const userArr = await getUser('', email);
					const user = userArr[0]
					$userStore = user
				}
			}
			return await getRaves()
		}
		raveList = await getUserRaves()
		if (raveList) {
			activeRaveList = [...raveList]
			groupOptions = raveList.map(group => group.name)
		}
		loaded = true
	})

	async function getUser(id: string, email: string) {
        const url = `/api/users?email=${email}&id=${id}`
		const response = await fetch(url);
		const user = await response.json();
        return user
	}

    async function getUsers(ids: string[]): Promise<User[]> {
        const JSONids = encodeURIComponent(JSON.stringify(ids))
        const url = `/api/users?ids=${JSONids}`
		const response = await fetch(url);
		const users = await response.json();
        return users
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

	function resetMultiSelect() {
		formAttendees = []
		const raveGroup = raveList.find(group => group.name === formGroup)
		attendeesOptions = [...raveGroup?.group_members || []]
		ticketsOptions = [...raveGroup?.group_members || []]
		console.log(attendeesOptions, ticketsOptions)
	}


</script>

<svelte:head>
	<title>Zaag | Raves</title>
	<meta name="description" content="Check out your raves here" />
</svelte:head>

<div id='scrollable' style="height: calc({$height}px - 6rem);" class='overflow-y-scroll w-screen flex flex-col items-center pb-8'>
	<Header title='Raves' />
	{#if loaded}
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
			<Button type='button' on:click={() => dialog.showModal()} text='ADD' />
		</div>
		
		<Dialog bind:dialog >
			<div class='text-md p-8'>
				<form method="dialog" on:submit|preventDefault={() => console.log(formGroup, formEvent, formDateStart, formDateEnd, formAttendees, formTickets)} class='text-lg'>
					<div class='flex flex-col'>
						<label for="group">Group:</label>
						<MultiSelect maxSelect={1} minSelect={1} id="group" name="group" bind:value={formGroup} options={groupOptions} required liOptionClass='!text-dark1' liSelectedClass='!bg-accent !text-light1' ulOptionsClass='text-accent' outerDivClass='!mb-8 !py-1 !px-2 !rounded-sm !text-dark1 !bg-light1'/>

						<MultiSelect id='attendees' name='attendees' bind:value={formAttendees} options={attendeesOptions} required liOptionClass='!text-dark1' liSelectedClass='!bg-accent !text-light1' ulOptionsClass='text-accent' outerDivClass='!mb-8 !py-1 !px-2 !rounded-sm !text-dark1 !bg-light1'/>
					</div>
					<div class='flex gap-8 justify-center'>
						<Button type='button' on:click={() => dialog.close()} text='CLOSE' />
						<Button type='submit' text='CONFIRM' />
					</div>
				</form>
			</div>
		</Dialog>
	{:else}
		<Loading />
	{/if}
</div>