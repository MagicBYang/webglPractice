//VSHADER

let VSHADER_SOURCE = 
//全局变量，存储限定符，是一个attribute类型变量，数据从着色器外部传入
//webgl系统对外接口
'attribute vec4 a_Position;\n' +
'attribute float a_PointSize;\n'+
'void main() {\n' +
'  gl_Position = a_Position;\n' +
'  gl_PointSize = a_PointSize;\n' +
'}\n';

//FSHADER
var FSHADER_SOURCE = 
    'void main() {\n' +
    ' gl_FragColor = vec4(0.0,1.0,0.0,1);\n' + //设置颜色    
    '}\n';


function main(){
//获取canvas
let canvas = document.getElementById('webgl')

//获取上下文
let gl = getWebGLContext(canvas)
if(!gl){
    console.log("无法获取上下文")
    return
}
//初始化着色器
if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
    console.log("无法加载着色器")
    return
}

//获取attribute变量的存储位置
//向webgl系统请求该变量地址
//第一个参数是一个程序对象，包括了定点着色器和片元着色器。必须调用过initShaders函数后才可以使用
//因为上述函数生成了它
//webgl系统查询器
let a_Position = gl.getAttribLocation(gl.program,'a_Position')
let a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize')
if(a_Position<0){
    console.log("无法获取该变量")
    return
}


//注册鼠标事件
canvas.onmousedown = function(e) {click(e,gl,canvas,a_Position,a_PointSize);};

//清空指定canvas颜色
gl.clearColor(0.0,0.0,0.0,1.0)
//清空canvas
gl.clear(gl.COLOR_BUFFER_BIT)

}

let g_points = [] //鼠标点击位置的数组
function click(e,gl,canvas,a_Position,a_PointSize){

    let x = e.clientX;
    let y = e.clientY;
    let rect = e.target.getBoundingClientRect()

    x = ((x-rect.left)-canvas.height/2)/(canvas.height/2);
    y = (canvas.width/2-(y-rect.top))/(canvas.width/2)
    
    g_points.push(x,y)

    gl.clear(gl.COLOR_BUFFER_BIT)

    let len = g_points.length
   
    for(let i = 0;i<=len;i+=2){
        //将点的位置传递到变量中a_Position
        gl.vertexAttrib1f(a_PointSize,x*100)
        gl.vertexAttrib4f(a_Position,g_points[i],g_points[i+1],0.0,1.0)
        gl.drawArrays(gl.POINTS,0,1)

    }
        
        
    
    

}


// 

// 

