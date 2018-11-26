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
    console.log('start');
    if(status != 0) return;
    status = 1;
    trapFlag = 0;
    slideTime = 1000;
    document.getElementById("okbutton").className = "weui-btn weui-btn_warn weui-btn_default";
    alldataarr = shuffle(alldataarr);
    clearInterval(timer);
    initResultBox();
    speed = 1;
    timer = setInterval("ScrollUp()",speed);
}

function getChosenOne(){
    if(result_box.scrollTop % 50 != 0){
        result_box.scrollTop = Math.round(result_box.scrollTop / 50) * 50;
    }

    console.log(alldataarr[(Math.round(result_box.scrollTop / 50)+2)%alldataarr.length]);
    //以下代码表示获得奖的，不能再获奖了。  重置刷新页面即可。
    alldataarr.splice((parseInt(result_box.scrollTop / 50)+2)%alldataarr.length,1);
    num = alldataarr.length-1;

    status = 0;
    document.getElementById("okbutton").className = "weui-btn weui-btn_primary";
}

function trap(){
    slowCount = 0;
    trapFlag = 1;
    slideTime = 3000;
    timer = setInterval("ScrollUpSlow()",speed);
}

function ScrollUpSlow(){
    ScrollUp();
    slowCount++;
    if(slowCount * speed >= slideTime){
        clearInterval(timer);
        if(speed < 30){
            speed = speed * 4;
            slowCount = 0;
            timer = setInterval("ScrollUpSlow()",speed);
        }
        else{
            if(trapFlag == 0 && Math.random() < 0.3){
                setTimeout(trap,1000);
            }else{
                getChosenOne();
            }
        }
    }
}

function startOrStop(){
    if(status == 0) start();
    else stop();
}

function stop(){
    console.log('stop');
    if(status != 1) return;
    status = -1;
    document.getElementById("okbutton").className = "weui-btn weui-btn_disable weui-btn_default";

    clearInterval(timer);
    speed = 8;
    slowCount = 0;
    timer = setInterval("ScrollUpSlow()",speed);
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
        result_box.scrollTop+=3;
    }
}