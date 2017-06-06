class Terrain extends THREE.PlaneBufferGeometry {
    constructor(worldWidth, worldDepth) {
        super(7500, 7500, worldWidth - 1, worldDepth - 1);

        this.rotateX(-Math.PI / 2);
        this.computeFaceNormals();
    }
}

export default Terrain;
