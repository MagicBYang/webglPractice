let  VSHADER_SOURCE = 
 'attribute vec4 a_Position;' +
 'attribute vec4 a_Color;' +
 'uniform mat4 u_ViewMatrix;' +
 'uniform mat4 u_ProjMatrix;' +
 'varying vec4 v_Color;\n' +
 'void main() {' +
 '  gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n' +
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
    //求可视矩阵
    let u_ViewMatrix = gl.getUniformLocation(gl.program,'u_ViewMatrix')
    //求可视空间矩阵
    let u_ProjMatrix = gl.getUniformLocation(gl.program,'u_ProjMatrix')
    let projMatrix = new Matrix4();
    let viewMatrix = new Matrix4();
    //注册键盘事件响应函数
    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ViewMatrix,viewMatrix,u_ProjMatrix,projMatrix);
    };
    draw(gl, n, u_ViewMatrix, viewMatrix,u_ProjMatrix,projMatrix);
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

 //键盘监听
 let g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; //视点
 function keydown(ev, gl, n, u_ViewMatrix, viewMatrix,u_ProjMatrix,projMatrix) {
    if(ev.keyCode == 39){   //按下右键
        g_eyeX += 0.01;
    }else if(ev.keyCode == 37){ //按下左键
        g_eyeX -= 0.01;
    }else {
        return ;
    }
    draw(gl, n, u_ViewMatrix, viewMatrix,u_ProjMatrix,projMatrix);
     
}
//执行绘制
function draw(gl, n, u_ViewMatrix, viewMatrix,u_ProjMatrix,projMatrix) {
    //设置视点和视线
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
    //将视图矩阵传递给u_ViewMatrix变量
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    //可视空间矩阵设置可视域
    projMatrix.setOrtho(-1.0,1.0,-1.0,1.0,0.0,2.0);//正常
    //projMatrix.setOrtho(-0.5,0.5,-0.5,0.5,0.0,1.0)//宽高减半，保持比例
    //projMatrix.setOrtho(-0.3,0.3,-1.0,1.0,0.0,0.5)//宽度减小一半
    //将可视空间矩阵传递给u_ProjMatrix变量
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.clear(gl.COlOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}