import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class PipesSceneManager {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    linesGroup: THREE.Group;
    horizonGroup: THREE.Group;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    meshIndexMap: Map<THREE.Object3D, number>;
    container: HTMLDivElement;



    constructor(container: HTMLDivElement) {
        this.container = container;

        const width = container.clientWidth;
        const height = container.clientHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
        this.camera.position.set(0, 0, 1000);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.linesGroup = new THREE.Group();
        this.horizonGroup = new THREE.Group();
        this.scene.add(new THREE.AmbientLight(0xffffff, 1.5));
        this.scene.add(this.linesGroup);
        this.scene.add(this.horizonGroup);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.meshIndexMap = new Map();
    }

    dispose() {
        this.controls.dispose();
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }

    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    updateMouse(clientX: number, clientY: number) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setRaycasterFromMouse() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
    }

    intersectLines() {
        return this.raycaster.intersectObjects(this.linesGroup.children, false);
    }

    clearGroups() {
        this.linesGroup.clear();
        this.horizonGroup.clear();
        this.meshIndexMap.clear();
    }

    addSectionMesh(mesh: THREE.Mesh, index: number) {
        this.linesGroup.add(mesh);
        this.meshIndexMap.set(mesh, index);
    }

    addHorizonSprite(sprite: THREE.Sprite) {
        this.horizonGroup.add(sprite);
    }
}