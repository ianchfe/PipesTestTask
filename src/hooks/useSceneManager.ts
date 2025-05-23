import {PipesSceneManager} from "../lib/PipesSceneManager.ts";
import type {RefObject} from "react";
import {useEffect, useRef} from "react";

export function useSceneManager(containerRef: RefObject<HTMLDivElement | null>) {
    const sceneManager = useRef<PipesSceneManager | null>(null);
    const animationFrameId = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;
        sceneManager.current = new PipesSceneManager(containerRef.current);

        const animate = () => {
            sceneManager.current?.setRaycasterFromMouse();
            sceneManager.current?.render();
            animationFrameId.current = requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => sceneManager.current?.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId.current);
            sceneManager.current?.dispose();
            sceneManager.current = null;
        };
    }, [containerRef]);

    return sceneManager;
}
