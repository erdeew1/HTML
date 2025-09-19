var cn = document.querySelector('canvas'),
    gl = cn.getContext('experimental-webgl'),
    cw, ch, st = Date.now();

window.onresize = () => {
    cw = cn.width  = window.innerWidth;
    ch = cn.height = window.innerHeight;
    gl.viewport(0, 0, cw, ch);
};  
onresize();

const fragmentShader = compileShader(gl, cn.textContent, gl.FRAGMENT_SHADER);
const vertexShader = compileShader(gl, `attribute vec3 avp;void main(){gl_Position = vec4(avp, 1.0);}`, gl.VERTEX_SHADER); 
const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);    
gl.linkProgram(program);
gl.useProgram(program);

const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
const timeLocation = gl.getUniformLocation(program, 'uTime');    
const vertexPositionLocation = gl.getAttribLocation(program, 'avp');

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(vertexPositionLocation);
gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 0, 0);

render();


function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function render() {
    gl.uniform1f(timeLocation, Date.now() - st);
    gl.uniform2fv(resolutionLocation, [cw, ch]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    window.requestAnimationFrame(render);
}