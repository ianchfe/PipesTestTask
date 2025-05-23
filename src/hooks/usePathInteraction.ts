import type {RefObject} from "react";
import type {PipesSceneManager} from "../lib/PipesSceneManager.ts";
import * as THREE from "three";
import {useCallback} from "react";
import {mineStore} from "../store/mineStore.ts";
import {clearPreviousSelection, highlightPath, showDistanceLabel} from "../lib/helpers.ts";
import {findShortestPath} from "../utils/findShortestPath.ts";

export function usePathInteraction(
    sceneManager: RefObject<PipesSceneManager | null>,
    originalColors: RefObject<Map<THREE.Mesh, THREE.Color>>,
    hasPathShown: RefObject<boolean>
) {
    return useCallback(() => {
        if (!mineStore.isPathMode || !sceneManager.current) return;

        const manager = sceneManager.current;

        if (hasPathShown.current) {
            clearPreviousSelection(manager, originalColors);
            mineStore.clearSelectedSections();
            hasPathShown.current = false;
        }

        manager.setRaycasterFromMouse();
        const intersects = manager.intersectLines();
        const intersected = intersects?.[0]?.object;
        if (!intersected) return;

        const sectionIndex = manager.meshIndexMap.get(intersected);
        const section = mineStore.sections[sectionIndex ?? -1];
        if (!section) return;

        mineStore.setSelectedSection(section);
        if (mineStore.selectedSections.length !== 2) return;

        const [from, to] = mineStore.selectedSections;
        const result = findShortestPath({
            sections: mineStore.sections,
            nodesMap: mineStore.nodesMap,
        }, from.startId, to.startId);

        if (result.distance === -1) {
            console.warn("Путь не найден");
            return;
        }

        highlightPath(result.path, mineStore, manager, originalColors);
        showDistanceLabel(result.distance, to.startId, manager.scene);
        hasPathShown.current = true;
        manager.render();
    }, []);
}
