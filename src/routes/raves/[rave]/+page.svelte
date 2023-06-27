<script lang='ts'>
    import { onMount } from "svelte";


    import { height } from "../../stores";

    export let data: { session: any, raveObject: Rave };
    let rave = data.raveObject;
    let userList: User[] = [];

    onMount( async() => {
        if (rave) {
            let attendees = rave.attendees ? rave.attendees.map((attendee) => attendee.toString()) : rave.attendees = []
            let tickets = rave.tickets ? rave.tickets.map((ticket) => ticket.toString()) : rave.tickets = []
            if (rave.attendees || rave.tickets) {
                let combinedArray = [...attendees, ...tickets];
                let uniqueUsersSet = new Set(combinedArray);
                let users = Array.from(uniqueUsersSet);
                userList = await getUsers(users)
            }
        }
    })

    async function getUsers(ids: string[]): Promise<User[]> {
        const JSONids = encodeURIComponent(JSON.stringify(ids))
        const url = `/api/users?ids=${JSONids}`
		const response = await fetch(url);
		const users = await response.json();
        return users
	}
</script>

<svelte:head>
	<title>Zaag | Rave page</title>
	<meta name="description" content="Zaagplanner | Create groups and plan your next raves" />
</svelte:head>

<div id='scrollable' style="height: calc({$height}px - 3rem);" class='w-screen flex flex-col items-center pt-8 pb-36'>
    <h1 class='text-light1 font-bold text-2xl mb-2'>{rave.event}</h1>
    <div class='flex flex-col items-center justify-center w-11/12'>
        <div class='text-lg font-bold italic'>{new Date(rave.startDate).toLocaleDateString("nl-NL", { day: 'numeric', month: "long", year: "numeric"}) }</div>
        <div class=''>{new Date(rave.startDate).toLocaleTimeString().split(':').slice(0, 2).join(':')} - {new Date(rave.endDate).toLocaleTimeString().split(':').slice(0, 2).join(':')}</div>
    </div>
    <div class='flex flex-row w-11/12 mt-2'>
        <div class='flex flex-col w-1/2 overflow-hidden px-2'>
            {#each rave.attendees || '' as attendee}
                <p class='w-full flex justify-end'>{userList.find(user => user._id === attendee)?.name}</p>
            {/each}
        </div>
        <div class='flex flex-col w-1/2 overflow-hidden px-2 justify-start'>
            {#each rave.tickets || '' as ticket}
                <p class='w-full flex justify-start'>{userList.find(user => user._id === ticket)?.name}</p>
            {/each}
        </div>
    </div>
</div>