// JS
import * as THREE from "https://cdn.skypack.dev/three@0.152.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.152.2/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("earth-canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Earth
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("https://raw.githubusercontent.com/rajAryanDev/assets/main/earth_texture.jpg");
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshStandardMaterial({ map: earthTexture })
);
scene.add(earth);

// Marker
const marker = new THREE.Mesh(
  new THREE.SphereGeometry(0.02, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(marker);

// Convert Lat/Lon to XYZ
function latLonToVector3(lat, lon, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Fallback hardcoded location (New Delhi)
const sampleLat = 28.6139;
const sampleLon = 77.2090;
const markerPos = latLonToVector3(sampleLat, sampleLon, 1.01);
marker.position.copy(markerPos);

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
