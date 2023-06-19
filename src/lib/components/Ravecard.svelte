<script lang="ts">
    import MdDeleteForever from 'svelte-icons/md/MdDeleteForever.svelte'
    import MdEdit from 'svelte-icons/md/MdEdit.svelte'
    import MdCheck from 'svelte-icons/md/MdCheck.svelte'

    export let raveName: String;
    // export let raveDescription: String;
    // export let raveDate: Date;
    // export let group: String[]; 

    let expanded: Boolean = false;
</script>

<div class="text-white flex flex-col rounded-md bg-dark1 w-11/12 border-2 border-darkred p-0 my-2">
    <!-- Title and date -->
    <div class="flex flex-row  border-b-2 m-0">
        <div class="flex w-3/4 whitespace-nowrap text-ellipsis overflow-hidden text-center ml-2 items-center">{raveName}</div>
        <div class="flex flex-row gap-3">
            <div class="h-8"> <MdEdit/> </div>
            <div class="h-8"> <MdDeleteForever/> </div>
        </div>  
    </div>
    <div class="flex flex-row flex-nowrap">
        <div class="w-1/3 flex flex-col text-center justify-center">
            <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center">{"14/08/2023"}</div>
            <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center">{"23:00-06:00"}</div>
        </div>
        <div class="w-1/3 flex flex-col text-center justify-center">
            <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center">{"OG Ravers"}</div>
            <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center">{"2/3 attending"}</div>
        </div>
        <div class="w-1/3 flex flex-col justify-between items-center">
            <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center">{"Ticket: "}</div>
            <div class="h-6"> <MdCheck/> </div>
        </div>

    </div>

    <!-- Group -->
    <div class="w-1/3"></div>

    <!-- Buttons -->
    <div class="w-1/3"></div>

</div>