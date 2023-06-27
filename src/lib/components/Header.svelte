<script lang='ts'>
    import '@fontsource/space-mono';
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    
    export let title: string;
    $: title, repeatHackText();
    let headerTitle: HTMLHeadingElement;
    
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval: number | NodeJS.Timer | null  = null;

    onMount(() => {
        repeatHackText();
    })

    function repeatHackText() {
        interval = setInterval(() => {
            hackText();
        }, 3000);
    }

    function hackText() {
        let iteration = 0;
        clearInterval(interval as number);
        let upperCaseTitle = title.toUpperCase();

        interval = setInterval(() => {
            if (!headerTitle) {
                clearInterval(interval as number);
                return;
            }
            headerTitle.innerText = headerTitle.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return upperCaseTitle[index];
                    }

                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iteration >= upperCaseTitle.length) {
                clearInterval(interval as number);
            }

            iteration += 1 / 3;
        }, 30);
    }
</script>

<div in:fade={{ delay: 500 }} id='header' class='sticky top-0 w-1/2 h-24 px-8 min-h-[6rem] flex items-center justify-center z-20'>
    <h1 id='header-title' bind:this={headerTitle} class='text-3xl font-medium text-light1 font-["Space_Mono"]'>{title.toUpperCase()}</h1>
</div>