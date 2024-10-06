import * as THREE from 'three';
// import WebGL from 'three/addons/capabilities/WebGL.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {XRButton} from 'three/addons/webxr/XRButton.js';
// import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {XRControllerModelFactory} from 'three/addons/webxr/XRControllerModelFactory.js';
import Stats from 'three/addons/libs/stats.module.js';
// import { RGBELoader } from 'three/examples/jsm/Addons.js';

const clock = new THREE.Clock();

let container;
let camera, scene, raycaster, renderer;
let desktop_controller, xr_controller, controllerGrip;
let texture;
let object;
let stats;
let cubeCamera;

init();
function init(){
    container = document.createElement('div');
    document.body.appendChild(container);

    stats = new Stats()

    scene = new THREE.Scene();
    texture = new THREE.TextureLoader();

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerWidth,
        0.1,
        1000,
    );
    scene.add(camera);
    camera.position.z = 5;

    scene.add(cubeMapLoader('images/cubemap/', scene));
    
    object = {
        item1 : new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2,), 
            new THREE.MeshBasicMaterial({
                // color : 0x00ff00,
                map : texture.load('images/logo_copilot.jpg'),
            })
        ),
    };
    scene.add(object.item1);
    
    raycaster = new THREE.Raycaster();
    
    renderer = new THREE.WebGLRenderer({
        antialias : false,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    desktop_controller = new OrbitControls(camera, renderer.domElement);
    // desktop_controller.autoRotate = true;

    xr_controller = renderer.xr.getController(0);
    scene.add(xr_controller);

    const controllerModelFactory = new XRControllerModelFactory();
    controllerGrip = renderer.xr.getControllerGrip(0);
    controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));
    scene.add(controllerGrip);

    window.addEventListener('resize', onWindowResize);

    document.body.appendChild(XRButton.createButton( renderer, {
        'optionalFeatures': ['depth-sensing'],
        'depthSensing': {
            'usagePreference' : [
                'gpu-optimized'
            ],
            'dataFormatPreference' : []
        }
    }));
}

function cubeMapLoader(image_folder, scene){
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath(image_folder);
    const skyboxTexture = cubeTextureLoader.load([
        'front.jpg', 'back.jpg',
        'left.jpg', 'right.jpg',
        'top.jpg', 'bottom.jpg'
    ]);
    scene.background = skyboxTexture;

    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512);
    cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    return cubeCamera;
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
    // requestAnimationFrame(animate);
    object.item1.rotation.x += 0.001;
    object.item1.rotation.y += 0.001;
    desktop_controller.update();
    cubeCamera.update(renderer, scene);
    renderer.render(scene, camera);
    stats.update();
}