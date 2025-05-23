import {observer} from "mobx-react-lite";
import {useCallback, useRef} from "react";
import * as THREE from "three";
import {useSceneManager} from "../hooks/useSceneManager.ts";
import {useEscapeKey} from "../hooks/useEscapeKey.ts";
import {usePathInteraction} from "../hooks/usePathInteraction.ts";
import {useSceneGraph} from "../hooks/useSceneGraph.ts";
import type {NodeMapItem, SectionItem} from "../store/mineStore.ts";

export type SceneManager = {
    setRaycasterFromMouse: () => void;
    intersectLines: () => THREE.Intersection[];
    meshIndexMap: Map<THREE.Object3D, number>;
    scene: THREE.Scene;
    render: () => void;
};

export type GraphInput = {
    sections: SectionItem[];
    nodesMap: ReadonlyMap<number, NodeMapItem>;
};

const PipesScene = observer(() => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasPathShown = useRef(false);
    const originalColors = useRef(new Map<THREE.Mesh, THREE.Color>());

    const sceneManager = useSceneManager(containerRef);
    useSceneGraph(sceneManager);
    useEscapeKey(sceneManager, originalColors, hasPathShown);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        sceneManager.current?.updateMouse(e.clientX, e.clientY);
    }, []);

    const onClick = usePathInteraction(sceneManager, originalColors, hasPathShown);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "100%", backgroundColor: "black" }}
            onMouseMove={onMouseMove}
            onClick={onClick}
        />
    );
});

export default PipesScene
