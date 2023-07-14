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

<svelte:head>
	<title>Zaag | Account</title>
	<meta name="description" content="Zaagplanner | Personal account" />
</svelte:head>

{#if loaded}
<div class="flex flex-col items-center justify-center text-xl h-full w-full">
    <h1 id='depth' class='text-2xl font-medium text-light1 text-center mb-8'>NICKNAME: <span class='font-bold italic'>{user.name}</span></h1>
    <h2 id='depth' class="text-base text-light1 text-center mx-8 mb-8">If you want to, you can change your name that is displayed in the group/rave pages. </h2>
    <form on:submit|preventDefault={() => changeName()} class='flex flex-col mb-8'>
        <label for="name"></label>
        <input bind:value={nickname} type="text" name="name" id="name" placeholder="{user.name}" class="mb-4 py-2 px-4 text-sm bg-light1 text-dark1 rounded-sm" />
        <CustomButton type='submit' text='Change' />
    </form>
    <h1 id='depth' class='text-2xl font-medium text-light1 text-center'>CODE: <span class='font-bold italic'>{user.code}</span></h1>
    <h2 id='depth' class="text-base text-light1 text-center mx-8 mb-8">This code is used to be added to groups.</h2>
</div>
{:else}
    <Loading />
{/if}