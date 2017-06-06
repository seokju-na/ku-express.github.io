const PI = Math.PI;

const curve = {
    getPointAt(t) {
        const v = new THREE.Vector3();
        let x;
        let y;
        let z;

        if (t >= 0 && t < 5) {
            x = t;
            y = 5;
            z = 0;
        } else if (t >= 5 && t < 20) {
            x = t;
            y = 15 * Math.sin((PI * t) / 15 - 5) + 20;
            z = 0;
        } else if (t >= 20 && t <= 26) {
            x = 29 + 9 * Math.tan((PI / 6) * (t - 23) - (PI / 4));
            y = 35;
            z = (t - 20);
        }

        console.log(x, y, z);

        return v.set(x, y, z).multiplyScalar(2);
    },

    getTangentAt(t) {
        const v = new THREE.Vector3();

        const delta = 0.00001;

        const t1 = Math.max(0, t - delta);
        const t2 = Math.min(1, t + delta);

        return v
            .copy(this.getPointAt(t2))
            .sub(this.getPointAt(t1))
            .normalize();
    }
};

export default curve;
