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

    // interface Point {
    //     add(point: Vector): void;
    //     x: number;
    //     y: number;
    // }
  
    let POINTS: Vector[] = [];
    let POINTS1: Vector[] = [];
    let POINTS2: Vector[] = [];

    const sketch: Sketch = (p5) => {
        p5.setup = () => {
            p5.createCanvas(width, height);
            p5.background(0,0,0,0);
            p5.angleMode(p5.DEGREES);
            p5.noiseDetail(noiseDetail, falloff);

            let space = width/density;
            POINTS = createPoints(p5, width, height, space);
            POINTS1 = createPoints(p5, width, height, space);
            POINTS2 = createPoints(p5, width, height, space);
        };
        p5.draw = () => {
            p5.noStroke();
            let max: number;
            if (p5.frameCount * spawnSpeed <= POINTS.length + POINTS1.length + POINTS2.length) {
                max = p5.frameCount * spawnSpeed;
            } else {
                max = POINTS.length + POINTS1.length + POINTS2.length;
            }
            filler(p5, max, [150, 12, 5, 255], POINTS);
            filler(p5, max, [150, 12, 5, 150], POINTS1);
            filler(p5, max, [150, 12, 5, 50], POINTS2);
        };
    }

    function filler(p5: import("p5"), max: number, rgba: number[], points: Vector[]) {
        p5.fill(rgba[0], rgba[1], rgba[2], rgba[3]);
        for (let i = 0; i<max/3; i++) {          
            let angle = p5.map(p5.noise(points[i].x * mult, points[i].y * mult), 0, 1, 0, 720);
            points[i].add(p5.createVector(p5.cos(angle), p5.sin(angle)))
    
            if (points[i].x >= -10 && points[i].x <= width + 10 && points[i].y >= -10 && points[i].y <= height + 10) {
                p5.ellipse(points[i].x, points[i].y, lineThickness);
            } else {
                    points[i].x *= -1
                    points[i].y *= -1
            }
        }
        // let nextPoint = p5.createVector(p5.random(-width, width), p5.random(-height, height));
        // points.push(nextPoint);
        if (points.length >= maxPoints) {
            points.shift();
        }
    }

    function createPoints(p5: import("p5"), width: number, height: number, totalSpawnPoints: number): Vector[] {
        let points: Vector[] = []
        for (let a=0; a<totalSpawnPoints; a++) {
            let spawnside = p5.random([0,1,2,3])/1
            let spawnheight;
            let spawnwidth;
            switch (spawnside) {
                // Left
                case 0:
                    spawnwidth = -10
                    spawnheight = p5.random(0, height)
                    break;
                // Right
                case 1:
                    spawnwidth = width + 10
                    spawnheight = p5.random(0, height)
                    break;
                // Top
                case 2:
                    spawnwidth = p5.random(0, width)
                    spawnheight = -10
                    break;
                // Bottom
                case 3:
                    spawnwidth = p5.random(0, width)
                    spawnheight = height + 10
            }
            points.push(p5.createVector(spawnwidth, spawnheight))
        }
        return points
    }

</script>
<div class="absolute w-full h-full bg-[#000] -z-10 ">
    <P5 {sketch} />  
</div>
<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

 