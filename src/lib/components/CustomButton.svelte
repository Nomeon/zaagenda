<script lang='ts'>
    export let text: string;
    export let type: "reset" | "submit" | "button" | null | undefined;
    export let btnClass: string = "";
</script>

<button type={type} class="{btnClass} relative bg-dark1 border overflow-hidden py-2 px-12 text-sm font-bold rounded-sm md:text-xl before:bg-light1" id='btn' on:click>
    <span class="mix-blend-difference">{text.toUpperCase()}</span>
</button>

<style>
    #btn:before {
        content: '';
        inset: 0;
        position: absolute;
        transform: translateX(var(--btnprog, -100%));
        transition: transform 0.2s ease-out;
    }

    #btn:hover:before {
        --btnprog: 0;
    }
</style>