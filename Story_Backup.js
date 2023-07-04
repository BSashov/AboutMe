import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';


//Scene
const scene = new THREE.Scene();


//Actor
const loader = new GLTFLoader();
loader.load('Story.glb', (gltf) => {
  const mesh = gltf.scene.children[0]; // first mesh from gltf
  scene.add(mesh);
});


//Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

//Light
const light = new THREE.PointLight(0xff6fff, 3, 100);
light.position.set(20, 20, 20)
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.5, 100);
scene.add(camera);


//Renderer
const canvas = document.querySelector(".flyingMe");
const renderer = new THREE.WebGL1Renderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

// Resize
window.addEventListener('resize', () => {
    //update size
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)

})


const loop = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
loop()


// Timeline
const tl = gsap.timeline({
    defaults: {
        duration: 1
    }
})

tl.fromTo("nav", {y: "-80%"}, {y: "0%"})

tl.fromTo(camera.position, {x: 25,y: 25,z: 25}, {x: 0,y: 3, z: 3})

tl.fromTo(".title", {opacity: 0}, {opacity: 1})


//Mouse
let mouseDown = false
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))
console.log(mouseDown)
