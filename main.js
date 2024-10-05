import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({
    antialias : false,
    alpha: false,
});
renderer.setSize(
    window.innerWidth,
    window.innerHeight
);
const controls = new OrbitControls(
    camera,
    renderer.domElement
);
const loader = new GLTFLoader();
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(
    1,
    1,
    1
);
const texture = new THREE.TextureLoader();
const material = new THREE.MeshBasicMaterial(
    {
        // color : 0x00ff00
        map : texture.load('images/logo_copilot.jpg'),
    }
);
const cube = new THREE.Mesh(
    geometry,
    material
);
scene.add(cube);
camera.position.z = 5;

function animate(){
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(
        scene,
        camera
    );
}

if(WebGL.isWebGL2Available()){
    animate();
}else{
    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById('container').appendChild(warning);
}