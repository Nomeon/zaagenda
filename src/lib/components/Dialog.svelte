<script lang='ts'>
	export let dialog: HTMLDialogElement;

    function onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            dialog.close();
        }
    }
</script>

<dialog on:keydown={(e) => onKeydown(e)} bind:this={dialog} on:click={() => dialog.close()} id='dialog-modal' class='relative p-0 rounded-lg bg-dark1 text-light1 overflow-hidden'>
	<slot/>
</dialog>