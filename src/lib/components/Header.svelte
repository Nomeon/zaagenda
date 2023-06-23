<script lang='ts'>
    export let title: string;
</script>

<div id='header' class='sticky top-0 w-full h-24 min-h-[6rem] flex items-center justify-center bg-gradient-to-b from-[#000]/70 from-85% mb-4'>
    <h1 class='text-3xl font-semibold font-mono'>{title.toUpperCase()}</h1>
</div>