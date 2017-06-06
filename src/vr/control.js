import { isWebVRAvailable, getVRDisplay } from './utils';

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

        if (isWebVRAvailable()) {
            getVRDisplay((err, vrDisplay) => {
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

export default VRControl;
