import RollerCoasterShadowGeometry from './geometry';

export function rollerCoasterShadowMeshFactory(curve, divisions) {
    const geometry = new RollerCoasterShadowGeometry(curve, divisions);
    const material = new THREE.MeshBasicMaterial({
        color: 0x305000, depthWrite: false, transparent: true
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.y = 0.1;

    return mesh;
}
