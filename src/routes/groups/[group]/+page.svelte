<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount, setContext } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { title } from "../../stores";
    import { Button } from "flowbite-svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import UserCard from "$lib/components/UserCard.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import CustomButton from "$lib/components/CustomButton.svelte";
    
    export let data: PageData;
    
    let loaded: boolean;
    let group = data.groupObject;
    let users: User[] = [];
    let dialog: Dialog;
    let formEmail: string;

    setContext('deletion', {
        deleteUserFromGroup
    })

    onMount(async() => {
        loaded = false
        if (group.user_ids) {
            users = await getUsers(group.user_ids)        
        }
        title.set(group.group_name || '')
        loaded = true
    })

    async function getUser(email: string): Promise<User[]> {
        const url = `/api/users?email=${email}`
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

    async function deleteUserFromGroup(user: string): Promise<void> {
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
                if (users.filter(e => e.name === $page.data.session?.user?.name).length <= 0) {
                    goto(`/groups`, {replaceState: true})
                }
            }
        }
    }

    async function deleteGroup(): Promise<void> {
        await fetch(`/api/groups`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: group._id
            })
        })
    }

    async function addUserToGroup(email: string): Promise<void> {
        let user_id = await getUser(email)
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
        } else if (user_id.length <= 0) {
            alert('User not found')
            return
        } else {
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

<div id='scrollable' class='h-[calc(100dvh-3rem)] overflow-y-scroll w-screen flex flex-col items-center pt-8 pb-36'>
    {#if loaded}
        {#each users as user}
            <UserCard user={user} />
        {/each}
        <Button type='button' on:click={() => dialog.showModal()} text='Add' class='absolute bottom-4 right-4 h-12 w-12 p-2 bg-dark1/60 backdrop-blur-sm focus:ring-0 text-accent hover:bg-dark1/60 hover:text-white'>
            <iconify-icon icon="material-symbols:person-add" width="32" height="32" />
        </Button>
        <Dialog bind:dialog >
            <div class='text-lg p-8'>
                <form method="dialog" on:submit={() => addUserToGroup(formEmail)} class='text-lg'>
                    <div class='flex flex-col'>
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" bind:value={formEmail} required class='text-dark1 mb-8 py-1 px-2 rounded-sm'/>
                    </div>
                    <div class='flex gap-8 justify-center'>
                        <CustomButton type='button' on:click={() => dialog.close()} text='CLOSE' />
                        <CustomButton type='submit' text='CONFIRM' />
                    </div>
                    </form>
            </div>
        </Dialog>
    {:else}
        <Loading />
    {/if}
</div>