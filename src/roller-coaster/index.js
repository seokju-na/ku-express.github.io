import RollerCoasterGeometry from './roller-coaster';

export function rollerCoasterMeshFactory(curve, divisions) {
    const geometry = new RollerCoasterGeometry(curve, divisions);
    const material = new THREE.MeshPhongMaterial({
        vertexColors: THREE.VertexColors
    });

    return new THREE.Mesh(geometry, material);
}
