import { renderSections, renderHorizons } from "../lib/renderUtils";
import type {RefObject} from "react";
import type {PipesSceneManager} from "../lib/PipesSceneManager.ts";
import {useEffect} from "react";
import {autorun} from "mobx";
import {mineStore} from "../store/mineStore.ts";
import * as THREE from "three";

export function useSceneGraph(sceneManagerRef: RefObject<PipesSceneManager | null>) {
    useEffect(() => {
        if (!sceneManagerRef.current) return;

        const disposer = autorun(() => {
            const { nodesMap, sections, horizons } = mineStore;
            if (!nodesMap.size) return;

            const sceneManager = sceneManagerRef.current!;
            sceneManager.clearGroups();

            const horizonColors = new Map<number, THREE.Color>();
            horizons.forEach((h) => {
                const color = new THREE.Color(Math.random(), Math.random(), Math.random());
                String(h.sections)
                    .split(",")
                    .map(id => parseInt(id.trim()))
                    .filter(Boolean)
                    .forEach(id => horizonColors.set(id, color));
            });

            renderSections(sections, nodesMap, horizonColors, sceneManager);
            renderHorizons(horizons, sections, nodesMap, horizonColors, sceneManager);
        });

        return () => disposer();
    }, [sceneManagerRef]);
}
