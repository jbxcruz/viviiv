// Set up the basic Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // Make the renderer full-screen
document.body.appendChild(renderer.domElement);

// Function to handle window resizing
function onWindowResize() {
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Add an event listener for window resizing
window.addEventListener('resize', onWindowResize);


// Create the cube geometry with diagonal lines
let cubeSize = 200; // Initial cube size
let cubeColor = '#ff0000'; // Default color
let isSpinning = false; // Spin flag

// Create a box geometry and add diagonal lines to each face
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

// Create materials for each face of the cube
const materials = [
  new THREE.MeshBasicMaterial({ color: cubeColor }),  // Right
  new THREE.MeshBasicMaterial({ color: cubeColor }),  // Left
  new THREE.MeshBasicMaterial({ color: cubeColor }),  // Top
  new THREE.MeshBasicMaterial({ color: cubeColor }),  // Bottom
  new THREE.MeshBasicMaterial({ color: cubeColor }),  // Front
  new THREE.MeshBasicMaterial({ color: cubeColor })   // Back
];

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Create lines for each face of the cube (diagonal lines)
const lineMaterial = new THREE.LineBasicMaterial({ color: '#000000' });
const lineGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-cubeSize / 2, -cubeSize / 2, 0),
  new THREE.Vector3(cubeSize / 2, cubeSize / 2, 0)
]);

const lines = [
  new THREE.Line(lineGeometry, lineMaterial), // Front
  new THREE.Line(lineGeometry, lineMaterial), // Back
  new THREE.Line(lineGeometry, lineMaterial), // Left
  new THREE.Line(lineGeometry, lineMaterial), // Right
  new THREE.Line(lineGeometry, lineMaterial), // Top
  new THREE.Line(lineGeometry, lineMaterial), // Bottom
];

lines.forEach(line => scene.add(line));

function animate() {
  requestAnimationFrame(animate);
  
  if (isSpinning) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

// Position the camera and render the scene
camera.position.z = 500;
animate();

// Create a dat.GUI instance and add controls
const gui = new dat.GUI();
let cubeProperties = {
  elevation: 0,
  visibility: true,
  wireframe: false,
  color: '#ff0000',
  rotateSpeed: 0.2,
  spin: function() {
    isSpinning = !isSpinning;
  },
};

// Elevation control (Y-axis movement)
gui.add(cubeProperties, 'elevation', -200, 200).name('Elevation').onChange(() => {
  cube.position.y = cubeProperties.elevation;
});

// Visibility control (Show/Hide cube)
gui.add(cubeProperties, 'visibility').name('Visibility').onChange(() => {
  cube.visible = cubeProperties.visibility;
});

// Wireframe control (display wireframe)
gui.add(cubeProperties, 'wireframe').name('Wireframe').onChange(() => {
  if (cubeProperties.wireframe) {
    // When wireframe is enabled, show only the diagonals (lines)
    materials.forEach(material => material.wireframe = true);
    lines.forEach(line => line.visible = true);
  } else {
    // When wireframe is disabled, show the full cube faces with color
    materials.forEach(material => material.wireframe = false);
    lines.forEach(line => line.visible = false);
  }
});

// Color control (change the cube color)
gui.addColor(cubeProperties, 'color').name('Color').onChange(() => {
  cubeColor = cubeProperties.color;
  materials.forEach(material => material.color.set(cubeColor));
});

// Spin button (start/stop spinning)
gui.add(cubeProperties, 'spin').name('Spin');

// Event listener to handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Add mouse event listeners for interactive rotation
let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };

function onMouseDown(event) {
  isMouseDown = true;
}

function onMouseUp(event) {
  isMouseDown = false;
}

function onMouseMove(event) {
  if (!isMouseDown) return;

  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  cube.rotation.x += deltaY * 0.01;
  cube.rotation.y += deltaX * 0.01;

  previousMousePosition = { x: event.clientX, y: event.clientY };
}

// Add event listeners to handle mouse movements
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousemove', onMouseMove);

// Add scroll wheel event listener for resizing the cube
window.addEventListener('wheel', (event) => {
  const zoomSpeed = 5;
  if (event.deltaY > 0) {
    // Scroll down: Decrease the cube size gradually
    cubeSize = Math.max(10, cubeSize - zoomSpeed); // Prevent size from going negative
  } else {
    // Scroll up: Increase the cube size gradually
    cubeSize = cubeSize + zoomSpeed;
  }

  // Update cube geometry with new size
  cube.scale.set(cubeSize / 200, cubeSize / 200, cubeSize / 200); // Keep proportions
});

