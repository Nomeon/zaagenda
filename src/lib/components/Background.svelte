<script lang='ts'>
    import type { Vector } from 'p5';
    import P5, { type Sketch } from 'p5-svelte';

    $: width = 0
    $: height = 0
    let POINTSARRAY: Vector[][] = [];
    let SPEEDARRAY: number[] = [];

    // Pattern properties
    let mult: number = 0.001; // Branching
    const noiseDetail: number =20; // spread
    const falloff: number = 0.1; // Spread based on octaves, 0.5 means half the amplitude of the previous octave

    // Line properties
    const lineThickness: number = 2;
    let totalColors = 255;
    let pointsPerColor = 16;
    


    const sketch: Sketch = (p5) => {
        p5.setup = () => {
            p5.createCanvas(width, height);
            p5.background(0,0,0,0);
            p5.angleMode(p5.DEGREES);
            p5.noiseDetail(noiseDetail, falloff);
            p5.frameRate(120)
            for(let p=0; p<totalColors; p++) {
                let points = createPoints(p5, pointsPerColor)
                POINTSARRAY.push(points)
                SPEEDARRAY.push(p5.random(0.7,1))
            }
        };
        p5.draw = () => {
            p5.fill(5, 10);
            p5.rect(0, 0, width, height);
            p5.noStroke();
            let s=0;
            POINTSARRAY.forEach(function(e){s += e.length; });

            for (let f=0; f<POINTSARRAY.length; f++) {
                let points = POINTSARRAY[f]
                let rgba = [40, 100/POINTSARRAY.length * f, 255, 255]
                filler(p5, s/POINTSARRAY.length, rgba, points)

            }
        };
    }

    function filler(p5: import("p5"), max: number, rgba: number[], points: Vector[]) {
        p5.fill(rgba[0], rgba[1], rgba[2], rgba[3]);
        p5.noiseSeed(56) //als je wil opslaan, pak seed
        for (let i = 0; i<max; i++) {          
            let angle = p5.map(p5.noise(points[i].x * mult, points[i].y * mult), 0, 1, 0, 720);
            points[i].add(p5.createVector(p5.cos(angle), p5.sin(angle)).mult(SPEEDARRAY[i]))
    
            if (points[i].x >= -10 && points[i].x <= width + 10 && points[i].y >= -10 && points[i].y <= height + 10) {
                p5.ellipse(points[i].x, points[i].y, lineThickness);
            } else {
                let spawn1 = determineSpawn(p5)
                points[i] = p5.createVector(spawn1[0], spawn1[1])
            }
        }
    }

    function createPoints(p5: import("p5"), totalSpawnPoints: number): Vector[] {
        let points: Vector[] = []
        for (let a=0; a<totalSpawnPoints; a++) {
            let spawn = determineSpawn(p5)
            points.push(p5.createVector(spawn[0], spawn[1]))
        }
        return points
    }
    
    function determineSpawn(p5: import("p5")): number[] {
        let spawnside = 4
        // p5.frameCount < 10 ? p5.random([0,1])/1 : p5.random([0,1,2,3])/1
        let spawnheight = 0;
        let spawnwidth = 0;
        switch (spawnside) {
            // Left
            case 0:
                spawnwidth = p5.random(-10, -lineThickness)
                spawnheight = p5.random(0, height)
                break;
            // Right
            case 1:
                spawnwidth = p5.random(width + 10, width + lineThickness)
                spawnheight = p5.random(0, height)
                break;
            // Top
            case 2:
                spawnwidth = p5.random(0, width)
                spawnheight = p5.random(-10, -lineThickness)
                break;
            // Bottom
            case 3:
                spawnwidth = p5.random(0, width)
                spawnheight = p5.random(height + 10, height + lineThickness)
                break;
            case 4:
                spawnwidth = p5.random(0, width)
                spawnheight = p5.random(0,height)
            } 
        return [spawnwidth, spawnheight]
    }

</script>
<div class="absolute w-full h-full bg-[#000] -z-10 ">
    <P5 {sketch} />  
</div>
<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

 