<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { height, userStore } from "../stores";
    import { fade } from 'svelte/transition'
    import MdCallMade from 'svelte-icons/md/MdCallMade.svelte'
    import Dialog from "$lib/components/Dialog.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import { goto } from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
    import { title } from "../stores";

    $: title.set('Groups')

    let groupList: Grouplist = [];
    let loaded: boolean;

    let dialog: Dialog;
    let formGroupName: string;

    onMount(async() => {
        loaded = false
        const getUserGroups = async () => {
            if (!$userStore) {
                const { email } = $page.data.session?.user || {};
                if (email) {
                    const userArr = await getUser('', email);
                    const user = userArr[0]
                    $userStore = user
                }
            }
            return await getGroups()
        }
        let groups = await getUserGroups()
        if (groups) {
            await populateGroupList(groups)
        }
        loaded = true
    })
    
    async function getUser(id: string, email: string) {
        const url = `/api/users?email=${email}&id=${id}`
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

    async function getGroups() {
        const id = $userStore?._id
        if (id) {
            const url = `/api/groups?user_id=${id}`
            const response = await fetch(url);
            const groups = await response.json();
            return groups
        }
    }

    async function populateGroupList(groups: Group[]) {
        for (const e of groups) {
            let group: {name?: string, id?: string, users: string[]} = {name: e.group_name, id: e._id, users: []}
            if (e.user_ids) {
                const users = await getUsers(e.user_ids)
                users.forEach(user => {
                    group.users.push(user.name.split(' ')[0])
                })
                groupList = [...groupList, group]
            }
        }
    }

    async function createGroup(formName: string) {
        const id = $userStore?._id
        if (id && confirm(`Do you want to create group: ${formName}?`)) {
            let user_ids = [id]
            const response = await fetch(`/api/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    group_name: formName,
                    user_ids: user_ids,
                })
            })
            const reply = await response.json()
            if (reply) {
                goto(`/groups/${reply}`, {replaceState: false})
            }
        } else {
            alert('Group creation failed.')
            return
        }
    }
</script>

<svelte:head>
	<title>Zaag | Groups</title>
	<meta name="description" content="Groups" />
</svelte:head>

<div id='scrollable' style="height: calc({$height}px - 3rem);" class='overflow-y-scroll w-screen flex flex-col items-center pt-8 pb-36'>
    {#if loaded}
        {#each groupList as group}
            <a in:fade href={`/groups/${group.id}`} class='rounded-lg relative flex flex-row overflow-hidden min-h-[6rem] w-11/12 bg-dark1/60 backdrop-blur-sm shadow-sm shadow-accent hover:border-light1 hover:shadow-light1 hover:shadow-md group mb-8'>
                <div class='flex flex-col justify-center ml-4'>
                    <div class='absolute top-8 right-4 h-8 w-8 text-accent group-hover:text-light1'>
                        <MdCallMade />
                    </div>
                    <p class='text-lg font-bold italic'>{group.name}</p>
                    <div class='flex text-lg'>
                        <p class='flex gap-2'>
                            {#if group.users.length === 2}
                                {group.users.join(" & ")}
                            {:else if group.users.length <= 4}
                                {group.users.join(", ")}
                            {:else}
                                {group.users.slice(0, 4).join(", ")} <p class='text-accent'> +{group.users.length - 4}</p>
                            {/if}
                        </p>
                    </div>
                </div>
            </a>
        {:else}
            <div class='w-full h-full flex justify-center items-center'>
                <p id='no-spin' class='text-4xl font-bold'>NO BITCHES</p>
            </div>
        {/each}
        <div class='absolute bottom-0 h-24 flex items-center overflow-hidden justify-center bg-gradient-to-t from-[#000] from-85% z-20 w-full'>
            <Button type='button' on:click={() => dialog.showModal()} text='CREATE' />
        </div>
    {:else}
        <Loading />
    {/if}
    <Dialog bind:dialog >
        <div class='text-lg p-8'>
            <form method="dialog" on:submit={() => createGroup(formGroupName)} class='text-lg'>
                <div class='flex flex-col'>
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" bind:value={formGroupName} required class='text-dark1 mb-8 py-1 px-2 rounded-sm'/>
                </div>
                <div class='flex gap-8 justify-center'>
                    <Button type='button' on:click={() => dialog.close()} text='CLOSE' />
                    <Button type='submit' text='CONFIRM' />
                </div>
                </form>
        </div>
    </Dialog>
</div>

<style>
    ::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }

    @keyframes pulse-custom {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: .2;
        }
    }

    #no-spin {
        animation: pulse-custom 100ms linear infinite;
    }

</style>