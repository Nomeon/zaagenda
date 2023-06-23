<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount, setContext } from "svelte";
    import { height } from "../../stores";
    import Dialog from "$lib/components/Dialog.svelte";
    import UserCard from "$lib/components/UserCard.svelte";
    import Header from "$lib/components/Header.svelte";
    
    export let data: PageData;
    let group = data.groupObject;
    let users: User[] = [];
    let dialog: Dialog;
    let formName: string;
    let formEmail: string;

    setContext('deletion', {
        deleteUserFromGroup
    })

    onMount(async() => {
        if (group.user_ids) {
            users = await getUsers(group.user_ids)        
        }
    })

    async function getUser(name: string, email: string): Promise<User[]> {
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
            }
        }
    }

    async function deleteGroup(): Promise<void> {
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

    async function addUserToGroup(name: string, email: string): Promise<void> {
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

<div id='scrollable' style="height: calc({$height}px - 6rem);" class='overflow-y-scroll w-screen flex flex-col gap-8 items-center pb-36'>
    <Header title={group.group_name || 'Group'} />
        {#each users as user}
            <UserCard user={user} />
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