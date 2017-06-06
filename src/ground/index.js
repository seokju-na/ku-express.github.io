export function groundMeshFactory(scene, width, height) {
    const geometry = new THREE.PlaneBufferGeometry(width, height, 15, 15);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    const positions = geometry.attributes.position.array;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positions.length; i += 3) {
        vertex.fromArray(positions, i);
        vertex.x += Math.random() * 10 - 5;
        vertex.z += Math.random() * 10 - 5;
        const distance = ( vertex.distanceTo(scene.position) / 5 ) - 25;
        vertex.y = Math.random() * Math.max(0, distance);
        vertex.toArray(positions, i);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial({
        color: 0x407000
    });

    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);
}
