<script lang='ts'>
    import type { PageData } from "./$types";
    export let data: PageData;
    let rave = data.raveObject;

    console.log(rave)
</script>


<h1 class='text-9xl text-dark1'>{rave.event}</h1>