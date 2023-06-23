<script lang='ts'>
    import { onMount } from "svelte";
    import '@fontsource/space-mono';
    
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

<div id='header' class='sticky top-0 w-full h-24 min-h-[6rem] flex items-center justify-center bg-gradient-to-b from-[#000]/70 from-85% mb-4 z-20'>
    <h1 id='header-title' bind:this={headerTitle} class='text-3xl font-bold font-["Space_Mono"]'>{title.toUpperCase()}</h1>
</div>