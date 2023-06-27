<script lang='ts'>
    import type { Vector } from 'p5';
    import P5, { type Sketch } from 'p5-svelte';

    $: width = 0
    $: height = 0
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
        p5.setup = () => {
            p5.createCanvas(width, height);
            p5.background(0,0,0,0);
            p5.angleMode(p5.DEGREES);
            p5.noiseDetail(noiseDetail, falloff);

            let space = width/density;
            for (let x=0; x < width; x+= space)
                for (let y=0; y < height; y+= space){
                    // Left spawn
                    let pLeft = p5.createVector(-10, y + p5.random(-height, height));
                    points.push(pLeft);
                    //Right spawn
                    let pRight = p5.createVector(width + 10, y + p5.random(-height, height));
                    points.push(pRight);
                    // Random spawn
                    let pRandom = p5.createVector(p5.random(-width, width),p5.random(-height, height)) 
                    points.push(pRandom);
                }

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
                p5.fill(150, 12, 5, 10);
                let angle = p5.map(p5.noise(points[i].x * mult, points[i].y * mult), 0, 1, 0, 720);
                points[i].add(p5.createVector(p5.cos(angle), p5.sin(angle)))
    
                if (points[i].x > 0 && points[i].x < width && points[i].y > 0 && points[i].y < height) {
                    p5.ellipse(points[i].x, points[i].y, lineThickness);
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

 