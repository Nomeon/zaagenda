<script lang='ts'>
    import type { Vector } from 'p5';
    import P5, { type Sketch } from 'p5-svelte';

    $: width = 0
    $: height = 0

    interface Point {
        add(point: Vector): void;
        x: number;
        y: number;
    }

    let oldPoints: Point[] = [];

    // Presets:
    // Rain: mult 0
    // Saturn: mult < 0.0006



    // Pattern
    let mult: number = 0.001; // field strength
    const noiseDetail: number = 2; // field alignment
    const falloff: number = 1; // Spread based on octaves, 0.5 means half the amplitude of the previous octave
    let totalPoints = 1;
    let lineThickness = 3;
    const spawnSpeed: number = 1;
    const maxPoints: number = 1000;

    let r1 = 100
    let g1 = 100
    let b1 = 100
    let a1 = 10

    const sketch: Sketch = (p5) => {
        p5.setup = () => {
            p5.createCanvas(width, height);
            p5.background(0,0,0,0);
            p5.angleMode(p5.DEGREES);
            p5.noiseDetail(noiseDetail, falloff);
            


        };
        p5.draw = () => {
            p5.noStroke();
            let max: number;
            if (p5.frameCount * spawnSpeed <= oldPoints.length) {
                max = p5.frameCount * spawnSpeed;
            } else {
                max = oldPoints.length;
            }
            // if (oldPoints[i].x > 0 && oldPoints[i].x < width && oldPoints[i].y > 0 && oldPoints[i].y < height) {
                for(let a=0; a<totalPoints; a++) {
                    let spawnside = p5.random([0,1,2,3])/1
                    let spawnheight
                    let spawnwidth
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
                    oldPoints.push(p5.createVector(spawnwidth, spawnheight))
                }
                // }
                
                r1 += (p5.random(-4, 4)) % 255;
                g1 += (p5.random(-4, 4)) % 255;
                b1 += (p5.random(-4, 4)) % 255;
                a1 += p5.random(-.1, .1);
            for (let i = 0; i<max; i++) {
                p5.fill(r1,g1, b1, 100);
                
                // Determine new point
                let angle = p5.map(p5.noise(oldPoints[i].x * mult, oldPoints[i].y * mult), 0, 1, 0, 720);
                // Draw new oldPoints
                if (oldPoints[i].x >= -11 && oldPoints[i].x <= width + 11 && oldPoints[i].y >= -11 && oldPoints[i].y <= height + 11) {
                    p5.ellipse(oldPoints[i].x + p5.cos(angle), oldPoints[i].y + p5.sin(angle), lineThickness)
                } else {
                    oldPoints[i].x *= -1
                    oldPoints[i].y *= -1
                }
                // Fade old oldPoints
                // p5.erase(35);
                // for (let k=0; k<4; k++) {
                //     p5.ellipse(oldPoints[i].x - k*p5.cos(angle), oldPoints[i].y - k* p5.sin(angle), lineThickness);
                // }
                // p5.noErase();
                // Add new point to old oldPoints
                oldPoints[i].add(p5.createVector(p5.cos(angle), p5.sin(angle)));
            }
            if (oldPoints.length >= maxPoints) {
                oldPoints.shift();
            }
        };
      }
</script>

<div class="absolute w-full h-full bg-[#000000] -z-10 ">  <!-- bg-gradient-to-l bg-opacity-80 from-[#2e0000] to-[#7a0016] -->
    <P5 {sketch} />  
</div>
<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

 