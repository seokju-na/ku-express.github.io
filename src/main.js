import RollerCoasterGeometry from './geometries/roller-coaster';
import VRControl from './vr/control';
import VREffect from './vr/effect';
import { isWebVRAvailable, getHelpMessageElement } from './vr/utils';

if (!isWebVRAvailable()) {
    getHelpMessageElement((element) => {
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

            return v2
                .copy(this.getPointAt(t2))
                .sub(this.getPointAt(t1))
                .normalize();
        }
    }
})();

const rollerCoasterGeometry = new RollerCoasterGeometry(curve, 1500);
const material = new THREE.MeshPhongMaterial({
    vertexColors: THREE.VertexColors
});
const mesh = new THREE.Mesh(rollerCoasterGeometry, material);
scene.add(mesh);

// VR
const control = new VRControl(camera);
const effect = new VREffect(renderer);

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
