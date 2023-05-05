import gsap from 'gsap'

export default class Camera {
    constructor(scene, world, playerModel, camera){
        this.scene = scene;
        this.world = world;
        this.playerModel = playerModel;
        this.camera = camera;

        //相机位置
        this.cameraOffset = {
            x: 0,
            y: 200,
            z: -300
        }
        //相机旋转
        this.cameraRotation = {
            x: 0,
            y: 0,
        }
        //上一次相机旋转
        this.lastCameraRotation = {
            x: 0,
            y:-0.5
        }
        //鼠标位置
        this.mouse = {
            x: 0,
            y: 0,
            _start_x:0,
            _start_y:0,
        }
        //是否按下鼠标
        this.isMouseDown = false;
        //初始化
        this.init();
    }
    init(){
        this.updateCamera();
        const clientMove = (e) => {
            this.mouse.x = e.clientX || e.changedTouches[0].clientX;
            this.mouse.y = e.clientY || e.changedTouches[0].clientY;
            if(this.isMouseDown){
                this.cameraRotation.x = this.lastCameraRotation.x - ((this.mouse.x - this.mouse._start_x) /window.innerWidth);
                this.cameraOffset.x = Math.sin(this.cameraRotation.x) * 36;
                this.cameraOffset.z = Math.cos(this.cameraRotation.x) *36;

                this.cameraRotation.y = this.lastCameraRotation.y - ((this.mouse.y - this.mouse._start_y) /window.innerHeight);
                if(this.cameraRotation.y > -1 && this.cameraRotation.y < 0){
                    this.cameraOffset.y = -Math.sin(this.cameraRotation.y) * 36;
                }else{
                    if(this.cameraRotation.y < -1) this.cameraRotation.y = -1;
                    if(this.cameraRotation.y > 0) this.cameraRotation.y = 0;
                }
            }else{
                this.lastCameraRotation.x = this.cameraRotation.x;
                this.lastCameraRotation.y = this.cameraRotation.y;
            }
        }
        //鼠标事件
        window.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.mouse._start_x = e.clientX;
            this.mouse._start_y = e.clientY;
            clientMove(e);
        });
        //触摸事件
        window.addEventListener('touchstart', (e) => {
            this.isMouseDown = true;
            this.mouse._start_x = e.touches[0].clientX;
            this.mouse._start_y = e.touches[0].clientY;
            clientMove(e);
        });

        //鼠标松开
        window.addEventListener('mouseup', (e) => {
            this.isMouseDown = false;
            clientMove(e);
        });
        //触摸松开
        window.addEventListener('touchend', (e) => {
            this.isMouseDown = false;
            clientMove(e);
        });
        //鼠标移动
        window.addEventListener('mousemove', (e) => {
            clientMove(e);
        });
        //触摸移动
        window.addEventListener('touchmove', (e) => {
            clientMove(e);
        });
    }

    updateCamera(){
        const update = () => {
            if(this.playerModel.position){
                //更改相机位置动画
                gsap.to(this.camera.position, {
                    duration: 1,
                    x: this.playerModel.position.x + this.cameraOffset.x,
                    y: this.playerModel.position.y + this.cameraOffset.y,
                    z: this.playerModel.position.z + this.cameraOffset.z,
                })
                this.camera.lookAt(this.playerModel.position);
            }
        }
        this.world.addEventListener('postStep', update);
    }
}