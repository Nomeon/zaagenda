<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import rave2 from '$lib/images/rave2.webp'

    let groups: Group[] = [];
    let localUser: User;

    onMount(async() => {
        const name: string | null |undefined = $page.data.session?.user?.name
        const email: string | null |undefined = $page.data.session?.user?.email
        if (name !== undefined && email !== undefined && name !== null && email !== null) {
            await checkUser(name, email);
        }
        let groupsResponse = await getGroups(localUser._id)
        groups = groupsResponse
        // createGroup('zagers', ['strix06@gmail.com', 'spg.nijhuis@hotmail.com'])
        // getGroup('zagers')
        // await getGroups()
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
                        email: email,
                    })
                })
            }
            localUser = user
            console.log(localUser)
        }
    }
    
    async function getUser(id: string, name: string, email: string) {
        const url = `/api/users?name=${name}&email=${email}&id=${id}`
		const response = await fetch(url);
		const user = await response.json();
        return user
	}

    async function getGroups(user_id: string) {
        const url = `/api/groups?user_id=${user_id}`
        const response = await fetch(url);
        const groups = await response.json();
        return groups
    }

    

</script>

<div class="flex flex-col gap-4 md:gap-8 items-center justify-center text-4xl md:text-6xl h-full w-full font-medium bg-dark1">
	<div id='vignette' class='fixed top-0 left-0 w-full h-full z-10 shadow-[inset_0_0_600px_rgba(0,0,0,1)]' />
	<!-- <img alt="The Rave" src={rave2} class="object-cover fixed top-0 left-0 w-full h-full" /> -->
    <h1 id='depth' class='z-10 font-bold'>ACCOUNT</h1>
    <p class='text-lg'>Add friends to a group, or remove yourself from one</p>
</div>

<style>
    #depth {
        text-shadow: 1px 1px 5px black;
    }
</style>