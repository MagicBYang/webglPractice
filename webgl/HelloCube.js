let VSHADER_SOURCE = 
    'attribute vec4 a_Position;' +
    'attribute vec4 a_Color;' +
    'uniform mat4 u_MvpMatrix;' +
    'varying vec4 v_Color;\n' +
    'void main() {' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
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
    //MVP矩阵
    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    //注册键盘事件响应函数
    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_MvpMatrix,canvas);
    };
    //指定清空<canvas>颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST)
    draw(gl, n, u_MvpMatrix,x,y,z,canvas);
    
 }
 
 function initVertexBuffers(gl){
     // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    let verticesColors = new Float32Array([
        1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
        1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
        1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
        1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
    ])
    //顶点索引
    //顶点着色器程序将不再按照顶点本身的顺序而是根据索引进行绘制
    let indices = new Uint8Array([ //无符号8位整形数
        0,1,2,0,2,3,//前
        0,3,4,0,4,5,//右
        0,5,6,0,6,1,//上
        1,6,7,1,7,2,//左
        7,4,3,7,3,2,//下
        4,7,6,4,6,5//后    
    ])

    //创建缓冲区对象
    let vertexColorBuffer = gl.createBuffer();
    if(!vertexColorBuffer){
        console.log("Failed to create thie buffer object");
        return -1;
    }
    //指定缓冲区用途
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexColorBuffer)
    //向缓冲区传输顶点数据
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

    //创建顶点索引缓冲区
    let indexBuffer = gl.createBuffer();
    if(!indexBuffer){
        console.log("Failed to create thie buffer object");
        return -1;
    }
    //将顶点索引数写入缓冲区对象，告诉webgl该缓冲区的内容是顶点索引值数据
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW)
    return indices.length
 }

 //计算相机视点，视线，上方向
 function getViewMatrix(){
     let viewMatrix = new Matrix4()
     viewMatrix.setLookAt(3,3,7,0,0,0,0,1,0)
     return viewMatrix
 }
 //计算投影矩阵
 function getProjMatrix(canvas){
     let projMatrix = new Matrix4()
     projMatrix.setPerspective(30,canvas.width/canvas.height,1,100)
     return projMatrix
 }
 //计算模型矩阵
 function getModelMatrix(x=0.75,y=0,z=0){
    let modelMatrix = new Matrix4()
    modelMatrix.setTranslate(x, y, z); //平移0.75单位
    return modelMatrix
 }

 //执行绘制
function draw(gl, n, u_MvpMatrix,x,y,z,canvas) {
    let modelMatrix = getModelMatrix(x,y,z)
    let projMatrix = getProjMatrix(canvas)
    let viewMatrix = getViewMatrix()
    let m = new Matrix4()
 
    let MvpMatrix = m.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)

    gl.uniformMatrix4fv(u_MvpMatrix,false,MvpMatrix.elements)
    
    //同时清除颜色缓冲区和深度缓冲区
    gl.clear(gl.COlOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //此处的n表示索引数组的长度，而不是本身数据顶点的个数
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
}
 //键盘监听
let x = 0.75, y = 0, z = 0.25; //视点
function keydown(ev, gl, n,u_MvpMatrix,canvas) {
    if(ev.keyCode == 39){   //按下右键
        x += 0.05;
    }else if(ev.keyCode == 37){ //按下左键
        x -= 0.05;
    }else if(ev.keyCode == 38){ //按下左键
        z += 0.05;
    }else if(ev.keyCode == 40){ //按下左键
        z -= 0.05;
    }else {
        return ;
    }
    draw(gl, n,u_MvpMatrix,x,y,z,canvas)
}