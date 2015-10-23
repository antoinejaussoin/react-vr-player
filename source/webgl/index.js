/* jshint -W069 */

var glMatrix = require('gl-matrix');
var settings = require('./settings');
var Shader = require('./shader');
if (__DEVELOPMENT__) {
    var Stats = require('stats.js');
}

module.exports = function (vrDevice, phoneDevice, video, canvas, width) {
    var positionsBuffer, verticesIndexBuffer, texture;
    var shader;
    var gl;
    var stats;

    var manualRotateRate = new Float32Array([0, 0, 0]);
    var frameId;
    var frame, previousFrame;

    return new Promise(function (resolve, reject) {
        gl = initWebGL(canvas);
        if (gl) {
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clearDepth(1.0);
            gl.disable(gl.DEPTH_TEST);
            initStats();
            initBuffers(gl);
            initTextures(gl);
            resolve({
                draw: function () {
                    if (frameId) {
                        cancelAnimationFrame(frameId);
                    }
                    frameId = requestAnimationFrame(buildDrawScene(video, canvas, gl, width));
                    return frameId;
                },
                stop: function () {
                    if (frameId) {
                        cancelAnimationFrame(frameId);
                        frameId = null;
                    }
                },
                rotate: function (axis, value) {
                    manualRotateRate[axis] += value;
                }
            });
        } else {
            reject('Unable to initialize WebGL. Your browser may not support it.');
        }
    });

    function initStats() {
        if (Stats) {
            stats = new Stats();
            stats.setMode(0);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.right = '50px';
            stats.domElement.style.bottom = '50px';
            canvas.ownerDocument.body.appendChild(stats.domElement);
        }
    }

    function initWebGL() {
        var gl = null;
        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        } catch (e) {}

        if (!gl) {
            return null;
        }

        shader = new Shader({
            fragmentShaderName: 'shader-fs',
            vertexShaderName: 'shader-vs',
            attributes: ['aVertexPosition'],
            uniforms: ['uSampler', 'eye', 'projection', 'proj_inv'],
        }, gl);

        return gl;
    }

    function initBuffers() {
        positionsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
        var positions = [
            -1.0, -1.0,
            1.0, -1.0,
            1.0, 1.0,
            -1.0, 1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        verticesIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticesIndexBuffer);
        var vertexIndices = [
            0, 1, 2, 0, 2, 3,
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(vertexIndices), gl.STATIC_DRAW);
    }

    function initTextures() {
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function updateTexture() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB,
            gl.UNSIGNED_BYTE, video);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    /**
     * Drawing the scene
     */
    function drawOneEye(eye, projectionMatrix) {
        gl.useProgram(shader.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
        gl.vertexAttribPointer(shader.attributes['aVertexPosition'], 2, gl.FLOAT, false, 0, 0);

        // Specify the texture to map onto the faces.
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shader.uniforms['uSampler'], 0);

        gl.uniform1f(shader.uniforms['eye'], eye);
        gl.uniform1f(shader.uniforms['projection'], settings.projection);

        var rotation = glMatrix.mat4.create();
        var totalRotation = glMatrix.quat.create();

        if (vrDevice.sensor !== null) {
            var state = vrDevice.sensor.getState();
            if (state !== null && state.orientation !== null && typeof state.orientation !== 'undefined' &&
                state.orientation.x !== 0 &&
                state.orientation.y !== 0 &&
                state.orientation.z !== 0 &&
                state.orientation.w !== 0) {
                var sensorOrientation = new Float32Array([state.orientation.x, state.orientation.y, state.orientation.z, state.orientation.w]);
                glMatrix.quat.multiply(totalRotation, settings.manualRotation, sensorOrientation);
            } else {
                totalRotation = settings.manualRotation;
            }
            glMatrix.mat4.fromQuat(rotation, totalRotation);
        } else {
            glMatrix.quat.multiply(totalRotation, settings.manualRotation, phoneDevice.rotationQuat());
            glMatrix.mat4.fromQuat(rotation, totalRotation);
        }

        var projectionInverse = glMatrix.mat4.create();
        glMatrix.mat4.invert(projectionInverse, projectionMatrix);
        var inv = glMatrix.mat4.create();
        glMatrix.mat4.multiply(inv, rotation, projectionInverse);

        gl.uniformMatrix4fv(shader.uniforms['proj_inv'], false, inv);

        if (eye === 0) { // left eye
            gl.viewport(0, 0, canvas.width / 2, canvas.height);
        } else { // right eye
            gl.viewport(canvas.width / 2, 0, canvas.width / 2, canvas.height);
        }

        // Draw
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticesIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    function buildDrawScene() {
        return function drawScene(frameTime) {
            if (stats) {
                stats.begin();
            }
            frame = frameTime;

            setCanvasSize(gl, vrDevice, canvas, width);

            updateTexture(gl, video);

            if (previousFrame) {
                // Apply manual controls.
                var interval = (frame - previousFrame) * 0.001;

                var update = glMatrix.quat.fromValues(manualRotateRate[0] * interval,
                    manualRotateRate[1] * interval,
                    manualRotateRate[2] * interval, 1.0);
                glMatrix.quat.normalize(update, update);
                glMatrix.quat.multiply(settings.manualRotation, settings.manualRotation, update);
            }

            var perspectiveMatrix = glMatrix.mat4.create();
            if (vrDevice.hmd) {
                var leftParams = vrDevice.hmd.getEyeParameters('left');
                var rightParams = vrDevice.hmd.getEyeParameters('right');
                perspectiveMatrix = mat4PerspectiveFromVRFieldOfView(leftParams.recommendedFieldOfView, 0.1, 10);
                drawOneEye(0, perspectiveMatrix);
                perspectiveMatrix = mat4PerspectiveFromVRFieldOfView(rightParams.recommendedFieldOfView, 0.1, 10);
                drawOneEye(1, perspectiveMatrix);
            } else {
                var ratio = (canvas.width / 2) / canvas.height;
                glMatrix.mat4.perspective(perspectiveMatrix, Math.PI / 2, ratio, 0.1, 10);
                drawOneEye(0, perspectiveMatrix);
                drawOneEye(1, perspectiveMatrix);
            }

            if (stats) {
                stats.end();
            }

            frameId = requestAnimationFrame(drawScene);
            previousFrame = frame;
        };
    }

    function setCanvasSize() {
        if (!window){
            return;
        }
        var w = window.innerWidth,
            h = window.innerHeight;

        if (width) {
            w = width;
            h = width / (1980 / 1024);
        }

        setCustomCanvasSize(w, h);
    }

    function setCustomCanvasSize(width, height) {

        if (typeof vrDevice.hmd !== 'undefined' && vrDevice.hmd !== null && typeof isFullscreen() !== 'undefined' && isFullscreen()) {

            var rectHalf = vrDevice.hmd.getEyeParameters('right').renderRect;
            canvas.width = rectHalf.width * 2;
            canvas.height = rectHalf.height;

            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        } else {
            // query the various pixel ratios
            var devicePixelRatio = window.devicePixelRatio || 1;
            var backingStoreRatio = gl.webkitBackingStorePixelRatio ||
                gl.mozBackingStorePixelRatio ||
                gl.msBackingStorePixelRatio ||
                gl.oBackingStorePixelRatio ||
                gl.backingStorePixelRatio || 1;
            var ratio = devicePixelRatio / backingStoreRatio;

            if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
                canvas.width = width * ratio;
                canvas.height = height * ratio;

                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
            }
        }
    }

    function mat4PerspectiveFromVRFieldOfView(fov, zNear, zFar) {
        var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
        var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
        var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
        var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);

        var xScale = 2.0 / (leftTan + rightTan);
        var yScale = 2.0 / (upTan + downTan);

        var out = new Float32Array(16); // Appropriate format to pass to WebGL
        out[0] = xScale;
        out[4] = 0.0;
        out[8] = -((leftTan - rightTan) * xScale * 0.5);
        out[12] = 0.0;

        out[1] = 0.0;
        out[5] = yScale;
        out[9] = ((upTan - downTan) * yScale * 0.5);
        out[13] = 0.0;

        out[2] = 0.0;
        out[6] = 0.0;
        out[10] = zFar / (zNear - zFar);
        out[14] = (zFar * zNear) / (zNear - zFar);

        out[3] = 0.0;
        out[7] = 0.0;
        out[11] = -1.0;
        out[15] = 0.0;

        return out;
    }

    function isFullscreen() {
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitCurrentFullScreenElement;
    }
};
