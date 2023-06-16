<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import Vignette from "$lib/components/Vignette.svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import rave from "$lib/images/raveGroup.webp";
    

    export let data: PageData;
    let group = data.groupObject;
    let users: User[] = [];
    let dialog: Dialog;
    let formName: string;
    let formEmail: string;

    onMount(async() => {
        if (group.user_ids) {
            users = await getUsers(group.user_ids)        
        }
    })

    async function getUser(name: string, email: string) {
        const url = `/api/users?name=${name}&email=${email}`
		const response = await fetch(url);
		const user = await response.json();
        return user
	}

    async function getUsers(ids: string[]): Promise<User[]> {
        const JSONids = encodeURIComponent(JSON.stringify(ids))
        const url = `/api/users?ids=${JSONids}`
		const response = await fetch(url);
		const users = await response.json();
        return users
	}

    async function deleteGroup() {
        if (confirm('Are you sure you want to delete this group?')) {
            await fetch(`/api/groups`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: group._id
                })
            })
            window.location.href = '/groups'
        }
    }

    async function deleteUserFromGroup(user: string) {
        if (confirm('Are you sure you want to delete this user from the group?')) {
            let user_ids = [user]
            let response = await fetch(`/api/groups`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: group._id,
                    users: user_ids
                })
            })
            if (response.status === 200) {
                users = users.filter((u) => u._id !== user)
                if (users.length === 0) {
                    deleteGroup()
                }
                if (group.user_ids) {
                    group.user_ids = group.user_ids.filter((u) => u !== user)
                }
            }
        }
    }

    async function addUserToGroup(name: string, email: string) {
        let user_id = await getUser(name, email)
        if (user_id.length > 0 && confirm(`Do you want to add ${user_id[0].name} to the group?`)) {
            let user_ids = [user_id[0]._id]
            await fetch(`/api/groups`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: group._id,
                    user_ids: user_ids
                })
            })
        } else {
            alert('User not found')
            return
        }
        window.location.reload()
    }

</script>
<!--   -->

<svelte:head>
	<title>Zaag | Group page</title>
	<meta name="description" content="Zaagplanner | Create groups and plan your next raves" />
</svelte:head>

<div class="flex flex-col gap-8 md:gap-8 items-center justify-center text-4xl md:text-6xl h-full w-full font-medium">
	<Vignette image={rave} />
    <div id='header' class='absolute top-24 w-full h-24 min-h-[6rem] flex items-center justify-center bg-gradient-to-b from-[#000] from-85%'>
        <h1 class='text-3xl font-semibold'>{group.group_name?.toUpperCase()}</h1>
    </div>
    <div class="flex flex-col gap-8 items-center justify-center text-4xl md:text-6xl h-full w-full font-medium">
        {#each users as user}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <button on:click={() => deleteUserFromGroup(user._id)}>{user.name}</button>
        {/each}
    </div>
    <button on:click={() => dialog.showModal()}>ADD</button>
        
        <Dialog bind:dialog >
            <div class='text-lg p-8'>
                <form method="dialog" on:submit={() => addUserToGroup(formName, formEmail)} class='text-lg'>
                    <div class='flex flex-col'>
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" bind:value={formName} required class='text-dark1 mb-4'/>

                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" bind:value={formEmail} required class='text-dark1 mb-4'/>
                    </div>
                    <div class='flex gap-8 justify-center'>
                        <button id='btn' type="button" on:click={() => dialog.close()}>CLOSE</button>
                        <button id='btn' type="submit">CONFIRM</button>
                    </div>
                  </form>
            </div>
        </Dialog>
</div>