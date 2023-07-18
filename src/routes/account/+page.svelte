<script lang='ts'>
    import { page } from "$app/stores";
    import { onMount, tick } from "svelte";
    import { title } from "../stores";
    import QRCode from "qrcode";
    import CustomButton from "$lib/components/CustomButton.svelte";
    import Loading from "$lib/components/Loading.svelte";

    $: title.set('Account')
    let loaded: boolean;
    let showQR: boolean = false;
    let nickname: string = '';
    let user: User;
    let svgCode: string;

    onMount(async() => {
        loaded = false
        if (!$page.data.session?.user?.email) {
            window.location.href = '/'
        } else {
            const users = await getUser($page.data.session?.user?.email);
            user = users[0]
        }

        loaded = true
        await tick()
        await createQRCode(user.code)
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
    
    async function createQRCode(code: string) {
        console.log('test')
        let svgString = await QRCode.toString(code, {
            errorCorrectionLevel: 'H',
            type: 'svg'
        })
        svgCode = changeColors(svgString, 'none', '#00FFFF');
    }

    function changeColors(originalSvgCode: string, fill: any, stroke: any) {
        return originalSvgCode.replace(/fill="#\w+"/g, `fill="${fill}"`).replace(/stroke="#\w+"/g, `stroke="${stroke}"`);
    }

</script>

<svelte:head>
	<title>Zaag | Account</title>
	<meta name="description" content="Zaagplanner | Personal account" />
</svelte:head>

{#if loaded}
<div class="flex flex-col items-center justify-center text-xl h-full w-full">
    <h1 id='depth' class='text-2xl font-medium text-light1 text-center mb-4'>Name: <span class='font-bold italic'>{user.name}</span></h1>
    <h2 id='depth' class="text-base text-light1 text-center mx-8 mb-8">If you want to, you can change your name that is displayed in the group/rave pages. </h2>
    <form on:submit|preventDefault={() => changeName()} class='flex flex-col mb-8'>
        <label for="name"></label>
        <input bind:value={nickname} type="text" name="name" id="name" placeholder="{user.name}" class="mb-4 py-2 px-4 text-sm bg-light1 text-dark1 rounded-sm" />
        <CustomButton type='submit' text='Change' />
    </form>
    <h1 id='depth' class='text-2xl font-medium text-light1 text-center'>Code: <span class='font-bold italic'>{user.code}</span></h1>
        <div class='w-48 h-48 m-4 flex justify-center items-center'>
            {#if showQR}
                <div class='w-full h-full flex items-center justify-center rounded-lg bg-dark1'>
                    {@html svgCode}
                </div>
            {:else}
                <CustomButton type="button" text="SHOW QR" on:click={() => showQR = true} />
            {/if}                        
        </div>
    <h2 id='depth' class="text-base text-light1 text-center mx-16 mb-8">Let a friend scan this code on a group page to be added.</h2>
</div>
{:else}
    <Loading />
{/if}