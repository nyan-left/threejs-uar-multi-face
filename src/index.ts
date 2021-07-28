/// Zappar for ThreeJS Examples
/// Face Tracking 3D Model

// In this example we track a 3D model to the user's face

import * as THREE from 'three';
import * as ZapparThree from '@zappar/zappar-threejs';

import snapshot from '@zappar/webgl-snapshot';
import './index.sass';
import source from './ppl.jpeg';

const manager = new ZapparThree.LoadingManager();

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
document.body.appendChild(renderer.domElement);

// As with a normal ThreeJS scene, resize the canvas if the window resizes
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const img = document.createElement('img');
const camera = new ZapparThree.Camera({
  rearCameraSource: img,
});

img.src = source;

img.onload = () => {
  camera.start();
};
// The Zappar component needs to know our WebGL context, so set it like this:
ZapparThree.glContextSet(renderer.getContext());

// Set the background of our scene to be the camera background texture
// that's provided by the Zappar camera
scene.background = camera.backgroundTexture;

// Create a FaceTracker and a FaceAnchorGroup from it to put Three content in
// Pass our loading manager to the loader to ensure that the progress bar
// works correctly
const faceTracker = new ZapparThree.FaceTrackerLoader(manager).load();
faceTracker.maxFaces = 3;
const faceTrackerGroup0 = new ZapparThree.FaceAnchorGroup(camera, faceTracker);
faceTrackerGroup0.anchorId = '0';
const faceTrackerGroup1 = new ZapparThree.FaceAnchorGroup(camera, faceTracker);
faceTrackerGroup1.anchorId = '1';
const faceTrackerGroup2 = new ZapparThree.FaceAnchorGroup(camera, faceTracker);
faceTrackerGroup2.anchorId = '2';
// Add our face tracker group into the ThreeJS scene
scene.add(faceTrackerGroup0, faceTrackerGroup1, faceTrackerGroup2);

const createCube = (color: string) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color,
  });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
};

faceTrackerGroup0.add(createCube('red'));
faceTrackerGroup1.add(createCube('black'));
faceTrackerGroup2.add(createCube('white'));

// Let's add some lighting, first a directional light above the model pointing down
const directionalLight = new THREE.DirectionalLight('white', 0.8);
directionalLight.position.set(0, 5, 0);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

// And then a little ambient light to brighten the model up a bit
const ambientLight = new THREE.AmbientLight('white', 0.4);
scene.add(ambientLight);

faceTracker.onNewAnchor.bind((anchor) => {
  console.log(anchor);
});

// Get a reference to the 'Snapshot' button so we can attach a 'click' listener
const placeButton = document.getElementById('snapshot') || document.createElement('div');

placeButton.addEventListener('click', () => {
  // Get canvas from dom
  const canvas = document.querySelector('canvas') || document.createElement('canvas');

  // Convert canvas data to url
  const url = canvas.toDataURL('image/jpeg', 0.8);

  // Take snapshot
  snapshot({
    data: url,
  });
});

// Use a function to render our scene as usual
function render(): void {
  // The Zappar camera must have updateFrame called every frame
  camera.updateFrame(renderer);

  // Draw the ThreeJS scene in the usual way, but using the Zappar camera
  renderer.render(scene, camera);

  // Call render() again next frame
  requestAnimationFrame(render);
}

// Start things off
render();
