<script lang="ts">
    import { onMount } from 'svelte';
	import * as THREE from "three";
    import { gsap } from 'gsap';

    let canvas: HTMLCanvasElement;
    let w: number;
    let h: number;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;

    let ambientLights: THREE.HemisphereLight;
    let mat: THREE.ShaderMaterial;

    let fragmentContent: string;
    let vertexContent: string;
    let primitive: PrimitiveElement;
    let start = Date.now();

    let uniforms = {
        time: {
            type: "f",
            value: 1.0
        },
        pointscale: {
            type: "f",
            value: 1.0
        },
        decay: {
            type: "f",
            value: 2.0
        },
        complex: {
            type: "f",
            value: 2.0
        },
        waves: {
            type: "f",
            value: 3.0
        },
        eqcolor: {
            type: "f",
            value: 3.0
        },
        fragment: {
            type: 'i',
            value: false
        },
        dnoise: {
            type: 'f',
            value: 0.0
        },
        qnoise: {
            type: 'f',
            value: 4.0
        },
        r_color: {
            type: 'f',
            value: 0.0
        },
        g_color: {
            type: 'f',
            value: 0.0
        },
        b_color: {
            type: 'f',
            value: 0.0
        }
    };

    let options = {
        perlin: {
            vel: 0.002,
            speed: 0.000050,
            perlins: 1.0,
            decay: 0.40,
            complex: 0.0,
            waves: 10.0,
            eqcolor: 4.0,
            fragment: false,
            redhell: true
        },
        rgb: {
            r_color: 2.6,
            g_color: 6.0,
            b_color: 0.0
        },
        cam: {
            zoom: 9
        }
    };

	onMount(async() => {
        const fragResponse = await fetch('/flower/fragment.txt');
        fragmentContent = await fragResponse.text();

        const verResponse = await fetch('/flower/vertex.txt');
        vertexContent = await verResponse.text();

        createWorld();
        createLights();
        createPrimitive();
        options.rgb.g_color = Math.floor(Math.random() * 10) + 1;
        animate();
    })

    function createWorld() {
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 5, 15);
        scene.background = new THREE.Color(0x000000);

        camera = new THREE.PerspectiveCamera(55, w / h, 1, 1000);
        camera.position.set(0, 0, 10);
    
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(w, h);
        renderer.shadowMap.enabled = true;
    }

    function createLights() {
        ambientLights = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 1.4);
        scene.add(ambientLights);
    }

    class PrimitiveElement {
        mesh: THREE.Object3D<THREE.Event>;
        constructor() {
            this.mesh = new THREE.Object3D();
            const geo = new THREE.IcosahedronGeometry(1, 6);
            mat = new THREE.ShaderMaterial({
                wireframe: false,
                uniforms: uniforms,
                vertexShader: vertexContent,
                fragmentShader: fragmentContent
            });
            const mesh = new THREE.Mesh(geo, mat);
            this.mesh.add(mesh);
        }
    }

    function createPrimitive() {
        primitive = new PrimitiveElement();
        primitive.mesh.scale.set(1, 1, 1);
        scene.add(primitive.mesh);
    }

    function oscillateSin(minValue: number, maxValue: number, frequency: number, phase: number, time: number) {
        const range = maxValue - minValue;
        const currentValue = (Math.sin((2 * Math.PI * frequency * time) + phase) + 1) / 2;
        const scaledValue = (currentValue * range) + minValue;
        return scaledValue;
    }

    function animate() {
        requestAnimationFrame(animate);
        const time = (options.perlin.speed + 0.0001) * (Date.now() - start);
        options.rgb.r_color = oscillateSin(0.8, 2.2, 0.5, 0, time)

        // gsap.to(camera.position, 1, {z:options.cam.zoom+5});
        gsap.to(camera.position, {
            duration: 4,
            z: options.cam.zoom + 5
        });

        primitive.mesh.rotation.y += 0.001;
        mat.uniforms['time'].value = options.perlin.speed * (Date.now() - start);
        mat.uniforms['pointscale'].value = options.perlin.perlins;
        mat.uniforms['decay'].value = options.perlin.decay;
        mat.uniforms['complex'].value = options.perlin.complex;
        mat.uniforms['waves'].value = options.perlin.waves;
        mat.uniforms['eqcolor'].value = options.perlin.eqcolor;
        mat.uniforms['r_color'].value = options.rgb.r_color;
        mat.uniforms['g_color'].value = options.rgb.g_color;
        mat.uniforms['b_color'].value = options.rgb.b_color;
        mat.uniforms['fragment'].value = options.perlin.fragment;
        
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

</script>
<canvas bind:this={canvas} class="fixed w-full h-full bg-black -z-10 " />
<svelte:window bind:innerWidth={w} bind:innerHeight={h} on:resize={onWindowResize} />