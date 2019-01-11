var result_box;
var result_con_box;
var result_con2_box;

var timer;
var status; // 0 开始可用，1停止可用，-1全不可用
var speed = 1;
var slowCount = 0;
var trapFlag = 0;
var slideTime = 1000;

var alldata;
var alldataarr;
var window_H=window.innerHeight;
var remJS=0.03*window_H;


window.onresize=function(){
	var sizeC = window.innerHeight/window_H;
	window_H = window.innerHeight;
	remJS=0.03*window_H;
	result_box.scrollTop *= sizeC;
}


$(document).ready(function(){
    status = 0;
    result_box = document.getElementById("result");
    result_con_box = document.getElementById("result_con");
    result_con2_box = document.getElementById("result_con2");

    htmlobj = $.ajax({url:"./data/member.txt",async:false});
    alldata = htmlobj.responseText;
    alldataarr = alldata.split(",");
    num = alldataarr.length;
    console.log(alldataarr);
});

function initResultBox(){
    result_con_box.innerHTML = null;
    alldataarr.forEach(function(val){
        const tmp = document.createElement("li");
        tmp.innerText = val;
        result_con_box.appendChild(tmp);
    });

    result_con2_box.innerHTML = result_con_box.innerHTML;
}

function start(){
    if(status != 0) return;
    status = 1;
    trapFlag = 0;
    slideTime = 1000;
    document.getElementById("okbutton").className = "weui-btn weui-btn_warn weui-btn_default";
    alldataarr = shuffle(alldataarr);
    clearInterval(timer);
    initResultBox();
    speed = 1;
    timer = setInterval(ScrollUp,speed);
}

function _slideToCorrect(args,val){
    return function(){
        slideToCorrect(args,val);
    }
}

function slideToCorrect(args,val){
    if( result_box.scrollTop>= result_con_box.scrollHeight){
        result_box.scrollTop=0;
    }else{
        result_box.scrollTop+=0.25*remJS;
    }

    if(result_box.scrollTop = val){
        clearInterval(timer);
        args();
    }
}


function getChosenOne(){
	if(trapFlag == 0 && Math.random() < 0.1){
		setTimeout(trap,800);
		return;
	}
	var tempIndex = (Math.round(result_box.scrollTop / (remJS*2.5))+4)%alldataarr.length;
    console.log(alldataarr[tempIndex]);
    //以下代码表示获得奖的，不能再获奖了。  重置刷新页面即可。
    alldataarr.splice(tempIndex,1);
    num = alldataarr.length-1;

    status = 0;
    document.getElementById("okbutton").className = "weui-btn weui-btn_primary";
}

function trap(){
    slowCount = 0;
    trapFlag = 1;
    slideTime = 1000;
    timer = setInterval(ScrollUpSlow,64);
}

function ScrollUpSlow(){
    ScrollUp();
    slowCount++;
    if(slowCount * speed >= slideTime){
        clearInterval(timer);
        if(speed < 30){
            speed = speed * 4;
            slowCount = 0;
            timer = setInterval(ScrollUpSlow,speed);
        }
        else{
            timer = setInterval(_slideToCorrect(getChosenOne,Math.round(result_box.scrollTop/(remJS*2.5))*(remJS*2.5)),speed);
        }
    }
}

function startOrStop(){
    if(status == 0) start();
    else stop();
}

function stop(){
    if(status != 1) return;
    status = -1;
    document.getElementById("okbutton").className = "weui-btn weui-btn_disable weui-btn_default";

    clearInterval(timer);
    speed = 8;
    slowCount = 0;
    timer = setInterval(ScrollUpSlow,speed);
}

function shuffle(arr){
    var len = arr.length;
    for(var i = 0; i < len - 1; i++){
        var idx = Math.floor(Math.random() * (len - i));
        var temp = arr[idx];
        arr[idx] = arr[len - i - 1];
        arr[len - i -1] = temp;
    }
    return arr;
}
function ScrollUp(){
    if( result_box.scrollTop>= result_con_box.scrollHeight){
        result_box.scrollTop=0;
    }else{
        result_box.scrollTop+=0.25*remJS;
    }
}