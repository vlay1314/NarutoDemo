(function($){
	$.fn.extend($.fn,{
		tWheel:function(){
			this.each(function(){
				var $this = $(this);
				var $this_s = $("div.wheel_s",$this);
				var $this_m = $("div.wheel_m",$this);
				var $this_c = $("div.wheel_c",$this);
				var props = {
					"rel":$this.attr("rel"),
					"yj":$this.attr("yj"),
					"model":$this.attr("model"),
					"location":$this.attr("location"),
					"sbgi":$this_s.attr("bgi"),
					"sw":$this_s.attr("w"),
					"sh":$this_s.attr("h"),
					"mbgc":$this_m.attr("bgc"),
					"mwidth":$this_m.attr("mwidth"),
					"or":$this_m.attr("r"),
					"ir":$("div.wheel_m div.wheel_c",$this).attr("r"),
					"ibgc":$("div.wheel_m div.wheel_c",$this).attr("bgc")
				};
				//获取当前页面的可视大小
				var pageWidth = $(document).width();
				var pageHeight = $(document).height();
				//设置组件div
				$this.css("position","absolute");
				//设置缩略图div
				$this_s.css("position","absolute");
				$this_s.css("width",props.sw);
				$this_s.css("height",props.sh);
				$this_s.css("background-image","url("+props.sbgi+")");
				$this_s.css("background-size","100% 100%");
				
				//设置圆形菜单
				$this_m.css("display","none");
				$this_m.css("position","absolute");
				$this_m.css("background-color",props.mbgc);
				$this_m.css("width",parseInt(props.or) * 2);
				$this_m.css("height",parseInt(props.or) * 2);
				$this_m.css("border-radius",parseInt(props.or));
				
				//设置内圆
				$this_c.css("position","absolute");
				$this_c.css("background-color",props.ibgc);
				$this_c.css("width",parseInt(props.ir) * 2);
				$this_c.css("height",parseInt(props.ir) * 2);
				$this_c.css("border-radius",parseInt(props.ir));
				
				var mcx,mcy;//外圆圆心坐标
				if( props.location == "left" ){
					$this_s.css("top",(pageHeight-parseInt(props.sh))/2 + "px");
					$this_s.css("left","0px");
					
					mcy = (pageHeight-parseInt(props.or * 2))/2 + parseInt(props.or);
					mcx = 0;
					$this_m.css("top",(pageHeight-parseInt(props.or * 2))/2 + "px");
					$this_m.css("left",0 - parseInt(props.or) + "px");
					
				}else if( props.location == "top" ){
					$this_s.css("top","0px");
					$this_s.css("left",(pageWidth-parseInt(props.sw))/2 + "px");
					
					mcy = 0;
					mcx = (pageWidth-parseInt(props.or * 2))/2 + parseInt(props.or);
					$this_m.css("top", 0 - parseInt(props.or) + "px");
					$this_m.css("left",(pageWidth-parseInt(props.or * 2))/2 + "px");
					
				}else if( props.location == "right" ){
					$this_s.css("top",(pageHeight-parseInt(props.sh))/2 + "px");
					$this_s.css("left",pageWidth-parseInt(props.sw) + "px");
					
					mcy = (pageHeight-parseInt(props.or * 2))/2 + parseInt(props.or);
					mcx = pageWidth;
					$this_m.css("top",(pageHeight-parseInt(props.or * 2))/2 + "px");
					$this_m.css("left",pageWidth - parseInt(props.or) + "px");
					
				}else if( props.location == "bottom" ){
					$this_s.css("top",pageHeight-parseInt(props.sh) + "px");
					$this_s.css("left",(pageWidth-parseInt(props.sw))/2 + "px");
					
					mcy = pageHeight;
					mcx = (pageWidth-parseInt(props.or * 2))/2 + parseInt(props.or);
					$this_m.css("top",pageHeight - parseInt(props.or) + "px");
					$this_m.css("left",(pageWidth-parseInt(props.or * 2))/2 + "px");
				}
				
				$this_c.css("top", parseInt(props.or)-parseInt(props.ir) + "px");
				$this_c.css("left",parseInt(props.or)-parseInt(props.ir) + "px");
				
				//菜单项
				var mWidth = props.mwidth;
				var mDLen = Math.sqrt(2 * Math.pow(mWidth,2));
				$("div.wheel_i",$this_m).each(function(index){
					$item = $(this);
					$item.css("position","absolute");
					$item.css("width",mWidth);
					$item.css("height",mWidth);
					$item.css("background-image","url("+$item.attr("bgi")+")");
					$item.css("background-size","100% 100%");
					
					var mX = parseInt( (Math.cos( -1 * Math.PI / 2 + (index * Math.PI/4) ) * (parseInt(props.ir) + ((parseInt(props.or) - parseInt(props.ir) - mDLen)/2) + mDLen/2) ) + parseInt(props.or) - mWidth/2 );
					var mY = parseInt( (Math.sin( -1 * Math.PI / 2 + (index * Math.PI/4) ) *  (parseInt(props.ir) + ((parseInt(props.or) - parseInt(props.ir) - mDLen)/2) + mDLen/2) ) + parseInt(props.or) - mWidth/2 );
					$item.css("top",mX + "px");
					$item.css("left",mY + "px");
				});
				
				//事件
				var preX,preY;//上一次鼠标点的坐标
				var curX,curY;//本次鼠标点的坐标
				var preAngle;//上一次鼠标点与圆心(mcx,150)的X轴形成的角度(弧度单位)
				var transferAngle;//当前鼠标点与上一次preAngle之间变化的角度
				var a = 0;
				$this_s.click(function(event){
					$this_m.show();
				});
				$("html").mousedown(function(event){
					$this_m.hide();
				});
				//点击事件
				$this_m.mousedown(function(event){
					event.stopPropagation();
					preX = event.clientX;
					preY = event.clientY;
					//计算当前点击的点与圆心(mcx,mcy)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
					preAngle = Math.atan2(preY - mcy, preX - mcx);
					//移动事件
					$("html").mousemove(function(event){
						curX = event.clientX;
						curY = event.clientY;
						//计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
						var curAngle = Math.atan2(curY - mcy, curX - mcx);
						transferAngle = curAngle - preAngle;
						a += (transferAngle * 180 / Math.PI);
						$this_m.rotate(a);
						
						$("div.wheel_i",$this_m).each(function(){
							$(this).rotate(-a);
						});
						$this_c.rotate(-a);
						preX = curX;
						preY = curY;
						preAngle = curAngle;
					});
					//释放事件
					$("html").mouseup(function(event){
						$("html").unbind("mousemove");
					});
				});
			});
		}
	});
})(jQuery);
