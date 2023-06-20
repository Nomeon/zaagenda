<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { height, userStore } from "../stores";
    import { fade } from 'svelte/transition'
    import MdCallMade from 'svelte-icons/md/MdCallMade.svelte'
    import Vignette from "$lib/components/Vignette.svelte";
    import rave from '$lib/images/raveGroups.webp'

    let groupList: Grouplist = [];
    let loaded = false;

    onMount(async() => {
        const name: string | null |undefined = $page.data.session?.user?.name
        const email: string | null |undefined = $page.data.session?.user?.email
        let image: string | null |undefined = $page.data.session?.user?.image
        if (image === null || image === undefined) {
            image = ''
        }
        if (name !== undefined && email !== undefined && name !== null && email !== null) {
            await checkUser(name, email, image);
            if ($userStore !== null) {
                let groups = await getGroups($userStore._id)
                await populateGroupList(groups)
            }
        }
        loaded = true
    })

    async function checkUser(name: string, email: string, image: string) {
        const userArr = await getUser('', name, email);
        const gotten_user = userArr[0]
        if (gotten_user === undefined) {
            if (name && email) {
                await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        image: image
                    })
                })
            }
            $userStore = await getUser('', name, email)
        }
    }
    
    async function getUser(id: string, name: string, email: string) {
        const url = `/api/users?name=${name}&email=${email}&id=${id}`
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

    async function getGroups(user_id: string) {
        const url = `/api/groups?user_id=${user_id}`
        const response = await fetch(url);
        const groups = await response.json();
        return groups
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

</script>

<svelte:head>
	<title>Zaag | Groups</title>
	<meta name="description" content="Groups" />
</svelte:head>

<Vignette image={rave} />
<div id='scrollable' style="height: calc({$height}px - 6rem);" class='overflow-y-scroll w-screen flex flex-col gap-8 items-center pb-8'>
    <div id='header' class='sticky top-0 w-full h-24 min-h-[6rem] flex items-center justify-center bg-gradient-to-b from-[#000] from-85%'>
        <h1 class='text-3xl font-semibold'>GROUPS</h1>
    </div>
    {#if loaded}
        {#if groupList.length === 0}
            <p class='text-2xl text-center'>You have no groups yet</p>
        {:else}
            {#each groupList as group}
                <a in:fade href={`/groups/${group.id}`} id='btn' class='rounded-lg relative overflow-hidden flex border border-light1 before:bg-light1 bg-[#000] min-h-[6rem] w-11/12'>
                    <div class='flex flex-col justify-center ml-4 mix-blend-difference'>
                        <div class='absolute top-8 right-4 h-8 w-8 text-accent'>
                            <MdCallMade />
                        </div>
                        <p class='text-2xl'>{group.name}</p>
                        <div class='flex text-lg'>
                            <p class='flex gap-2'>
                                {#if group.users.length === 2}
                                    {group.users.join(" & ")}
                                {:else if group.users.length < 4}
                                    {group.users.join(", ")}
                                {:else}
                                    {group.users.slice(0, 3).join(", ")} <p class='text-accent'> +{group.users.length - 3}</p>
                                {/if}
                            </p>
                        </div>
                    </div>
                </a>
            {/each}
        {/if}
    {/if}
</div>

<style>
    ::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }
</style>