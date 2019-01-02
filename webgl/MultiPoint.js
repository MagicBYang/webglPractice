//VSHADER

let VSHADER_SOURCE = 
//全局变量，存储限定符，是一个attribute类型变量，数据从着色器外部传入
//webgl系统对外接口
'attribute vec4 a_Position;\n' +
'void main() {\n' +
'  gl_Position = a_Position;\n' +
'  gl_PointSize = 10.0;\n' +
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

//设置顶点位置
let n = initVertexBuffers(gl)
if(n<0){
     console.log('无法设置顶点信息')
}


//清空指定canvas颜色
gl.clearColor(0.0,0.0,0.0,1.0)
//清空canvas
gl.clear(gl.COLOR_BUFFER_BIT)

gl.drawArrays(gl.POINTS,0,n)
}


function initVertexBuffers(gl){

      let vertices = new Float32Array([
          0.0,0.5,-0.5,-0.5,0.5,-0.5 
      ])
      //点个数
      let n = vertices.length/2

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

