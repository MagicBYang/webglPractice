let  VSHADER_SOURCE = 
 'attribute vec4 a_Position;' +
 'attribute vec2 a_TexCoord;' +
 'varying vec2 v_TexCoord;\n' + //varying变量
 'void main() {' +
 '  gl_Position = a_Position;\n' +
 '  v_TexCoord = a_TexCoord;\n' + 
 '}';

let FSHADER_SOURCE =
    //显式定义精确度
    'precision mediump float;' +
    'uniform sampler2D u_Sampler1;' +
    'uniform sampler2D u_Sampler2;' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n'+
    '  vec4 color0 = texture2D(u_Sampler1,v_TexCoord);\n'+//从顶点着色器接收数据'
    '  vec4 color1 = texture2D(u_Sampler2,v_TexCoord);\n'+//从顶点着色器接收数据'
    '  gl_FragColor = color0*color1;\n' +
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
    initTextures(gl,n)
 }
 
 function initVertexBuffers(gl){
    let verticesTexCoords = new Float32Array([
       -0.5,0.5,0.0,1.0,
       -0.5,-0.5,0.0,0.0,
        0.5,0.5,1.0,1.0,
        0.5,-0.5,1.0,0.0
    ])
    let n = 4
 
    //创建合一的缓冲区对象
    let vertexTexBuffer = gl.createBuffer();
    if(!vertexTexBuffer){
        console.log("Failed to create thie buffer object");
        return -1;
    }
    //指定缓冲区用途
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexTexBuffer)
    //向缓冲区传输数据
    gl.bufferData(gl.ARRAY_BUFFER,verticesTexCoords,gl.STATIC_DRAW)
    
    let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT
    //获取顶点着色器中的位置指针
    let a_Position = gl.getAttribLocation(gl.program,'a_Position')
    //将缓冲区分配给attribute对象(位置)
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*4,0)
    //开启缓冲区分配(位置)
    gl.enableVertexAttribArray(a_Position)

    //获取顶点着色器中的纹理坐标指针
    let a_TexCoord = gl.getAttribLocation(gl.program,'a_TexCoord')
    //将缓冲区分配给a_TexCoord
    gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2)
    //开启缓冲区分配(大小)
    gl.enableVertexAttribArray(a_TexCoord)
    
    return n
 }



 function initTextures(gl,n){

    let texture0 = gl.createTexture() //创建纹理对象1
    let texture1 = gl.createTexture() //创建纹理对象2
    //获取u_Sampler1存储位置
    let u_Sampler1 = gl.getUniformLocation(gl.program,'u_Sampler1')
    //获取u_Sampler2存储位置
    let u_Sampler2 = gl.getUniformLocation(gl.program,'u_Sampler2')
    let image1 = new Image()
    image1.onload = ()=>{
         loadTexture(gl,n,texture0,u_Sampler1,image1,0) 
    }
    let image2 = new Image()
    image2.onload = ()=>{
        loadTexture(gl,n,texture1,u_Sampler2,image2,1) 
   }
    //图片路径
    image1.src = './image/1.png'
    image2.src = './image/2.png'
    return true
 }
 let image1down = false,image2down = false
 function loadTexture(gl,n,texture,u_Sampler,image,unit){

     //y轴翻转
     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1)
     //分别开启0号和1号纹理单元
     if(unit===0){
        gl.activeTexture(gl.TEXTURE0)
        image1down = true
     }else if(unit===1){
        gl.activeTexture(gl.TEXTURE1)
        image2down = true
     } 
     //向target绑定纹理对象,指定纹理对象用途
     gl.bindTexture(gl.TEXTURE_2D,texture)
     //配置纹理参数
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR)
     //配置纹理图像
     gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image)
     //分两次将0号纹理传递给着色器,1号纹理传递给着色器
     gl.uniform1i(u_Sampler,unit)
     //指定清空<canvas>颜色
     gl.clearColor(0.0, 0.0, 0.0, 1.0)
     //清空<canvas>
     gl.clear(gl.COLOR_BUFFER_BIT)
     //POINTS
     if(image1down && image2down){
        gl.drawArrays(gl.TRIANGLE_STRIP,0,n)
     }
 }


