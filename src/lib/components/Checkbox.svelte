<script lang='ts'>
	export let group: RaveList;
	export let value: { name: string; raves: Rave[]; group_members: string[]; };
	export let checked: boolean;
	
	$: updateCheckbox(group)
	$: updateGroup(checked)
	
	function updateCheckbox(group: RaveList) {
		checked = group.indexOf(value) >= 0
	}
	
	function updateGroup(checked: boolean) {
		const index = group.indexOf(value)
		if (checked) {
			if (index < 0) {
				group.push(value)
				group = group
			}
		} else {
			if (index >= 0) {
				group.splice(index, 1)
				group = group
			}
		}
	}
</script>

<label class='{checked ? 'border-accent text-accent' : 'border-dark1 text-light1'} flex border-2 bg-dark1 cursor-pointer w-full items-center justify-center m-2 py-2 rounded-md hover:border-light1'>
    <input class='absolute opacity-0 cursor-pointer h-0 w-0' type="checkbox" bind:checked={checked} value={value} />
    <span>{value.name}</span>
</label>
