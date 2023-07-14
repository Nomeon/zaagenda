<script lang='ts'>
    export let type: "reset" | "submit" | "button" | null | undefined;
    export let icon: string;
    export let size: number;
    export let btnClass: string;
</script>

<button type={type} on:click class="{btnClass} absolute text-accent hover:text-white bg-dark1/60 backdrop-blur-sm h-12 w-12 text-center inline-flex items-center justify-center rounded-lg">
    <iconify-icon icon={icon} width={size} height={size} />
</button>