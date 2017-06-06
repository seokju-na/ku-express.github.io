(function () {
    var app = window.app || {};

    function VRControls(object, onError) {
        this.object = object;

        this.standingMatrix = new THREE.Matrix4();
        this.scale = 1;
        this.standing = false;
        this.userHeight = 1.6;
        this.frameData = null;

        if ('VRFrameData' in window) {
            this.frameData = new window.VRFrameData();
        }

        if (navigator.getVRDisplays) {
            navigator
                .getVRDisplays()
                .then(function (displays) {
                    if (displays.length > 0) {
                        this.vrDisplay = displays[0];
                    } else {
                        onError('VR input not available.');
                    }
                }.bind(this))
                .catch(function () {
                    console.warn('Unable to get VR Displays');
                });
        }
    }

    VRControls.prototype.getVRDisplay = function () {
        return this.vrDisplay;
    };

    VRControls.prototype.setVRDisplay = function (value) {
        this.vrDisplay = value;
    };

    VRControls.prototype.getStandingMatrix = function () {
        return this.standingMatrix;
    };

    VRControls.prototype.update = function () {
        if (!this.vrDisplay) {
            return;
        }

        this.vrDisplay.getFrameData(this.frameData);

        var pose = this.frameData.pose;

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
                this.object.applyMatrix(this.tandingMatrix);
            } else {
                this.object.position.setY(this.object.position.y + this.userHeight);
            }
        }
    };

    VRControls.prototype.dispose = function () {
        this.vrDisplay = null;
    };

    app.VRControls = VRControls;
    window.app = app;
})();
