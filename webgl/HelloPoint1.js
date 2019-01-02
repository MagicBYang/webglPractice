//定点着色器

var VSHADER_SOURCE = 
    'void main() {\n'+
    ' gl_Position = vec4(0.0,0.5,0.0,1.0);\n'+ //设置坐标
    ' gl_PointSize = 10.0;\n' + //设置尺寸
    '}\n';

//片元着色器
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
    //清空指定canvas颜色
    gl.clearColor(0.0,0.0,0.0,1.0)
    //清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT)
    //绘制一个点
    gl.drawArrays(gl.POINTS,0,1)




}    