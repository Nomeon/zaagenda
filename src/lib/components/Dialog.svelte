<script lang='ts'>
	export let dialog: HTMLDialogElement;
</script>

<dialog bind:this={dialog} id='dialog-modal' class='relative p-0 rounded-lg bg-dark1 text-light1 overflow-hidden'>
	<slot/>
</dialog>