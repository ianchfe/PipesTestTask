import * as THREE from "three";
import type { SectionItem, NodeMapItem } from "../store/mineStore.ts";
import { createCoordinateTransformer } from "../utils/transformCoordinates.ts";
import { makeTextSprite } from "../utils/makeTextSprite.ts";
import type { PipesSceneManager } from "./PipesSceneManager.ts";

export function renderSections(
    sections: SectionItem[],
    nodesMap: ReadonlyMap<number, NodeMapItem>,
    horizonColors: Map<number, THREE.Color>,
    sceneManager: PipesSceneManager
) {
    const { getVec, scale } = createCoordinateTransformer(nodesMap);

    sections.forEach((section, i: number) => {
        const startVec = getVec(section.startId);
        const endVec = getVec(section.endId);
        if (!startVec || !endVec) return;

        const dir = new THREE.Vector3().subVectors(endVec, startVec);
        const length = dir.length();
        const geometry = new THREE.CylinderGeometry(section.thickness * scale, section.thickness * scale, length, 8);

        const color = horizonColors.get(i) ?? new THREE.Color(0x00ffff);
        const material = new THREE.MeshStandardMaterial({ color });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5));
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

        sceneManager.addSectionMesh(mesh, i);
    });
}

export function renderHorizons(
    horizons: { name: string; sections: string }[],
    sections: SectionItem[],
    nodesMap: ReadonlyMap<number, NodeMapItem>,
    horizonColors: Map<number, THREE.Color>,
    sceneManager: PipesSceneManager
) {
    const { getVec } = createCoordinateTransformer(nodesMap);

    horizons.forEach((horizon, hIndex: number) => {
        const color = horizonColors.get(hIndex) ?? new THREE.Color(Math.random(), Math.random(), Math.random());
        const sectionIds = String(horizon.sections).split(",").map(id => parseInt(id.trim())).filter(Boolean);

        const center = new THREE.Vector3();
        let total = 0;

        sectionIds.forEach(id => {
            const section = sections[id];
            if (!section) return;
            const start = getVec(section.startId);
            const end = getVec(section.endId);
            if (!start || !end) return;
            center.add(start).add(end);
            total += 2;
        });

        if (total > 0) {
            center.divideScalar(total);
            const sprite = makeTextSprite(horizon.name, {
                fontsize: 64,
                color: "#" + color.getHexString(),
            });
            sprite.position.copy(center);
            sceneManager.addHorizonSprite(sprite);
        }
    });
}
