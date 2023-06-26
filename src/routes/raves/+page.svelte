<script lang='ts'>
	import { onMount } from 'svelte';
	import { height, userStore } from '../stores';
	import { page } from '$app/stores';
	// @ts-ignore
	import MultiSelect from 'svelte-multiselect';
	import RaveCardV3 from '$lib/components/RaveCardV3.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Button from '$lib/components/Button.svelte';
	import { title } from "../stores";

	$: title.set('Raves')


	let userList: User[] = [];
	let raveList: RaveList = [];
	let users: any[];
	let activeRaveList: RaveList = [];
	$: activeRaveList, sortRaveList();

	let attendees: string[] = [];
	let tickets: string[] = [];

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
			userList = await getUsers(raveList.map((group) => group.group_members).flat())
			users = userList.map((user) => {
				return {label: user.name, value: user._id}
			})
		}
	})

	async function getUser(id: string, name: string, email: string) {
        const url = `/api/users?name=${name}&email=${email}&id=${id}`
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

	function addRaveToGroup(id: string, event: string, dateStart: string, dateEnd: string, attendees: string[], tickets: string[]) {
		console.log(id, event, dateStart, dateEnd, attendees, tickets)
		dialog.close()
	}

	const setAttendeesTickets = () => {
		formAttendees = []
		formTickets = []
		raveList.forEach((group) => {
			if (group.name === formGroup) {
				attendees = users.filter((user) => group.group_members.includes(user.value))
				tickets = users.filter((user) => group.group_members.includes(user.value))
			}
		})
	}

</script>

<svelte:head>
	<title>Zaag | Raves</title>
	<meta name="description" content="Check out your raves here" />
</svelte:head>

<div id='scrollable' style="height: calc({$height}px - 3rem);" class='overflow-y-scroll w-screen flex flex-col items-center pt-8 pb-36'>
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
		<Button type='button' on:click={() => dialog.showModal()} text='Add Rave' />
	</div>
    <Dialog bind:dialog >
        <div class='text-sm p-4'>
            <form method="dialog" on:submit|preventDefault={() => addRaveToGroup(formGroup, formEvent, formDateStart, formDateEnd, formAttendees, formTickets)} class='text-lg'>
                <div class='flex flex-col'>
					<label for="select" class='text-base'>Group:</label>
					<select bind:value={formGroup} on:change={setAttendeesTickets} class='text-dark1 mb-4'>
						{#each raveList as group}
							<option value={group.name} class='text-dark1'>
								{group.name}
							</option>
						{/each}
					</select>
                    <label for="name" class='text-base'>Event name:</label>
                    <input type="text" id="name" name="name" bind:value={formEvent} required class='mb-4 py-1 px-2 text-sm text-dark1 rounded-sm '/>
					<div class='flex flex-row w-full justify-between'>
						<div class='flex flex-col w-[calc(50%-.5rem)]'>
							<label for="dateStart" class='text-base'>Starts:</label>
							<input type="datetime-local" id="dateStart" name="dateStart" bind:value={formDateStart} required class='mb-8 py-1 px-2 text-sm text-dark1 rounded-sm'/>
						</div>
						<div class='flex flex-col w-[calc(50%-.5rem)]'>
							<label for="dateEnd" class='text-base'>Ends:</label>
							<input type="datetime-local" id="dateEnd" name="dateEnd" bind:value={formDateEnd} required class='mb-8 py-1 px-2 text-sm text-dark1 rounded-sm'/>
						</div>
					</div>
					<label for="attendees" class='text-base'>Who's attending?</label>
					<MultiSelect id='attendees' name='attendees' bind:selected={formAttendees} options={attendees} required liOptionClass='!text-dark1' liSelectedClass='!bg-accent !text-light1' ulOptionsClass='text-accent' outerDivClass='!mb-8 !py-0 !px-0 !rounded-sm !text-dark1 !bg-light1'/>
					<label for="tickets" class='text-base'>Who's got tickets?</label>
					<MultiSelect id='tickets' name='tickets' bind:selected={formTickets} options={tickets} required liOptionClass='!text-dark1' liSelectedClass='!bg-accent !text-light1' ulOptionsClass='text-accent' outerDivClass='!mb-8 !py-0 !px-0 !rounded-sm !text-dark1 !bg-light1'/>
                </div>
                <div class='flex gap-8 justify-center'>
					<Button type='button' on:click={() => dialog.close()} text='CLOSE' />
					<Button type='submit' text='CONFIRM' />
				</div>
			</form>
        </div>
    </Dialog>
</div>