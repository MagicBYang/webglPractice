//VSHADER

let VSHADER_SOURCE = 
//全局变量，存储限定符，是一个attribute类型变量，数据从着色器外部传入
//webgl系统对外接口
//接受旋转的角度的三角函数值，glsl最多写成先这样了，剩下的计算必须在js中完成
'attribute vec4 a_Position;\n' +
'uniform mat4 u_ModelMatrix;\n' +
'void main() {\n' +
'  gl_Position = u_ModelMatrix*a_Position;\n' + 
'}\n';

//FSHADER
var FSHADER_SOURCE = 
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0,0.5,0.0,1);\n' + //设置颜色    
    '}\n';

//旋转速度   
let ANGLE_STEP = 45.0

//当前时间
let oldtime = new Date().getTime()
let newtime = new Date().getTime()
let duringtime
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
    //清空指定canvas颜色
    gl.clearColor(0.0,0.0,0.0,1.0)
    let n = initVertexBuffers(gl)
    if(n<0){
        console.log('无法设置顶点信息')
    }
    //获取模型矩阵变量
    let u_ModelMatrix = gl.getUniformLocation(gl.program,'u_ModelMatrix')
    //当前旋转角
    let currentAngle = 0.0
    let modelMatrix = new Matrix4()
    let tick = function(){
        newtime = new Date().getTime()
        duringtime = newtime - oldtime
        oldtime = newtime
        //根据当前时间和速度计算实时角度
        currentAngle = animate(currentAngle)
        draw(gl,n,currentAngle,modelMatrix,u_ModelMatrix)
        requestAnimationFrame(tick)
    }
    tick()
}
//根据矩阵信息和当前角度绘制webgl图形
function draw(gl,n,currentAngle,modelMatrix,u_ModelMatrix){
    //先设置旋转矩阵
    modelMatrix.setRotate(currentAngle,0,0,1)  
    //modelMatrix.translate(.55,0,0) 
    //将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements)
    //清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT)
    //绘制三角形
    gl.drawArrays(gl.TRIANGLES,0,n)
    
}
//根据当前时间和速度计算实时角度
function animate(currentAngle){
    currentAngle += duringtime*ANGLE_STEP/1000
    return currentAngle%=360
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


