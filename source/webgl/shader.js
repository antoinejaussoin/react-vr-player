var fragment = require('./fragment.glsl');
var vertex = require('./vertex.glsl');

module.exports = function Shader(params, gl) {
    this.params = params;
    this.fragmentShader = getShader(fragment, 'fragment', gl);
    this.vertexShader = getShader(vertex, 'vertex', gl);

    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(this.program));
    }

    gl.useProgram(this.program);

    this.attributes = {};
    for (var i = 0; i < this.params.attributes.length; i++) {
        var attributeName = this.params.attributes[i];
        this.attributes[attributeName] = gl.getAttribLocation(this.program, attributeName);
        gl.enableVertexAttribArray(this.attributes[attributeName]);
    }

    this.uniforms = {};
    for (i = 0; i < this.params.uniforms.length; i++) {
        var uniformName = this.params.uniforms[i];
        this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
        gl.enableVertexAttribArray(this.attributes[uniformName]);
    }
};

function getShader(source, type, gl) {
    var result;

    if (type === 'fragment') {
        result = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type === 'vertex') {
        result = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null; // Unknown shader type
    }

    gl.shaderSource(result, source);
    gl.compileShader(result);

    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(result));
        return null;
    }

    return result;
}
