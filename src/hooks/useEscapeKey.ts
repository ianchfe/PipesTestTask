import type {RefObject} from "react";
import type {PipesSceneManager} from "../lib/PipesSceneManager.ts";
import * as THREE from "three";
import {useEffect} from "react";
import {mineStore} from "../store/mineStore.ts";
import {clearPreviousSelection} from "../lib/helpers.ts";

export function useEscapeKey(
    sceneManager: RefObject<PipesSceneManager | null>,
    originalColors: RefObject<Map<THREE.Mesh, THREE.Color>>,
    hasPathShown: RefObject<boolean>
) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            mineStore.setPathMode(false);
            mineStore.clearSelectedSections();
            hasPathShown.current = false;
            clearPreviousSelection(sceneManager.current!, originalColors);
            sceneManager.current?.render();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
}
