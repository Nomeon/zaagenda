<script lang='ts'>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import CustomButton from "$lib/components/CustomButton.svelte";
    import CheckboxRave from "$lib/components/CheckboxRave.svelte";

    export let data: { session: any, raveObject: Rave };
    let rave = data.raveObject;
    let userList: User[] = [];
    let formAttendees: string[] = [];
    let formTickets: string[] = []; 

    onMount( async() => {
        if (rave) {
            if (rave.attendees || rave.tickets) {
                await getGroup(rave._id)
                formAttendees = rave.attendees?.toString().split(',') || []
                formTickets = rave.tickets?.toString().split(',') || []
            }
        }
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
            goto('/raves')
        } else {
            alert('Something went wrong')
        }
    }

</script>

<svelte:head>
	<title>Zaag | Rave page</title>
	<meta name="description" content="Zaagplanner | Create groups and plan your next raves" />
</svelte:head>
<div id='scrollable' class='w-screen flex flex-col items-center pt-8 pb-36 h-[calc(100dvh-3rem)]'>
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
                <div id='user-row' class='flex flex-row w-full mt-2 justify-around'>
                    <div class='w-1/2 mx-4 flex justify-center'>
                        <CheckboxRave bind:group={formAttendees} value={user} checked={formAttendees.includes(user._id)} />
                    </div>
                    <div class='w-1/2 mx-4 flex justify-center'>
                        <CheckboxRave bind:group={formTickets} value={user} checked={formTickets.includes(user._id)} />
                    </div>
                </div>
            {/each}
            <div class='flex flex-row mt-4 justify-center'>
                <CustomButton type='submit' text='SAVE' />
            </div>
        </div>
    </form>
</div>