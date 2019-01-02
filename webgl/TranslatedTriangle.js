//VSHADER

let VSHADER_SOURCE = 
//全局变量，存储限定符，是一个attribute类型变量，数据从着色器外部传入
//webgl系统对外接口
'attribute vec4 a_Position;\n' +
'uniform vec4 u_Translation;\n' +
'void main() {\n' +
'  gl_Position = a_Position + u_Translation;\n' +
'}\n';

//FSHADER
var FSHADER_SOURCE = 
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0,0.5,0.0,1);\n' + //设置颜色    
    '}\n';

let Tx = 0.5,Ty = 0.5,Tz= 0.0


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

//设置顶点位平移变量
let u_Translation = gl.getUniformLocation(gl.program,'u_Translation')
//传入偏移值，第四个坐标必须是0.0,因为要保证相加后的vec4变量第四个值是1.0
gl.uniform4f(u_Translation,Tx,Ty,Tz,0.0)




let n = initVertexBuffers(gl)

if(n<0){
     console.log('无法设置顶点信息')
}


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
gl.drawArrays(gl.TRIANGLE_FAN,0,n)
}


function initVertexBuffers(gl){

      let vertices = new Float32Array([
          // 0.0,0.7,0.5,-0.9,-0.2,-0.5 //三角
          0.5,-0.5,-0.5,0.5,-0.5,-0.5,0.5,0.5//矩形或带状
      ])
      //点个数
      let n = 4
      //方 4
      //三角 vertices.length/2 

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

