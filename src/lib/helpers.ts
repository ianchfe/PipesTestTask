import type {GraphInput, SceneManager} from "../components/PipesScene.tsx";
import * as THREE from "three";
import {makeTextSprite} from "../utils/makeTextSprite.ts";
import {createCoordinateTransformer} from "../utils/transformCoordinates.ts";
import {mineStore} from "../store/mineStore.ts";
import type {RefObject} from "react";

export function clearPreviousSelection(manager: SceneManager, originalColors: React.RefObject<Map<THREE.Mesh, THREE.Color>>) {
    const sprite = manager.scene.getObjectByName('distanceLabel');
    if (sprite) {
        manager.scene.remove(sprite);
    }

    if (!originalColors.current) return;

    originalColors.current.forEach((color: THREE.Color, mesh: THREE.Mesh) => {
        if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
                if ('color' in mat) {
                    (mat as THREE.Material & { color: THREE.Color }).color.copy(color);
                }
            });
        } else if ('color' in mesh.material) {
            (mesh.material as THREE.Material & { color: THREE.Color }).color.copy(color);
        }
    });

    originalColors.current.clear();
}


export function showDistanceLabel(distance: number, nodeId: number, scene: THREE.Scene) {
    const sprite = makeTextSprite(`${distance.toFixed(1)} м`, {
        fontsize: 64,
        color: 'red'
    });

    const pos = createCoordinateTransformer(mineStore.nodesMap)?.getVec(nodeId);
    if (
        typeof pos?.x === 'number' &&
        typeof pos?.y === 'number' &&
        typeof pos?.z === 'number'
    ){
        sprite.position.set(pos.x, pos.y, pos.z);
        sprite.name = 'distanceLabel';

        scene.add(sprite);
    }
}

function makeSectionKey(a: number, b: number): string {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
}

export function highlightPath(path: number[], graph: GraphInput, manager: SceneManager, originalColors:  RefObject<Map<THREE.Mesh, THREE.Color>>) {
    originalColors.current.clear();

    const sectionIds = new Set<string>();
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const key = makeSectionKey(from, to);

        const section = graph.sections.find(
            s => makeSectionKey(s.startId, s.endId) === key
        );
        if (section) {
            sectionIds.add(key);
        }
    }

    manager.meshIndexMap?.forEach((index, object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const mesh = object as THREE.Mesh;

        if (mesh.material instanceof THREE.MeshStandardMaterial) {
            const material = mesh.material as THREE.MeshStandardMaterial;
            const sec = graph.sections[index];
            const idKey = makeSectionKey(sec.startId, sec.endId);

            if (sectionIds.has(idKey)) {
                if (!originalColors.current.has(mesh)) {
                    originalColors.current.set(mesh, material.color.clone());
                }
                material.color.set('yellow' as any);
            }
        }
    })
};