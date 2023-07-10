<script lang='ts'>
    import { page } from "$app/stores";
    import CustomButton from "$lib/components/CustomButton.svelte";
    import { onMount } from "svelte";
    import { title } from "../stores";
    import Loading from "$lib/components/Loading.svelte";

    $: title.set('Account')
    let loaded: boolean;
    let nickname: string = '';
    let user: User;

    onMount(async() => {
        loaded = false
        if (!$page.data.session?.user?.email) {
            window.location.href = '/'
        } else {
            const users = await getUser($page.data.session?.user?.email);
            user = users[0]
        }
        loaded = true
    })

    async function changeName() {
        if (user.name === nickname) {
            alert('Please enter a different name.')
            return
        }
        if (nickname === '') { 
            alert('Please enter a name.')
            return
        }
        if (nickname.length > 20) {
            alert('Please enter a name that is less than 20 characters.')
            return
        }
        if (nickname.length <= 2) {
            alert('Please enter a name that is more than 2 characters.')
            return
        }
        if (user) {
            const response = await fetch(`/api/users`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    id: user._id, 
                    name: nickname 
                })
            })
            if (response.status === 200) {
                const reply = await response.json();
                console.log(reply)
                window.location.reload();
            } else {
                alert('Name change failed.')
                return
            }
        }
    }

	async function getUser(email: string) {
        const url = `/api/users?email=${email}`
		const response = await fetch(url);
		const user = await response.json();
        return user
	}
    
</script>
{#if loaded}
<div class="flex flex-col items-center justify-center text-xl h-full w-full">
    <h1 id='depth' class='text-4xl font-medium text-light1 text-center'>NICKNAME:</h1>
    <h2 id='depth' class="text-2xl text-light1 text-center italic font-bold mb-8">{user.name}</h2>
    <h2 id='depth' class="text-base text-light1 text-center mx-8 mb-8">If you want to, you can change your name that is displayed in the group/rave pages. </h2>
    <form on:submit|preventDefault={() => changeName()} class='flex flex-col'>
        <label for="name"></label>
        <input bind:value={nickname} type="text" name="name" id="name" placeholder="{user.name}" class="mb-4 py-2 px-4 text-sm bg-light1 text-dark1 rounded-sm" />
        <CustomButton type='submit' text='Change' />
    </form>
</div>
{:else}
<Loading />
{/if}