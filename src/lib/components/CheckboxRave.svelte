<script lang='ts'>
	export let group: string[];
	export let value: User;
	export let checked: boolean;
	
	$: updateCheckbox(group)
	$: updateGroup(checked)
	
	function updateCheckbox(group: string[]) {
		checked = group.indexOf(value._id) >= 0
	}
	
	function updateGroup(checked: boolean) {
		const index = group.indexOf(value._id)
		if (checked) {
			if (index < 0) {
				group.push(value._id)
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

<label class='{checked ? 'border-accent' : 'border-dark1'} border bg-dark1 flex py-1 cursor-pointer w-full items-center justify-center rounded-sm'>
    <input class='absolute opacity-0 cursor-pointer h-0 w-0' type="checkbox" bind:checked={checked} value={value} />
    <span class="truncate">{value.name}</span>
</label>