// pages/about.js

export default function About() {
    return (
      <div>
        <h1>About Page</h1>
        <p>This is the About page of the Next.js app.</p>
      </div>
    );
  }


function floodFill(image, sr, sc, newColor) {
  const originalColor = image[sr][sc];
  
  // If the starting pixel is already the new color, no need to do anything
  if (originalColor === newColor) {
    return image;
  }
  
  const m = image.length;
  const n = image[0].length;
  
  // Initialize the BFS queue
  const queue = [[sr, sc]];
  
  // Directions for moving up, down, left, and right
  const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1],  // Right
  ];
  
  while (queue.length > 0) {
    const [x, y] = queue.shift();
    // Change the color of the current pixel
    image[x][y] = newColor;
  
    // Check all 4 directions
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
  
      // If the new coordinates are within bounds and the color is the same as the original color
      if (nx >= 0 && nx < m && ny >= 0 && ny < n && image[nx][ny] === originalColor) {
        queue.push([nx, ny]);
      }
    }
  }
  
  return image;
}
  