<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { height } from "../../stores";
    import Vignette from "$lib/components/Vignette.svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import rave from "$lib/images/raveGroup.webp";
    import MdDelete from "svelte-icons/md/MdDelete.svelte";
    import MdAccountCircle from 'svelte-icons/md/MdAccountCircle.svelte'
    

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

<Vignette image={rave} />
<div id='scrollable' style="height: calc({$height}px - 6rem);" class='overflow-y-scroll w-screen flex flex-col gap-8 items-center pb-36'>
    <div id='header' class='sticky top-0 w-full h-24 min-h-[6rem] flex items-center justify-center bg-gradient-to-b from-[#000] from-85% z-20'>
        <h1 class='text-3xl font-semibold'>{group.group_name?.toUpperCase()}</h1>
    </div>
        {#each users as user}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div in:fade id='btn' class='rounded-lg relative overflow-hidden flex border border-light1 before:bg-light1 bg-[#000] min-h-[6rem] w-11/12'>
                <div class='absolute top-8 h-8 w-8 left-4 mix-blend-difference'>
                    <MdAccountCircle />
                </div>
                <div class='absolute left-12 flex flex-col justify-center h-full ml-4 mix-blend-difference'>
                    <p class='text-xl'>{user.name.split(' ')[0]}</p>
                    <p class='text-xl'>{user.name.split(' ')[1]}</p>
                </div>
                <button on:click={() => deleteUserFromGroup(user._id)} class='absolute top-8 right-4 h-8 w-8 text-accent mix-blend-difference'>
                    <MdDelete />
                </button>
            </div>
        {/each}
    <div class='absolute bottom-0 h-24 flex items-center overflow-hidden justify-center bg-gradient-to-t from-[#000] from-85% z-20 w-full'>
        <button class="relative bg-[#000] border overflow-hidden py-2 px-12 text-sm rounded-lg md:text-xl before:bg-light1" id='btn' on:click={() => dialog.showModal()}><span class="mix-blend-difference">ADD</span></button>
    </div>

    <Dialog bind:dialog >
        <div class='text-lg p-8'>
            <form method="dialog" on:submit={() => addUserToGroup(formName, formEmail)} class='text-lg'>
                <div class='flex flex-col'>
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" bind:value={formName} required class='text-dark1 mb-8 py-1 px-2 rounded-sm'/>

                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" bind:value={formEmail} required class='text-dark1 mb-8 py-1 px-2 rounded-sm'/>
                </div>
                <div class='flex gap-8 justify-center'>
                    <button class="bg-[#000] border overflow-hidden py-2 px-8 text-sm rounded-lg md:text-xl before:bg-light1" id='btn' on:click={() => dialog.close()}><span class="mix-blend-difference">CLOSE</span></button>
                    <button type="submit" class="bg-[#000] border overflow-hidden py-2 px-8 text-sm rounded-lg md:text-xl before:bg-light1" id='btn'><span class="mix-blend-difference">CONFIRM</span></button>
                </div>
                </form>
        </div>
    </Dialog>
</div>