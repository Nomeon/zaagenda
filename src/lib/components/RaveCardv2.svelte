<script lang="ts">
    import MdDelete from "svelte-icons/md/MdDelete.svelte";
    import MdEdit from "svelte-icons/md/MdEdit.svelte";

    export let rave: Rave;
    export let raveGroup: { name: string; raves: Rave[]; group_members: string[] };
    export let link: string;
</script>

<div class=" h-14 w-11/12 grid grid-cols-6 m-1">
    <div class=" h-14 w-11/12 col-span-6 rounded-md mr-0 bg-gradient-to-r from-[#a52121] to-[#520202] absolute z-0 grid grid-cols-6 items-center">
        <div class="flex flex-col">
            <p class="col-span-1 text-center text-[#EEEBE3]">{new Date(rave.date).toLocaleDateString('en-US', {month: 'short'})}</p>
            <p class="col-span-1 text-center text-[#EEEBE3]">{new Date(rave.date).toLocaleDateString('en-US', {day: 'numeric'})}</p>
        </div>
    </div>
    <div class=" h-14 w-3/4 col-span-5 rounded-md ml-0 bg-gradient-to-l from-[#751616] to-[#BF4D4D] absolute justify-self-end z-10 p-2 pt-0">
        <div class="flex flex-row items-center justify-between whitespace-nowrap text-ellipsis overflow-hidden">
            <p class="text-[#EEEBE3] text-lg">{rave.event}</p>
            <div class="flex flex-row gap-4">
                <div class="h-4 text-[#EEEBE3]"> <MdEdit/> </div>
                <div class="h-4 text-[#D11A2A]"> <MdDelete/> </div>
            </div>
        </div>
        <p class="text-[#EEEBE3] text-sm">{raveGroup.name}</p>
    </div>
</div>
