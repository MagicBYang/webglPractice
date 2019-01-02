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
    let verticesSizes = new Float32Array([
        0.0,0.5,10,
        -0.5,-0.5,20,
        0.5,-0.5,40
    ])
    let n = verticesSizes.length/3
 
    //创建合一的缓冲区对象
    let vertexSizeBuffer = gl.createBuffer();
    if(!vertexSizeBuffer){
        console.log("Failed to create thie buffer object");
        return -1;
    }
    //指定缓冲区用途
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexSizeBuffer)
    //向缓冲区传输数据
    gl.bufferData(gl.ARRAY_BUFFER,verticesSizes,gl.STATIC_DRAW)
    
    let FSIZE = verticesSizes.BYTES_PER_ELEMENT
    //获取顶点着色器中的位置指针
    let a_Position = gl.getAttribLocation(gl.program,'a_Position')
    //将缓冲区分配给attribute对象(位置)
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*3,0)
    //开启缓冲区分配(位置)
    gl.enableVertexAttribArray(a_Position)

    //获取顶点着色器中的大小指针
    let a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize')
    //将缓冲区分配给attribute对象(大小)
    gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,FSIZE*3,FSIZE*2)
    //开启缓冲区分配(大小)
    gl.enableVertexAttribArray(a_PointSize)
    

    return n
 }