
<script lang='ts'>
    import P5 from 'p5-svelte';
    
    export let width: number;
    export let height: number;

    // @ts-ignore
    const sketch = (p5) => {
        p5.setup = () => {
            p5.createCanvas((width/2), (height/2), p5.WEBGL)
            p5.angleMode(p5.DEGREES)
            p5.noiseDetail(1)
        }

        p5.draw = () => {
            p5.background(100, 150, 100, 0.0)

            // p5.translate (0,0,300)
            // p5.rotateX(5)
            p5.noStroke()

            var w = 30
            var start = p5.frameCount/60

            var xoff = 0
            for (var x = -width / 2; x <= width / 2; x += w) {
                var yoff = 0
                for (var y = -height / 2; y <= height; y += w) {
                    var h = p5.map(p5.noise(xoff + start, yoff + start), 0, 1, -100, 100)

                    var r = p5.map(x, -width/2, width/2, 0, 255)
                    var g = p5.map(y, -height /2, height / 2, 255, 0)
                    var b = p5.map(h, -100, 100, 0, 255)

                    p5.push()
                    p5.fill(r,g,b)
                    p5.translate(x,y,-h/2)
                    p5.box(w,w,h)
                    p5.pop()

                    yoff += 0.1
                }
                xoff += 0.1
            }
        }
    }
</script>

<P5 {sketch} />