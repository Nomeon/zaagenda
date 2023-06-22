<script lang="ts">
    import { onMount } from "svelte";

    onMount(() => {
        console.log("HELLO THERE");
          // Initialize the points with random positions
        function generatePoints(canvasWidth: number, canvasHeight: number, numPoints: number) {
            const gridSize = Math.sqrt((canvasWidth * canvasHeight) / numPoints); // Calculate grid size based on canvas area and desired number of points
            const numCols = Math.ceil(canvasWidth / gridSize); // Calculate the number of columns based on the grid size
            const numRows = Math.ceil(canvasHeight / gridSize); // Calculate the number of rows based on the grid size
            const points = [];

            for (let row = 0; row < numRows; row++) {
              for (let col = 0; col < numCols; col++) {
                const x = (col + 0.5) * gridSize; // Calculate the x-coordinate of the point
                const y = (row + 0.5) * gridSize; // Calculate the y-coordinate of the point

                if (points.length < numPoints) {
                  points.push({ x, y }); // Add the point to the list if the desired number of points hasn't been reached
                } else {
                  return points; // Return the points if the desired number has been reached
                }
              }
            }

            return points; // Return the points if the desired number is greater than the number of grid cells
        }

        // Usage example
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height; 
        const numPoints = 100; 
        const points = generatePoints(canvasWidth, canvasHeight, numPoints);
        
        if (context) {
            console.log("CONTEEEXT");
            context.fillStyle = 'red';

            points.forEach(point => {
                context.beginPath();
                context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                context.fill();
            });
        } else {
            console.log("NO CONTEEEEXT");
        }

    });
  console.log("end of script");  
  </script>
  
  <canvas id="canvas"></canvas>

  <style>
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  </style>
  