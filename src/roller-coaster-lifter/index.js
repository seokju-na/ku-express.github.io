import RollerCoasterLifterGeometry from './geometry';

export function rollerCoasterLifterMeshFactory(curve, divisions) {
    const geometry = new RollerCoasterLifterGeometry(curve, divisions);
    const material = new THREE.MeshPhongMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.y = 0.1;

    return mesh;
}
