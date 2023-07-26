<script lang='ts'>
	import { onMount } from 'svelte';
	import { userStore } from '../stores';
	import { page } from '$app/stores';
	import { title } from "../stores";
	import RaveCardV3 from '$lib/components/RaveCardV3.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import CustomButton from '$lib/components/CustomButton.svelte';
    import Loading from '$lib/components/Loading.svelte';
    import SmallButton from '$lib/components/SmallButton.svelte';
    import { goto } from '$app/navigation';

	$: title.set('Raves')

	let loaded: boolean;
	let today = new Date();
	let raveList: RaveList = [];
	let activeRaveList: RaveList = [];

	let dialog: HTMLDialogElement;
	let formGroup: string;
	let formEvent: string;
	let formDateStart: string;
	let formDateEnd: string;

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
		}
		loaded = true
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
				group.raves.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
			});
			return raves
		}
	}

	async function addRaveToGroup() {
		dialog.close()
		// TODO Client side form validation
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
						attendees: [],
						tickets: []
					})
			})
			if (response.status === 201) {
				const reply = await response.json();
				await putToGroup(reply)
				if (reply) {
					goto(`/raves/${reply}`, {replaceState: true})
				}
			}
        } else {
			resetDialog()
			alert('Rave creation failed.')
            return
        }
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
			return
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
	}

    function handleCreateRave() {
        if (raveList.length === 0) {
            alert('You need to create a group first.')
            return
        } else if (raveList.length >= 1) {
            formGroup = raveList[0].name
        }
        dialog.showModal()
    }

</script>

<svelte:head>
	<title>Zaag | Raves</title>
	<meta name="description" content="Check out your raves here" />
</svelte:head>

<div id='scrollable' class='h-[calc(100dvh-3rem)] overflow-y-scroll w-screen flex flex-col items-center pt-8 pb-32'>
	{#if loaded}
		{#if raveList && raveList.length != 0 }

			<!-- UPCOMING RAVES -->
			<h1 class="font-bold fill-light1 mb-3"> UPCOMING </h1>
			{#each activeRaveList
				.flatMap(raveGroup => raveGroup.raves)
				.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) as rave}
				{#each activeRaveList.filter(raveGroup => raveGroup.raves.includes(rave) && (new Date(rave.endDate) > new Date())) as raveGroup}
					<RaveCardV3 rave={rave} raveGroup={raveGroup} link={`/raves/${rave._id}`}/>
				{/each}
			{/each}
			
			<!-- PAST RAVES -->
			<h1 class="font-bold fill-light1 mb-3 mt-4">HISTORY</h1>
				{#each activeRaveList
					.flatMap(raveGroup => raveGroup.raves)
					.sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) as rave}
					{#each activeRaveList.filter(raveGroup => raveGroup.raves.includes(rave) && (new Date(rave.endDate) < new Date())) as raveGroup}
						<RaveCardV3 rave={rave} raveGroup={raveGroup} link={`/raves/${rave._id}`}/>
					{/each}
				{/each}
			<div class='absolute bottom-0 z-10 flex items-center justify-center w-full h-20 pr-16 bg-gradient-to-t from-[#000] from-85%'>
				<ul class='flex w-11/12 items-center justify-center gap-4 font-bold'>
					{#each raveList as group}
						<Checkbox bind:group={activeRaveList} value={group} checked={activeRaveList.includes(group)} />
					{/each}
				</ul>
                <SmallButton type='button' size={32} icon='material-symbols:add-ad-sharp' btnClass='bottom-4 right-4' on:click={handleCreateRave} />
			</div>
		<Dialog bind:dialog >
			<div class='text-sm p-4'>
				<form method="dialog" on:submit|preventDefault={() => addRaveToGroup()} class='text-lg'>
					<div class='flex flex-col'>
						<label for="select" class='text-sm'>Group:</label>
						<select bind:value={formGroup} class='py-1 px-2 text-sm text-dark1 bg-light1 mb-4 rounded-sm'>
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
								<input on:change={() => formDateEnd = formDateStart} min={today.toISOString().slice(0, 16)} type="datetime-local" id="dateStart" name="dateStart" bind:value={formDateStart} required class='mb-8 py-1 px-2 text-sm bg-light1 text-dark1 rounded-sm w-full'/>
							</div>
							<div class='flex flex-col w-[calc(50%-.5rem)]'>
								<label for="dateEnd" class='text-base'>Ends:</label>
								<input min={formDateStart} type="datetime-local" id="dateEnd" name="dateEnd" bind:value={formDateEnd} required class='mb-8 py-1 px-2 text-sm bg-light1 text-dark1 rounded-sm w-full'/>
							</div>
						</div>
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