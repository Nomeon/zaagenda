<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import rave2 from '$lib/images/rave2.webp'

    let groups: Array<string> = [];
    let localUser: localUser;

    onMount(async() => {
        const name: string | null |undefined = $page.data.session?.user?.name
        const email: string | null |undefined = $page.data.session?.user?.email
        if (name !== undefined && email !== undefined && name !== null && email !== null) {
            await checkUser(name, email);
        }
        // createGroup('zagers', ['strix06@gmail.com', 'spg.nijhuis@hotmail.com'])
        // getGroup('zagers')
        await getGroups()
    })

    async function checkUser(name: string, email: string) {
        const userArr = await getUser('', name, email);
        const user = userArr[0]
        if (user !== undefined) {
            if (user.name !== name || user.email !== email) {
                await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email
                    })
                })
            }
            localUser = user
        }

    }

    async function getUser(id:string, name: string, email: string) {
        const url = `/api/users?name=${name}&email=${email}&id=${id}`
		const response = await fetch(url);
		const user = await response.json();
        return user
	}

    async function getUsers() {
        const url = `/api/users`
        const response = await fetch(url);
        const users = await response.json();
    }

    async function getGroup(name: string = '', id: string = '') {
        const url = `/api/groups?name=${name}&id=${id}`
        const response = await fetch(url);
        const group = await response.json();
        return group
    }

    async function getGroups() {
        if (localUser._id === undefined || localUser._id === '') {
            return
        }
        if (localUser.groups === undefined || localUser.groups.length < 1) {
            return
        }
        for (let id of localUser.groups) {
            let group = await getGroup('', id)
            let groupName = group[0].name
            groups = [...groups, groupName]
        }
    }

    async function createGroup(name: string, emails: Array<string>) {
        let existingGroup = await getGroup(name)
        if (existingGroup.length > 0) {
            console.log('group already exists')
            return
        }
        let ids: Array<string> = []
        for (let email of emails) {
            let response = await getUser('', name, email)
            let id = response[0]._id
            ids.push(id)
        }

        const url = `/api/groups`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                emails: emails
            })
        })
        const group = await response.json();
    }

</script>

<div class="flex flex-col gap-4 md:gap-8 items-center justify-center text-4xl md:text-6xl h-full w-full font-medium bg-dark1">
	<div id='vignette' class='fixed top-0 left-0 w-full h-full z-10 shadow-[inset_0_0_600px_rgba(0,0,0,1)]' />
	<!-- <img alt="The Rave" src={rave2} class="object-cover fixed top-0 left-0 w-full h-full" /> -->
    <h1 id='depth' class='z-10 font-bold'>GROUPS</h1>
    {#each groups as group}
        <h2>{group}</h2>
    {/each}
</div>

<style>
    #depth {
        text-shadow: 1px 1px 5px black;
    }
</style>