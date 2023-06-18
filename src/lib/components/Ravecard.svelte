<script lang="ts">
	import { Badge, Button, Card, Group, Image, Text } from '@svelteuidev/core';

    export let raveName: String;
    export let raveDescription: String;
    export let raveDate: Date;
    export let group: String[]; 

    let expanded: Boolean = false;

    function expand() {
        expanded = !expanded;
    }
</script>




<Card style="padding: 0px; border-radius: 7px; margin: 20px;">
    <div style="display: flex; flex-flow: row nowrap;">
        <Image src='src\lib\images\RR.PNG' height={160} alt='Rotterdam Rave'/>
        <div style="display: flex; flex-flow: column; background-color: black;">
            <Text style="font-weight: bold; text-align: center; margin: 20px; color: white;">{raveName}</Text>
            <Text style="width: 400px; text-align: center; margin: 10px; margin-top: 0px; color: white;">{raveDescription}</Text>
        </div>
    </div>
    <div class="test" style="display: flex; flex-flow: row; justify-content: space-between; background-color: grey;">
        <Text style="font-weight: bold; text-align: center; margin: auto; margin-left: 10px; color: white;">{raveDate}</Text>
        <button on:click={expand} id="btn" style="border: 2px solid white; align-self: right; margin-top: 0px; background-color: darkred; border-radius: 0px;" class="bg-[#000] border overflow-hidden py-1 px-6 relative text-sm md:text-xl before:bg-light1">
            <label for="btn" class="mix-blend-difference">{expanded ? "Attendees -" : "Attendees +"}</label>
        </button>
    </div>
    {#if expanded}
        <div style="background-color: black; display: flex; flex-flow: column nowrap; align-content: center; justify-content: center;">
            {#each group as name}
                <div style="display: flex; flex-flow: row nowrap; justify-content: center;">
                    <div style="background-color: grey; color: white; border-radius: 7px; text-align: center; margin: 5px; width: 25%">{name}</div>
                    <p style="color: white;">X</p>
                    <p style="color: white;">X</p>
                    <p style="color: white;">X</p>
                </div>
            {/each}
        </div>
    {/if}
</Card>


<!-- <Card shadow='sm' padding='lg' style="text-align: center">
	<Card.Section padding='lg'>
		<Image
			src='src\lib\images\RR.PNG'
			height={160}
			alt='Portugal'
		/>
	</Card.Section>

	<Group position='apart'>
		<Text weight={500}>Portugal Porto Adventures</Text>
		<Badge color='pink' variant='light'>
			On Sale
		</Badge>
	</Group>

	<Text size='sm'>
		With Portugal Porto Adventures you can explore more of the beautiful portuguese cities,
		by walking on food, meeting the locals and eat excellent food and wine
	</Text>

	<Button variant='light' color='blue' fullSize>
		Book classic tour now
	</Button>
</Card> -->