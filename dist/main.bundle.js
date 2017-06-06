/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isWebVRAvailable;
/* harmony export (immutable) */ __webpack_exports__["c"] = getVRDisplay;
/* harmony export (immutable) */ __webpack_exports__["b"] = getHelpMessageElement;
function isWebVRAvailable() {
    return navigator.getVRDisplays !== undefined;
}

function getVRDisplay(callback) {
    if (!isWebVRAvailable()) {
        callback('browser not support vr display', null);
        return;
    }

    navigator.getVRDisplays().then(displays => {
        callback(null, displays[0]);
    }).catch(error => {
        callback(error, null);
    });
}

function getHelpMessageElement(callback) {
    const makeMessageElement = message => {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '0';
        container.style.top = '0';
        container.style.right = '0';
        container.style.zIndex = '999';
        container.align = 'center';

        const error = document.createElement('div');
        error.style.fontFamily = 'sans-serif';
        error.style.fontSize = '16px';
        error.style.fontStyle = 'normal';
        error.style.lineHeight = '26px';
        error.style.backgroundColor = '#fff';
        error.style.color = '#000';
        error.style.padding = '10px 20px';
        error.style.margin = '50px';
        error.style.display = 'inline-block';
        error.innerHTML = message;
        container.appendChild(error);

        callback(container);
    };

    getVRDisplay((err, vrDisplay) => {
        if (err) {
            makeMessageElement('Your browser does not support WebVR. See <a href="http://webvr.info">webvr.info</a> for assistance.');
        } else if (!vrDisplay) {
            makeMessageElement('WebVR supported, but no VRDisplays found.');
        } else {
            callback(null);
        }
    });
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class RollerCoasterGeometry extends THREE.BufferGeometry {
    constructor(curve, divisions) {
        super();

        var vertices = [];
        var normals = [];
        var colors = [];

        var color1 = [1, 1, 1];
        var color2 = [1, 1, 0];

        var up = new THREE.Vector3(0, 1, 0);
        var forward = new THREE.Vector3();
        var right = new THREE.Vector3();

        var quaternion = new THREE.Quaternion();
        var prevQuaternion = new THREE.Quaternion();
        prevQuaternion.setFromAxisAngle(up, Math.PI / 2);

        var point = new THREE.Vector3();
        var prevPoint = new THREE.Vector3();
        prevPoint.copy(curve.getPointAt(0));

        // shapes

        var step = [new THREE.Vector3(-0.225, 0, 0), new THREE.Vector3(0, -0.050, 0), new THREE.Vector3(0, -0.175, 0), new THREE.Vector3(0, -0.050, 0), new THREE.Vector3(0.225, 0, 0), new THREE.Vector3(0, -0.175, 0)];

        var PI2 = Math.PI * 2;

        var sides = 5;
        var tube1 = [];

        for (var i = 0; i < sides; i++) {

            var angle = i / sides * PI2;
            tube1.push(new THREE.Vector3(Math.sin(angle) * 0.06, Math.cos(angle) * 0.06, 0));
        }

        var sides = 6;
        var tube2 = [];

        for (var i = 0; i < sides; i++) {

            var angle = i / sides * PI2;
            tube2.push(new THREE.Vector3(Math.sin(angle) * 0.025, Math.cos(angle) * 0.025, 0));
        }

        var vector = new THREE.Vector3();
        var normal = new THREE.Vector3();

        function drawShape(shape, color) {

            normal.set(0, 0, -1).applyQuaternion(quaternion);

            for (var j = 0; j < shape.length; j++) {

                vector.copy(shape[j]);
                vector.applyQuaternion(quaternion);
                vector.add(point);

                vertices.push(vector.x, vector.y, vector.z);
                normals.push(normal.x, normal.y, normal.z);
                colors.push(color[0], color[1], color[2]);
            }

            normal.set(0, 0, 1).applyQuaternion(quaternion);

            for (var j = 0; j < shape.length; j++) {

                vector.copy(shape[j]);
                vector.applyQuaternion(quaternion);
                vector.add(point);

                vertices.push(vector.x, vector.y, vector.z);
                normals.push(normal.x, normal.y, normal.z);
                colors.push(color[0], color[1], color[2]);
            }
        };

        var vector1 = new THREE.Vector3();
        var vector2 = new THREE.Vector3();
        var vector3 = new THREE.Vector3();
        var vector4 = new THREE.Vector3();

        var normal1 = new THREE.Vector3();
        var normal2 = new THREE.Vector3();
        var normal3 = new THREE.Vector3();
        var normal4 = new THREE.Vector3();

        function extrudeShape(shape, offset, color) {

            for (var j = 0, jl = shape.length; j < jl; j++) {

                var point1 = shape[j];
                var point2 = shape[(j + 1) % jl];

                vector1.copy(point1).add(offset);
                vector1.applyQuaternion(quaternion);
                vector1.add(point);

                vector2.copy(point2).add(offset);
                vector2.applyQuaternion(quaternion);
                vector2.add(point);

                vector3.copy(point2).add(offset);
                vector3.applyQuaternion(prevQuaternion);
                vector3.add(prevPoint);

                vector4.copy(point1).add(offset);
                vector4.applyQuaternion(prevQuaternion);
                vector4.add(prevPoint);

                vertices.push(vector1.x, vector1.y, vector1.z);
                vertices.push(vector2.x, vector2.y, vector2.z);
                vertices.push(vector3.x, vector3.y, vector3.z);

                vertices.push(vector1.x, vector1.y, vector1.z);
                vertices.push(vector3.x, vector3.y, vector3.z);
                vertices.push(vector4.x, vector4.y, vector4.z);

                //

                normal1.copy(point1);
                normal1.applyQuaternion(quaternion);
                normal1.normalize();

                normal2.copy(point2);
                normal2.applyQuaternion(quaternion);
                normal2.normalize();

                normal3.copy(point2);
                normal3.applyQuaternion(prevQuaternion);
                normal3.normalize();

                normal4.copy(point1);
                normal4.applyQuaternion(prevQuaternion);
                normal4.normalize();

                normals.push(normal1.x, normal1.y, normal1.z);
                normals.push(normal2.x, normal2.y, normal2.z);
                normals.push(normal3.x, normal3.y, normal3.z);

                normals.push(normal1.x, normal1.y, normal1.z);
                normals.push(normal3.x, normal3.y, normal3.z);
                normals.push(normal4.x, normal4.y, normal4.z);

                colors.push(color[0], color[1], color[2]);
                colors.push(color[0], color[1], color[2]);
                colors.push(color[0], color[1], color[2]);

                colors.push(color[0], color[1], color[2]);
                colors.push(color[0], color[1], color[2]);
                colors.push(color[0], color[1], color[2]);
            }
        };

        var offset = new THREE.Vector3();

        for (var i = 1; i <= divisions; i++) {

            point.copy(curve.getPointAt(i / divisions));

            up.set(0, 1, 0);

            forward.subVectors(point, prevPoint).normalize();
            right.crossVectors(up, forward).normalize();
            up.crossVectors(forward, right);

            var angle = Math.atan2(forward.x, forward.z);

            quaternion.setFromAxisAngle(up, angle);

            if (i % 2 === 0) {

                drawShape(step, color2);
            }

            extrudeShape(tube1, offset.set(0, -0.125, 0), color2);
            extrudeShape(tube2, offset.set(0.2, 0, 0), color1);
            extrudeShape(tube2, offset.set(-0.2, 0, 0), color1);

            prevPoint.copy(point);
            prevQuaternion.copy(quaternion);
        }

        // console.log( vertices.length );

        this.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        this.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    }
}

/* harmony default export */ __webpack_exports__["a"] = (RollerCoasterGeometry);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);


class VRControl {
    constructor(object) {
        this.object = object;

        this.standingMatrix = new THREE.Matrix4();
        this.scale = 1;
        this.standing = false;
        this.userHeight = 1.6;
        this.frameData = null;
    }

    init(onError) {
        if ('VRFrameData' in window) {
            this.frameData = new window.VRFrameData();
        }

        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* isWebVRAvailable */])()) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* getVRDisplay */])((err, vrDisplay) => {
                if (err) {
                    console.warn(err);
                } else if (!vrDisplay) {
                    onError('VR input not available.');
                } else {
                    this.vrDisplay = vrDisplay;
                }
            });
        }
    }

    getVRDisplay() {
        return this.vrDisplay;
    }

    setVRDisplay(value) {
        this.vrDisplay = value;
    }

    getStandingMaxtrix() {
        return this.standingMatrix;
    }

    update() {
        if (!this.vrDisplay) {
            return;
        }

        this.vrDisplay.getFrameData(this.frameData);

        const pose = this.frameData.pose;

        if (pose.orientation !== null) {
            this.object.quaternion.fromArray(pose.orientation);
        }

        if (pose.position !== null) {
            this.object.position.fromArray(pose.position);
        } else {
            this.object.position.set(0, 0, 0);
        }

        if (this.standing) {
            if (this.vrDisplay.stageParameters) {
                this.object.updateMatrix();
                this.standingMatrix.fromArray(this.vrDisplay.stageParameters.sittingToStandingTransform);
                this.object.applyMatrix(this.standingMatrix);
            } else {
                this.object.position.setY(this.object.position.y + this.userHeight);
            }
        }
    }

    dispose() {
        this.vrDisplay = null;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (VRControl);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
class VREffect {
    constructor(renderer) {
        this.renderer = renderer;

        this.vrDisplay = null;
        this.frameData = null;

        this.eyeTranslationL = new THREE.Vector3();
        this.eyeTranslationR = new THREE.Vector3();

        this.isPresenting = false;

        this.rendererSize = renderer.getSize();
        this.rendererUpdateStyle = false;
        this.rendererPixelRatio = renderer.getPixelRatio();

        this.canvas = renderer.domElement;
        this.defaultLeftBounds = [0.0, 0.0, 0.5, 1.0];
        this.defaultRightBounds = [0.5, 0.0, 0.5, 1.0];

        this.autoSubmitFrame = true;
    }

    _onVRDisplayPresentChange() {
        const wasPresenting = this.isPresenting;
        this.isPresenting = !!this.vrDisplay && this.vrDisplay.isPresenting;

        if (this.isPresenting) {
            const eyeParamsL = this.vrDisplay.getEyeParameters('left');
            const eyeWidth = eyeParamsL.renderWidth;
            const eyeHeight = eyeParamsL.renderHeight;

            if (!wasPresenting) {
                this.rendererPixelRatio = this.renderer.getPixelRatio();
                this.rendererSize = this.renderer.getSize();

                this.renderer.setPixelRatio(1);
                this.renderer.setSize(eyeWidth * 2, eyeHeight, false);
            }
        } else if (wasPresenting) {
            this.renderer.setPixelRatio(this.rendererPixelRatio);
            this.renderer.setSize(this.rendererSize.width, this.rendererSize.height, this.rendererUpdateStyle);
        }
    }

    init(onError) {
        if ('VRFrameData' in window) {
            this.frameData = new window.VRFrameData();
        }

        if (isWebVRAvailable()) {
            getVRDisplay((err, vrDisplay) => {
                if (err || !vrDisplay) {
                    onError('HMD not available');
                } else {
                    this.vrDisplay = vrDisplay;
                }
            });
        }

        window.addEventListener('vrdisplaypresentchange', () => {
            this._onVRDisplayPresentChange();
        });
    }

    getVRDisplay() {
        return this.vrDisplay;
    }

    setVRDisplay(value) {
        this.vrDisplay = value;
    }

    setSize(width, height, updateStyle) {
        this.rendererSize = { width, height };
        this.rendererUpdateStyle = updateStyle;

        if (this.isPresenting) {
            const eyeParamsL = this.vrDisplay.getEyeParameters('left');

            this.renderer.setPixelRatio(1);
            this.renderer.setSize(eyeParamsL.renderWidth * 2, eyeParamsL.renderHeight, false);

        } else {
            this.renderer.setPixelRatio(this.rendererPixelRatio);
            this.renderer.setSize(width, height, updateStyle);
        }
    }

    setFullScreen(boolean) {
        return new Promise((resolve) => {
            if (this.isPresenting === boolean) {
                resolve();
                return;
            }

            if (boolean) {
                resolve(this.vrDisplay.requestPresent({ source: this.canvas }));
            } else {
                resolve(this.vrDisplay.exitPresent());
            }
        });
    }

    requestPresent() {
        return this.setFullScreen(true);
    }

    exitPresent() {
        return this.setFullScreen(false);
    }

    requestAnimationFrame(f) {
        if (this.vrDisplay) {
            return this.vrDisplay.requestAnimationFrame(f);
        }

        return window.requestAnimationFrame(f);
    }

    cancelAnimationFrame(h) {
        if (this.vrDisplay) {
            this.vrDisplay.cancelAnimationFrame(h);
        } else {
            window.cancelAnimationFrame(h);
        }
    }

    submitFrame() {
        if (this.vrDisplay && this.isPresenting) {
            this.vrDisplay.submitFrame();
        }
    }

    render(scene, camera, renderTarget, forceClear) {
        const cameraL = new THREE.PerspectiveCamera();
        const cameraR = new THREE.PerspectiveCamera();

        cameraL.layers.enable(1);
        cameraR.layers.enable(2);

        if (this.vrDisplay && this.isPresenting) {
            const autoUpdate = scene.autoUpdate;

            if (autoUpdate) {
                scene.updateMatrixWorld();
                scene.autoUpdate = false;
            }

            const eyeParamsL = this.vrDisplay.getEyeParameters('left');
            const eyeParamsR = this.vrDisplay.getEyeParameters('right');

            this.eyeTranslationL.fromArray(eyeParamsL.offset);
            this.eyeTranslationR.fromArray(eyeParamsR.offset);

            const size = this.renderer.getSize();
            const layers = this.vrDisplay.getLayers();

            let leftBounds;
            let rightBounds;

            if (layers.length) {
                const layer = layers[0];

                leftBounds = layer.leftBounds !== null && layer.leftBounds.length === 4 ? layer.leftBounds : this.defaultLeftBounds;
                rightBounds = layer.rightBounds !== null && layer.rightBounds.length === 4 ? layer.rightBounds : this.defaultRightBounds;

            } else {
                leftBounds = defaultLeftBounds;
                rightBounds = defaultRightBounds;
            }

            const renderReactL = {
                x: Math.round(size.width * leftBounds[0]),
                y: Math.round(size.height * leftBounds[1]),
                width: Math.round(size.width * leftBounds[2]),
                height: Math.round(size.height * leftBounds[3])
            };

            const renderRectR = {
                x: Math.round(size.width * rightBounds[0]),
                y: Math.round(size.height * rightBounds[1]),
                width: Math.round(size.width * rightBounds[2]),
                height: Math.round(size.height * rightBounds[3])
            };

            if (renderTarget) {
                this.renderer.setRenderTarget(renderTarget);
                renderTarget.scissorTest = true;
            } else {
                this.renderer.setRenderTarget(null);
                this.renderer.setScissorTest(true);
            }

            if (this.renderer.autoClear || forceClear) {
                this.renderer.clear();
            }

            if (camera.parent === null) {
                camera.updateMatrixWorld();
            }

            camera.matrixWorld.decompose(cameraL.position, cameraL.quaternion, cameraL.scale);

            cameraR.position.copy(cameraL.position);
            cameraR.quaternion.copy(cameraL.quaternion);
            cameraR.scale.copy(cameraL.scale);

            cameraL.translateOnAxis(this.eyeTranslationL, cameraL.scale.x);
            cameraR.translateOnAxis(this.eyeTranslationR, cameraR.scale.x);

            if (this.vrDisplay.getFrameData) {

            }
        }
    }
}
*/

function VREffect(renderer, onError) {

    var vrDisplay, vrDisplays;
    var eyeTranslationL = new THREE.Vector3();
    var eyeTranslationR = new THREE.Vector3();
    var renderRectL, renderRectR;

    var frameData = null;

    if ('VRFrameData' in window) {

        frameData = new window.VRFrameData();
    }

    function gotVRDisplays(displays) {

        vrDisplays = displays;

        if (displays.length > 0) {

            vrDisplay = displays[0];
        } else {

            if (onError) onError('HMD not available');
        }
    }

    console.log(navigator.getVRDisplays);

    if (navigator.getVRDisplays) {

        navigator.getVRDisplays().then(gotVRDisplays).catch(function () {

            console.warn('THREE.VREffect: Unable to get VR Displays');
        });
    }

    //

    this.isPresenting = false;

    var scope = this;

    var rendererSize = renderer.getSize();
    var rendererUpdateStyle = false;
    var rendererPixelRatio = renderer.getPixelRatio();

    this.getVRDisplay = function () {

        return vrDisplay;
    };

    this.setVRDisplay = function (value) {

        vrDisplay = value;
    };

    this.getVRDisplays = function () {

        console.warn('THREE.VREffect: getVRDisplays() is being deprecated.');
        return vrDisplays;
    };

    this.setSize = function (width, height, updateStyle) {

        rendererSize = { width: width, height: height };
        rendererUpdateStyle = updateStyle;

        if (scope.isPresenting) {

            var eyeParamsL = vrDisplay.getEyeParameters('left');
            renderer.setPixelRatio(1);
            renderer.setSize(eyeParamsL.renderWidth * 2, eyeParamsL.renderHeight, false);
        } else {

            renderer.setPixelRatio(rendererPixelRatio);
            renderer.setSize(width, height, updateStyle);
        }
    };

    // VR presentation

    var canvas = renderer.domElement;
    var defaultLeftBounds = [0.0, 0.0, 0.5, 1.0];
    var defaultRightBounds = [0.5, 0.0, 0.5, 1.0];

    function onVRDisplayPresentChange() {

        var wasPresenting = scope.isPresenting;
        scope.isPresenting = vrDisplay !== undefined && vrDisplay.isPresenting;

        if (scope.isPresenting) {

            var eyeParamsL = vrDisplay.getEyeParameters('left');
            var eyeWidth = eyeParamsL.renderWidth;
            var eyeHeight = eyeParamsL.renderHeight;

            if (!wasPresenting) {

                rendererPixelRatio = renderer.getPixelRatio();
                rendererSize = renderer.getSize();

                renderer.setPixelRatio(1);
                renderer.setSize(eyeWidth * 2, eyeHeight, false);
            }
        } else if (wasPresenting) {

            renderer.setPixelRatio(rendererPixelRatio);
            renderer.setSize(rendererSize.width, rendererSize.height, rendererUpdateStyle);
        }
    }

    window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange, false);

    this.setFullScreen = function (boolean) {

        return new Promise(function (resolve, reject) {

            if (vrDisplay === undefined) {

                reject(new Error('No VR hardware found.'));
                return;
            }

            if (scope.isPresenting === boolean) {

                resolve();
                return;
            }

            if (boolean) {

                resolve(vrDisplay.requestPresent([{ source: canvas }]));
            } else {

                resolve(vrDisplay.exitPresent());
            }
        });
    };

    this.requestPresent = function () {

        return this.setFullScreen(true);
    };

    this.exitPresent = function () {

        return this.setFullScreen(false);
    };

    this.requestAnimationFrame = function (f) {

        if (vrDisplay !== undefined) {

            return vrDisplay.requestAnimationFrame(f);
        } else {

            return window.requestAnimationFrame(f);
        }
    };

    this.cancelAnimationFrame = function (h) {

        if (vrDisplay !== undefined) {

            vrDisplay.cancelAnimationFrame(h);
        } else {

            window.cancelAnimationFrame(h);
        }
    };

    this.submitFrame = function () {

        if (vrDisplay !== undefined && scope.isPresenting) {

            vrDisplay.submitFrame();
        }
    };

    this.autoSubmitFrame = true;

    // render

    var cameraL = new THREE.PerspectiveCamera();
    cameraL.layers.enable(1);

    var cameraR = new THREE.PerspectiveCamera();
    cameraR.layers.enable(2);

    this.render = function (scene, camera, renderTarget, forceClear) {

        if (vrDisplay && scope.isPresenting) {

            var autoUpdate = scene.autoUpdate;

            if (autoUpdate) {

                scene.updateMatrixWorld();
                scene.autoUpdate = false;
            }

            var eyeParamsL = vrDisplay.getEyeParameters('left');
            var eyeParamsR = vrDisplay.getEyeParameters('right');

            eyeTranslationL.fromArray(eyeParamsL.offset);
            eyeTranslationR.fromArray(eyeParamsR.offset);

            if (Array.isArray(scene)) {

                console.warn('THREE.VREffect.render() no longer supports arrays. Use object.layers instead.');
                scene = scene[0];
            }

            // When rendering we don't care what the recommended size is, only what the actual size
            // of the backbuffer is.
            var size = renderer.getSize();
            var layers = vrDisplay.getLayers();
            var leftBounds;
            var rightBounds;

            if (layers.length) {

                var layer = layers[0];

                leftBounds = layer.leftBounds !== null && layer.leftBounds.length === 4 ? layer.leftBounds : defaultLeftBounds;
                rightBounds = layer.rightBounds !== null && layer.rightBounds.length === 4 ? layer.rightBounds : defaultRightBounds;
            } else {

                leftBounds = defaultLeftBounds;
                rightBounds = defaultRightBounds;
            }

            renderRectL = {
                x: Math.round(size.width * leftBounds[0]),
                y: Math.round(size.height * leftBounds[1]),
                width: Math.round(size.width * leftBounds[2]),
                height: Math.round(size.height * leftBounds[3])
            };
            renderRectR = {
                x: Math.round(size.width * rightBounds[0]),
                y: Math.round(size.height * rightBounds[1]),
                width: Math.round(size.width * rightBounds[2]),
                height: Math.round(size.height * rightBounds[3])
            };

            if (renderTarget) {

                renderer.setRenderTarget(renderTarget);
                renderTarget.scissorTest = true;
            } else {

                renderer.setRenderTarget(null);
                renderer.setScissorTest(true);
            }

            if (renderer.autoClear || forceClear) renderer.clear();

            if (camera.parent === null) camera.updateMatrixWorld();

            camera.matrixWorld.decompose(cameraL.position, cameraL.quaternion, cameraL.scale);

            cameraR.position.copy(cameraL.position);
            cameraR.quaternion.copy(cameraL.quaternion);
            cameraR.scale.copy(cameraL.scale);

            cameraL.translateOnAxis(eyeTranslationL, cameraL.scale.x);
            cameraR.translateOnAxis(eyeTranslationR, cameraR.scale.x);

            if (vrDisplay.getFrameData) {

                vrDisplay.depthNear = camera.near;
                vrDisplay.depthFar = camera.far;

                vrDisplay.getFrameData(frameData);

                cameraL.projectionMatrix.elements = frameData.leftProjectionMatrix;
                cameraR.projectionMatrix.elements = frameData.rightProjectionMatrix;
            } else {

                cameraL.projectionMatrix = fovToProjection(eyeParamsL.fieldOfView, true, camera.near, camera.far);
                cameraR.projectionMatrix = fovToProjection(eyeParamsR.fieldOfView, true, camera.near, camera.far);
            }

            // render left eye
            if (renderTarget) {

                renderTarget.viewport.set(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
                renderTarget.scissor.set(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
            } else {

                renderer.setViewport(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
                renderer.setScissor(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
            }
            renderer.render(scene, cameraL, renderTarget, forceClear);

            // render right eye
            if (renderTarget) {

                renderTarget.viewport.set(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
                renderTarget.scissor.set(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
            } else {

                renderer.setViewport(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
                renderer.setScissor(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
            }
            renderer.render(scene, cameraR, renderTarget, forceClear);

            if (renderTarget) {

                renderTarget.viewport.set(0, 0, size.width, size.height);
                renderTarget.scissor.set(0, 0, size.width, size.height);
                renderTarget.scissorTest = false;
                renderer.setRenderTarget(null);
            } else {

                renderer.setViewport(0, 0, size.width, size.height);
                renderer.setScissorTest(false);
            }

            if (autoUpdate) {

                scene.autoUpdate = true;
            }

            if (scope.autoSubmitFrame) {

                scope.submitFrame();
            }

            return;
        }

        // Regular render mode if not HMD

        renderer.render(scene, camera, renderTarget, forceClear);
    };

    this.dispose = function () {

        window.removeEventListener('vrdisplaypresentchange', onVRDisplayPresentChange, false);
    };

    //

    function fovToNDCScaleOffset(fov) {

        var pxscale = 2.0 / (fov.leftTan + fov.rightTan);
        var pxoffset = (fov.leftTan - fov.rightTan) * pxscale * 0.5;
        var pyscale = 2.0 / (fov.upTan + fov.downTan);
        var pyoffset = (fov.upTan - fov.downTan) * pyscale * 0.5;
        return { scale: [pxscale, pyscale], offset: [pxoffset, pyoffset] };
    }

    function fovPortToProjection(fov, rightHanded, zNear, zFar) {

        rightHanded = rightHanded === undefined ? true : rightHanded;
        zNear = zNear === undefined ? 0.01 : zNear;
        zFar = zFar === undefined ? 10000.0 : zFar;

        var handednessScale = rightHanded ? -1.0 : 1.0;

        // start with an identity matrix
        var mobj = new THREE.Matrix4();
        var m = mobj.elements;

        // and with scale/offset info for normalized device coords
        var scaleAndOffset = fovToNDCScaleOffset(fov);

        // X result, map clip edges to [-w,+w]
        m[0 * 4 + 0] = scaleAndOffset.scale[0];
        m[0 * 4 + 1] = 0.0;
        m[0 * 4 + 2] = scaleAndOffset.offset[0] * handednessScale;
        m[0 * 4 + 3] = 0.0;

        // Y result, map clip edges to [-w,+w]
        // Y offset is negated because this proj matrix transforms from world coords with Y=up,
        // but the NDC scaling has Y=down (thanks D3D?)
        m[1 * 4 + 0] = 0.0;
        m[1 * 4 + 1] = scaleAndOffset.scale[1];
        m[1 * 4 + 2] = -scaleAndOffset.offset[1] * handednessScale;
        m[1 * 4 + 3] = 0.0;

        // Z result (up to the app)
        m[2 * 4 + 0] = 0.0;
        m[2 * 4 + 1] = 0.0;
        m[2 * 4 + 2] = zFar / (zNear - zFar) * -handednessScale;
        m[2 * 4 + 3] = zFar * zNear / (zNear - zFar);

        // W result (= Z in)
        m[3 * 4 + 0] = 0.0;
        m[3 * 4 + 1] = 0.0;
        m[3 * 4 + 2] = handednessScale;
        m[3 * 4 + 3] = 0.0;

        mobj.transpose();
        return mobj;
    }

    function fovToProjection(fov, rightHanded, zNear, zFar) {

        var DEG2RAD = Math.PI / 180.0;

        var fovPort = {
            upTan: Math.tan(fov.upDegrees * DEG2RAD),
            downTan: Math.tan(fov.downDegrees * DEG2RAD),
            leftTan: Math.tan(fov.leftDegrees * DEG2RAD),
            rightTan: Math.tan(fov.rightDegrees * DEG2RAD)
        };

        return fovPortToProjection(fovPort, rightHanded, zNear, zFar);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (VREffect);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__geometries_roller_coaster__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vr_control__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vr_effect__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vr_utils__ = __webpack_require__(0);





if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__vr_utils__["a" /* isWebVRAvailable */])()) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__vr_utils__["b" /* getHelpMessageElement */])(element => {
        document.body.appendChild(element);
    });
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xf0f0ff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Light
const light = new THREE.HemisphereLight(0xfff0f0, 0x606066);
light.position.set(1, 1, 1);
scene.add(light);

// Train
const train = new THREE.Object3D();
scene.add(train);
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 500);
train.add(camera);

// Roller coaster rail
const PI2 = Math.PI * 2;
const curve = (() => {
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();

    return {
        getPointAt(t) {
            const p = t * PI2;

            const x = Math.sin(p * 3) * Math.cos(p * 4) * 50;
            const y = Math.sin(p * 10) * 2 + Math.cos(p * 17) * 2 + 5;
            const z = Math.sin(p) * Math.sin(p * 4) * 50;

            return v1.set(x, y, z).multiplyScalar(2);
        },

        getTangentAt(t) {
            const delta = 0.00001;

            const t1 = Math.max(0, t - delta);
            const t2 = Math.min(1, t + delta);

            return v2.copy(this.getPointAt(t2)).sub(this.getPointAt(t1)).normalize();
        }
    };
})();

const rollerCoasterGeometry = new __WEBPACK_IMPORTED_MODULE_0__geometries_roller_coaster__["a" /* default */](curve, 1500);
const material = new THREE.MeshPhongMaterial({
    vertexColors: THREE.VertexColors
});
const mesh = new THREE.Mesh(rollerCoasterGeometry, material);
scene.add(mesh);

// VR
const control = new __WEBPACK_IMPORTED_MODULE_1__vr_control__["a" /* default */](camera);
const effect = new __WEBPACK_IMPORTED_MODULE_2__vr_effect__["a" /* default */](renderer);

control.init();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);
});

// Animation
const position = new THREE.Vector3();
const tangent = new THREE.Vector3();
const lookAt = new THREE.Vector3();

let velocity = 0;
let progress = 0;
let prevTime = window.performance.now();

function animate(time) {
    effect.requestAnimationFrame(animate);

    const delta = time - prevTime;

    progress += velocity;
    progress = progress % 1;
    position.copy(curve.getPointAt(progress));
    position.y += 0.3;
    train.position.copy(position);
    tangent.copy(curve.getTangentAt(progress));
    velocity -= tangent.y * 0.0000001 * delta;
    velocity = Math.max(0.00001, Math.min(0.0002, velocity));
    train.lookAt(lookAt.copy(position).sub(tangent));

    control.update();
    effect.render(scene, camera);

    prevTime = time;
}

effect.requestAnimationFrame(animate);

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map