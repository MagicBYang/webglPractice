let  VSHADER_SOURCE = 
 'attribute vec4 a_Position;' +
 'attribute vec4 a_Color;' +
 'uniform mat4 u_ProjMatrix;' +
 'varying vec4 v_Color;\n' +
 'void main() {' +
 '  gl_Position = u_ProjMatrix * a_Position;\n' +
 '  gl_PointSize = 10.0;\n' +
 '  v_Color = a_Color;\n' + //varying变量
 '}';
let FSHADER_SOURCE =
    //显式定义精确度
    'precision mediump float;' +
    'varying vec4 v_Color;\n' +
    'void main(){\n'+
    '  gl_FragColor = v_Color;\n'+//从顶点着色器接收数据
 '}';
 function main(){
    //获取canvas元素
    let canvas = document.getElementById("webgl");
    if(!canvas){
        console.log("Failed to retrieve the <canvas> element");
        return;
    }
    let nf = document.getElementById('nearFar')
    //获取WebGL绘图上下文
    let gl = getWebGLContext(canvas);
    if(!gl){
        console.log("Failed to get the rendering context for WebGL");
        return;
    }
    //初始化着色器
    if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
        console.log("Failed to initialize shaders.");
        return;
    }
    //设置顶点位置
    let n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }
    
    let u_ProjMatrix = gl.getUniformLocation(gl.program,'u_ProjMatrix')
    let projMatrix = new Matrix4()

    document.onkeydown = function(e){
         keydown(e,gl,n,u_ProjMatrix,projMatrix,nf)
    }

    //指定清空<canvas>颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    
 }

 let g_near = 0.0,g_far = 0.5
 function keydown(e,gl,n,u_ProjMatrix,projMatrix,nf){
    switch(e.keyCode){
         case 39: g_near += 0.01;break
         case 37: g_near -= 0.01;break
         case 38: g_far += 0.01;break
         case 40: g_far -= 0.01;break
    } 
    draw(gl,n,u_ProjMatrix,projMatrix,nf)
 }
 //执行绘制
 function draw(gl,n,u_ProjMatrix,projMatrix,nf){
    //使用矩阵设置可视空间
    projMatrix.setOrtho(-1,1,-1,1,g_near,g_far)
    //将投影矩阵传递给u_ProjMatrix
    gl.uniformMatrix4fv(u_ProjMatrix,false,projMatrix.elements)
    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    //显示当前的near和far值
    nf.innerHTML = 'near:' + Math.round(g_near * 100)/100 + ', far: ' + Math.round(g_far*100)/100
    //POINTS
    gl.drawArrays(gl.TRIANGLES,0,n)
 }

 function initVertexBuffers(gl){
    let verticesColors = new Float32Array([
         0.0,0.5,-0.4,0.4,1.0,0.4,//绿色
        -0.5,-0.5,-0.4,0.4,1.0,0.4,
         0.5,-0.5,-0.4,1.0,0.4,0.4,

         0.5,0.4,-0.2,1.0,0.4,0.4,//黄色
        -0.5,0.4,-0.2,1.0,1.0,0.4,
         0.0,-0.6,-0.2,1.0,1.0,0.4,

         0.0,0.5,0.0,0.4,0.4,1.0,//蓝色
        -0.5,-0.5,0.0,0.4,0.4,1.0,
         0.5,-0.5,0.0,1.0,0.4,0.4
    ])
    let n = 9
    //创建合一的缓冲区对象
    let vertexColorBuffer = gl.createBuffer();
    if(!vertexColorBuffer){
        console.log("Failed to create thie buffer object");
        return -1;
    }
    //指定缓冲区用途
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexColorBuffer)
    //向缓冲区传输数据
    gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW)
    let FSIZE = verticesColors.BYTES_PER_ELEMENT
    //获取顶点着色器中的位置指针
    let a_Position = gl.getAttribLocation(gl.program,'a_Position')
    //将缓冲区分配给attribute对象(位置)
    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,FSIZE*6,0)
    //开启缓冲区分配(位置)
    gl.enableVertexAttribArray(a_Position)
    //获取顶点着色器中的颜色指针
    let a_Color = gl.getAttribLocation(gl.program,'a_Color')
    //将缓冲区分配给attribute对象(大小)
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE*6,FSIZE*3)
    //开启缓冲区分配(大小)
    gl.enableVertexAttribArray(a_Color)
    return n
 }

