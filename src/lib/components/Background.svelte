<script lang='ts'>
    import P5 from 'p5-svelte';
    
    export let width: number;
    export let height: number;
    let useRange = false;
    let useLightningEffect = false;
    let fadeDistance = 400;
    let drawRange = 500;
    let lineThickness = 1;
    var density = 30;
    var mult = 0.001;
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
        p5.background(30);
        p5.angleMode(p5.DEGREES);
        p5.noiseDetail(10);
        console.log(p5.angleMode());

    
        var space = width/density;

        for (var x=0; x < width; x+= space){
            for (var y=0; y < height; y+= space){
                var p = p5.createVector(x + p5.random(-10, 10), y + p5.random(-10, 10));
                points.push(p);
            }
        }
        r1 = p5.random(255);
        r2 = p5.random(255);
        g1 = p5.random(255);
        g2 = p5.random(255);
        b1 = p5.random(255);
        b2 = p5.random(255);

        p5.shuffle(points, true);
      };
        p5.draw = () => {
            p5.noStroke();

            if (p5.frameCount <= points.length) {
                var max = p5.frameCount;
            } else {
                var max = points.length;
            }
    
    
            for (var i = 0; i<max; i++) {
                var r = p5.map(points[i].x, 0, width, r1, r2);
                var g = p5.map(points[i].y, 0, height, g1, g2);
                var b = p5.map(points[i].x, 0, width, b1, b2);
                
                if (useRange) {
                    var alpha = p5.map(p5.dist(width/2, height/2, points[i].x, points[i].y), 0, fadeDistance, 255, 0);
                }
    
    
                p5.fill(r, g, b, alpha);
                if (useLightningEffect) {
                    mult = p5.random(0.001, 0.006)
                }
                var angle = p5.map(p5.noise(points[i].x * mult, points[i].y * mult), 0, 1, 0, 720);
                points[i].add(p5.createVector(p5.cos(angle), p5.sin(angle)))
    
                if (useRange == true) {
                    if (p5.dist(width/2, height/2, points[i].x, points[i].y) < drawRange) {
                        p5.ellipse(points[i].x, points[i].y, 1);
                    }
                } else {
                    p5.ellipse(points[i].x, points[i].y, lineThickness);
                }
            }
        };
      }
  </script>
  
  <P5 {sketch} />
  