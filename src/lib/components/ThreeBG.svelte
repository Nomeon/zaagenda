<script lang="ts">
    import { onMount } from 'svelte';
	import * as THREE from "three"
    // @ts-ignore
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    
    let canvas: HTMLCanvasElement;
    let boat: THREE.Object3D;

	onMount(async() => {
		let camera : THREE.PerspectiveCamera;
		let scene : THREE.Scene;
		let renderer : THREE.WebGLRenderer;        

		const init = async() => {
			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true
            });
			renderer.setSize( window.innerWidth, window.innerHeight );

            const light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
            scene.add( light );

            const loader = new GLTFLoader();
            const loadedData = await loader.loadAsync('/submarine/scene.gltf');
            scene.add(loadedData.scene);

            boat = loadedData.scene.children[0]

            boat.position.z = -2
            boat.position.y = -3
			camera.position.z = 5;
		}

		const render = () => {
			renderer.clear()
			renderer.render(scene, camera);
		}

		const animate = () => {
			requestAnimationFrame(animate)

            boat.rotation.y += 0.01
            boat.rotation.x += 0.01

			render()
		}

		await init()
		animate()
    })
</script>
<canvas bind:this={canvas} class="fixed w-full h-full -z-10 " />