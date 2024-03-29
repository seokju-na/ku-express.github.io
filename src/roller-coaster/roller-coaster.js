function RollerCoasterGeometry(curve, divisions) {

    THREE.BufferGeometry.call(this);

    var vertices = [];
    var normals = [];
    var colors = [];

    //레일 그릴 때 필요한 색
    var color1 = [1, 1, 1];	//하얀색
    var color2 = [1, 0.3, 0.2];	//노란색

    var up = new THREE.Vector3(0, 1, 0);
    var forward = new THREE.Vector3();
    var right = new THREE.Vector3();

    //quaternion은 4x4 행렬을 의미함
    var quaternion = new THREE.Quaternion();
    var prevQuaternion = new THREE.Quaternion();
    prevQuaternion.setFromAxisAngle(up, Math.PI / 2);

    var point = new THREE.Vector3();
    var prevPoint = new THREE.Vector3();
    prevPoint.copy(curve.getPointAt(0));

    // shapes
    //가운데 레일 옆 세모 두 개
    var step = [
        //왼쪽 세모
        new THREE.Vector3(-0.225, 0, 0),
        new THREE.Vector3(0, -0.050, 0),
        new THREE.Vector3(0, -0.175, 0),
        //오른쪽 세모
        new THREE.Vector3(0, -0.050, 0),
        new THREE.Vector3(0.225, 0, 0),
        new THREE.Vector3(0, -0.175, 0)
    ];

    var PI2 = Math.PI * 2; //360도
    var step1 = [];
    for (var i = 0; i < 5; i++) {

        var angle = ( i / 5 ) * PI2;	//angle이 72, 144, 216, 288, 360 다섯 가지가 됨
        step1.push(new THREE.Vector3(0, Math.sin(angle) * 0.02, Math.cos(angle) * 0.02));

    }

    //가운데 레일에 관한 설정
    var sides = 5;	//오각 원통 모양을 의미하는 듯
    var tube1 = [];

    for (var i = 0; i < sides; i++) {

        var angle = ( i / sides ) * PI2;	//angle이 72, 144, 216, 288, 360 다섯 가지가 됨
        tube1.push(new THREE.Vector3(Math.sin(angle) * 0.06, Math.cos(angle) * 0.06, 0));	//0.06은 사이즈에 관한 상수 값, sin^2+cos^2 = 1

    }
    //양 옆의 레일에 관한 설정
    var sides = 6;	//육각 원통 모양을 의미하는 듯
    var tube2 = [];

    for (var i = 0; i < sides; i++) {

        var angle = ( i / sides ) * PI2;	//angle이 60, 120, 180, 240, 300, 360 여섯 가지가 됨
        tube2.push(new THREE.Vector3(Math.sin(angle) * 0.025, Math.cos(angle) * 0.025, 0));	//0.025라서 가운데 레일보다 사이즈가 작음

    }

    var vector = new THREE.Vector3();
    var normal = new THREE.Vector3();

    function drawShape(shape, color) {	//해당 색을 가지는 도형 그리기

        normal.set(0, 0, -1).applyQuaternion(quaternion);	//normal vector가 이동 방향의 반대(우리가 앞을 볼 때 보이는 면)

        for (var j = 0; j < shape.length; j++) {

            vector.copy(shape[j]);
            vector.applyQuaternion(quaternion);
            vector.add(point);

            vertices.push(vector.x, vector.y, vector.z);
            normals.push(normal.x, normal.y, normal.z);
            colors.push(color[0], color[1], color[2]);

        }

        normal.set(0, 0, 1).applyQuaternion(quaternion);	//normal vector가 이동 방향(우리가 뒤를 볼 때 보이는 면)

        for (var j = shape.length - 1; j >= 0; j--) {

            vector.copy(shape[j]);
            vector.applyQuaternion(quaternion);
            vector.add(point);

            vertices.push(vector.x, vector.y, vector.z);
            normals.push(normal.x, normal.y, normal.z);
            colors.push(color[0], color[1], color[2]);

        }

    };

    var vector1 = new THREE.Vector3();
    var vector2 = new THREE.Vector3();
    var vector3 = new THREE.Vector3();
    var vector4 = new THREE.Vector3();

    var normal1 = new THREE.Vector3();
    var normal2 = new THREE.Vector3();
    var normal3 = new THREE.Vector3();
    var normal4 = new THREE.Vector3();

    function extrudeShape(shape, offset, color) {	//얘는 삼각형 같은 평면도형을 그리는 drawShape는 다르게 레일처럼 입체도형을 그리는데 사용하는 듯.

        for (var j = 0, jl = shape.length; j < jl; j++) {

            var point1 = shape[j];
            var point2 = shape[( j + 1 ) % jl];

            vector1.copy(point1).add(offset);
            vector1.applyQuaternion(quaternion);
            vector1.add(point);

            vector2.copy(point2).add(offset);
            vector2.applyQuaternion(quaternion);
            vector2.add(point);

            vector3.copy(point2).add(offset);
            vector3.applyQuaternion(prevQuaternion);
            vector3.add(prevPoint);

            vector4.copy(point1).add(offset);
            vector4.applyQuaternion(prevQuaternion);
            vector4.add(prevPoint);

            vertices.push(vector1.x, vector1.y, vector1.z);
            vertices.push(vector2.x, vector2.y, vector2.z);
            vertices.push(vector4.x, vector4.y, vector4.z);

            vertices.push(vector2.x, vector2.y, vector2.z);
            vertices.push(vector3.x, vector3.y, vector3.z);
            vertices.push(vector4.x, vector4.y, vector4.z);

            //

            normal1.copy(point1);
            normal1.applyQuaternion(quaternion);
            normal1.normalize();

            normal2.copy(point2);
            normal2.applyQuaternion(quaternion);
            normal2.normalize();

            normal3.copy(point2);
            normal3.applyQuaternion(prevQuaternion);
            normal3.normalize();

            normal4.copy(point1);
            normal4.applyQuaternion(prevQuaternion);
            normal4.normalize();

            normals.push(normal1.x, normal1.y, normal1.z);
            normals.push(normal2.x, normal2.y, normal2.z);
            normals.push(normal4.x, normal4.y, normal4.z);

            normals.push(normal2.x, normal2.y, normal2.z);
            normals.push(normal3.x, normal3.y, normal3.z);
            normals.push(normal4.x, normal4.y, normal4.z);

            colors.push(color[0], color[1], color[2]);
            colors.push(color[0], color[1], color[2]);
            colors.push(color[0], color[1], color[2]);

            colors.push(color[0], color[1], color[2]);
            colors.push(color[0], color[1], color[2]);
            colors.push(color[0], color[1], color[2]);

        }

    };

    function extrudeShapeSide(shape, fromPoint, toPoint, color) {

        for (var j = 0, jl = shape.length; j < jl; j++) {

            var point1 = shape[j];
            var point2 = shape[( j + 1 ) % jl];

            vector1.copy(point1);
            vector1.applyQuaternion(quaternion);
            vector1.add(fromPoint);

            vector2.copy(point2);
            vector2.applyQuaternion(quaternion);
            vector2.add(fromPoint);

            vector3.copy(point2);
            vector3.applyQuaternion(quaternion);
            vector3.add(toPoint);

            vector4.copy(point1);
            vector4.applyQuaternion(quaternion);
            vector4.add(toPoint);

            vertices.push(vector1.x, vector1.y, vector1.z);
            vertices.push(vector2.x, vector2.y, vector2.z);
            vertices.push(vector4.x, vector4.y, vector4.z);

            vertices.push(vector2.x, vector2.y, vector2.z);
            vertices.push(vector3.x, vector3.y, vector3.z);
            vertices.push(vector4.x, vector4.y, vector4.z);

            //

            normal1.copy(point1);
            normal1.applyQuaternion(quaternion);
            normal1.normalize();

            normal2.copy(point2);
            normal2.applyQuaternion(quaternion);
            normal2.normalize();

            normal3.copy(point2);
            normal3.applyQuaternion(quaternion);
            normal3.normalize();

            normal4.copy(point1);
            normal4.applyQuaternion(quaternion);
            normal4.normalize();

            normals.push(normal1.x, normal1.y, normal1.z);
            normals.push(normal2.x, normal2.y, normal2.z);
            normals.push(normal4.x, normal4.y, normal4.z);

            normals.push(normal2.x, normal2.y, normal2.z);
            normals.push(normal3.x, normal3.y, normal3.z);
            normals.push(normal4.x, normal4.y, normal4.z);

            colors.push(color[0], color[1], color[2]);
            colors.push(color[0], color[1], color[2]);
            colors.push(color[0], color[1], color[2]);

            colors.push(color[0], color[1], color[2]);
            colors.push(color[0], color[1], color[2]);
            colors.push(color[0], color[1], color[2]);

        }

    };

    var offset = new THREE.Vector3();
    var fromPoint = new THREE.Vector3();
    var toPoint = new THREE.Vector3();


    for (var i = 1; i <= divisions; i++) {

        point.copy(curve.getPointAt(i / divisions));

        up.set(0, 1, 0);

        forward.subVectors(point, prevPoint).normalize();
        right.crossVectors(up, forward).normalize();
        up.crossVectors(forward, right);

        var angle = Math.atan2(forward.x, forward.z);

        quaternion.setFromAxisAngle(up, angle);

        if (i % 2 === 0) {
            //가운데 노란 레일 양 옆에 노란색 세모 두 개 그리기
            //drawShape( step, color2 );
            fromPoint.set(-0.2, -0.02, 0);
            fromPoint.applyQuaternion(quaternion);
            fromPoint.add(point);

            toPoint.set(0, -0.135, 0);
            toPoint.applyQuaternion(quaternion);
            toPoint.add(point);
            extrudeShapeSide(step1, fromPoint, toPoint, color2);

            fromPoint.set(0.2, -0.02, 0);
            fromPoint.applyQuaternion(quaternion);
            fromPoint.add(point);

            toPoint.set(0, -0.135, 0);
            toPoint.applyQuaternion(quaternion);
            toPoint.add(point);
            extrudeShapeSide(step1, fromPoint, toPoint, color2);
        }

        //가운데에 노란색 레일 그리기
        extrudeShape(tube1, offset.set(0, -0.125, 0), color2);
        //양 옆에 하얀색 레일 그리기
        extrudeShape(tube2, offset.set(0.2, 0, 0), color1);
        extrudeShape(tube2, offset.set(-0.2, 0, 0), color1);

        prevPoint.copy(point);
        prevQuaternion.copy(quaternion);

    }

    // console.log( vertices.length );

    this.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    this.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
    this.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

}

RollerCoasterGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);

export default RollerCoasterGeometry;
