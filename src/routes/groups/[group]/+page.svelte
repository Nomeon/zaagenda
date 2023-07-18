<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount, setContext, tick } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { title } from "../../stores";
    import QrScanner from "qr-scanner";
    import Dialog from "$lib/components/Dialog.svelte";
    import UserCard from "$lib/components/UserCard.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import CustomButton from "$lib/components/CustomButton.svelte";
    import SmallButton from "$lib/components/SmallButton.svelte";

    
    export let data: PageData;
    
    let loaded: boolean;
    let feed: boolean = false;
    let group = data.groupObject;
    let users: User[] = [];
    let dialog: HTMLDialogElement;
    let formCode: string;
    let scanner: QrScanner | null;
    const re = new RegExp(/\b[A-Z0-9]{4}\b/);

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

    async function getUser(code: string): Promise<User[]> {
        const url = `/api/users?code=${code}`
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

    async function addUserToGroup(code: string): Promise<void> {
        let user_id = await getUser(code)
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

    async function scanQR() {
        feed = true
        await tick();
        console.log('test')
        const video = document.getElementById("qr-video") as HTMLVideoElement;
        console.log(video)
        if (video) {
            scanner = new QrScanner(video, result => useQR(result), {
                highlightScanRegion: true,
                highlightCodeOutline: true,
            });
            scanner.start();
        }
    }

    function useQR(result: QrScanner.ScanResult) {
        const code = result.data
        closeQR()
        re.test(code) ? addUserToGroup(code) : alert('Invalid QR code')
    }

    function closeQR() {
        scanner!.stop();
        scanner!.destroy();
        scanner = null;
        feed = false
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
        <SmallButton type='button' size={32} icon='material-symbols:person-add' btnClass='bottom-4 right-4' on:click={() => dialog.showModal()} />
        <Dialog bind:dialog >
            {#if feed}
            <div class='flex flex-col justify-center'>
                <!-- svelte-ignore a11y-media-has-caption -->
                <video id='qr-video'></video>
                <CustomButton type='button' btnClass="border-0" on:click={closeQR} text='CLOSE' />
            </div>
            {:else}
            <div class='text-lg p-8'>
                <form method="dialog" on:submit={() => addUserToGroup(formCode)} class='text-lg'>
                    <div class='flex flex-col'>
                        <label for="code">Code</label>
                        <div class='flex flex-row justify-center items-center mb-8'>
                            <input type="text" id="code" name="code" bind:value={formCode} required class='text-dark1 py-1 px-2 rounded-sm w-full'/>
                            <button type="button" on:click={scanQR} class='w-12 h-12 flex justify-center items-center ml-4'>
                                <iconify-icon icon="bx:qr-scan" width={32} height={32}></iconify-icon>
                            </button>
                        </div>
                    </div>
                    <div class='flex gap-8 justify-center'>
                        <CustomButton type='button' on:click={() => dialog.close()} text='CLOSE' />
                        <CustomButton type='submit' text='CONFIRM' />
                    </div>
                </form>
            </div>
            {/if}
        </Dialog>
    {:else}
        <Loading />
    {/if}
</div>