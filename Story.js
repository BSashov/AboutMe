//Imports
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import './Story.css';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


// Responsive
const sizes = {
  width: innerWidth,
  height: innerHeight,
}


//Scene
const scene = new THREE.Scene();
  // Set fog color
  scene.fog = new THREE.Fog(0x000000, 1, 90);



// Objects
//Ground
const groundTexture = new THREE.TextureLoader().load('GoundTexture.jpg')

const geometry = new THREE.CylinderGeometry(5, 0, 10,64)
const material = new THREE.MeshStandardMaterial({
  map: groundTexture,
})
const ground = new THREE.Mesh(geometry, material)
ground.receiveShadow = true
ground.position.x = 11
ground.position.z = -3
ground.position.y = -5
scene.add(ground)

//Actor
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
loader.load('Sitting.glb', function (gltf) {
  const model = gltf.scene;
  //textures
  gltf.scene.traverse((child) => {
    if (child.isMesh && child.material.map) { // make sure map is set
      const map = child.material.map;
      map.encoding = THREE.sRGBEncoding; // set encoding
      textureLoader.load(map.src, (texture) => {
        texture.encoding = THREE.sRGBEncoding; // set encoding
        child.material.map = texture;
        child.material.needsUpdate = true; // mark material as updated
      });
    }
  });

  //Animations
  const mixer = new THREE.AnimationMixer(model);
  const animation = gltf.animations[0];
  const action = mixer.clipAction(animation);

  model.scale.set(9, 9, 9);
  model.position.x = 12
  model.position.z = -6


  scene.add(model);

  action.play();

  // Framerate
  const clock = new THREE.Clock();
  const tick = () => {
    const delta = clock.getDelta();
    mixer.update(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
});

//Thorus


const geometryMath = new THREE.TorusKnotGeometry(10, 1, 300, 20);
const materialMath = new THREE.MeshStandardMaterial({
  color: 0xff6fff,
})
const torusKnot = new THREE.Mesh(geometryMath, materialMath);
//torusKnot.receiveShadow = true
torusKnot.castShadow = true
torusKnot.position.y = 10
torusKnot.position.x = 9
torusKnot.position.z = 2
torusKnot.scale.set(0.12, 0.12, 0.12)
scene.add(torusKnot);



//Lights
  //Point Light Torus Math
const pointLightTorus = new THREE.PointLight(0xff6fff)
pointLightTorus.position.set(10, 9, 2)
pointLightTorus.intensity = 0.6
pointLightTorus.castShadow = true
scene.add(pointLightTorus);

  //Point light on top
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(10, 20, 20)
pointLight.intensity = 1.2
pointLight.castShadow = true
scene.add(pointLight);


//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.5, 100);
camera.position.x = 30
camera.position.y = 5
camera.position.z = 9
scene.add(camera)

  //camera positions for scroll
const cameraPositions = [
  { x: 30, y: 5, z: 9 }, 
  { x: 30, y: 12, z: 16 },
  { x: 30, y: 2, z: 16 },
  { x: 0, y: 0, z: 26 },
  { x: -18, y: 1.5, z: 4 },
]

//Helpers
//const gridHelper = new THREE.GridHelper(100, 100);
//const cameraHelper = new THREE.CameraHelper(camera);
//const lightHelper = new THREE.PointLightHelper(pointLight);
//scene.add(cameraHelper, gridHelper, lightHelper)

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),
  alpha: true,
});
renderer.shadowMap.enabled = true
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableRotate = true
controls.enablePan = false
controls.enableDamping = true
controls.enableZoom = false

//Background
function addStar() {
  const geometry = new THREE.TorusGeometry(9, 0.9, 12, 16);
  const material = new THREE.MeshStandardMaterial({ color: 0xbcb1ff, transparent: true, opacity: 0.6 });
  const star = new THREE.Mesh(geometry, material);
  star.scale.set(0.1,0.1,0.1)
  const [x, y, z] = Array(3)
  .fill()
  .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
Array(42).fill().forEach(addStar);

// Animations on scroll
window.addEventListener('scroll', () => {
  
  const scrollPosition = window.scrollY / window.innerHeight;
  
  //Scroll camera
  const startIndex = Math.floor(scrollPosition);
  const endIndex = Math.min(startIndex + 1, cameraPositions.length - 1);
  const start = cameraPositions[startIndex];
  const end = cameraPositions[endIndex];
  
  const t = scrollPosition - startIndex;
  camera.position.lerpVectors(
    new THREE.Vector3(start.x, start.y, start.z),
    new THREE.Vector3(end.x, end.y, end.z), t);

});


//Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  controls.update()

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

// Refresh render
const renderLoop = () => {
  renderer.render(scene, camera)
  window.requestAnimationFrame(renderLoop)
}
renderLoop()


//animate thorus
function animate() {

  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.01;
  torusKnot.rotation.z += 0.01;

  requestAnimationFrame(animate)
  controls.update();
  renderer.render(scene, camera);
}
animate()

//Timeline animation
const tl = gsap.timeline({defaults: {duration: 1.3}})

tl.fromTo(torusKnot.position, {z:-22, x:-30, y:-29}, {z:2, x:9, y:10})
tl.fromTo("nav",{y:"-100%"}, {y:"0%"})
tl.fromTo(".part0", {opacity:0}, {opacity:1})


//music
const audio = document.getElementById("myAudio");
const eclipse = document.querySelector(".eclipse");


eclipse.addEventListener("click", function() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});



// Back to top
const backToTopBtn = document.querySelector('#back-to-top-btn');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 0) {
    backToTopBtn.style.display = 'block';
  } else {
    backToTopBtn.style.display = 'none';
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

//Refresh to top
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

const names = document.querySelectorAll('.name');

// Listen for the scroll event on the window
window.addEventListener('scroll', () => {
  // Calculate the opacity based on the scroll position
  const opacity = 1 - (window.scrollY / 70);

  // Set the opacity on each element with the class "name"
  names.forEach((name) => {
    name.style.opacity = opacity;
  });
});

//Autoscroll
const scrollBtn = document.getElementById("scrollBtn");

scrollBtn.addEventListener("click", function() {
  const scrollHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const difference = scrollHeight - windowHeight;
  const increment = difference / 3600;
  let currentPosition = 0;
  
  const scroll = setInterval(function() {
    currentPosition += increment;
    window.scrollTo(0, currentPosition);
    
    if (currentPosition >= difference) {
      clearInterval(scroll);
    }
  }, 33);
});

scrollBtn.addEventListener("click", function() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});