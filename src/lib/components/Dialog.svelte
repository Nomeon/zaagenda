<script>
    // @ts-nocheck
	 export let dialog
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog bind:this={dialog} on:click|self={() => dialog.close()} class='p-0 rounded-lg border-2 border-accent bg-dark1 text-light1'>
	<slot/>
</dialog>

<style>
    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>