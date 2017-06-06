const { range } = require('lodash');

const PI = Math.PI;
const PI2 = PI * 2;

class RollerCoasterGeometry extends THREE.BufferGeometry {
    constructor(curve, divisions) {
        super();

        this.vertices = [];
        this.normals = [];
        this.colors = [];

        const color1 = [1, 1, 1];
        const color2 = [1, 1, 0];

        const upVector = new THREE.Vector3(0, 1, 0);
        const forwardVector = new THREE.Vector3();
        const rightVector = new THREE.Vector3();

        // Quaternion: something that can rotate.
        this.quaternion = new THREE.Quaternion();
        this.prevQuaternion = new THREE.Quaternion();
        this.prevQuaternion.setFromAxisAngle(upVector, PI / 2);

        this.point = new THREE.Vector3();
        this.prevPoint = new THREE.Vector3();
        this.prevPoint.copy(curve.getPointAt(0));

        // make shapes
        const step = [];
        range(5).forEach((idx) => {
            const angle = (idx / 5) * PI2;
            step.push(new THREE.Vector3(0, Math.sin(angle) * 0.02, Math.cos(angle) * 0.02));
        });

        const tube1 = [];

        range(5).forEach((idx) => {
            const angle = (idx / 5) * PI2;

            tube1.push(new THREE.Vector3(
                Math.sin(angle) * 0.06,
                Math.cos(angle) * 0.06,
                0
            ));
        });

        const tube2 = [];

        range(6).forEach((idx) => {
            const angle = (idx / 6) * PI2;

            tube2.push(new THREE.Vector3(
                Math.sin(angle) * 0.025,
                Math.cos(angle) * 0.025,
                0
            ));
        });

        const offset = new THREE.Vector3();
        const fromPoint = new THREE.Vector3();
        const toPoint = new THREE.Vector3();

        for (let i = 1; i <= divisions; i += 1) {
            this.point.copy(curve.getPointAt(i / divisions));

            upVector.set(0, 1, 0);

            forwardVector
                .subVectors(this.point, this.prevPoint)
                .normalize();

            rightVector
                .crossVectors(upVector, forwardVector)
                .normalize();

            upVector.crossVectors(forwardVector, rightVector);

            const angle = Math.atan2(forwardVector.x, forwardVector.z);

            this.quaternion.setFromAxisAngle(upVector, angle);

            if (i % 2 === 0) {
                fromPoint.set(-0.2, -0.02, 0);
                fromPoint.applyQuaternion(this.quaternion);
                fromPoint.add(this.point);

                toPoint.set(0, -0.135, 0);
                toPoint.applyQuaternion(this.quaternion);
                toPoint.add(this.point);
                this.extrudeSideShape(step, fromPoint, toPoint, color2);

                fromPoint.set(0.2, -0.02, 0);
                fromPoint.applyQuaternion(this.quaternion);
                fromPoint.add(this.point);

                toPoint.set(0, -0.135, 0);
                toPoint.applyQuaternion(this.quaternion);
                toPoint.add(this.point);
                this.extrudeSideShape(step, fromPoint, toPoint, color2);
            }

            this.extrudeShape(tube1, offset.set(0, -0.125, 0), color2);
            this.extrudeShape(tube2, offset.set(0.2, 0, 0), color1);
            this.extrudeShape(tube2, offset.set(-0.2, 0, 0), color1);

            this.prevPoint.copy(this.point);
            this.prevQuaternion.copy(this.quaternion);
        }

        const verticesBuffer = new THREE.BufferAttribute(new Float32Array(this.vertices), 3);
        const normalsBuffer = new THREE.BufferAttribute(new Float32Array(this.normals), 3);
        const colorsBuffer = new THREE.BufferAttribute(new Float32Array(this.colors), 3);

        this.addAttribute('position', verticesBuffer);
        this.addAttribute('normal', normalsBuffer);
        this.addAttribute('color', colorsBuffer);
    }

    drawShape(shape, color) {
        const vector = new THREE.Vector3();
        const normal = new THREE.Vector3();

        normal.set(0, 0, -1).applyQuaternion(this.quaternion);

        for (let i = 0; i < shape.length; i += 1) {
            vector.copy(shape[i]);
            vector.applyQuaternion(this.quaternion);
            vector.add(this.point);

            this.vertices.push(vector.x, vector.y, vector.z);
            this.normals.push(normal.x, normal.y, normal.z);
            this.colors.push(color[0], color[1], color[2]);
        }

        normal.set(0, 0, 1).applyQuaternion(this.quaternion);

        for (let i = shape.length - 1; i >= 0; i -= 1) {
            vector.copy(shape[i]);
            vector.applyQuaternion(this.quaternion);
            vector.add(this.point);

            this.vertices.push(vector.x, vector.y, vector.z);
            this.normals.push(normal.x, normal.y, normal.z);
            this.colors.push(color[0], color[1], color[2]);
        }
    }

    extrudeShape(shape, offset, color) {
        const v1 = new THREE.Vector3();
        const v2 = new THREE.Vector3();
        const v3 = new THREE.Vector3();
        const v4 = new THREE.Vector3();

        const n1 = new THREE.Vector3();
        const n2 = new THREE.Vector3();
        const n3 = new THREE.Vector3();
        const n4 = new THREE.Vector3();

        for (let i = 0; i < shape.length; i += 1) {
            const p1 = shape[i];
            const p2 = shape[(i + 1) % shape.length];

            v1.copy(p1).add(offset);
            v1.applyQuaternion(this.quaternion);
            v1.add(this.point);

            v2.copy(p2).add(offset);
            v2.applyQuaternion(this.quaternion);
            v2.add(this.point);

            v3.copy(p2).add(offset);
            v3.applyQuaternion(this.prevQuaternion);
            v3.add(this.prevPoint);

            v4.copy(p1).add(offset);
            v4.applyQuaternion(this.prevQuaternion);
            v4.add(this.prevPoint);

            this.vertices.push(v1.x, v1.y, v2.z);
            this.vertices.push(v2.x, v2.y, v2.z);
            this.vertices.push(v4.x, v4.y, v4.z);

            this.vertices.push(v2.x, v2.y, v2.z);
            this.vertices.push(v3.x, v3.y, v3.z);
            this.vertices.push(v4.x, v4.y, v4.z);

            n1.copy(p1);
            n1.applyQuaternion(this.quaternion);
            n1.normalize();

            n2.copy(p2);
            n2.applyQuaternion(this.quaternion);
            n2.normalize();

            n3.copy(p2);
            n3.applyQuaternion(this.prevQuaternion);
            n3.normalize();

            n4.copy(p1);
            n4.applyQuaternion(this.prevQuaternion);
            n4.normalize();

            this.normals.push(n1.x, n1.y, n1.z);
            this.normals.push(n2.x, n2.y, n2.z);
            this.normals.push(n4.x, n4.y, n4.z);

            this.normals.push(n2.x, n2.y, n2.z);
            this.normals.push(n3.x, n3.y, n3.z);
            this.normals.push(n4.x, n4.y, n4.z);

            this.colors.push(color[0], color[1], color[2]);
            this.colors.push(color[0], color[1], color[2]);
            this.colors.push(color[0], color[1], color[2]);

            this.colors.push(color[0], color[1], color[2]);
            this.colors.push(color[0], color[1], color[2]);
            this.colors.push(color[0], color[1], color[2]);
        }
    }

    extrudeSideShape(shape, fromPoint, toPoint, color) {
        const v1 = new THREE.Vector3();
        const v2 = new THREE.Vector3();
        const v3 = new THREE.Vector3();
        const v4 = new THREE.Vector3();

        const n1 = new THREE.Vector3();
        const n2 = new THREE.Vector3();
        const n3 = new THREE.Vector3();
        const n4 = new THREE.Vector3();

        for (let j = 0, jl = shape.length; j < jl; j++) {

            const point1 = shape[j];
            const point2 = shape[( j + 1 ) % jl];

            v1.copy(point1);
            v1.applyQuaternion(this.quaternion);
            v1.add(fromPoint);

            v2.copy(point2);
            v2.applyQuaternion(this.quaternion);
            v2.add(fromPoint);

            v3.copy(point2);
            v3.applyQuaternion(this.quaternion);
            v3.add(toPoint);

            v4.copy(point1);
            v4.applyQuaternion(this.quaternion);
            v4.add(toPoint);

            this.vertices.push(v1.x, v1.y, v1.z);
            this.vertices.push(v2.x, v2.y, v2.z);
            this.vertices.push(v4.x, v4.y, v4.z);

            this.vertices.push(v2.x, v2.y, v2.z);
            this.vertices.push(v3.x, v3.y, v3.z);
            this.vertices.push(v4.x, v4.y, v4.z);

            n1.copy(point1);
            n1.applyQuaternion(this.quaternion);
            n1.normalize();

            n2.copy(point2);
            n2.applyQuaternion(this.quaternion);
            n2.normalize();

            n3.copy(point2);
            n3.applyQuaternion(this.quaternion);
            n3.normalize();

            n4.copy(point1);
            n4.applyQuaternion(this.quaternion);
            n4.normalize();

            this.normals.push(n1.x, n1.y, n1.z);
            this.normals.push(n2.x, n2.y, n2.z);
            this.normals.push(n4.x, n4.y, n4.z);

            this.normals.push(n2.x, n2.y, n2.z);
            this.normals.push(n3.x, n3.y, n3.z);
            this.normals.push(n4.x, n4.y, n4.z);

            this.colors.push(color[0], color[1], color[2]);
            this.colors.push(color[0], color[1], color[2]);
            this.colors.push(color[0], color[1], color[2]);

            this.colors.push(color[0], color[1], color[2]);
            this.colors.push(color[0], color[1], color[2]);
            this.colors.push(color[0], color[1], color[2]);
        }
    }
}

export default RollerCoasterGeometry;
