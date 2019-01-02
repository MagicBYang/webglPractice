let  VSHADER_SOURCE = 
 'attribute vec4 a_Position;' +
 'attribute float a_PointSize;' +
 'void main() {' +
 '  gl_Position = a_Position;' +
 '  gl_PointSize = a_PointSize;' +
 '}';

let FSHADER_SOURCE=
    'void main(){'+
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);'+
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
    //指定清空<canvas>颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,n)

 }
 
 function initVertexBuffers(gl){
    let vertices = new Float32Array([
        0.0,0.5,-0.5,-0.5,0.5,-0.5
    ])
    let n = vertices.length/2
    let sizes = new Float32Array([
        10.0,20.0,30.0  //点的尺寸
    ])
    //创建两个缓冲区对象
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("Failed to create thie buffer object");
        return -1;
    }
    let sizeBuffer = gl.createBuffer();
    if(!sizeBuffer){
        console.log("Failed to create thie buffer object");
        return -1;
    }
    //指定缓冲区用途
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
    //向缓冲区传输数据
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW)
    //获取顶点着色器中的位置指针
    let a_Position = gl.getAttribLocation(gl.program,'a_Position')
    if(a_Position < 0){
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }
    //将缓冲区分配给attribute对象
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0)
    //开启缓冲区对象
    gl.enableVertexAttribArray(a_Position)
  
    //指定缓冲区用途
    gl.bindBuffer(gl.ARRAY_BUFFER,sizeBuffer)
    //向缓冲区传输数据
    gl.bufferData(gl.ARRAY_BUFFER,sizes,gl.STATIC_DRAW)
    //获取顶点着色器中的位置指针
    let a_PointSize= gl.getAttribLocation(gl.program,'a_PointSize')
    if(a_PointSize < 0){
        console.log("Failed to get the storage a_PointSize");
        return -1;
    }
    //将缓冲区分配给attribute对象
    gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,0,0)
    //开启缓冲区对象
    gl.enableVertexAttribArray(a_PointSize)

    return n
 }