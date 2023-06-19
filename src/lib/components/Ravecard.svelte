<script lang="ts">
    import MdDeleteForever from 'svelte-icons/md/MdDeleteForever.svelte'
    import MdEdit from 'svelte-icons/md/MdEdit.svelte'
    import MdCheck from 'svelte-icons/md/MdCheck.svelte'

    export let rave: Rave;
    export let raveGroup: { name: string; raves: Rave[]; group_members: string[] };

    function editRave(theRave: Rave) {
		console.log('edit wat fzo, klote api calls implementeren')
        console.log('tehReef: ', theRave)
        // Call /api/raves?id=${theRave._id} with PUT method, create dropdown with raveGroup.group_members as options for attendees and ticket
	}

	function deleteRave(theRave: Rave) {
		console.log('delete wat fzo, deze is ook gewoon niet leuk, maar regel ik wel keertj')
        console.log('wow: ', theRave)
        // Call /api/raves?id=${theRave._id} with DELETE method
	}
</script>

<div class="text-white flex flex-col rounded-md bg-dark1 w-11/12 border-2 border-darkred p-0 my-2">
    <div class="flex flex-row  border-b-2 m-0">
        <div class="flex w-3/4 whitespace-nowrap text-ellipsis overflow-hidden text-center ml-2 items-center">{rave.event}</div>
        <div class="flex flex-row gap-3">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div on:click={() => editRave(rave)} class="h-8"><MdEdit/></div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div on:click={() => deleteRave(rave)} class="h-8"><MdDeleteForever/></div>
        </div>  
    </div>
    <div class="flex flex-row flex-nowrap">
        <div class="w-1/3 flex flex-col text-center justify-center">
                                                                                        <!-- In database als UTC, testen op conversie? -->
            <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center">{new Date(rave.date).toLocaleDateString('nl-NL')}</div>
            <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center">{new Date(rave.date).toLocaleString().split(' ')[1].split(':').splice(0, 2).join(':')}</div>
        </div>
        <div class="w-1/3 flex flex-col text-center justify-center">
            <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center">{raveGroup.name}</div>
            {#if rave.attendees}
                <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center">{rave.attendees[0] ? rave.attendees.length : '0'}/{raveGroup.group_members.length} Attending</div>
            {/if}
        </div>
        <div class="w-1/3 flex flex-col justify-between items-center">
            <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center">{"Ticket: "}</div>
            <div class="h-6"> <MdCheck/> </div>
        </div>

    </div>
</div>