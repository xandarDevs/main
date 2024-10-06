import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {XRButton} from 'three/addons/webxr/XRButton.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {XRControllerModelFactory} from 'three/addons/webxr/XRControllerModelFactory.js';

const clock = new THREE.Clock();
let container;
let camera, scene, raycaster, renderer;
let desktop_controller, xr_controller, controllerGrip;
let geometry, texture, material;
let room;
var object;
let INTERSECTED;

init();
function init(){
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerWidth,
        0.1,
        1000,
    );
    scene.add(camera);
    camera.position.z = 5;
    
    texture = new THREE.TextureLoader();
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
        antialias : true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    desktop_controller = new OrbitControls(camera, renderer.domElement);

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

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
    object.item1.rotation.x += 0.01;
    object.item1.rotation.y += 0.01;
    renderer.render(scene, camera);
}