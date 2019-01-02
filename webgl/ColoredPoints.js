//VSHADER

let VSHADER_SOURCE = 
//全局变量，存储限定符，是一个attribute类型变量，数据从着色器外部传入
//webgl系统对外接口
'attribute vec4 a_Position;\n' +
'attribute float a_PointSize;\n'+
'void main() {\n' +
'  gl_Position = a_Position;\n' +
'  gl_PointSize = 20.0;\n' +
'}\n';

//FSHADER
var FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +//uniform变量
    'void main() {\n' +
    ' gl_FragColor = u_FragColor;\n' + //通过传入的值改变颜色    
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
        
        //获取attribute变量的存储位置
        let a_Position = gl.getAttribLocation(gl.program,'a_Position')
        let a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize')
        let u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor')
        if(a_Position<0){
            console.log("无法获取该变量")
            return
        }
        //注册鼠标事件
        canvas.onmousedown = function(e) {click(e,gl,canvas,a_Position,u_FragColor,a_PointSize);};
        
        //清空指定canvas颜色
        gl.clearColor(0.0,0.0,0.0,1.0)
        //清空canvas
        gl.clear(gl.COLOR_BUFFER_BIT)
        
        }

        let g_points = [] //鼠标点击位置的数组
        let g_color = [] //存储点颜色的数组

        function click(ev,gl,canvas,a_Position,u_FragColor,a_PointSize){
           let x = ev.clientX;
           let y = ev.clientY;
           let rect = ev.target.getBoundingClientRect()

           x = ((x-rect.left)-canvas.height/2)/(canvas.height/2);
           y = (canvas.width/2-(y-rect.top))/(canvas.width/2);
           
           //存储坐标
           g_points.push([x,y])
           //存储颜色
           if(x<0.0 && y>0.0){ //第0象限
             g_color.push([0.0,0.0,1.0,1.0]) //蓝色
           }
           else if(x>=0.0 && y>=0.0){ //第一象限
             g_color.push([1.0,0.0,0.0,1.0]) //红色
           }else if(x<0.0 && y<0.0){ //第三象限
             g_color.push([0.0,1.0,0.0,1.0]) //绿色
           }else {  //其他
             g_color.push([1.0,1.0,1.0,1.0])//白色  
           }
        
        //清空canvas
        gl.clear(gl.COLOR_BUFFER_BIT)
        let len = g_points.length
        //由于是逐顶点和逐片元进行操作，所以不论g_points和g_color有多长，每次都必须从开始进行绘制操作，否则只能绘制最后一次的结果
        for(let i =0;i<len;i++){
            //一个点对应一个颜色
            let xy = g_points[i]
            let rgba = g_color[i]
            //将点的位置传输到a_Position变量中
            gl.vertexAttrib3f(a_Position,xy[0],xy[1],0.0)
            //将点的颜色传输到u_FragColor变量中
            gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3])
            //绘制点
            gl.drawArrays(gl.POINTS,0,1)
        }
         
          //  //例子如下，无法对结果进行保存。原因是颜色缓冲区每次绘制完毕后都会被清除
          //  //所以实际上每次看到的保存前次视图结果的情况，是每次重复绘制的结果
          //   gl.vertexAttrib4f(a_Position,g_points[g_points.length-1][0],g_points[g_points.length-1][1],0.0,1.0)
          //   //将点的颜色传输到u_FragColor变量中
          //   gl.uniform4f(u_FragColor,g_color[g_color.length-1][0],g_color[g_color.length-1][1],g_color[g_color.length-1][2],g_color[g_color.length-1][3])
          //   //绘制点
          //   gl.drawArrays(gl.POINTS,0,1)


    }
