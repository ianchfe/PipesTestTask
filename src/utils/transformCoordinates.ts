import * as THREE from 'three';

// Так как координаты узлов слишком разбросаны, не все корректно отображается в сцене, поэтому для отрисовки значения усредняются
export interface RawNode {
    X: number;
    Y: number;
    Z: number;
}

export function createCoordinateTransformer(nodesMap:  ReadonlyMap<number, RawNode>) {
    let sumX = 0, sumY = 0, sumZ = 0, count = 0;

    nodesMap.forEach(({ X, Y, Z }) => {
        sumX += X;
        sumY += Y;
        sumZ += Z;
        count++;
    });

    const centerX = sumX / count;
    const centerY = sumY / count;
    const centerZ = sumZ / count;

    let maxDistance = 0;
    nodesMap.forEach(({ X, Y, Z }) => {
        const dist = Math.hypot(X - centerX, Y - centerY, Z - centerZ);
        if (dist > maxDistance) maxDistance = dist;
    });

    const scale = maxDistance > 0 ? 500 / maxDistance : 1;

    const getVec = (id: number): THREE.Vector3 | null => {
        const node = nodesMap.get(id);
        if (!node) return null;
        return new THREE.Vector3(
            (node.X - centerX) * scale,
            (node.Y - centerY) * scale,
            (node.Z - centerZ) * scale
        );
    };

    return {getVec, scale};
}
