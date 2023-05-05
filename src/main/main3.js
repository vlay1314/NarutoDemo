//导入threejs
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import nipplejs from 'nipplejs';
import * as CANNON from "cannon-es";
import  './dop.min.js';
import { randnum } from '../js/Utils.js';
//导入八叉树
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import CannonDebugger from 'cannon-es-debugger';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import gsap from 'gsap';

var container, renderer, camera, camera2, scene, planeMesh, capsuleMesh, gui, light, stats, naruto, mixer, 
actions, controls, activateCamera=false, nameSprite, cannonDebugRenderer;
var joystick;
var clock = new THREE.Clock();
var dop = new Dop(); //个人兼容移动端操作的库
//八叉树变量
var octree, octreeHelper,playerCollider;
//玩家是否在地面
var playerOnFloor = false;
//物理世界变量
var sphereBody,sphereBody2,sphere,sphere2,cannonPlaneBody,tempBody,tempMesh;
//重力
var gravity = -9.8;
//设置玩家的速度
var playerVelocity = new THREE.Vector3(0,0,0);
//方向向量
var playerdirection = new THREE.Vector3(0,0,0);
//玩家柱状体
var playerBody;
//需要计算碰撞检测的组
var group;
//碰撞检测的盒子，把移动的模型加载到这个盒子中
var cubeBody;
// 当前位置
let position = new THREE.Vector3();
// 是否在移动
let isMoving = false;
let updateDrive;
var lastTime;
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
let cannon = {world: null};


draw();

function initRender() {
    if(dop.browserRedirect() === "pc"){
        renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
    }
    else{
        renderer = new THREE.WebGLRenderer({antialias: true});
    }
    renderer.setPixelRatio(2);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xeeeeee);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //告诉渲染器需要阴影效果
    // document.body.appendChild(renderer.domElement);
    container.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);
    camera.position.set(0, 300, -800);
    // camera.lookAt(new THREE.Vector3());

    camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);
    // camera2.rotation.order = 'YXZ';
    camera2.position.set(0, 300, -800);
    // camera2.lookAt(new THREE.Vector3());
}

function initScene() {
    container = document.getElementById('container');
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x00ffff);
    // scene.fog = new THREE.Fog(0x00ffff, 1000, 11000);
    scene.background = new THREE.Color(0x020924);
    scene.fog = new THREE.Fog(0x020924, 1000, 11000);
    //创建AXES辅助线
    var axes = new THREE.AxesHelper(1000);
    scene.add(axes);

    group = new THREE.Group();
    scene.add(group);
}
 
//初始化dat.GUI简化试验流程
function initGui() {
    //声明一个保存需求修改的相关数据的对象
    gui = {
        helper: true //模型辅助线
    };
    //datGui = new dat.GUI();
    //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）

    /*datGui.add(gui, "helper").onChange(function (e) {
        meshHelper.visible = e;
    });*/
}

function initLight() {
    scene.add(new THREE.AmbientLight(0x444444));

    light = new THREE.DirectionalLight(0xaaaaaa);
    light.position.set(0, 10000, 800);
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

// 创建一个平面
function initPlane() {
     //创建物理世界
     let world = new CANNON.World();
     world.gravity.set(0, -9.82, 0);
     world.broadphase = new CANNON.NaiveBroadphase();
     world.allowSleep = true;
     world.defaultContactMaterial.contactEquationStiffness = 1e9;
     world.defaultContactMaterial.contactEquationRelaxation = 4;

    const solver = new CANNON.GSSolver();
    solver.iterations = 7;
    solver.tolerance = 0.1;

    world.solver = new CANNON.SplitSolver(solver);

     cannon.world = world;
 
     cannonDebugRenderer = new CannonDebugger(group, world);
 
     //声明默认材质
     var cannonDefaultMaterial = new CANNON.Material("physics");
     cannonDefaultMaterial.friction = 0;//摩擦力
     cannonDefaultMaterial.restitution = 0.3;//弹性系数
 
     var cannonDefaultCantactMaterial = new CANNON.ContactMaterial(
        cannonDefaultMaterial , 
        cannonDefaultMaterial , 
        {
         friction: 0,//摩擦力
         restitution: 0.3,//弹性系数
        //  contactEquationStiffness: 1, //接触方程刚度
      }
     );
 
     //将两个材质添加到世界中
     world.addContactMaterial(cannonDefaultCantactMaterial);
    //  world.defaultContactMaterial = cannonDefaultCantactMaterial;
 
     //创建地面
     let cannonPlaneShape = new CANNON.Plane();
 
     //创建地板刚体的材质，默认材质
     let cannonPlaneMaterial = cannonDefaultMaterial;
 
     //创建地板的质量mass为0的静止物体
     let cannonPlaneMass = 0;
 
     //创建地板的刚体body的位置positoin,坐标原点
     let cannonPlanePosition = new CANNON.Vec3(0, 0, 0);
 
     //创建地板的刚体body
     cannonPlaneBody = new CANNON.Body({
         mass: cannonPlaneMass,
         material: cannonPlaneMaterial,
         shape: cannonPlaneShape,
         position: cannonPlanePosition
     });
 
     //设置地板的旋转角度
     cannonPlaneBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
 
     //将cannonPlaneBody添加到世界中
     world.addBody(cannonPlaneBody);
 
    //  创建球体
     var mass = 1, radius = 30;
     let sphereShape = new CANNON.Sphere(radius);
     sphereBody = new CANNON.Body({
         mass: mass, 
         material: cannonDefaultMaterial,
         shape: sphereShape,
         position: new CANNON.Vec3(-100, 32, 20)
     });
     world.addBody(sphereBody);
 
     //创建一个threejs球体
     var geometry = new THREE.SphereGeometry(radius, 32, 32);
     var material = new THREE.MeshStandardMaterial({ 
        color: 0x0000ff,
        metalness: 0.3,
        roughness: 0.4, 
        wireframe: false
    });
     sphere = new THREE.Mesh(geometry, material);
     sphere.castShadow = true;
     sphere.receiveShadow = true;
     sphere.position.copy(sphereBody.position);
     // scene.add(sphere);
     group.add(sphere);
     MeshBodyToUpdate.push({mesh: sphere,body: sphereBody});
 
     sphereBody2 = new CANNON.Body({
         mass: mass, 
         material: cannonDefaultMaterial,
         shape: sphereShape,
         position: new CANNON.Vec3(100, 32, 20)
     });
     world.addBody(sphereBody2);
     var material2 = new THREE.MeshStandardMaterial({ color: 0xff00ff, metalness: 0.3, roughness: 0.4, wireframe: false});
     sphere2 = new THREE.Mesh(geometry, material2);
     sphere2.castShadow = true;
     sphere2.receiveShadow = true;
     sphere2.position.copy(sphereBody2.position);
     // scene.add(sphere2);
     group.add(sphere2);
     MeshBodyToUpdate.push({mesh: sphere2,body: sphereBody2});
 
      //创建物理墙面
      var wallShape = new CANNON.Box(new CANNON.Vec3(500, 150, 5));
      const wallBody = new CANNON.Body({
          mass: 0,
          material: cannonDefaultMaterial,
          shape: wallShape,
      });
      wallBody.position.set(500, 0, 0);
      wallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI/2);
      world.addBody(wallBody);
  
      const wallBody2 = new CANNON.Body({
          mass: 0,
          material: cannonDefaultMaterial,
          shape: wallShape,
      });
      wallBody2.position.set(-500, 0, 0);
      wallBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI/2);
      world.addBody(wallBody2);
 
      const wallBody3 = new CANNON.Body({
          mass: 0,
          material: cannonDefaultMaterial,
          shape: wallShape,
      });
      wallBody3.position.set(0, 0, 500);
      world.addBody(wallBody3);
 
      const wallBody4 = new CANNON.Body({
          mass: 0,
          material: cannonDefaultMaterial,
          shape: wallShape,
      });
      wallBody4.position.set(0, 0, -500);
      world.addBody(wallBody4);
 
     //创建4个threejs墙面
     var geometry = new THREE.BoxGeometry(1000, 300, 10);
     // geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 100, 0));
     var boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness:0.3, roughness:0.4 });
     let wall = new THREE.Mesh(geometry, boxMaterial);
     wall.castShadow = true;
     wall.receiveShadow = true;
     // 将物理刚体的位置和旋转信息同步到Three.js的Mesh上
     wall.position.copy(wallBody.position);
     wall.quaternion.copy(wallBody.quaternion);
    //  wall.rotation.y = Math.PI/2;
     wall.visible = true;
    //  scene.add(wall);
 
     let wall2 = new THREE.Mesh(geometry, boxMaterial);
     wall2.castShadow = true;
     wall2.receiveShadow = true;
     wall2.position.copy(wallBody2.position);
     wall2.quaternion.copy(wallBody2.quaternion);
     wall2.visible = true;
    //  scene.add(wall2);
 
     let wall3 = new THREE.Mesh(geometry, boxMaterial);
     wall3.castShadow = true;
     wall3.receiveShadow = true;
     wall3.position.copy(wallBody3.position);
     wall3.quaternion.copy(wallBody3.quaternion);
     wall3.visible = true;
    //  scene.add(wall3);
 
     let wall4 = new THREE.Mesh(geometry, boxMaterial);
     wall4.castShadow = true;
     wall4.receiveShadow = true;
     wall4.position.copy(wallBody4.position);
     wall4.quaternion.copy(wallBody4.quaternion);
     wall4.visible = true;
    //  scene.add(wall4);
     group.add(sphere);
     group.add(sphere2);
     group.add(wall);
     group.add(wall2);
     group.add(wall3);
     group.add(wall4);

    MeshBodyToUpdate.push({ mesh: wall, body: wallBody });
    MeshBodyToUpdate.push({ mesh: wall2, body: wallBody2 });
    MeshBodyToUpdate.push({ mesh: wall3, body: wallBody3 });
    MeshBodyToUpdate.push({ mesh: wall4, body: wallBody4 });

    // 创建物理材质
    //    const physicsMaterial = new CANNON.Material("physics");
    //    const physics_physics = new CANNON.ContactMaterial(
    //        physicsMaterial,
    //        physicsMaterial,
    //        {
    //            // 当摩擦力为0时，物体不会滑动
    //            friction: 0,
    //            // 弹性系数
    //            restitution: 0.3,
    //        }
    //    );
    //    // 将物理材质添加到世界中
    //    cannon.world.addContactMaterial(physics_physics);

    // 创建一个球体
    // const radius = 30;
    const sphereShape2 = new CANNON.Sphere(radius);
    tempBody = new CANNON.Body({
           mass: 1,
           material: cannonDefaultMaterial,
           collisionResponse: true,
    });
    tempBody.addShape(sphereShape2);
    tempBody.linearDamping = 0.9;
    // tempBody.angularDamping = 0.1;
    // tempBody.fixedRotation = true;
    tempBody.position.set(50, 32, 200);
    // tempBody.velocity.set(0, 0, 0);
    world.addBody(tempBody);

    // 创建threejs的球体
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        wireframe: true,
    });
    tempMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(tempMesh);

    //设置相机看向的目标
    camera.lookAt(tempMesh.position);
    camera2.lookAt(tempMesh.position);

    // MeshBodyToUpdate.push({ mesh: tempMesh, body: tempBody });

    //监听cubeBody的碰撞事件
    tempBody.addEventListener("collide", function (e) {
        var relativeVelocity = e.contact.getImpactVelocityAlongNormal(group);
        if (Math.abs(relativeVelocity) > 10) {
            // More energy 
            // console.log("碰撞到的物体 > 10", e);
        } else {
            // Less energy 
            // console.log("碰撞到的物体 < 10", e);
        }
    });


     // 地板
     var groundTexture = new THREE.TextureLoader().load('./models/caodi.jpg');
     groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
     groundTexture.repeat.set(800, 800);
     groundTexture.anisotropy = 16;
     var groundMaterial = new THREE.MeshBasicMaterial({map: groundTexture, side: THREE.DoubleSide});
    const planeGeometry = new THREE.PlaneGeometry(20000, 20000, 1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
    });
     planeMesh = new THREE.Mesh(planeGeometry, groundMaterial);
     // planeMesh.rotation.x = -Math.PI / 2;
     planeMesh.receiveShadow = true;
     // planeMesh.position.set(0, 0,0);
     planeMesh.position.copy(cannonPlaneBody.position);
    //  planeMesh.position.y = 0;
     planeMesh.quaternion.copy(cannonPlaneBody.quaternion);
     planeMesh.visible = true;
    //  scene.add(planeMesh);
     group.add(planeMesh);

     //创建立方体叠楼梯的效果
    for (var i = 0; i < 10; i++) {
        var box = new THREE.Mesh(new THREE.BoxGeometry(100, 10, 100), new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));
        box.position.set(180, i * 10, i * 20);
        box.castShadow = true;
        box.receiveShadow = true;
        group.add(box);
        
        //将boxGeometry转换为cannon.js的形状
        var boxShape = new CANNON.Box(new CANNON.Vec3(50, 5, 50));
        //创建刚体
        var boxBody = new CANNON.Body({ mass: 0 });
        boxBody.addShape(boxShape);
        boxBody.position.set(180, i * 10, i * 20);
        //将boxBody添加到世界中
        world.addBody(boxBody);
    }

    //  //创建一个胶囊体
    //  const capsuleGeometry = new THREE.CapsuleGeometry(30, 100, 64);
    //  const capsuleMaterial = new THREE.MeshBasicMaterial({ color: 0x0ffff0, side: THREE.DoubleSide,transparent: true, opacity: 0.5 });
    //  capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
    //  capsuleMesh.position.set(0, 88, 0);

    //  if(naruto){
    //      capsuleMesh.add(naruto);
    //  }

    //  group.add(capsuleMesh);
 
    //  //创建一个八叉树
    //  octree = new Octree();
    //  //将胶囊体添加到八叉树中
    //  octree.fromGraphNode(group);
 
    //  //创建一个八叉树辅助线
    //  octreeHelper = new OctreeHelper(octree, 0xff0);
    //  octreeHelper.visible = false;
    //  scene.add(octreeHelper);

    // //创建一个胶囊体碰撞体
    // playerCollider = new Capsule(
    //     new THREE.Vector3(0, 0, 0), 
    //     new THREE.Vector3(0, 100, 0), 
    //     30
    // );
    // console.log("playerCollider",playerCollider.getCenter(new THREE.Vector3()));
    
}

function updatePlayer(deltaTime){
    let damping = -0.05;
    //如果人物在地面上
    if(playerOnFloor){
        playerVelocity.y = 0;
        state.move ||
        playerVelocity.addScaledVector(playerVelocity,damping);
    }else{
        playerVelocity.y += gravity * deltaTime;
    }
    //计算移动的距离
    const playerMoveDistance = playerVelocity.clone().multiplyScalar(deltaTime);
    playerCollider.translate(playerMoveDistance);
    //更新胶囊体的位置
    playerCollider.getCenter(capsuleMesh.position);

    //进行碰撞检测
    playerCollisions();
}
// 人物碰撞检测
function playerCollisions() {
    // 人物碰撞检测
    const result = octree.capsuleIntersect(playerCollider);
    // console.log("碰撞检测",result);
    playerOnFloor = false;
    if (result) {
        console.log("碰撞检测到的物体",result);
      playerOnFloor = result.normal.y > 0;
      playerCollider.translate(result.normal.multiplyScalar(result.depth));
    //   capsuleMesh.translateZ(-0.1);
    }
}


function initModel() {

    const loaderManager = new THREE.LoadingManager(
        () => {
          //Loaded
          console.log("Everything Loaded")
          gsap.to(".loader", {
            delay: 1,
            duration: 2,
            translateY: "-100%",
            ease: "ease-in-out",
            pointerEvents: "none",
          })
        },
        (x,y,z) => { 
          //Progress
          document.querySelector(".loader span").textContent = `${Math.floor(y/z*100)}% Loading...`;
          gsap.to(".loading-bar", {
            scaleY: y/z
          })
        }
      );
    //加载模型
    var loader = new FBXLoader(loaderManager);
    loader.load("./models/Naruto.fbx", function (mesh) {

        console.log("模型", mesh);

        //设置模型的每个部位都可以投影
        mesh.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        //创建动画
        mixer = mesh.mixer = new THREE.AnimationMixer(mesh);
        const animations = mesh.animations;

        actions = {}; //所有的动画数组

        for (var i = 0; i < animations.length; i++) {
            let clip = animations[i];
            let name = clip.name;
            const action = mixer.clipAction(clip);
            actions[name] = action;
        }
        // console.log(actions);

        actions['_Idle'].play();
       
        // mesh.position.y = 110;

        //设置光线焦点模型
        light.target = mesh;
       
        //设置模型的位置
        mesh.position.set(0, 110, 0);
        // scene.add(mesh);
        // group.add(mesh);

        naruto = mesh;

        //创建一个圆柱体
        // var cylinderGeometry = new THREE.CylinderGeometry(54, 54, 180, 32);
        // var cylinderMaterial = new THREE.MeshBasicMaterial({
        //     color: 0xffffff,
        //     wireframe: false,
        //     transparent: true,
        //     opacity: 0.5
        // });
        // playerBody = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        // // playerBody.position.set(0, 92, 0);
        // // scene.add( cylinder );
        // // playerBody.add(naruto);
        // group.add(playerBody);

        //把相机添加到圆柱体上
        // playerBody.add(camera);
        // camera.lookAt(playerBody.position);
        // camera2.lookAt(playerBody.position);

        // //创建一个圆柱刚体默认材质
        // var cylinderBodyMaterial = new CANNON.Material("defaultMaterial");
        // cubeBody = new CANNON.Body({
        //     mass: 5,
        //     friction: 1.0,
        //     restitution: 0.7,
        //     material: cylinderBodyMaterial,
        //     shape: new CANNON.Cylinder(54, 54, 180, 32)
        // });
        // //添加阻尼，防止物体一直旋转
        // cubeBody.angularDamping = 1;
        // // cubeBody.linearDamping = 0.9;
        // cubeBody.position.set(0, 90, 0);
        // playerBody.position.copy(cubeBody.position);
        // cannon.world.addBody(cubeBody);
        // MeshBodyToUpdate.push({ mesh: playerBody, body: cubeBody });


        // //创建一个刚体默认材质
        // var cubeBodyMaterial = new CANNON.Material("defaultMaterial");
        // cubeBody = new CANNON.Body({
        //     mass: 0.1,
        //     material: cubeBodyMaterial,
        //     shape: threeToCannon(playerBody, { type: ShapeType.CYLINDER }).shape,
        //     // velocity: new CANNON.Vec3(0, 0, 0),
        //     position: new CANNON.Vec3(100, 0, 150)
        // });
        //  //添加阻尼，防止物体一直旋转
        //  cubeBody.angularDamping = 1;
        //  cannon.world.addBody(cubeBody);

        // //设置playerBody的位置为刚体cubeBody的位置
        // playerBody.position.copy(cubeBody.position);

        //监听cubeBody的碰撞事件
        // cubeBody.addEventListener("collide", function (e) {

        //     var relativeVelocity = e.contact.getImpactVelocityAlongNormal(group);
        //     if (Math.abs(relativeVelocity) > 10) {
        //         // More energy 
        //         console.log("碰撞到的物体 > 10", e);
        //     } else {
        //         // Less energy 
        //         console.log("碰撞到的物体 < 10", e);
        //     }
        // });

        // MeshBodyToUpdate.push({ mesh: playerBody, body: cubeBody });

        //创建头顶的文字精灵图
        // createSprite(100, 50, '鸣人', 35, 35, naruto.position);
        // createSprite(100, 50, '鸣人', 35, 35, playerBody.position);

        /**
         * 点击表情按钮显示表情菜单圆盘
         */
        $("#biaoqing").click(function () {
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
        $(".outerDiv img").click(function (e) { 
            e.preventDefault();
            console.log("点击了图片",e.target.id);
            var v_id2 = $(this).attr("id");
            console.log(v_id2);
            //停止所有动画
            stopAllAction();
            //淡入效果
            actions[v_id2].fadeIn(0.5);
            //播放当前动画
            actions[v_id2].play();
            //当前动画是否播放完毕
            actions[v_id2].setLoop(THREE.LoopOnce);
            //动画播放完毕后执行
            actions[v_id2].clampWhenFinished = true;
        
            mixer.addEventListener('finished',function () {
                console.log("动画播放完毕");
                //淡出效果
                 actions[v_id2].fadeOut(0.5);
                //停止所有动画
                stopAllAction();
                //重置动画
                actions[v_id2].reset();
                //播放默认动画
                actions['_Idle'].play();
            });
        });

    });
}


//停止所有动画
function stopAllAction() {
    for (let key in actions) {
        actions[key].stop();
    }
}


// 创建星空背景
function initSky() {

    const positions = [];
    const colors = [];
    var sparkGeometry = new THREE.BufferGeometry();
    for (var i = 0; i < 10000; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 5.5 - 1;
        vertex.y = Math.random() + 0.1;
        vertex.z = Math.random() * 5.5 - 1;
        // console.log("vertex.y",vertex.y);
        positions.push(vertex.x, vertex.y, vertex.z);
        //随机生成颜色
        var color = new THREE.Color();
        color.setHSL(Math.random()*0.2 + 0.5, 0.55, 0.55 + Math.random()*0.25);
        colors.push(color.r, color.g, color.b);
    }
    sparkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    sparkGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
     //创建纹理加载器
     var loader = new THREE.TextureLoader();
     //加载纹理贴图
     var texture = loader.load('models/snowflake.png');
        //创建粒子材质
        
    var sparkMaterial = new THREE.PointsMaterial({
        map: texture,
        size: 20,
        transparent: true,
        opacity: 1,
        vertexColors: true, 
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        side: THREE.DoubleSide
    });
    //创建粒子系统
    var spark = new THREE.Points(sparkGeometry, sparkMaterial);
    spark.scale.set(3000, 3000, 3000);
    scene.add(spark);
}

//创建控制器
function initControls() {
    controls = new OrbitControls(camera2, renderer.domElement);
    if(naruto){
        controls.target.set(camera2.position.x, camera2.position.y + 100, camera2.position.z + 1.0);
        controls.update();
    }
    controls.addEventListener('change', function(){
        console.log("change-camera",controls.enabled);

        if(controls.enabled){
            activateCamera = true;
        }else{
            activateCamera = false;
        }
    });
}

//初始化性能插件
function initStats() {
    stats = new Stats();
    // document.body.appendChild(stats.dom);
    container.appendChild(stats.dom);
}

//当前人物状态的对象存储
let state = {
    move:false, //当前人物是否处于移动状态
    skills:0, //当前人物是否处于攻击或者释放技能状态 0：不处于攻击状态 >0:正处于释放某种技能的状态
}

// 创建niipplejs的虚拟摇杆
function initNipple() {
    let options = {
        zone: document.getElementById('zone_joystick'),
        mode: 'static',
        position: {left: '10%', top: '80%'},
        color: 'white',
        size: 100,
        restOpacity: 0.5,
        opactiy:1.0
    };
    manager = nipplejs.create(options);

    manager.on('start', function (evt, nipple) {
        // console.log("start",nipple);
        state.move = true;
        stopAllAction();

    }).on('move', function (evt, nipple) {
        console.log("move", nipple);
        if(nipple.distance >= 40){
            actions['Walk'].stop();
            actions['Run'].play();
            actions['Run'].loop = THREE.LoopRepeat;
        }else{
            actions['Run'].stop();
            actions['Walk'].play();
            actions['Walk'].loop = THREE.LoopRepeat;
        }

        if(naruto){
            naruto.rotation.y = nipple.angle.radian - Math.PI/2;
        }

       characterMove(nipple.vector, nipple.distance/50);

    }).on('end', function (evt, nipple) {
        // console.log("end",nipple);
        state.move = false;
        characterMove(new THREE.Vector2(), 0);
        stopAllAction();
        actions['_Idle'].play();
        actions['_Idle'].loop = THREE.LoopRepeat;
    });
}


//添加用户按钮技能操作事件
function addSkills() {
    let skill = document.querySelector("#skills");
    //普通攻击事件
    let attackList = ["Air Attack 02", "Air Attack 03", "Kick 01", "Kick 02", "Kick 03"]; //连招的循序
    let attackCombo = false; //是否连招，接下一个攻击
    let attackInterval; //当前攻击的定时器
    dop.$(skill.querySelector(".attack")).on("tap", function () {
        // actions['Jump spin'].play();
        stopAllAction();
        actions['jump'].play();
        actions['jump'].loop = THREE.LoopOnce;
        // naruto.position.y = 150;
        cubeBody.velocity.y = 250;
        mixer.addEventListener('finished', function (e) {
            // console.log("ddddd",e.action._clip.name);
            if (e.action._clip.name === 'jump') {
                // naruto.position.y = 110;
                cubeBody.velocity.y = 0;
                stopAllAction();
                actions['_Idle'].play();
            }
        });
       
    });
}

//添加用户按钮移动操作事件
function addStick() {
    let control = document.querySelector("#joystick");
    let barWrap = control.querySelector(".bar-wrap");
    let bar = control.querySelector(".bar");
    let dop = new Dop();
    let media = dop.browserRedirect();
    let center = new THREE.Vector2(); //操作杆的中心
    let mouse = new THREE.Vector2(); //鼠标按下的位置
    let doc = dop.$(control);

    dop.$(control).on("down", function (event) {
        console.log("按下摇杆移动键",event);
        event.preventDefault();
        isMoving = true;
        activateCamera = false;
        // console.log("按下移动键",isActivate);
       
        //获取当前的按钮中心点
        center.x = window.innerWidth - parseFloat(dop.getFinalStyle(control, "right")) - parseFloat(dop.getFinalStyle(control, "width")) / 2;
        center.y = window.innerHeight - parseFloat(dop.getFinalStyle(control, "bottom")) - parseFloat(dop.getFinalStyle(control, "height")) / 2;

        getRadian(event);
        
        //鼠标按下切换跑步动作
        actions['_Idle'].weight = 1;
        actions['_Idle'].fadeIn(0.5);
        actions['_Idle'].stop();
        if(state.skills === 0 ){
            actions['Walk'].weight = 1;
            actions['Walk'].fadeIn(0.5);
            actions['Walk'].play();
        }

        //给document绑定拖拽和鼠标抬起事件
        doc.on("move", move);
        doc.on("up", up);
    });

    function move(event) {
        
        getRadian(event);
    }

    function up() {
        console.log("up");
        isMoving = false;
        doc.remove("move", move);
        doc.remove("up", up);

        //按钮复原
        bar.style.marginTop = 0;
        barWrap.style.transform = `translate(-50%, -50%) rotate(0deg)`;
        bar.style.transform = `translate(-50%, -50%) rotate(0deg)`;

        //设置移动距离为零
        characterMove(new THREE.Vector2(), 0);

        //鼠标抬起切换站立状态
        stopAllAction()
        if(state.skills === 0){
            actions['_Idle'].weight = 1;
            actions['_Idle'].fadeIn(0.5);
            actions['_Idle'].play();
        }
    }

    //获取到两点间的距离，偏转的位置
    function getRadian(event) {

        //获取到当前按下的位置
        if (media === "pc") {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        }
        else {
            mouse.x = event.touches[0].clientX;
            mouse.y = event.touches[0].clientY;
        }
        // console.log("mouse", mouse);
        let distance = center.distanceTo(mouse);
        distance >= parseFloat(dop.getFinalStyle(control, "width")) / 2 && (distance = parseFloat(dop.getFinalStyle(control, "width")) / 2);
        if(distance>50){
            actions['Walk'].stop();
            actions['Run'].play();
        }else{
            actions['Run'].stop();
            actions['Walk'].play();
        }
        //计算两点之间的夹角
        mouse.x = mouse.x - center.x;
        mouse.y = mouse.y - center.y;

        //修改操作杆的css样式
        bar.style.marginTop = `-${distance}px`;
        bar.style.transform = `translate(-50%, -50%) rotate(-${(mouse.angle() / Math.PI * 180 + 90) % 360}deg)`;
        barWrap.style.transform = `translate(-50%, -50%) rotate(${(mouse.angle() / Math.PI * 180 + 90) % 360}deg)`;

        //修改当前模型的朝向
        // console.log("angle",mouse.angle);
        // console.log("模型朝向",- mouse.angle() - Math.PI/2);
        if(naruto || playerBody){
            var angle = - mouse.angle() - Math.PI/2;
            // naruto.rotation.y = angle;
            // playerBody.rotation.y = angle;
            // cubeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), angle);
            // capsuleMesh.rotation.y = - mouse.angle() - Math.PI/2;
        }
        // console.log("distance",distance);
        // console.log("width",parseFloat(dop.getFinalStyle(control, "width")) / 2);
        // console.log("ratio",distance / (parseFloat(dop.getFinalStyle(control, "width")) / 2));
        //修改当前的移动方向和移动速度
        characterMove(mouse.normalize(), distance / (parseFloat(dop.getFinalStyle(control, "width")) / 2));
    }
}

// //角色移动的方法
// let direction = new THREE.Matrix4(); //当前移动的旋转矩阵
// let move = new THREE.Vector3(); //当前位置移动的距离
// function characterMove(vector, ratio) {
//     // console.log("vector::",vector,"ratio::",ratio);
//     //重置矩阵
//     direction.identity();

//     //通过相机的四元数获取到相机的旋转矩阵
//     let quaternion = camera.quaternion;
//     direction.makeRotationFromQuaternion(quaternion);

//     //获取到操作杆的移动方向
//     move.x = vector.x;
//     move.y = 0;
//     move.z = vector.y;

//     //通过相机方向和操作杆获得最终角色的移动方向
//     move.applyMatrix4(direction);
//     move.normalize();

//     move.x = move.x * ratio * 5;
//     move.z = move.z * ratio * 5;
// }

var direction = new THREE.Vector3();
var moveDirection = new THREE.Vector3();
var shootVelo = 4;
//角色移动的方法
function characterMove(vector, ratio){
    // console.log("ratio:",ratio *5);
    // console.log("vector:",vector);
    //获取相机的方向向量
    camera.getWorldDirection(direction);
    //将相机的方向向量转换为世界空间中的向量
    direction.applyQuaternion(camera.quaternion);
    //获取到操作杆的移动方向
    moveDirection.x = vector.x;
    moveDirection.y = 0;
    moveDirection.z = vector.y;
    //计算人物模型的移动向量
    moveDirection.multiplyScalar(ratio * 5);
    //将移动向量转换为世界空间中的向量
    moveDirection.applyQuaternion(camera.quaternion);
}

 updateDrive = (forward = moveDirection) => {
    // console.log("forward:",forward);
    if(isMoving){
        tempBody.velocity.x += forward.x;
        tempBody.velocity.z += forward.z;
        console.log("velocity222",tempBody.velocity);
        // tempBody.velocity.x = tempBody.position.x + tempBody.velocity.x * 0.016;
        // tempBody.velocity.z = tempBody.position.z + tempBody.velocity.z * 0.016;
    }

}

//窗口变动触发的函数
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 添加鼠标监听
function addMouse() {
    // //鼠标按下
    // document.body.addEventListener('mousedown', (event) => {
    //     console.log("鼠标按下",event);
    //     activateCamera = true;
    //     document.body.requestPointerLock();
    // });
    // //鼠标抬起
    // document.body.addEventListener('mouseup', (event) => {
    //     console.log("鼠标抬起",event);
    //     activateCamera = false;
    //     document.exitPointerLock();
    // });
    // //鼠标移动
    // document.body.addEventListener( 'mousemove', ( event ) => {
    //     console.log("鼠标监听",event);
    //     if(event.target.id === "joystick"){
    //         return;
    //     }
    //     if ( document.pointerLockElement === document.body ) {
    //         activateCamera = true;
    //         console.log("改变相机位置camera2");
    //         camera2.rotation.y -= event.movementX / 500;
    //         camera2.rotation.x -= event.movementY / 500;
    //     }else{
    //         activateCamera = false;
    //     }
    // } );

    //监听移动端的触摸事件
    document.body.addEventListener('touchstart', (event) => {
        event.preventDefault();
        console.log("触摸事件开始",event.touches[0].clientX,event.touches[0].clientY);
        toucheMovementX = event.touches[0].clientX;
        toucheMovementY = event.touches[0].clientY;
        activateCamera = true;
        document.body.requestPointerLock();
    });
    document.body.addEventListener('touchend', (event) => {
        event.preventDefault();
        console.log("触摸事件结束",event);
        activateCamera = false;
        document.exitPointerLock();
    });
    //监听移动端的触摸移动事件
    document.body.addEventListener('touchmove', (event) => {
        // event.preventDefault();
        console.log("触摸事件移动",event.touches[0].clientX,event.touches[0].clientY);
      
    });

}

/**
 * 制作区域标签 使用精灵图
*/
function createSprite(wid, hgt, textword, ww, wh, cvsPosition){
    console.log("创建精灵文字");
      //用canvas生成图片
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      canvas.width = wid //100
      canvas.height = hgt //50
      //制作矩形
    //   ctx.fillStyle = "rgba(140, 141, 142,0.8)";
    //   ctx.fillRect(0, 0, 100, 50)
      //设置文字
      ctx.fillStyle = "#fff";
      ctx.font = 'normal 20px "宋体"'
      //文字换行
      ctx.fillText(textword, ww, wh)
      //生成图片
      let url = canvas.toDataURL('image/png');
      var spriteMaterial = new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load(url), //设置精灵纹理贴图
      transparent: true, //开启透明(纹理图片png有透明信息)
      });
      // 创建精灵模型对象，不需要几何体geometry参数
      nameSprite = new THREE.Sprite(spriteMaterial);
      nameSprite.scale.set(100, 30, 0); //精灵图大小
      nameSprite.translateY(0);
      nameSprite.position.set(cvsPosition.x, cvsPosition.y + 340 , 0);
      scene.add(nameSprite);
}


function render() {
    var time = clock.getDelta();
    if (mixer) {
        mixer.update(time);
    }
    
    //施加外力作用改变物体的运动方向
    // sphereBody.applyForce(new CANNON.Vec3(-10.0, 0, 0), sphereBody.position);
    // sphereBody2.applyForce(new CANNON.Vec3(0, 0, 10.0), sphereBody2.position);
    // tempBody.applyForce(new CANNON.Vec3(-100, 0, 0), tempBody.position);
    updateDrive && updateDrive();
    tempMesh.position.copy(tempBody.position);
    let now = Date.now();
    lastTime === undefined && (lastTime = now);
    let dt = (Date.now() - lastTime) / 1000.0;
    lastTime = now;
    cannon.world.step(fixedTimeStep,dt);

    //如果模型添加成功，则每帧都移动角色位置
    if (naruto || playerBody) {
        //获取当前位置
        position.x += moveDirection.x;
        position.z += moveDirection.z;

        //修改模型位置
        // naruto.position.x = position.x;
        // naruto.position.z = position.z;

        // playerBody.position.x = position.x;
        // playerBody.position.z = position.z;

        // cubeBody.position.x = position.x;
        // cubeBody.position.z = position.z;

        // tempBody.position.x = position.x;
        // tempBody.position.z = position.z;
        // tempMesh.position.copy(tempBody.position);
        // tempBody.velocity.y -= 9.8 * 100.0 * dt;
        // tempBody.velocity.y = 0;
        camera.position.x = tempMesh.position.x;
        camera.position.y = tempMesh.position.y + 300;
        camera.position.z = tempMesh.position.z - 800;

        //修改名字精灵图的位置
        // nameSprite.position.set(naruto.position.x, naruto.position.y+60, naruto.position.z);
        // nameSprite.position.set(playerBody.position.x, playerBody.position.y+60, playerBody.position.z);

        //修改平衡光的位置
        light.position.x = position.x;
        light.position.z = position.z + 100;
    }
    

    for (const object of MeshBodyToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
    }
}

function animate() {
    //更新控制器
    render();

    //更新性能插件
    stats.update();

    cannonDebugRenderer.update();

    // console.log("isActivate",isActivate);
    if(activateCamera){
        renderer.render(scene, camera2);
    }else{
        renderer.render(scene, camera);
    }
    if(controls){
        controls.update();
    }

    // renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function draw() {
    // initGui();
    initScene();
    initRender();
    initCamera();
    initLight();
    initSky();
    initStats();
    // initNipple();
    
    initPlane();
    initModel();
    addSkills();
    addStick();
    //添加鼠标监听
    // addMouse();
    initControls();
    animate();
    window.onresize = onWindowResize;
}