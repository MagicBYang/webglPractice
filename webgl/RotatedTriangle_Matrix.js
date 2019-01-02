//VSHADER

let VSHADER_SOURCE = 
//全局变量，存储限定符，是一个attribute类型变量，数据从着色器外部传入
//webgl系统对外接口
//接受旋转的角度的三角函数值，glsl最多写成先这样了，剩下的计算必须在js中完成
'attribute vec4 a_Position;\n' +
'uniform mat4 u_xformMatrix;\n' +
'uniform mat4 u_moveFormMatrix;\n' +
'uniform mat4 u_scaleFormMatrix;\n' +
'void main() {\n' +
'  gl_Position = u_xformMatrix*u_moveFormMatrix*u_scaleFormMatrix*a_Position;\n' + 
'}\n';

//FSHADER
var FSHADER_SOURCE = 
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0,0.5,0.0,1);\n' + //设置颜色    
    '}\n';

//旋转角度    
let ANGLE = -10

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

let n = initVertexBuffers(gl)

if(n<0){
     console.log('无法设置顶点信息')
}

//旋转
//绕z轴旋转转换
let result = RotateZTransfer(ANGLE)
//列主序的旋转矩阵
let xformMatrix = new Float32Array([
    result.cosB,result.sinB,0.0,0.0,
   -result.sinB,result.cosB,0.0,0.0,
    0.0,0.0,1.0,0.0,
    0.0,0.0,0.0,1.0
])
//将旋转矩阵传输给顶点着色器
let u_xformMatrix = gl.getUniformLocation(gl.program,'u_xformMatrix')
gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix)



//平移
let Tx = 0.5,Ty = 0.5,Tz = 0.0
//列主序的平移矩阵
let moveFormMatrix = new Float32Array([
    1.0,0.0,0.0,0.0,
    0.0,1.0,0.0,0.0,
    0.0,0.0,1.0,0.0,
    Tx,Ty,Tz,1.0
])
//将平移矩阵传输给顶点着色器
let u_moveFormMatrix = gl.getUniformLocation(gl.program,'u_moveFormMatrix')
gl.uniformMatrix4fv(u_moveFormMatrix,false,moveFormMatrix)



//缩放
let Sx = 1.5,Sy = 1.5,Sz = 1.0
//列主序的平移矩阵
let scaleFormMatrix = new Float32Array([
   Sx,0.0,0.0,0.0,
   0.0,Sy,0.0,0.0,
   0.0,0.0,Sz,0.0,
   0.0,0.0,0.0,1.0
])
//将平移矩阵传输给顶点着色器
let u_scaleFormMatrix = gl.getUniformLocation(gl.program,'u_scaleFormMatrix')
gl.uniformMatrix4fv(u_scaleFormMatrix,false,scaleFormMatrix)


//清空指定canvas颜色
gl.clearColor(0.0,0.0,0.0,1.0)
//清空canvas
gl.clear(gl.COLOR_BUFFER_BIT)

//LINE_STRIP连接线段
//LINES 独立线段，两个点
//LINE_LOOP回路线段(线框)，与LINE_STRIP相比增加了一条从最后一个点到第一个点的线段
//TRIANGLES 三角形，如果点的数据不是3的整数倍，被忽略
//TRIANGLE_STRIP 条带状三角形
//TRIANGLE_FAN 一系列三角形组成的类似扇形


//将顶点坐标传给a_Position 向a_Position加上u_Translation 结果赋值给gl_Position
gl.drawArrays(gl.TRIANGLES,0,n)

}

//绕z轴旋转转换
function RotateZTransfer(ANGLE){
    //将旋转图形所需的数据传输给顶点着色器
    let radian = Math.PI *ANGLE /180.0;
    let cosB = Math.cos(radian)
    let sinB = Math.sin(radian)
    return {
         cosB:cosB,
         sinB:sinB
    }
}


function initVertexBuffers(gl){
      let vertices = new Float32Array([
           0.0,0.5,-0.5,-0.5,0.5,-0.5 //三角
      ])
      //点个数
      let n = 3
      //创建缓冲区对象
      let vertexBuffer = gl.createBuffer()
      if(!vertexBuffer){
          console.log('无法创建缓冲区对象')
          return -1
      }
      //将缓冲区对象绑定到目标
      gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
      //向缓冲区对象中写入数据
      gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW)
      let a_Position = gl.getAttribLocation(gl.program,'a_Position')
      //将缓冲区对象分配给a_Position变量
      gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0)
      //连接a_Position变量与分配给它的缓冲区对象
      gl.enableVertexAttribArray(a_Position)
      return n
}


