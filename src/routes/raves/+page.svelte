<script lang='ts'>
	import { onMount } from 'svelte';
	import { userStore } from '../stores';
	import { page } from '$app/stores';
	// @ts-ignore
	import MultiSelect from 'svelte-multiselect';
	import RaveCardV3 from '$lib/components/RaveCardV3.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import CustomButton from '$lib/components/CustomButton.svelte';
	import { title } from "../stores";
    import Loading from '$lib/components/Loading.svelte';
	import FaAngleUp from 'svelte-icons/fa/FaAngleUp.svelte'
    import { fly } from 'svelte/transition';

	$: title.set('Raves')

	let filters: boolean = false;
	let loaded: boolean;
	let today = new Date();
	let userList: User[] = [];
	let raveList: RaveList = [];
	let users: any[];
	let activeRaveList: RaveList = [];

	let attendees: string[] = [];
	let tickets: string[] = [];

	let dialog: Dialog;
	let formGroup: string;
	let formEvent: string;
	let formDateStart: string;
	let formDateEnd: string;
	let formAttendees: [{label: string, value: string}] | [];
	let formTickets: [{label: string, value: string}] | [];

	onMount(async () => {
		loaded = false
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
		loaded = true
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
				group.raves.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
			});
			return raves
		}
	}

	async function addRaveToGroup() {
		let aanwezigen: string[] = [];
		let ticketonis: string[] = [];
		formAttendees.forEach((attendee) => {
			aanwezigen.push(attendee.value)
		})
		formTickets.forEach((ticket) => {
			ticketonis.push(ticket.value)
		})
		let valid = true

		if (valid) {
			const response = await fetch(`/api/raves`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						event: formEvent,
						startDate: formDateStart,
						endDate: formDateEnd,
						attendees: aanwezigen,
						tickets: ticketonis
					})
			})
			if (response.status === 201) {
				const reply = await response.json();
				putToGroup(reply)
			}
        } else {
            alert('Rave creation failed.')
            return
        }
		dialog.close()
		resetDialog()
	}

	async function putToGroup(reply: string) {
		let groupid = raveList.filter((group) => group.name === formGroup)[0].group_id
		const response = await fetch(`/api/groups`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: groupid,
				rave_ids: [reply]
			})
		})
		if (response.status === 200) {
			window.location.reload()
		} else {
			alert('Rave was not added to group.')
			return
		}
	}

	const resetDialog = () => {
		formGroup = ''
		formEvent = ''
		formDateStart = ''
		formDateEnd = ''
		formAttendees = []
		formTickets = []
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

<div id='scrollable' class='h-[calc(100dvh-3rem)] overflow-y-scroll w-screen flex flex-col items-center pt-8 {filters ? 'pb-52' : 'pb-36'}'>
	{#if loaded}
		{#if raveList}
			{#each activeRaveList
				.flatMap(raveGroup => raveGroup.raves)
				.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) as rave}
				{#each activeRaveList.filter(raveGroup => raveGroup.raves.includes(rave)) as raveGroup}
					<RaveCardV3 rave={rave} raveGroup={raveGroup} link={`/raves/${rave._id}`}/>
				{/each}
			{/each}		  
			{#if filters}
			<div transition:fly={{ y: 100, duration: 500 }} class='absolute bottom-16 z-10 flex items-center justify-center w-full py-8 bg-gradient-to-t from-[#000] from-85%'>
				<ul class='flex w-11/12 items-center justify-center gap-4 font-bold '>
					{#each raveList as group}
						<Checkbox bind:group={activeRaveList} value={group} checked={activeRaveList.includes(group)} />
					{/each}
				</ul>
			</div>
			{/if}
		<div class='absolute bottom-0 h-24 flex items-center overflow-hidden justify-center bg-gradient-to-t from-[#000] from-85% z-20 w-full'>
			<CustomButton type='button' on:click={() => dialog.showModal()} text='Add Rave' />
			<button type='button' on:click={() => filters = !filters} class='absolute duration-500 right-8 h-8 w-8 {filters ? 'text-accent -rotate-180' : 'text-light1'}'>
				<FaAngleUp />
			</button>
		</div>
		<Dialog bind:dialog >
			<div class='text-sm p-4'>
				<form method="dialog" on:submit|preventDefault={() => addRaveToGroup()} class='text-lg'>
					<div class='flex flex-col'>
						<label for="select" class='text-sm'>Group:</label>
						<select bind:value={formGroup} on:change={setAttendeesTickets} class='py-1 px-2 text-sm text-dark1 bg-light1 mb-4 rounded-sm'>
							{#each raveList as group}
								<option value={group.name} class='text-dark1'>
									{group.name}
								</option>
							{/each}
						</select>
						<label for="name" class='text-base'>Event name:</label>
						<input type="text" id="name" name="name" bind:value={formEvent} required class='mb-4 py-1 px-2 text-sm bg-light1 text-dark1 rounded-sm'/>
						<div class='flex flex-row w-full justify-between'>
							<div class='flex flex-col w-[calc(50%-.5rem)]'>
								<label for="dateStart" class='text-base'>Starts:</label>
								<input on:change={() => formDateEnd = formDateStart} min={today.toISOString().slice(0, 16)} type="datetime-local" id="dateStart" name="dateStart" bind:value={formDateStart} required class='mb-8 py-1 px-2 text-sm bg-light1 text-dark1 rounded-sm max-w-fit'/>
							</div>
							<div class='flex flex-col w-[calc(50%-.5rem)]'>
								<label for="dateEnd" class='text-base'>Ends:</label>
								<input min={formDateStart} type="datetime-local" id="dateEnd" name="dateEnd" bind:value={formDateEnd} required class='mb-8 py-1 px-2 text-sm bg-light1 text-dark1 rounded-sm max-w-fit'/>
							</div>
						</div>
						<label for="attendees" class='text-base'>Who's attending?</label>
						<MultiSelect id='attendees' name='attendees' bind:selected={formAttendees} options={attendees} liOptionClass='!text-dark1 !text-sm' liSelectedClass='!bg-accent !text-sm !text-light1' ulOptionsClass='text-accent !text-sm' outerDivClass='!mb-8 !py-0 !px-0 !rounded-sm !text-dark1 !bg-light1 !text-sm'/>
						<label for="tickets" class='text-base'>Who's got tickets?</label>
						<MultiSelect id='tickets' name='tickets' bind:selected={formTickets} options={tickets} liOptionClass='!text-dark1 !text-sm' liSelectedClass='!bg-accent !text-sm !text-light1' ulOptionsClass='text-accent !text-sm' outerDivClass='!mb-8 !py-0 !px-0 !rounded-sm !text-dark1 !bg-light1 !text-sm'/>
					</div>
					<div class='flex gap-8 justify-center'>
						<CustomButton type='button' on:click={() => dialog.close()} text='CLOSE' />
						<CustomButton type='submit' text='CONFIRM' />
					</div>
				</form>
			</div>
		</Dialog>
		{:else}
		<div class='w-full h-full flex justify-center items-center'>
			<p class='text-4xl font-bold animate-pulse-custom'>NO FUN</p>
		</div>
		{/if}
	{:else}
		<Loading />
	{/if}
</div>