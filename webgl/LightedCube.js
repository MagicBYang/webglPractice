let VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' + //表面基底色
    'attribute vec4 a_Normal;\n' + //法向量
    'uniform mat4 u_MvpMatrix;\n' + //光线颜色
    'uniform vec3 u_LightColor;\n' + //归一化的世界坐标（入射光方向）
    'uniform vec3 u_LightDirection;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    'gl_Position = u_MvpMatrix * a_Position;\n' +//对法向量进行归一化
    'vec3 normal = normalize(vec3(a_Normal));\n' + //对法向量进行归一化
    'float nDotL = max(dot(u_LightDirection,normal),0.0);\n' + //计算光线方向和法向量的点积，即cos
    'vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;\n' +          //最终计算漫反射光的颜色  
    'v_Color = vec4(diffuse, a_Color.a);\n' +
    '}\n';
let FSHADER_SOURCE =
    //显式定义精确度
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n'+
    '  gl_FragColor = v_Color;\n'+//从顶点着色器接收数据
    '}\n';
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

    //光照相关
    //获取光线颜色变量
    let u_LightColor = gl.getUniformLocation(gl.program,'u_LightColor')
    //获取归一化坐标
    let u_LightDirection = gl.getUniformLocation(gl.program,'u_LightDirection')

    //设置光线颜色
    gl.uniform3f(u_LightColor,1.0,0.4,0.0)
    //设置光线方向(世界坐标系下)
    let lightDirection = new Vector3([0.5,3.0,4.0])
    lightDirection.normalize()//归一化
    gl.uniform3fv(u_LightDirection,lightDirection.elements)



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

    let verticesColors = new Float32Array([
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
    ])
    let colors = new Float32Array([     // Colors
        1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,    // v0-v1-v2-v3 front
        1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,     // v0-v3-v4-v5 right
        1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,     // v0-v5-v6-v1 up
        1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,     // v1-v6-v7-v2 left
        1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,    // v7-v4-v3-v2 down
        1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,　    // v4-v7-v6-v5 back
    ]);
    //顶点索引
    //顶点着色器程序将不再按照顶点本身的顺序而是根据索引进行绘制
    let indices = new Uint8Array([ //无符号8位整形数
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ])
    //法向量
    let normals = new Float32Array([
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ])
    //创建法向量缓冲区对象
    if(!initArrayBuffer(gl,normals,3,0,gl.FLOAT,'a_Normal')){
        return -1;
    }
    //创建顶点缓冲区对象
    if(!initArrayBuffer(gl,verticesColors,3,0,gl.FLOAT,'a_Position')){
        return -1;
    }
    //创建颜色缓冲区对象
    if(!initArrayBuffer(gl,colors,3,0,gl.FLOAT,'a_Color')){
        return -1;
    }
    //单独创建索引缓冲区
    let indexBuffer = gl.createBuffer();
    if(!indexBuffer){
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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

//专门初始化缓冲区
function initArrayBuffer(gl, data, num,offset=0,type, attribute) {
    let buffer = gl.createBuffer();   // Create a buffer object
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute letiable
    let a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, offset);
    // Enable the assignment of the buffer object to the attribute letiable
    gl.enableVertexAttribArray(a_attribute);

    return true;
}