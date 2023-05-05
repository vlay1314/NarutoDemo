//获取outerDiv的宽度
var outerWidth = $('#outerDiv').width();
//获取外圆outerDiv的半径
var or = outerWidth/2;
//获取subOuterDiv的宽度
var subOuterWidth = $('#subOuterDiv').width();
//获取内圆subOuterDiv的半径
var ir = subOuterWidth/2;

//获取菜单块的宽度
var mWidth = 26;
//获取菜单块的对角线长度
var mDLen = Math.sqrt(2 * Math.pow(mWidth, 2));
//获取外圆的中心点坐标
var outerLeft = $('#outerDiv').offset().left + $('#outerDiv').width() / 2;
var outerTop = $('#outerDiv').offset().top + $('#outerDiv').height() / 2;

//第一个菜单块中心与以o(outerLeft,outerTop)为圆心的的X轴的夹角为-90(-PI/2), 求菜单块中心点坐标
var m1X = parseInt((Math.cos(-1 * Math.PI / 2) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerLeft - mWidth / 2);
var m1Y = parseInt((Math.sin(-1 * Math.PI / 2) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerTop - mWidth / 2);
$("#m1").width(mWidth);
$("#m1").height(mWidth);
$("#m1").offset({ top: m1Y, left: m1X });

//第二个菜单块中心与以o(outerLeft,outerTop)为圆心的的X轴的夹角为-45(-PI/4), 求菜单块中心点坐标
var m2X = parseInt((Math.cos(-1 * Math.PI / 4) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerLeft - mWidth / 2);
var m2Y = parseInt((Math.sin(-1 * Math.PI / 4) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerTop - mWidth / 2);
$("#m2").width(mWidth);
$("#m2").height(mWidth);
$("#m2").offset({ top: m2Y, left: m2X });

//第三个菜单块中心与以o(outerLeft,outerTop)为圆心的的X轴的夹角为0(0), 求菜单块中心点坐标
var m3X = parseInt((Math.cos(0) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerLeft - mWidth / 2);
var m3Y = parseInt((Math.sin(0) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerTop - mWidth / 2);
$("#m3").width(mWidth);
$("#m3").height(mWidth);
$("#m3").offset({ top: m3Y, left: m3X });

//第四个菜单块中心与以o(outerLeft,outerTop)为圆心的的X轴的夹角为45(PI/4), 求菜单块中心点坐标
var m4X = parseInt((Math.cos(Math.PI / 4) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerLeft - mWidth / 2);
var m4Y = parseInt((Math.sin(Math.PI / 4) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerTop - mWidth / 2);
$("#m4").width(mWidth);
$("#m4").height(mWidth);
$("#m4").offset({ top: m4Y, left: m4X });

//第五个菜单块中心与以o(outerLeft,outerTop)为圆心的的X轴的夹角为90(PI/2), 求菜单块中心点坐标
var m5X = parseInt((Math.cos(Math.PI / 2) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerLeft - mWidth / 2);
var m5Y = parseInt((Math.sin(Math.PI / 2) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerTop - mWidth / 2);
$("#m5").width(mWidth);
$("#m5").height(mWidth);
$("#m5").offset({ top: m5Y, left: m5X });

//第六个菜单块中心与以o(outerLeft,outerTop)为圆心的的X轴的夹角为135(3*PI/4), 求菜单块中心点坐标
var m6X = parseInt((Math.cos(3 * Math.PI / 4) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerLeft - mWidth / 2);
var m6Y = parseInt((Math.sin(3 * Math.PI / 4) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerTop - mWidth / 2);
$("#m6").width(mWidth);
$("#m6").height(mWidth);
$("#m6").offset({ top: m6Y, left: m6X });

//第七个菜单块中心与以o(outerLeft,outerTop)为圆心的的X轴的夹角为180(PI), 求菜单块中心点坐标
var m7X = parseInt((Math.cos(Math.PI) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerLeft - mWidth / 2);
var m7Y = parseInt((Math.sin(Math.PI) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerTop - mWidth / 2);
$("#m7").width(mWidth);
$("#m7").height(mWidth);
$("#m7").offset({ top: m7Y, left: m7X });

//第八个菜单块中心与以o(outerLeft,outerTop)为圆心的的X轴的夹角为225(5*PI/4), 求菜单块中心点坐标
var m8X = parseInt((Math.cos(-0.75 * Math.PI) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerLeft - mWidth / 2);
var m8Y = parseInt((Math.sin(-0.75 * Math.PI) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + outerTop - mWidth / 2);
$("#m8").width(mWidth);
$("#m8").height(mWidth);
$("#m8").offset({ top: m8Y, left: m8X });

var preX, preY; //上一次鼠标点的坐标
var curX, curY; //本次鼠标点的坐标
var preAngle; //上一次鼠标点与圆心(150,150)的X轴形成的角度(弧度单位)
var transferAngle; //当前鼠标点与上一次preAngle之间变化的角度

var a = 0;
var obj = document.getElementById('outerDiv');
obj.addEventListener('touchstart', function (event) {
    console.log("touchstart-event", event.target.id);
    var touch = event.targetTouches[0];
    preX = touch.clientX;
    preY = touch.clientY;
    //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
    preAngle = Math.atan2(preY - outerTop, preX - outerLeft);
    //移动事件
    obj.addEventListener('touchmove', function (event) {
        console.log("touchmove-event", event.target.id);
        var touchMove = event.targetTouches[0];
        curX = touchMove.clientX;
        curY = touchMove.clientY;
        //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
        var curAngle = Math.atan2(curY - outerTop, curX - outerLeft);
        transferAngle = curAngle - preAngle;
        a += (transferAngle * 180 / Math.PI);
        $('#outerDiv').rotate(a);

        for (var i = 1; i <= 8; i++) {
            $("#m" + i).rotate(-a);
        }
        preX = curX;
        preY = curY;
        preAngle = curAngle;

    }, false);
    //释放事件
    $("outerDiv").mouseup(function (event) {
        $("outerDiv").unbind("mousemove");
    });
}, false);

$("#outerDiv").hide();













// var or = 75;
// var ir = 50;
// var mWidth = 20;
// var mDLen = Math.sqrt(2 * Math.pow(mWidth, 2));
// //获取当前页面的可视大小
// var pageWidth = $(document).width();
// var pageHeight = $(document).height();
// console.log("mDLen:",mDLen);
// //第1菜单块中心点与以o(150,150)为圆心的的X轴的夹角为-90(-PI/2), 求菜单块中心点坐标
// var m1X = parseInt((Math.cos(-1 * Math.PI / 2) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// var m1Y = parseInt((Math.sin(-1 * Math.PI / 2) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// console.log("m1X--m1Y:",pageWidth-m1X,pageHeight-m1Y);
// console.log("m1X--m1Y:",m1X,m1Y);
// $("#m1").width(mWidth);
// $("#m1").height(mWidth);
// // $("#m1").offset({ top:parseInt(pageHeight - m1Y - mWidth - or - ir - mDLen), left:parseInt(pageWidth- m1X + mWidth) });
// // $("#m1").offset({ top: m1Y, left: m1X });
// $("#m1").css("top",m1X + "px");
// $("#m1").css("left",m1Y + "px");

// //第2菜单块中心点与以o(150,150)为圆心的的X轴的夹角为-45(-PI/4), 求菜单块中心点坐标
// var m2X = parseInt((Math.cos(-1 * Math.PI / 4) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// var m2Y = parseInt((Math.sin(-1 * Math.PI / 4) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// $("#m2").width(mWidth);
// $("#m2").height(mWidth);
// // $("#m2").offset({ top:parseInt(pageHeight - m2Y - mWidth - or - ir - mDLen), left:parseInt(pageWidth- m2X + mWidth) });
// // $("#m2").offset({ top: m2Y, left:  m2X });
// $("#m2").css("top",m2X + "px");
// $("#m2").css("left",m2Y + "px");
// console.log("m2X--m2Y:",pageWidth-m2X,pageHeight-m2Y);
// console.log("m2X--m2Y:",m2X,m2Y);

// //第3菜单块中心点与以o(150,150)为圆心的的X轴的夹角为0(0), 求菜单块中心点坐标
// var m3X = parseInt((Math.cos(0) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// var m3Y = parseInt((Math.sin(0) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// $("#m3").width(mWidth);
// $("#m3").height(mWidth);
// // $("#m3").offset({ top:parseInt(pageHeight - m3Y - mWidth - or - ir - mDLen), left:parseInt(pageWidth- m3X + mWidth) });
// // $("#m3").offset({ top: m3Y, left: m3X });
// $("#m3").css("top",m3X + "px");
// $("#m3").css("left",m3Y + "px");
// console.log("m3X--m3Y:",pageWidth-m3X,pageHeight-m3Y);
// console.log("m3X--m3Y:",m3X,m3Y);

// //第4菜单块中心点与以o(150,150)为圆心的的X轴的夹角为45(PI/4), 求菜单块中心点坐标
// var m4X = parseInt((Math.cos(Math.PI / 4) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// var m4Y = parseInt((Math.sin(Math.PI / 4) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// $("#m4").width(mWidth);
// $("#m4").height(mWidth);
// // $("#m4").offset({ top:parseInt(pageHeight - m4Y - mWidth - or - ir - mDLen), left:parseInt(pageWidth- m4X + mWidth) });
// // $("#m4").offset({ top: m4Y, left: m4X });
// $("#m4").css("top",m4X + "px");
// $("#m4").css("left",m4Y + "px");
// console.log("m4X--m4Y:",pageWidth-m4X,pageHeight-m4Y);
// console.log("m4X--m4Y:",m4X,m4Y);

// //第5菜单块中心点与以o(150,150)为圆心的的X轴的夹角为90(PI/2), 求菜单块中心点坐标
// var m5X = parseInt((Math.cos(Math.PI / 2) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// var m5Y = parseInt((Math.sin(Math.PI / 2) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// $("#m5").width(mWidth);
// $("#m5").height(mWidth);
// // $("#m5").offset({ top:parseInt(pageHeight - m5Y - mWidth - or - ir - mDLen), left:parseInt(pageWidth- m5X + mWidth) });
// // $("#m5").offset({ top: m5Y, left: m5X });
// $("#m5").css("top",m5X + "px");
// $("#m5").css("left",m5Y + "px");
// console.log("m5X--m5Y:",pageWidth-m5X,pageHeight-m5Y);
// console.log("m5X--m5Y:",m5X,m5Y);

// //第6菜单块中心点与以o(150,150)为圆心的的X轴的夹角为135(0.75PI), 求菜单块中心点坐标
// var m6X = parseInt((Math.cos(0.75 * Math.PI) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// var m6Y = parseInt((Math.sin(0.75 * Math.PI) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// $("#m6").width(mWidth);
// $("#m6").height(mWidth);
// // $("#m6").offset({ top:parseInt(pageHeight - m6Y - mWidth - or - ir - mDLen), left:parseInt(pageWidth- m6X + mWidth) });
// // $("#m6").offset({ top: m6Y, left: m6X });
// $("#m6").css("top",m6X + "px");
// $("#m6").css("left",m6Y + "px");
// console.log("m6X--m6Y:",pageWidth-m6X,pageHeight-m6Y);
// console.log("m6X--m6Y:",m6X,m6Y);

// //第7菜单块中心点与以o(150,150)为圆心的的X轴的夹角为180(PI), 求菜单块中心点坐标
// var m7X = parseInt((Math.cos(Math.PI) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// var m7Y = parseInt((Math.sin(Math.PI) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// $("#m7").width(mWidth);
// $("#m7").height(mWidth);
// // $("#m7").offset({ top:parseInt(pageHeight - m7Y - mWidth - or - ir - mDLen), left:parseInt(pageWidth- m7X + mWidth) });
// // $("#m7").offset({ top: m7Y, left: m7X });
// $("#m7").css("top",m7X + "px");
// $("#m7").css("left",m7Y + "px");
// console.log("m7X--m7Y:",pageWidth-m7X,pageHeight-m7Y);
// console.log("m7X--m7Y:",m7X,m7Y);

// //第8菜单块中心点与以o(150,150)为圆心的的X轴的夹角为-135(PI), 求菜单块中心点坐标
// var m8X = parseInt((Math.cos(-0.75 * Math.PI) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// var m8Y = parseInt((Math.sin(-0.75 * Math.PI) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + or - mWidth / 2);
// $("#m8").width(mWidth);
// $("#m8").height(mWidth);
// // $("#m8").offset({ top:parseInt(pageHeight - m8Y - mWidth - or - ir - mDLen), left:parseInt(pageWidth- m8X + mWidth) });
// // $("#m8").offset({ top: m8Y, left: m8X });
// $("#m8").css("top",m8X + "px");
// $("#m8").css("left",m8Y + "px");
// console.log("m8X--m8Y:",pageWidth-m8X,pageHeight-m8Y);
// console.log("m8X--m8Y:",m8X,m8Y);

// //===============================================

// var preX, preY;//上一次鼠标点的坐标
// var curX, curY;//本次鼠标点的坐标
// var preAngle;//上一次鼠标点与圆心(150,150)的X轴形成的角度(弧度单位)
// var transferAngle;//当前鼠标点与上一次preAngle之间变化的角度

// var a = 0;

// // for (var i = 0; i < 15; i++) {
// //     $("body").append("<br>");
// // }
// //获取外心圆的坐标
// var mcx = $("#outerDiv").offset().left + $("#outerDiv").width() / 2;
// var mcy = $("#outerDiv").offset().top + $("#outerDiv").height() / 2;
// // var mcx = 75;
// // var mcy = 75;
// console.log("获取外心圆的坐标:",mcx,mcy);
// console.log("left-offset:",$("#outerDiv").offset().left, "top-offset:",$("#outerDiv").offset().top);
// console.log($("#outerDiv").offset().left + $("#outerDiv").width() / 2,$("#outerDiv").offset().top + $("#outerDiv").height() / 2);
// // console.log("left:",pageWidth-110,"top:",pageHeight-175);
// var obj = document.getElementById('outerDiv');
// obj.addEventListener('touchstart', function (event) {
//     console.log("touchstart-event", event);
//     var touch = event.targetTouches[0];
//     preX = touch.clientX;
//     preY = touch.clientY;
//     //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
//     preAngle = Math.atan2(preY - mcy, preX - mcx);
//     //移动事件
//     obj.addEventListener('touchmove', function (event) {
//         console.log("touchmove-event", event);
//         var touchMove = event.targetTouches[0];
//         curX = touchMove.clientX;
//         curY = touchMove.clientY;
//         //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
//         var curAngle = Math.atan2(curY - mcy, curX - mcx);
//         transferAngle = curAngle - preAngle;
//         a += (transferAngle * 180 / Math.PI);
//         $('#outerDiv').rotate(a);

//         for (var i = 1; i <= 8; i++) {
//             $("#m" + i).rotate(-a);
//         }
//         preX = curX;
//         preY = curY;
//         preAngle = curAngle;

//     }, false);
//     //释放事件
//     $("outerDiv").mouseup(function (event) {
//         $("outerDiv").unbind("mousemove");
//     });
// }, false);

// //点击事件
// $("#outerDiv").mousedown(function (event) {
//     preX = event.clientX;
//     preY = event.clientY;
//     //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
//     preAngle = Math.atan2(preY - mcy, preX - mcx);
//     //移动事件
//     $("html").mousemove(function (event) {
//         curX = event.clientX;
//         curY = event.clientY;
//         //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
//         var curAngle = Math.atan2(curY - mcy, curX - mcx);
//         transferAngle = curAngle - preAngle;
//         a += (transferAngle * 180 / Math.PI);
//         $('#outerDiv').rotate(a);

//         for (var i = 1; i <= 8; i++) {
//             $("#m" + i).rotate(-a);
//         }
//         preX = curX;
//         preY = curY;
//         preAngle = curAngle;
//     });
//     //释放事件
//     $("html").mouseup(function (event) {
//         $("html").unbind("mousemove");
//     });
// });

