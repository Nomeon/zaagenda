<script lang='ts'>
    import P5 from 'p5-svelte';
    
    export let width: number;
    export let height: number;
    let useRange = false;
    let useLightningEffect = false;
    let fadeDistance = 40;
    let drawRange = 100;
    let lineThickness = 3;
    let maxPoints = 200;
    
    // Speed
    var density = 20;
    let spawnSpeed = 30;


    // Pattern
    var mult = 0.001; // Branching
    let noiseDetail = 2; // spread

    var points: {x: number, y: number}[] = []
  
    // @ts-ignore
    const sketch = (p5) => {
        var r1: number;
        var r2: number;
        var g1: number;
        var g2: number;
        var b1: number;
        var b2: number;

      p5.setup = () => {


        p5.createCanvas(width, height);
        p5.background(0,0,0,0);
        p5.angleMode(p5.DEGREES);
        p5.noiseDetail(noiseDetail);

    
        var space = width/density;
        for (var x=0; x < width; x+= space)
            for (var y=0; y < height; y+= space){
                // Left spawn
                var p = p5.createVector(-10, y + p5.random(-height, height));
                points.push(p);
                //Right spawn
                p = p5.createVector(width + 10, y + p5.random(-height, height));
                points.push(p);
                // // Top spawn
                // var p = p5.createVector(p5.random(0, width), -10);
                // points.push(p);
                // // Bottom spawn
                // var p = p5.createVector(p5.random(0, width), height);
                // points.push(p);

                // Random spawn
                var p = p5.createVector(p5.random(-width, width),p5.random(-height, height))
                points.push(p);
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
            var max
            if (p5.frameCount * spawnSpeed <= points.length) {
                max = p5.frameCount * spawnSpeed;
            } else {
                max = points.length;
            }

            
    
    
            for (var i = 0; i<max; i++) {
                // CAUSES TILING, DONT KNOW WHY
                // var r = p5.map(points[i].x, 0, width, 0, 165);
                // var g = p5.map(points[i].y, 0, width, 0, 25);
                // var b = p5.map(points[i].x, 0, height, 0, 25);

                // var r = p5.map(points[i].x, 0, width, r1, r2);
                // var g = p5.map(points[i].y, 0, width, g1, g2);
                // var b = p5.map(points[i].x, 0, height, b1, b2);
                
                if (useRange) {
                    var alpha = p5.map(p5.dist(width/2, height/2, points[i].x, points[i].y), 0, fadeDistance, 255, 0);
                }
    
    
                p5.fill(150, 12, 5, 10);
                if (useLightningEffect) {
                    mult = p5.random(0.001, 0.004)
                }
                var angle = p5.map(p5.noise(points[i].x * mult, points[i].y * mult), 0, 1, 0, 720);
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
            var nextPoint = p5.createVector(p5.random(-width, width), p5.random(-height, height));
            points.push(nextPoint);
            if (points.length >= maxPoints) {
                points.shift();
            }
        };
      }
  </script>
  <div class="absolute w-full h-full bg-[#000000] -z-20 ">  <!-- bg-gradient-to-l bg-opacity-80 from-[#2e0000] to-[#7a0016] -->
  </div>
  <P5 {sketch} />
 