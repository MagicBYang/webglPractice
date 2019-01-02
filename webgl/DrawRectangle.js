function main(){

  //获取canvas
  let canvas = document.getElementById('webgl')

  //获取上下文
  let gl = getWebGLContext(canvas)
  if(!gl){
      console.log("无法获取上下文")
      return
  }
  //清空指定canvas颜色
  gl.clearColor(0.0,0.0,0.0,1.0)
  
  //清空canvas
  gl.clear(gl.COLOR_BUFFER_BIT)
  
  gl.clearDepth(0.1)
}