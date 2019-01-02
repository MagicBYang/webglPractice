//VSHADER

let VSHADER_SOURCE = 
//全局变量，存储限定符，是一个attribute类型变量，数据从着色器外部传入
//webgl系统对外接口
//接受旋转的角度的三角函数值，glsl最多写成先这样了，剩下的计算必须在js中完成
'attribute vec4 a_Position;\n' +
'uniform float u_CosB,u_SinB;\n' +
'void main() {\n' +
'  gl_Position.x = a_Position.x*u_CosB - a_Position.y*u_SinB;\n' +
'  gl_Position.y = a_Position.x*u_SinB + a_Position.y*u_CosB;\n' +
'  gl_Position.z = a_Position.z;\n' +
'  gl_Position.w = 1.0;\n' + 
'}\n';

//FSHADER
var FSHADER_SOURCE = 
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0,0.5,0.0,1);\n' + //设置颜色    
    '}\n';

//旋转角度    
let ANGLE = -90.0

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
//绕z轴旋转转换
let result = RotateZTransfer(ANGLE)
//获取顶点着色器的角度变量
let u_CosB = gl.getUniformLocation(gl.program,'u_CosB')
let u_SinB = gl.getUniformLocation(gl.program,'u_SinB')
//将旋转转换的结果传入顶点着色器
gl.uniform1f(u_CosB,result.cosB)
gl.uniform1f(u_SinB,result.sinB)

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

