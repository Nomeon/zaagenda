<script lang='ts'>
    import { fade } from "svelte/transition";
    import { getContext } from "svelte";

    const { deleteUserFromGroup }: any = getContext('deletion');

    export let user: User;
</script>

<div in:fade id='divider' class='rounded-lg relative flex flex-row overflow-hidden min-h-[6rem] w-11/12 bg-dark1/60 backdrop-blur-sm shadow-sm shadow-accent mb-8'>
    <div id='left-card' class= 'w-[5.5rem] bg-dark1 h-full'>
        <div class='flex items-center justify-center h-24 w-24 p-4'>
            {#if user.image}
                <img src={user.image} alt="user profile" class='z-20 h-11/12 w-11/12 object-cover rounded-full' referrerpolicy="no-referrer"/>
            {:else}
                <iconify-icon icon="material-symbols:account-circle" width="59" height="59" />
            {/if}
        </div>
    </div>
    <div id='right-card' class='flex flex-col absolute left-32 justify-center h-full'>
        <p class='text-xl'>{user.name}</p>
        <p class='text-lg'>Code: <span class='font-bold italic'>{user.code}</span></p>
    </div>
    <button on:click={() => deleteUserFromGroup(user._id)} class='absolute top-8 right-4 h-8 w-8 text-accent hover:text-light1'>
        <iconify-icon icon="material-symbols:person-remove" width="32" height="32" />
    </button>
</div>

<style>
    #divider::before{ 
        content:'';
        position: absolute;
        pointer-events: none;
        background-repeat: no-repeat;
        bottom: -0.1vw;
        left: 5.4rem;
        right: 0vw;
        top: -0.1vw; 
        background-size: 10%;
        /* https://shapedividers.com/ */
        background-position: 0% 50%;  background-image: url('data:image/svg+xml;charset=utf8, <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 1000"><g fill="%230f172a"><g opacity=".3"><path d="M26 1001h-9v-20l9 20zM55 1001H40l-23-50v-31l26 57 12 24zM83 1001H69l-1-2-25-52-26-57v-30l26 56 25 53 15 32zM87 978l-19-39-25-53-26-57v-30l26 57 25 52 19 40v30zM87 917l-19-39-25-53-26-56v-31l26 57 25 53 19 39v30zM87 857l-19-40-25-52-26-57v-30l26 56 25 53 19 39v31zM87 796l-19-39-25-53-26-57v-30l26 57 25 52 19 40v30zM87 735l-19-39-25-53-26-56v-31l26 57 25 53 19 39v30zM87 675l-19-40-25-52-26-57v-30l26 56 25 53 19 39v31zM87 614l-19-39-25-53-26-57v-30l26 57 25 52 19 40v30zM87 553l-19-39-25-53-26-56v-31l26 57 25 53 19 39v30zM87 493l-19-40-25-52-26-57v-30l26 56 25 53 19 39v31zM87 432l-19-39-25-53-26-57v-30l26 57 25 52 19 40v30zM87 371l-19-39-25-53-26-56v-31l26 57 25 53 19 39v30zM87 311l-19-40-25-52-26-57v-30l26 56 25 53 19 39v31zM87 250l-19-40-25-52-26-57V71l26 57 25 52 19 40v30zM87 189l-19-39-25-53-26-56V10v1l26 56 25 52 19 40v30zM87 129L68 89 43 37 27 1h14l2 5 25 53 19 39v31zM87 68L68 28 55 1h15l17 37v30z"/></g><path fill="none" d="M68 1003l-1-2H17V1h51v1002z"/><path d="M17 1H1v1000h16V1zM39 1001H24l-7-16v-30l22 46z"/><path d="M67 1001H53l-10-20-26-57v-30l26 57 24 50zM87 1001h-5l-14-28-25-53-26-56v-31l26 57 25 52 19 40v19zM43 829l-26-56v30l26 57 25 52 19 40v-31l-19-39-25-53zM43 769l-26-57v30l26 57 25 52 19 40v-30l-19-40-25-52zM43 708l-26-57v31l26 56 25 53 19 39v-30l-19-40-25-52zM43 647l-26-56v30l26 57 25 52 19 40v-31l-19-39-25-53zM43 587l-26-57v30l26 57 25 52 19 40v-30l-19-40-25-52zM43 526l-26-57v30l26 57 25 53 19 39v-30l-19-40-25-52zM43 465l-26-57v31l26 57 25 52 19 40v-31l-19-39-25-53zM43 405l-26-57v30l26 57 25 52 19 40v-30l-19-40-25-52zM43 344l-26-57v30l26 57 25 53 19 39v-30l-19-40-25-52zM43 283l-26-57v31l26 57 25 52 19 40v-31l-19-39-25-53zM43 223l-26-57v30l26 57 25 52 19 40v-30l-19-40-25-52zM43 162l-26-57v30l26 57 25 53 19 39v-30l-19-40-25-52zM43 101L17 44v31l26 57 25 52 19 40v-31l-19-39-25-53zM43 71l25 52 19 40v-30L68 93 43 41 25 1H15l1 10 1 3h-2 2l26 57zM68 63l19 39V72L68 32 53 1H39l4 9 25 53zM87 42V11L82 1H68v1l19 40z"/><path fill="none" d="M17 1h70v1000H17z"/></g></svg>'); 
    }
</style>