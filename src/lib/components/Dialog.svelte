<script>
    // @ts-nocheck
	 export let dialog
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog bind:this={dialog} on:click|self={() => dialog.close()} id='dialog-modal' class='relative p-0 rounded-lg bg-dark1 text-light1 overflow-hidden'>
	<slot/>
</dialog>

<style>
    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
    }
/* 
    #dialog-modal {
        border: 2px solid;
        border-image: linear-gradient(45deg, gold, deeppink) 1;
        clip-path: inset(0px round 2px);
        animation: huerotate 6s infinite linear;
        filter: hue-rotate(360deg);
    }

    @keyframes huerotate {
        0% {
            filter: hue-rotate(0deg);
        }
        100% {
            filter: hue-rotate(360deg);
        }
    } */
</style>