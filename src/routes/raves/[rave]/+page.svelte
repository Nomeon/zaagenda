<script lang='ts'>
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import CustomButton from "$lib/components/CustomButton.svelte";
    import CheckboxRave from "$lib/components/CheckboxRave.svelte";

    export let data: PageData;

    let loaded: boolean;
    let rave = data.raveObject;
    let userList: User[] = [];
    let formAttendees: string[] = [];
    let formTickets: string[] = [];

    let openButtons: boolean = false;

    onMount(async() => {
        loaded = false
        if (rave._id) {
            await getGroup(rave._id)
            if (rave.attendees || rave.tickets) {
                formAttendees = rave.attendees?.toString().split(',') || []
                formTickets = rave.tickets?.toString().split(',') || []
            }
        }
        loaded = true
    })

    async function getGroup(raveId: string): Promise<void> {
        const url = `/api/groups?rave_id=${raveId}`
        const response = await fetch(url);
        const group = await response.json();
        userList = await getUsers(group[0].user_ids)
    }

    async function getUsers(ids: string[]): Promise<User[]> {
        const JSONids = encodeURIComponent(JSON.stringify(ids))
        const url = `/api/users?ids=${JSONids}`
		const response = await fetch(url);
		const users = await response.json();
        return users
	}

    async function updateTicketAttendees(): Promise<void> {
        const url = `/api/raves?rave_id=${rave._id}`
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: rave._id,
                attendees: formAttendees,
                tickets: formTickets
            })
        })
        if (response.status === 200) {
            window.location.reload()
        } else {
            alert('Something went wrong')
        }
    }

    function addTicket(user: User) {
        formTickets = [...formTickets, user._id]
    }

    function removeTicket(user: User) {
        const index = formTickets.indexOf(user._id)
        if (index !== -1) {
            formTickets = [...formTickets.slice(0, index), ...formTickets.slice(index + 1)];
        }
    }
</script>

<svelte:head>
	<title>Zaag | Rave page</title>
	<meta name="description" content="Zaagplanner | Create groups and plan your next raves" />
</svelte:head>
<div id='scrollable' class='w-screen flex flex-col items-center pt-8 pb-36 h-[calc(100dvh-3rem)]'>
    {#if loaded}
        <h1 class='text-light1 font-bold text-2xl mb-2'>{rave.event}</h1>
        <div class='flex flex-col items-center justify-center w-11/12'>
            <div class='text-lg font-bold italic'>{new Date(rave.startDate).toLocaleDateString("nl-NL", { day: 'numeric', month: "long", year: "numeric"}) }</div>
            <div class=''>{new Date(rave.startDate).toLocaleTimeString().split(':').slice(0, 2).join(':')} - {new Date(rave.endDate).toLocaleTimeString().split(':').slice(0, 2).join(':')}</div>
        </div>
        <form on:submit={updateTicketAttendees} class='w-11/12'>
            <div id='header-row' class='flex font-bold flex-row w-full mt-4 mb-2'>
                <div class='w-1/2 flex justify-center'>Attendees</div>
                <div class='w-1/2 flex justify-center'>Tickets</div>
            </div>
            <div class='flex flex-col gap-2'>
                {#each userList as user}
                    <div id='user-row' class='grid grid-cols-2 w-full mt-2 gap-x-4'>
                        <div class='w-full flex justify-center' >
                            <CheckboxRave bind:group={formAttendees} value={user} checked={formAttendees.includes(user._id)} />
                        </div> 
                        <div class='w-full flex justify-center' >
                            {#if openButtons}
                                <div class='flex w-full justify-between items-center rounded-sm'>
                                    <button type="button" on:click={() => removeTicket(user)} class="w-16 h-full bg-dark1 border border-accent flex items-center justify-center">
                                        <iconify-icon icon={'ic:baseline-minus'} />
                                    </button>
                                    <button type='button' on:click={() => openButtons = !openButtons} class='bg-dark1 border border-accent h-full w-full mx-2'>{formTickets.filter(item => item === user._id).length}</button>
                                    <button type="button" on:click={() => addTicket(user)} class="w-16 h-full bg-dark1 border border-accent flex items-center justify-center">
                                        <iconify-icon icon={'ic:baseline-plus'} />
                                    </button>
                                </div>
                            {:else}
                                <button type='button' on:click={() => openButtons = !openButtons} class='{formTickets.filter(item => item === user._id).length > 0 ? 'border-accent' : 'border-dark1'} relative border bg-dark1 flex py-1 cursor-pointer w-full items-center justify-center rounded-sm px-2'>
                                    {#if formTickets.filter(item => item === user._id).length > 0}
                                        <span class='absolute rounded-full -top-3 -right-3 bg-accent text-dark1 h-6 w-6 flex items-center justify-center'>{formTickets.filter(item => item === user._id).length}</span>
                                    {/if}
                                    <span class="truncate">{user.name}</span>
                                </button>
                            {/if}
                        </div>
                    </div>
                {/each}
                <div class='flex flex-row mt-4 justify-center'>
                    <CustomButton type='submit' text='SAVE' />
                </div>
            </div>
        </form>
    {/if}
</div>