//导入threejs
import * as THREE from 'three';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

//创建一个clock
const clock = new THREE.Clock();

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x88ccee );
scene.fog = new THREE.Fog( 0x88ccee, 0, 50 );
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const container = document.getElementById('container');
container.appendChild(renderer.domElement);
// 创建光源
const fillLight1 = new THREE.HemisphereLight( 0x4488bb, 0x00224, 0.5 );
fillLight1.position.set( 2, 1, 1 );
scene.add( fillLight1 );
const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( -5, 25, 1 );
light.castShadow = true;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 100;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.radius = 4;
light.shadow.bias = -0.00006
scene.add( light );

// 创建状态stats
const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
container.appendChild( stats.dom );

//设置重力
const GRAVITY = 30;
//设置可创建的最大球体数量
const NUM_SPHERS = 100;
const SPHERE_RADIUS = 0.5;

const STEPS_PER_FRAME = 5;

const spheres = [];
const sphereIdx = 0;

//创建球体
const sphereGeometry = new THREE.BufferGeometry( SPHERE_RADIUS, 16, 16 );
const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );

for (let index = 0; index < NUM_SPHERS; index++) {
    const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    scene.add( sphereMesh );
    //把球体添加到数组中
    spheres.push( {
        mesh: sphereMesh,
        velocity: new THREE.Vector3(),
        collider:new THREE.Sphere(new THREE.Vector3(0,-100,0),SPHERE_RADIUS)
    } );
}

//创建八叉树
const octree = new Octree();

//创建玩家胶囊体
const playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 );
//创建玩家速度
const playerVelocity = new THREE.Vector3();
//创建玩家方向
const playerDirection = new THREE.Vector3();

//玩家是否在地面
let playerOnFloor = false;
//玩家是否在空中
let playerInAir = false;

//创建开始移动的时间
let mouseTime = 0;

//创建键盘状态
const keyStates = {};
const vector1 = new THREE.Vector3();
const vector2 = new THREE.Vector3();
const vector3 = new THREE.Vector3();

//监听键盘按下事件
document.addEventListener( 'keydown', function ( event ) {
    keyStates[ event.code ] = true;
} );
//监听键盘抬起事件
document.addEventListener( 'keyup', function ( event ) {
    keyStates[ event.code ] = false;
} );
//监听鼠标按下事件
document.addEventListener( 'mousedown', function ( event ) {
    document.body.requestPointerLock();
    mouseTime = performance.now();
} );
//监听鼠标抬起事件
document.addEventListener( 'mouseup', function ( event ) {
    if(document.pointerLockElement !== null){
        throwBall();
    }
} );
//监听鼠标移动事件
document.addEventListener( 'mousemove', function ( event ) {
    if(document.pointerLockElement === document.body){
        camera.rotation.y -= event.movementX / 500;
        camera.rotation.x -= event.movementY /500;
    }
} );

//创建一个屏幕大小监听
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//创建一个扔球的函数
function throwBall(){
    const sphere = spheres[ sphereIdx ];

    camera.getWorldDirection( playerDirection );

    sphere.collider.center.copy( playerCollider.end ).addScaledVector( playerDirection, playerCollider.radius * 1.5 );

    // throw the ball with more force if we hold the button longer, and if we move forward

    const impulse = 15 + 30 * ( 1 - Math.exp( ( mouseTime - performance.now() ) * 0.001 ) );

    sphere.velocity.copy( playerDirection ).multiplyScalar( impulse );
    sphere.velocity.addScaledVector( playerVelocity, 2 );

    sphereIdx = ( sphereIdx + 1 ) % spheres.length;

}

function playerCollisions(){
    const result = octree.capsuleIntersect(playerCollider);
    playerOnFloor = false;

    if(result){
        playerOnFloor = result.normal.y > 0;
        if(!playerOnFloor){
            playerVelocity.addScaledVector(result.normal,-result.normal.dot(playerVelocity));
        }
        playerCollider.translate(result.normal.multiplyScalar(result.depth));
    }
}

// 更新玩家的位置
function updatePlayer(deltaTime){
    let damping = Math.exp(-4 * deltaTime) -1;
    if(!playerOnFloor){
        playerVelocity.y -= GRAVITY * deltaTime;
        damping *= 0.1;
    }
    playerVelocity.addScaledVector(playerVelocity,damping);
    const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
    playerCollider.translate(deltaPosition);
    playerCollisions();

    camera.position.copy(playerCollider.end);
}

// 更新胶囊体球体的位置
function playerSphereCollision(sphere){
    const radius = playerCollider.radius + sphere.collider.radius;
    const radius2 = radius * radius;
    const center = vector1.addVectors(playerCollider.start,playerCollider.end).multiplyScalar(0.5);
    const sphereCenter = sphere.collider.center;
    for (const point of [playerCollider.start, playerCollider.end, center]) {
        const d2 = point.distanceToSquared(sphereCenter);
        if(d2 < radius2){
            const normal = vector1.subVectors(point, sphereCenter).normalize();
            const v1 = vector2.copy(normal).multiplyScalar(normal.dot(playerVelocity));
            const v2 = vector3.copy(normal).multiplyScalar(normal.dot(sphere.velocity));

            playerVelocity.add(d2).sub(v1);
            sphere.velocity.add(v1).sub(v2);

            const d = (radius - Math.sqrt(d2))/2;
            sphereCenter.addScaledVector(normal, -d);
        }
    }
}

//创建一个球体碰撞检测的函数
function spheresCollisions(){
    for (let i = 0; i < spheres.length; i++) {
        const s1 = spheres[i];
       for (let j = i + 1; j < spheres.length; j++) {
            const s2 = spheres[j];

            const d2 = s1.collider.center.distanceToSquared(s2.collider.center);
            const r = s1.collider.radius + s2.collider.radius;
            const r2 = r * r;

            if(d2 < r2){
                const normal = vector1.subVectors(s1.collider.center, s2.collider.center).normalize();
                const v1 = vector2.copy(normal).multiplyScalar(normal.dot(s1.velocity));
                const v2 = vector3.copy(normal).multiplyScalar(normal.dot(s2.velocity));

                s1.velocity.add(v2).sub(v1);
                s2.velocity.add(v1).sub(v2);

                const d = (r - Math.sqrt(d2))/2;
                s1.collider.center.addScaledVector(normal, d);
                s2.collider.center.addScaledVector(normal, -d);
            }
       }
    }
}
//更新球体的位置
function updateSpheres(deltaTime){

    spheres.forEach(sphere => {
        sphere.collider.center.addScaledVector(sphere.velocity, deltaTime);
        const result = octree.sphereIntersect(sphere.collider);
        if(result){
            sphere.velocity.addScaledVector(result.normal,-result.normal.dot(sphere.velocity) * 1.5);
            sphere.collider.center.add(result.normal.multiplyScalar(result.depth));
        }else{
            sphere.velocity.y -= GRAVITY * deltaTime;
        }
        //设置阻力值
        const damping = Math.exp(-1.5 * deltaTime) -1;
        sphere.velocity.addScaledVector(sphere.velocity,damping);
        playerSphereCollision(sphere);
    });

    spheresCollisions();

    for (const shpere of spheres) {
        shpere.mesh.position.copy(shpere.collider.center);
    }
}

//获取相机的前方向
function getForwardVector(){
   camera.getWorldDirection( playerDirection );
   playerDirection.y = 0;
   playerDirection.normalize();

    return playerDirection;
}

//获取相机侧面方向
function getSiderVector(){
    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(camera.up);

    return playerDirection;
}

function controls(deltaTime){
    const speedDelta = deltaTime * (playerOnFloor ? 25 :8);
    if(keyStates['KeyW']){
        playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
    }
    if(keyStates['KeyS']){
        playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
    }
    if(keyStates['KeyA']){
        playerVelocity.add(getSiderVector().multiplyScalar(-speedDelta));
    }
    if(keyStates['KeyD']){
        playerVelocity.add(getSiderVector().multiplyScalar(speedDelta));
    }

    if(playerOnFloor){
        if(keyStates['Space']){
            playerVelocity.y = 10;
        }
    }
}

const loader = new GLTFLoader().setPath('models/gltf/');
loader.load('collision-world.glb',  (gltf)=> {
    scene.add(gltf.scene);
    //八叉树碰撞检测计算
    octree.fromGraphNode(gltf.scene);
    gltf.scene.traverse(child => {
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;

            if(child.material.map){
                child.material.map.anisotropy = 100;
            }
        }
    });

    const octreeHelper = new OctreeHelper(octree);
    octreeHelper.visible = true;
    scene.add(octreeHelper);
    
    const gui = new GUI({ width:200});
    gui.add({debug:false}, 'debug').onChange((value) => {
        octreeHelper.visible = value;
    });
    
    animate();
});

function teleportPlayerIfOob(){

    if( camera.position.y <= -25){
        playerCollider.start.set(0, 0.35, 0);
        playerCollider.end.set(0,1,0);
        playerCollider.radius = 0.35;
        camera.position.copy(playerCollider.end);
        camera.rotation.set(0, 0, 0);
    }
}

function animate(){
    const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;

    for(let i =0;i< STEPS_PER_FRAME;i++){
        controls(deltaTime);
        updatePlayer(deltaTime);
        updateSpheres(deltaTime);
        teleportPlayerIfOob();
    }

    renderer.render(scene,camera);
    stats.update();

    requestAnimationFrame(animate);
}