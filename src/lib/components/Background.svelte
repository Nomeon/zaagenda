<script lang='ts'>
    import type { Vector } from 'p5';
    import P5, { type Sketch } from 'p5-svelte';

    $: width = 0
    $: height = 0
    let useRange: boolean = false;
    const useLightningEffect: boolean = false;
    const fadeDistance: number = 40;
    const drawRange: number = 100;
    const lineThickness: number = 3;
    const maxPoints: number = 200;
    
    // Speed
    const density: number = 20;
    const spawnSpeed: number = 30;

    // Pattern
    let mult: number = 0.001; // Branching
    const noiseDetail: number = 2; // spread
    const falloff: number = 0.5; // Spread based on octaves, 0.5 means half the amplitude of the previous octave

    interface Point {
        add(point: Vector): void;
        x: number;
        y: number;
    }

    let points: Point[] = [];
  
    const sketch: Sketch = (p5) => {
        let r1: number;
        let r2: number;
        let g1: number;
        let g2: number;
        let b1: number;
        let b2: number;

        p5.setup = () => {
            p5.createCanvas(width, height);
            p5.background(0,0,0,0);
            p5.angleMode(p5.DEGREES);
            p5.noiseDetail(noiseDetail, falloff);

            let space = width/density;
            for (let x=0; x < width; x+= space)
                for (let y=0; y < height; y+= space){
                    // Ik ga ervan uit dat er een nieuwe variabele voor de vector wordt aangemaakt, dus dat de vector niet wordt overschreven
                    // Is dat wel nodig, gewoon let p bij left spawn, en dan bij de rest p = p5.createVector.

                    // Left spawn
                    let pLeft = p5.createVector(-10, y + p5.random(-height, height));
                    points.push(pLeft);
                    //Right spawn
                    let pRight = p5.createVector(width + 10, y + p5.random(-height, height));
                    points.push(pRight);
                    // // Top spawn
                    // var p = p5.createVector(p5.random(0, width), -10);
                    // points.push(p);
                    // // Bottom spawn
                    // var p = p5.createVector(p5.random(0, width), height);
                    // points.push(p);

                    // Random spawn
                    let pRandom = p5.createVector(p5.random(-width, width),p5.random(-height, height)) 
                    points.push(pRandom);
                }
            r1 = p5.random(100, 255);
            r2 = p5.random(100, 255);
            g1 = p5.random(50);
            g2 = p5.random(50);
            b1 = p5.random(50);
            b2 = p5.random(50);

            p5.shuffle(points, true);
        };
        p5.draw = () => {
            p5.noStroke();
            let max: number;
            if (p5.frameCount * spawnSpeed <= points.length) {
                max = p5.frameCount * spawnSpeed;
            } else {
                max = points.length;
            }
    
            for (let i = 0; i<max; i++) {
                // CAUSES TILING, DONT KNOW WHY
                // var r = p5.map(points[i].x, 0, width, 0, 165);
                // var g = p5.map(points[i].y, 0, width, 0, 25);
                // var b = p5.map(points[i].x, 0, height, 0, 25);

                // var r = p5.map(points[i].x, 0, width, r1, r2);
                // var g = p5.map(points[i].y, 0, width, g1, g2);
                // var b = p5.map(points[i].x, 0, height, b1, b2);
                
                if (useRange) {
                    let alpha = p5.map(p5.dist(width/2, height/2, points[i].x, points[i].y), 0, fadeDistance, 255, 0);
                }
    
                p5.fill(150, 12, 5, 10);
                if (useLightningEffect) {
                    mult = p5.random(0.001, 0.004)
                }
                let angle = p5.map(p5.noise(points[i].x * mult, points[i].y * mult), 0, 1, 0, 720);
                points[i].add(p5.createVector(p5.cos(angle), p5.sin(angle)))
    
                if (useRange == true) {
                    if (p5.dist(width/2, height/2, points[i].x, points[i].y) > drawRange) {
                        p5.ellipse(points[i].x, points[i].y, 1);
                    }
                } else {
                    if (points[i].x > 0 && points[i].x < width && points[i].y > 0 && points[i].y < height) {
                        p5.ellipse(points[i].x, points[i].y, lineThickness);
                    }
                }
            }
            let nextPoint = p5.createVector(p5.random(-width, width), p5.random(-height, height));
            points.push(nextPoint);
            if (points.length >= maxPoints) {
                points.shift();
            }
        };
      }
</script>
<div class="absolute w-full h-full bg-[#000000] -z-10 ">  <!-- bg-gradient-to-l bg-opacity-80 from-[#2e0000] to-[#7a0016] -->
    <P5 {sketch} />  
</div>
<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

 