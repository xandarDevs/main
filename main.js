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
let controller, controllerGrip;
let geometry, texture, material;
let cube;

container = document.createElement('div');
document.body.appendChild(container);

scene = new THREE.Scene();
scene.background = new THREE.Color(0x505050);
camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
renderer = new THREE.WebGLRenderer({
    antialias : true,
    alpha: false,
});
renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

geometry = new THREE.BoxGeometry(
    1,
    1,
    1
);
texture = new THREE.TextureLoader();
material = new THREE.MeshBasicMaterial(
    {
        // color : 0x00ff00
        map : texture.load('images/logo_copilot.jpg'),
    }
);
cube = new THREE.Mesh(
    geometry,
    material
);
scene.add(cube);
camera.position.z = 5;

raycaster = new THREE.Raycaster();

renderer = new THREE.WebGLRenderer({
    antialias : true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);

controller = renderer.xr.getController(0);
controller.addEventListener('connect', function(event){
    this.add(buildController(event.data));
});
controller.addEventListener('disconnected', function(){
    this.remove(this.children[0]);
});
scene.add(controller);

const controllerModelFactory = new XRControllerModelFactory();
controllerGrip = renderer.xr.getControllerGrip(0);
controllerGrip.add(
    controllerModelFactory.createControllerModel(controllerGrip)
);
scene.add(controllerGrip);

window.addEventListener('resize', onWindowResize);

document.body.appendChild(XRButton.createButton(renderer, {
    'optionalFeatures' : ['depth-sensing'],
    'depthSensing': {
        'usagePreference' : ['gpu-optimized'],
        'dataFormatPreference' : []
    }
}));

function buildController( data ) {

    let geometry, material;

    switch ( data.targetRayMode ) {

        case 'tracked-pointer':

            geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
            geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

            material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

            return new THREE.Line( geometry, material );

        case 'gaze':

            geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
            material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
            return new THREE.Mesh( geometry, material );

    }

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate(){
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(
        scene,
        camera
    );
}