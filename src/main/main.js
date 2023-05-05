//导入threejs
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import nipplejs, { factory } from 'nipplejs';
import * as CANNON from "cannon-es";
import './dop.min.js';
import CannonDebugger from 'cannon-es-debugger';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import gsap from 'gsap';
import Swal from 'sweetalert2';
import html2Canvas from 'html2canvas';
// 导入draco压缩格式的解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Canvas2Image from './canvas2image.js';
import { MathUtils } from 'three/src/math/MathUtils.js';
var FakeProgress = require("fake-progress");

// var p = new FakeProgress({
// 	timeConstant : 10000,
// 	autoStart : true
// });

// var exampleAsyncFunction = function(callback){
// 	setTimeout(function(){
// 		callback()
// 	},30000)
// };

// var onEachSecond = function(){
// 	console.log("Progress is "+(p.progress*100).toFixed(1)+" %");
// };

// var interval = setInterval(onEachSecond, 1000);

// var onEnd = function(){
// 	p.end();
// 	clearInterval(interval);
// 	console.log("Ended. Progress is "+(p.progress*100).toFixed(1)+" %")
// };

// exampleAsyncFunction(onEnd);

//变量
var clock = new THREE.Clock();
var dop = new Dop();
var container, renderer, camera, camera2, scene, group, playerModel, playerMesh, playerBody, planeMesh,
 gui, light, stats, mixer, actions,activeAction, previousAction,
 controls,nameSprite, cannonDebugRenderer,arrowHelper;

/**
 * 物理材质
*/
var physicalMaterial;
var lastTime = 0, world, groundBody;
var fixedTimeStep = 1 / 60;

/**
 * MeshBodyToUpdate为一个对象数组
 * 数组中的每一个对象为Three中的Mesh和Cannon中的Body
 * 添加的形式如下
 * MeshBodyToUpdate.push({
 *   mesh: mesh,
 *   body: body,
 * })
 * 在render函数中遍历该数组，将Three中的Mesh的位置和旋转更新为Cannon中的Body的位置和旋转
 */
const MeshBodyToUpdate = [];

/**
 * 人物是否在移动
*/
var isMoveing = false;

/**
 * 人物是否在地面
*/
var isOnGround = false;

//当前人物的移动方向
var check = null;
var updateCamera;
var followCamera,rotationObject;

/**
 * 人物是否可以跳跃
*/
var canJump = false,jumpimg = false;

/**
 * 人物跳起来的高度
*/
var jumpVelocity = 100;
var distance;
var index = 0; 

/**
 * 人物播放默认的骨骼动画'_Idle'
*/
let idleAction, walkAction, runAction;
let idleWeight, walkWeight, runWeight;

/**
 * 物理世界的射线检测
*/
var rayResult = new CANNON.RaycastResult();
var rayHasHit = false;
var rayCastLength = 29.57;
var raySafeOffset = 0.83;
var character = {
    velocity:new THREE.Vector3(),
    moveSpeed:4,
    orientation:new THREE.Vector3(0, 0, 1)
}

//记录鼠标位置的参数
var toucheMovementX, toucheMovementY;
const _PI_2 = Math.PI / 2;
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
var pointerSpeed = 1.0;
var minPolarAngle = 0; // radians
var maxPolarAngle = Math.PI; // radians
var movementX, movementY, velocityFactor = 0.2, time = Date.now();
const playerDirection = new THREE.Vector3();
var inputVelocity = new THREE.Vector3();
var euler = new THREE.Euler();
var quat = new THREE.Quaternion();

// 初始化项目
init();

function init() {
    //初始化场景
    initScene();

    //初始化相机
    initCamera();

    //初始化灯光
    initLight();

    //初始化渲染器
    initRenderer();

    //初始化物理世界
    initWorld();

    //初始化控制器
    // initControls();

    //初始化cannon调试器
    initCannonDebugRenderer();

    //初始化模型
    initModel();
    // loadModel();

    //初始化摇杆
    initJoystick();

    //圆盘菜单点击显示隐藏事件
    clickFace();

    //人物跳跃操作事件
    clickJump();

    //初始化帧率
    // initStats();

    //初始化动画
    initAnimation();

    //更新widnow大小
    window.addEventListener('resize', onWindowResize, false);

    // 在按下空格键时向上应用一个力
    window.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            if (canJump === true) {
                jump();
            }
        }
    });

    window.addEventListener('touchstart', onDocumentTouchDown, false);
    window.addEventListener('touchmove', onDocumentTouchMove, false);

}

function onDocumentTouchDown(event) {
    // event.preventDefault();
    event.stopPropagation();
    // console.log("鼠标按下!:", event);
    var currentElement = event.srcElement.localName;
    if(currentElement === "canvas") {
        toucheMovementX = event.touches[0].clientX;
        toucheMovementY = event.touches[0].clientY;
        console.log(toucheMovementX, toucheMovementY);
    }
}

function onDocumentTouchMove(event) {
    // event.preventDefault();
    event.stopPropagation();
    var currentElement = event.srcElement.localName;
    // console.log("鼠标移动!:", event.target);
    if (currentElement === "canvas") {
        // console.log("旋转相机");
        //0.5为移动端旋转角度的速度
        event.movementX = 0.5 * (event.touches[0].clientX - toucheMovementX);
        event.movementY = 0.5 * (event.touches[0].clientY - toucheMovementY);

        // playerMesh.rotation.y -= event.movementX * 0.002 * pointerSpeed;
        // followCamera.rotation.x += event.movementY * 0.002 * pointerSpeed;

        toucheMovementX = event.touches[0].clientX;
        toucheMovementY = event.touches[0].clientY;
        onMouseMove(event, true);
    }
}

//相机旋转
function onMouseMove(event, ismobile = false) {
    if (!ismobile) return;

    movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    // console.log("movementY:",movementY,"movementX:",movementX);
    
    rotationObject.rotation.y -= movementX * 0.002 * pointerSpeed;
    followCamera.rotation.x += movementY * 0.002 * pointerSpeed;
    followCamera.rotation.x = Math.max( - _PI_2/3.5, Math.min( _PI_2/2, followCamera.rotation.x ) );

    //旋转playerbody
    // playerBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -movementX * 0.002 * pointerSpeed);
    //旋转相机
    // camera.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -movementX * 0.002 * pointerSpeed);
    //旋转playerMesh
    // playerMesh.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -movementX * 0.002 * pointerSpeed);

    // camera.position.lerp(followCamera.getWorldPosition(new THREE.Vector3(0,1,0)), 0.1);
    _euler.setFromQuaternion(camera.quaternion);
    _euler.y += movementX * 0.002 * pointerSpeed;
    _euler.x += movementY * 0.002 * pointerSpeed;
    // console.log("相机旋转角度:",_euler);
    // _euler.x = Math.max(_PI_2 - maxPolarAngle, Math.min(_PI_2 - minPolarAngle, _euler.x));
    // camera.quaternion.setFromEuler(_euler);

    getForwardVector();
}

//初始化场景
function initScene() {
    //获取容器
    container = document.getElementById('container');

    //创建场景
    scene = new THREE.Scene();

    //创建辅助器
    const axesHelper = new THREE.AxesHelper(5000);
    scene.add(axesHelper);

    group = new THREE.Group();
    scene.add(group);

    //添加一个射线辅助对象
    // arrowHelper = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 100, 0xffff00);
    // arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,50,0), 50, 0xffff00);
    // scene.add(arrowHelper);

}

//初始化相机
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, -150);
    camera.rotation.order = 'YXZ';
    // camera.lookAt(0, 0, 0);
}

//初始化模型
function initModel() {
    //加载模型
    const loaderManager = new THREE.LoadingManager(
        () => {
            //Loaded
            gsap.to(".loader", {
                delay: 1,
                duration: 2,
                translateY: "-100%",
                ease: "ease-in-out",
                pointerEvents: "none",
            })
        },
        (x, y, z) => {
            //Progress
            document.querySelector(".loader span").textContent = `${Math.floor(y / z * 100)}% Loading...`;
            gsap.to(".loading-bar", {
                scaleY: y / z
            })
        }
    );

    //加载模型
    var loader = new FBXLoader(loaderManager);
    loader.load('./models/Naruto.fbx', function (object) {
        //设置模型的每个部位都可以投影
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.scale.set(0.3, 0.3, 0.3);
        //赋值playerModel
        playerModel = object;
        //设置模型的位置
        // playerModel.position.set(0, 100, 0);
        // group.add(playerModel);

        //设置光线焦点模型
        if (playerModel) {
            light.target = playerModel;

            //创建模型的骨骼动画
            createAnimation(playerModel, playerModel.animations);
        }

        //将模型添加到playerMesh中
        // playerMesh.add(playerModel);

        //创建模型的刚体
        if(world){
            createPlayerModel(physicalMaterial, world, playerModel);
        }

        //创建人物头顶的名称
        // createSprite(100, 50, '鸣人', 15, 35, new THREE.Vector3(playerMesh.position.x, playerMesh.position.y+170, playerMesh.position.z));
        
        // //创建一个刚体材质
        // var defaultMaterial = new CANNON.Material("defaultMaterial");
        // // 把模型转换成物理模型
        // const result = threeToCannon(object, { type: ShapeType.SPHERE });
        // //创建一个刚体
        // playerBody = new CANNON.Body({
        //     mass: 1,
        //     material: defaultMaterial,
        //     shape: result.shape,
        //     position: new CANNON.Vec3(0, 110, 0),
        // });
        // //将刚体添加到物理世界中
        // if (world) {
        //     console.log("将刚体添加到物理世界中");
        //     world.addBody(playerBody);
        // }
    });
}


/*加载模型*/
function loadModel() {
    var loadingManager = new THREE.LoadingManager(() => {
        
    }, (url, itemsLoaded, itemsTotal) => {

    }, (url) => {
        console.log('There was an error loading ' + url);
    });

    var loader = new GLTFLoader(loadingManager);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('draco/gltf/');
    dracoLoader.setDecoderConfig({type:'js'});
    dracoLoader.preload();
    // const THREE_PATH = `https://unpkg.com/three`
    // const dracoLoader = new DRACOLoader().setDecoderPath( `${THREE_PATH}/examples/jsm/libs/draco/gltf/` );
    loader.setDRACOLoader(dracoLoader);
    loader.load('models/world.glb', function (glft) {
        console.log("小镇:", glft);
        glft.scene.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        group.add(glft.scene);
    },function onProgress(xhr) {});
}


// 初始化控制器
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
}

// 初始化初始化灯光
function initLight() {

    // scene.add(new THREE.AmbientLight(0x444444));
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    light = new THREE.DirectionalLight(0xaaaaaa);
    light.position.set(0, 1000, 800);
    light.lookAt(new THREE.Vector3());

    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -180;
    light.shadow.camera.left = -180;
    light.shadow.camera.right = 180;
    //告诉平行光需要开启阴影投射
    light.castShadow = true;
    scene.add(light);
}

//初始化renderer
function initRenderer() {
    if (dop.browserRedirect() === "pc") {
        renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: false,preserveDrawingBuffer : true  });
    } else {
        renderer = new THREE.WebGLRenderer({ antialias: true,preserveDrawingBuffer : true  });
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 加载纹理
    const textureLoader = new THREE.TextureLoader();
    // 加载环境纹理
    let envMap = textureLoader.load("textures/0006_4k.jpg");
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 设置为环境纹理
    scene.background = envMap;
    scene.environment = envMap;
}

//初始化物理世界
function initWorld() {
    //创建物理世界
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    //设置重力
    world.gravity.set(0, -30, 0);
    //设置物理世界的步长
    world.broadphase = new CANNON.NaiveBroadphase();
    //设置物理世界的迭代次数
    world.solver.iterations = 7;
    //设置物理世界的精度
    world.solver.tolerance = 0.1;
    //设置物理世界的碰撞过滤
    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    // 允许睡眠
    // world.allowSleep = true;
    //设置睡眠速度
    // world.sleepSpeedLimit = 0.1;
    // //设置睡眠时间
    // world.sleepTimeLimit = 1;

    //创建物理材质
    physicalMaterial = new CANNON.Material("slipperyMaterial");
    //创建物理材质的接触材质
    var contactMaterial = new CANNON.ContactMaterial(
        physicalMaterial,
        physicalMaterial,
        {
            friction: 0.3,
            restitution: 0,
        }
    );
    //将接触材质添加到物理世界
    world.addContactMaterial(contactMaterial);

    //创建地面
    createGround(physicalMaterial, world);

    //创建球体
    createSphere(physicalMaterial, world);

    //创建模型的刚体
    // createPlayerModel(physicalMaterial,world);
}

//创建模型的刚体
/**
 * @param {CANNON.Material} physicalMaterial 物理材质
 * @param {CANNON.World} world 物理世界
 * @param {THREE.Object3D} object 模型
 * 
*/
function createPlayerModel(physicalMaterial, world,object) {
    var radius = 15;
    //创建一个球体
    var sphereShape = new CANNON.Sphere(radius);
    // 把模型转换成物理模型
    // const modelShape = threeToCannon(object, { type: ShapeType.SPHERE });
    //创建一个刚体
    playerBody = new CANNON.Body({
        mass: 5,
        material: physicalMaterial,
        friction: 0.3,
        //弹力
        restitution: 0,
    });
    playerBody.position.set(0, radius, 0);
    playerBody.angularDamping = 0.9;
    playerBody.fixedRotation = true;
    playerBody.updateMassProperties();
    // playerBody.addShape(sphereShape,new CANNON.Vec3(0,100,0));
    // playerBody.addShape(sphereShape,new CANNON.Vec3(0,50,0));
    playerBody.addShape(sphereShape,new CANNON.Vec3(0,0,0));
    //将刚体添加到物理世界中
    world.addBody(playerBody);

    // var contactNormal = new CANNON.Vec3();
    // var upAxis = new CANNON.Vec3(0, 1, 0);
    // //监听碰撞事件
    // playerBody.addEventListener("collide", function (e) {
    //     // Swal.fire({
    //     //     title: 'Error!',
    //     //     text: 'Do you want to continue',
    //     //     icon: 'error',
    //     //     confirmButtonText: 'Cool'
    //     // });
    //     var contact = e.contact;
    //     if(contact.bi.id == playerBody.id){
    //         console.log("碰撞到了");
    //         contact.ni.negate(contactNormal);
    //     }else{
    //         console.log("碰撞到了+++");
    //         contactNormal.copy(contact.ni);
    //         // playerBody.velocity.y = 0;
    //     }
    //     console.log("upAxis",contactNormal.dot(upAxis));
    //     if(contactNormal.dot(upAxis) > 0.5){
    //         // console.log("跳起来了");
    //         canJump = true;
    //     }
    // });

    //创建threejs球体
    var sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x00fff0, transparent: true, opacity: 0.5, wireframe: true});
    playerMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    playerMesh.name = "模型mesh";
    group.add(playerMesh);
    //设置模型的位置
    object && object.position.set(0, 18, 0);
    object && playerMesh.add(object);
    
    //创建人物头顶的名字
    // nameSprite = getTextCanvas('鸣人');
    // nameSprite.position.set(0, radius + 21, 0);
    // playerMesh.add(nameSprite);
    nameSprite = drawText("鸣人");
    nameSprite.position.set(0, radius + 19, 0);
    playerMesh.add(nameSprite);

    var arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(0, playerMesh.position.y, playerMesh.position.z+20), object.position, 50, 0xffff00);
    object.add(arrowHelper);

    // 第三人称视角
    followCamera = new THREE.Object3D();
    followCamera.position.set(0,0,0);
    followCamera.add(camera);
    // playerMesh.add(followCamera);
    camera.lookAt(playerMesh.position.x, playerMesh.position.y + 5, playerMesh.position.z);

    rotationObject = new THREE.Object3D();
    rotationObject.position.set(0,30,0);
    rotationObject.add(followCamera);
    playerMesh.add(rotationObject);
}

//更新相机的位置
updateCamera = () => {
    if (followCamera) {
        camera.position.lerp(followCamera.getWorldPosition(new THREE.Vector3()), 0.1);
        camera.lookAt(playerMesh.position.x, playerMesh.position.y + .5, playerMesh.position.z);
    }
}

//创建threejs地面
function createGround(physicalMaterial, world) {
    //创建地面
    var groundShape = new CANNON.Plane();
    groundBody = new CANNON.Body({
        mass: 0,
        material: physicalMaterial,
    });
    groundBody.addShape(groundShape);
    groundBody.position.set(0, 0, 0);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);

    var groundTexture = new THREE.TextureLoader().load('./models/caodi.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(800, 800);
    groundTexture.anisotropy = 16;
    var groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture, side: THREE.DoubleSide });
    const planeGeometry = new THREE.PlaneGeometry(20000, 20000, 1, 1);
    planeMesh = new THREE.Mesh(planeGeometry, groundMaterial);
    planeMesh.name = "ground";
    planeMesh.receiveShadow = true;
    planeMesh.position.copy(groundBody.position);
    planeMesh.quaternion.copy(groundBody.quaternion);
    planeMesh.visible = true;
    group.add(planeMesh);
}

//创建球体
function createSphere(physicalMaterial, world) {
    var mass = 5, radius = 30;
    let sphereShape = new CANNON.Sphere(radius);
    var sphereBody = new CANNON.Body({
        mass: mass,
        material: physicalMaterial,
        shape: sphereShape,
        position: new CANNON.Vec3(-100, 132, 120),
    });
    world.addBody(sphereBody);

    var sphereBody2 = new CANNON.Body({
        mass: mass,
        material: physicalMaterial,
        shape: sphereShape,
        position: new CANNON.Vec3(-150, 32, 160),
    });
    world.addBody(sphereBody2);

    //创建threejs球体
    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var material = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        metalness: 0.3,
        roughness: 0.4,
        wireframe: false
    });
    var sphereMesh = new THREE.Mesh(geometry, material);
    sphereMesh.name = "球1"
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    sphereMesh.position.copy(sphereBody.position);
    group.add(sphereMesh);
    MeshBodyToUpdate.push({ mesh: sphereMesh, body: sphereBody });

    var material2 = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        metalness: 0.3,
        roughness: 0.4,
        wireframe: false
    });
    var sphere2Mesh = new THREE.Mesh(geometry, material2);
    sphere2Mesh.name = "球2"
    sphere2Mesh.castShadow = true;
    sphere2Mesh.receiveShadow = true;
    sphere2Mesh.position.copy(sphereBody2.position);
    group.add(sphere2Mesh);
    MeshBodyToUpdate.push({ mesh: sphere2Mesh, body: sphereBody2 });

    //创建立方体叠楼梯的效果
    for (var i = 0; i < 10; i++) {
        var BoxGeometry = new THREE.BoxGeometry(100, 10, 100);
        var box = new THREE.Mesh(BoxGeometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
        // box.position.set(180, i * 10, i * 20);
        box.name = "box";
        box.castShadow = true;
        box.receiveShadow = true;
        group.add(box);

        //将boxGeometry转换为cannon.js的形状
        var boxShape = new CANNON.Box(new CANNON.Vec3(50, 5, 50));
        //创建刚体
        var boxBody = new CANNON.Body({ mass: 0 });
        boxBody.addShape(boxShape);
        boxBody.position.set(180, i === 0 ? i * 10 + 5 : i * 10, i * 20);
        box.position.copy(boxBody.position);
        //将boxBody添加到世界中
        world.addBody(boxBody);
    }

    //创建围墙
    createWall(physicalMaterial);
}

//创建围墙
function createWall(physicalMaterial) {
    //创建物理墙面
    var wallShape = new CANNON.Box(new CANNON.Vec3(500, 150, 5));
    const wallBody = new CANNON.Body({
        mass: 0,
        material: physicalMaterial,
        shape: wallShape,
    });
    wallBody.position.set(500, 150, 0);
    wallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    world.addBody(wallBody);

    const wallBody2 = new CANNON.Body({
        mass: 0,
        material: physicalMaterial,
        shape: wallShape,
    });
    wallBody2.position.set(-500, 150, 0);
    wallBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    world.addBody(wallBody2);

    const wallBody3 = new CANNON.Body({
        mass: 0,
        material: physicalMaterial,
        shape: wallShape,
    });
    wallBody3.position.set(0, 150, 500);
    world.addBody(wallBody3);

    const wallBody4 = new CANNON.Body({
        mass: 0,
        material: physicalMaterial,
        shape: wallShape,
    });
    wallBody4.position.set(0, 150, -500);
    world.addBody(wallBody4);

    //创建4个threejs墙面
    var geometry = new THREE.BoxGeometry(1000, 300, 10);
    geometry.name = "wall";
    var boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.3, roughness: 0.4 });
    let wall = new THREE.Mesh(geometry, boxMaterial);
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.name = "wall";
    // 将物理刚体的位置和旋转信息同步到Three.js的Mesh上
    wall.position.copy(wallBody.position);
    wall.quaternion.copy(wallBody.quaternion);
    wall.visible = false;
    group.add(wall);

    let wall2 = new THREE.Mesh(geometry, boxMaterial);
    wall2.castShadow = true;
    wall2.receiveShadow = true;
    wall2.name = "wall";
    wall2.position.copy(wallBody2.position);
    wall2.quaternion.copy(wallBody2.quaternion);
    wall2.visible = false;
    group.add(wall2);

    let wall3 = new THREE.Mesh(geometry, boxMaterial);
    wall3.castShadow = true;
    wall3.receiveShadow = true;
    wall3.name = "wall";
    wall3.position.copy(wallBody3.position);
    wall3.quaternion.copy(wallBody3.quaternion);
    wall3.visible = false;
    group.add(wall3);

    let wall4 = new THREE.Mesh(geometry, boxMaterial);
    wall4.castShadow = true;
    wall4.receiveShadow = true;
    wall4.name = "wall";
    wall4.position.copy(wallBody4.position);
    wall4.quaternion.copy(wallBody4.quaternion);
    wall4.visible = false;
    group.add(wall4);

    // MeshBodyToUpdate.push({ mesh: wall, body: wallBody });
    // MeshBodyToUpdate.push({ mesh: wall2, body: wallBody2 });
    // MeshBodyToUpdate.push({ mesh: wall3, body: wallBody3 });
    // MeshBodyToUpdate.push({ mesh: wall4, body: wallBody4 });
}

//初始化cannon调试器
function initCannonDebugRenderer() {
    cannonDebugRenderer = new CannonDebugger(group, world);
}

//初始化摇杆
function initJoystick() {
    let options = {
        zone: document.getElementById('zone_joystick'),
        mode: 'static',
        position: { left: '60px', bottom: '110px' },
        color: 'white',
        size: 100,
        restOpacity: 1.0,
        opactiy: 1.0
    };

    var manager = nipplejs.create(options);
    manager.on('start', function (evt, nipple) {
        console.log("开始监听",evt);
        // evt.preventDefault();
        isMoveing = true;
        playerBody.allowSleep = false;
        //停止播放动画
        stopAllAction();
    });

    manager.on('move', function (evt, nipple) {
        // evt.preventDefault();
        // console.log("摇杆移动",nipple);
        isMoveing = true;
        playerBody.allowSleep = false;
        distance = nipple.distance;
        const vector = nipple.vector;
        let radian = nipple.angle.radian;
        const angle = radian - Math.PI / 2;
        const force = nipple.force;

        if (distance >= 40) {
            //如果distance大于40，就是在跑步
            // actions['Walk'].stop();
            // activeAction = actions['Run'];

            walkAction.stop();
            activeAction = runAction;
            activeAction.fadeIn(0.5);
            activeAction.setEffectiveTimeScale(1);
            activeAction.setEffectiveWeight(1);
            activeAction.play();

        } else {
            //如果distance小于40，就是在走路
            // actions['Run'].stop();
            // activeAction = actions['Walk'];

            runAction.stop();
            activeAction = walkAction;
            activeAction.fadeIn(0.5);
            activeAction.setEffectiveTimeScale(1);
            activeAction.setEffectiveWeight(1);
            activeAction.play();

        }

        check = (delta) => {
            delta *= 0.1;
            inputVelocity.set(0,0,0);
            inputVelocity.x = -vector.x * distance * 2.5;
            inputVelocity.z = vector.y * distance * 2.5;

            euler.x = followCamera.rotation.x;
            euler.y = rotationObject.rotation.y;
            euler.order = "XYZ";
            quat.setFromEuler(euler);
            inputVelocity.applyQuaternion(quat);
            playerBody.velocity.x = inputVelocity.x;
            playerBody.velocity.z = inputVelocity.z;

            // playerBody.velocity.set(
            //     -vector.x * distance * 2.5,
            //     playerBody.velocity.y,
            //     vector.y * distance * 2.5
            // );

            // 设置模型朝向
            // playerModel && (playerModel.rotation.y = angle);
            if(playerModel){
                // var quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), angle);
                var quaternion = quat.setFromAxisAngle(new THREE.Vector3(0,1,0), angle + rotationObject.rotation.y);
                playerModel.quaternion.copy(quaternion);
            }
        }
    });

    manager.on('end', function (evt, nipple) {
        // console.log("摇杆停止",nipple);
        playerBody.allowSleep = true;
        playerBody.velocity.set(0, 0, 0);
        isMoveing = false;
        stopAllAction();
        activeAction = idleAction;
		activeAction.play();

    });
}

function getForwardVector() {

    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();
    console.log("playerDirection:",playerDirection);
    return playerDirection;

}

//初始化帧率
function initStats() {
    stats = new Stats();
    container.appendChild(stats.dom);
}

//表情点击事件
function clickFace() {
    // cameraDiv.style.display = "none";
    // showPotoDiv.style.display = "none";
    $("#cameraDiv").hide();
    $("#showPoto").hide();
    $("#bgShowPoto").hide();
    /**
 * 点击表情按钮显示表情菜单圆盘
 */
    $("#biaoqing").click(function (event) {
        console.log("点击显示");
        if ($('#outerDiv').is(':hidden')) {
            $("#outerDiv").show();
        } else {
            $("#outerDiv").hide();
        }
    });
    /**
     * 圆形菜单点击事件
     */
    $(".outerDiv img").click(function (event) {
        console.log("点击了图片:", e.target.id);
        //获取点击播放的骨骼动作名称
        var actionName = $(this).attr("id");
        console.log("当前播放的动作名称:",actionName);

        fadeToAction(actionName, 0.2);
        mixer.addEventListener('finished', restoreState);

        // //停止所有动画
        // stopAllAction();
        // //淡入效果
        // actions[actionName].fadeIn(0.5);
        // //播放当前动画
        // actions[actionName].play();
        // //当前动画是否播放完毕
        // actions[actionName].setLoop(THREE.LoopOnce);
        // //动画播放完毕后执行
        // actions[actionName].clampWhenFinished = true;

        // mixer.addEventListener('finished', function () {
        //     console.log("动画播放完毕");
        //     //淡出效果
        //     actions[actionName].fadeOut(0.5);
        //     //停止所有动画
        //     stopAllAction();
        //     //重置动画
        //     actions[actionName].reset();
        //     //播放默认动画
        //     actions['_Idle'].play();
        // });
    });

    //点击camera按钮
    $("#camera").click(function (event) {
        console.log("点击了camera");
        $("#cameraDiv").show();
    });
    $("#item-one").click(function (event) {
        console.log("点击了item-one");
    });
    $("#item-two").click(function (event) {
        console.log("点击了item-two");
    });
    $("#item-three").click(function (event) {
        console.log("点击了item-three");
    });
    $("#item-four").click(function (event) {
        console.log("点击了item-four");
    });
    $("#item-five").click(function (event) {
        console.log("点击了item-five");
    });

    $("#closeBtn").click(function (event){
        console.log("关闭");
        $("#cameraDiv").hide();
    });

    $("#takePhoto").click(takePhoto);

    $(".saveDown").click(function (event){
        console.log("保存");
        $("#showPoto").hide();
        $("#bgShowPoto").hide();
    });
}

//拍照
function takePhoto() {
    console.log("拍照");

    var canvasDiv = document.getElementById("canvasDiv");
    var showImg = document.getElementById("showImg");
    var screenshotImg = document.getElementById("screenshotImg");
    var coverView = document.getElementById("coverView");

    console.log("canvasDiv:", canvasDiv.offsetLeft, canvasDiv.offsetTop,canvasDiv.clientHeight,canvasDiv.clientWidth);

    $("#bgShowPoto").show();
    $("#showPoto").show();
    $("#bgImg").hide();
    $("#screenshotImg").hide();

    var width = canvasDiv.offsetWidth;
    var height = canvasDiv.offsetHeight;
    var scale = 2;
    var opts = {
        scale: scale,
        width: width,
        height: height,
        useCORS: true,
        backgroundColor:null,
        x: canvasDiv.offsetLeft,
        y: canvasDiv.offsetTop,
    };

    layui.use(function () {
        $('#cameraDiv').hide();

        var layer = layui.layer;
        var index = layer.load(); 

        html2Canvas(document.body, opts).then(function (canvas) {
            var context = canvas.getContext('2d');
            context.mozImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.msImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;
            canvas.style.width = "300px";
            canvas.style.height = "300px";
            $("#bgImg").show();
            $("#screenshotImg").show();
            screenshotImg.appendChild(Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height));

            html2Canvas(showImg).then(function (canvas) {
                var context = canvas.getContext('2d');
                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;
                canvas.style.width = "300px";
                canvas.style.height = "300px";
                setTimeout(function () {
                    layer.close(index);
                    coverView.appendChild(Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height));
                    $("#bgImg").hide();
                    $("#screenshotImg").hide();
                }, 3000);
            });
        });
        // var util = layui.util;
        // util.on('lay-on', {
        //     'load': function () {
        //         console.log("load");
        //         var loadIndex = layer.load(0);
        //         html2Canvas(document.body, opts).then(function (canvas) {
        //             var context = canvas.getContext('2d');
        //             context.mozImageSmoothingEnabled = false;
        //             context.webkitImageSmoothingEnabled = false;
        //             context.msImageSmoothingEnabled = false;
        //             context.imageSmoothingEnabled = false;
        //             canvas.style.width = "300px";
        //             canvas.style.height = "300px";
        //             // showImg.appendChild(Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height))
        //             // $("#bgImg").show();
        //             // screenshotImg.appendChild(Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height));
        //             $("#bgImg").show();
        //             $("#screenshotImg").show();
        //             screenshotImg.appendChild(Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height));

        //             setTimeout(function () {
        //                 html2Canvas(showImg).then(function (canvas) {
        //                     var context = canvas.getContext('2d');
        //                     context.mozImageSmoothingEnabled = false;
        //                     context.webkitImageSmoothingEnabled = false;
        //                     context.msImageSmoothingEnabled = false;
        //                     context.imageSmoothingEnabled = false;
        //                     canvas.style.width = "300px";
        //                     canvas.style.height = "300px";
        //                     // 模拟关闭
        //                     setTimeout(function () {
        //                         $('#coverView').hide();
        //                         coverView.appendChild(Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height));
        //                         layer.close(loadIndex)
        //                     }, 2000);
        //                 });

        //             }, 1000);

        //             $('#cameraDiv').hide();
        //         });
        //     },
        // });
    });
    
}

/**
 * 点击跳跃按钮
*/
function clickJump() {
    let skill = document.querySelector("#jump");
    dop.$(skill.querySelector(".attack")).on("tap", function () {
        console.log("跳跃",canJump);
        if (canJump === true) {
            jump();
        }
    });
}

/**
 * 人物跳跃方法
*/
function jump() {
    //正在跳起中
    jumpimg = true;
    //人物跳起来的时候不在地面上
    isOnGround = false;

    playerBody.velocity.y = jumpVelocity;
    fadeToAction('jump', 0.5);
    mixer.addEventListener('finished',jumpFinished);

    function jumpFinished() {
        console.log("跳跃结束");
        //设置跳跃动作为false
        // jumpimg = false;
        restoreState();
    }
    // actions['jump'].play();
    // actions['jump'].loop = THREE.LoopOnce;
    // actions['jump'].clampWhenFinished = true;
    
    // mixer.addEventListener('finished', function (e) {
    //     if (e.action._clip.name === 'jump') {
            
    //         //延时0.5秒后执行
    //         // setTimeout(function () {
    //         // stopAllAction();
    //         //淡入淡出效果
    //         actions['jump'].fadeOut(0.5);
    //         //播放默认动画
    //         actions['_Idle'].play();
    //         actions['_Idle'].fadeIn(0.5);
    //         jumpimg = false;
    //         // }, 200);
    //     }
    // });
}

//停止所有动画
function stopAllAction() {
    for (let key in actions) {
        actions[key].stop();
    }
}

/**
 * 物体移动的射线检测
 * @param {*} target 模型
 * @param {*} targetBody 物理刚体
 * @param {*} deltaTime 时间间隔
*/
function checkMoveTarget(target, targetBody,deltaTime) {
    //获取target当前的位置，Y轴加一个固定量50，代表纵轴射线发射的位置
    var origin = target.position.clone().add(new THREE.Vector3(0, 0, 0));
    //获取target的朝向
    var direction = new THREE.Vector3(0, -1, 0);//定义一个向下的方向向量
    direction.normalize();//将向量规格化
    //定义一个射线
    var raycaster = new THREE.Raycaster(origin, direction);
    raycaster.camera = camera;
    //射线与物体相交的检测
    var intersects = raycaster.intersectObjects(group.children);
    // console.log("intersects:", intersects);
    if (intersects.length > 0) {

        //脱离楼梯或高台后的坠落速度
        let fallenSpeed = 100;
        let velocityY = targetBody.velocity.y;
        //获取相交的物体
        let {distance,object} = intersects[0];
        //获取相交的物体的名称
        var name = object.name;
        
        // console.log("distance:", Math.floor(distance), "name:", name);
        if (name === "ground" || name === "box" && Math.floor(distance) > 32) {
            // console.log("执行坠落动画");
            //不在地面上
            isOnGround = false;
            canJump = false;
            // playerBody.velocity.y -= 9.82 * Math.floor(distance) * deltaTime;
        } 
        if(name==="ground" || name === "box" && Math.floor(distance) <= 31) {
            // console.log("在地面上");
            //在地面上
            isOnGround = true;
            //如果距离小于30，则表示在地面上
            canJump = true;
        }
    }
}


  // 创建文字精灵
var getTextCanvas = function(text) {
    
    let option = {
        fontFamily: 'Arial',
        fontSize: 15,
        fontWeight: 'normal',
        color: '#ffffff',
        actualFontSize: 15,
    },canvas, context, textWidth, texture, materialObj, spriteObj;
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    context.scale(2, 2); // 缩放画布，提高清晰度
    // 先设置字体大小后获取文本宽度
    context.font = option.fontWeight + ' ' + option.fontSize + 'px ' + option.fontFamily;
    textWidth = context.measureText(text).width;
    canvas.width = textWidth;
    canvas.height = option.fontSize;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = option.color;
    context.fillText(text, textWidth / 2, option.fontSize / 2);
    context.font = option.fontWeight + ' ' + option.fontSize + 'px ' + option.fontFamily;
    texture = new THREE.CanvasTexture(canvas);
    materialObj = new THREE.SpriteMaterial({map: texture});
    spriteObj = new THREE.Sprite(materialObj);
    spriteObj.scale.set(textWidth / option.fontSize * option.actualFontSize, option.actualFontSize, option.actualFontSize);
    
    return spriteObj;
}

function drawText(textName) {
    //创建canvas
    var canvas = document.createElement('canvas');
    //设置canvas的宽高
    canvas.width = 512;
    canvas.height = 512;
    //获取canvas的上下文
    var ctx = canvas.getContext('2d');
    //设置字体
    ctx.font = 'bold 40px "微软雅黑"';
    //设置颜色
    ctx.fillStyle = '#fff';
    //设置水平对齐方式
    ctx.textAlign = 'center';
    //设置垂直对齐方式
    ctx.textBaseline = 'middle';
    //绘制文字（参数：要写的字，x坐标，y坐标）
    ctx.fillText(textName, 256, 256);

    ctx.strokeStyle = 'black';
    ctx.strokeText(textName, 256, 256);
    //创建纹理对象
    var texture = new THREE.CanvasTexture(canvas);

    var materialObj = new THREE.SpriteMaterial({map: texture});
    var spriteObj = new THREE.Sprite(materialObj);
    spriteObj.position.set(0,50,0);
    spriteObj.scale.set(30,30,1);
    return spriteObj;
}

/* 绘制圆角矩形 */
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}


//创建人物骨骼动画
function createAnimation(model, animations) {
    //创建动画
    mixer = new THREE.AnimationMixer(model);
    //所有的动画数组
    actions = {};
    for (var i = 0; i < animations.length; i++) {
        let clip = animations[i];
        let name = clip.name;
        const action = mixer.clipAction(clip);
        actions[name] = action;
        if (name == "Walk" || name == "_Idle" || name == "Run") {
            action.clampWhenFinished = false;
            action.loop = THREE.LoopRepeat;
        } else {
            if(name=="jump"){
                action.clampWhenFinished = true;
            }else{
                action.clampWhenFinished = false;
            }
            action.loop = THREE.LoopOnce;
        }
    }

    //默认播放站立的动画
    idleAction = actions['_Idle'];
    //走路动画
    walkAction = actions['Walk'];
    //跑动动画
    runAction = actions['Run'];

    //播放站立的状态
    activeAction = idleAction;
    activeAction.play();
}

///播放动画
function fadeToAction(name, duration) {
    previousAction = activeAction;
    activeAction = actions[name];

    if (previousAction !== activeAction) {
        previousAction.fadeOut(duration);
    }

    activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();
}

//移除动画播放完的监听
function restoreState() {
    mixer.removeEventListener('finished', restoreState);
    if(isMoveing){
        stopAllAction();
        if(distance > 40){
            activeAction = runAction;
            activeAction.play();
        }else{
            activeAction = walkAction;
            activeAction.play();
        }
    }else{
        fadeToAction('_Idle', 0.2);
    }
    jumpimg = false;
}

//创建物理世界射线检测
function feetRaycast(delta) {
    var delta = clock.getDelta();
    let body = playerBody;
    const start = new CANNON.Vec3(body.position.x, body.position.y, body.position.z);
    const end = new CANNON.Vec3(
        body.position.x,
        playerMesh.position.y - rayCastLength - raySafeOffset-10,
        body.position.z);
    const rayCastOptions = {
        collisionFilterMask: 1,
        skipBackfaces: true,
    }
    //在物理世界中找到与射线相交的第一个刚体
    rayHasHit = world.raycastClosest(start, end, rayCastOptions, rayResult);
    // console.log("rayHasHit:", rayHasHit);
    // console.log("rayResult:", rayResult.distance);

    if(rayHasHit){
        //如果在地面上就可以跳跃
        canJump = true;
        isOnGround = true;
        if(jumpimg == false){
            playerBody.velocity.y = -30;
        }
    }else{
        // console.log("如果不在地面上就不可以跳跃");
        canJump = false;
        isOnGround = false;
        if(jumpimg == false){
            playerBody.velocity.y -= 30 *5 * 100 * delta;
        }
        
    }
}


//更新渲染  
function renderUpdate() {
    //获取clock
    var delta = clock.getDelta();

    //更新动画
    if (mixer) {
        mixer.update(delta);
    }

    //更新物理世界
    world.step(fixedTimeStep, delta, 3);

    if (playerBody && playerMesh) {
        // console.log("playerBody:", playerBody.velocity.y);
        //物体发射射线检测
        checkMoveTarget(playerMesh, playerBody, delta);
        feetRaycast(delta);
        playerMesh.position.copy(playerBody.position);
        playerMesh.quaternion.copy(playerBody.quaternion);
        // updateCamera && updateCamera();
        if (isMoveing) {
            check && check(Date.now() - time);
        }
        
        // // 移动对象补偿
        // if (jumpimg) {
        //     // console.log("跳跃");
        //     playerBody.velocity.y = jumpVelocity;
        // } else {
        //     // console.log("人物坠落");
        //     if (isMoveing) {
        //         playerBody.velocity.y -= 9.82 * 100 * delta;
        //     } else {
        //         // console.log("停止移动");
        //         playerBody && playerBody.velocity.set(0, 0, 0);
        //     }
        // }

    }


    //更新threejs物体
    for (var i = 0; i < MeshBodyToUpdate.length; i++) {
        MeshBodyToUpdate[i].mesh.position.copy(MeshBodyToUpdate[i].body.position);
        MeshBodyToUpdate[i].mesh.quaternion.copy(MeshBodyToUpdate[i].body.quaternion);
    }
}

//更新window大小
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//初始化动画
function initAnimation() {

    requestAnimationFrame(initAnimation);

    renderUpdate();

    //更新性能插件
    stats && stats.update();

    //更新cannon调试器
    if (cannonDebugRenderer) {
        cannonDebugRenderer.update();
    }

    renderer.render(scene, camera);

    if (controls) {
        controls.update();
    }

}

