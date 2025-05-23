import { makeAutoObservable } from "mobx";

export interface Node {
    Id: number;
    X: number;
    Y: number;
    Z: number;
}

export interface Section {
    StartNodeId: number;
    EndNodeId: number;
    Thickness?: number;
}

export interface Horizon {
    Id: number;
    Name: string;
    Altitude: number;
    Sections: string;
}

export interface NodeMapItem {
    X: number;
    Y: number;
    Z: number;
}

export interface SectionItem {
    startId: number;
    endId: number;
    thickness: number;
}

export interface HorizonItem {
    id: number;
    name: string;
    altitude: number;
    sections: string;
}

interface RawGraph {
    Nodes?: { Node?: Node[] };
    Sections?: { Section?: Section[] };
    Horizons?: { Horizon?: Horizon[] };
}

class MineStore {
    private _nodesMap: Map<number, NodeMapItem> = new Map();
    private _sections: SectionItem[] = [];
    private _horizons: HorizonItem[] = [];

    selectedSections: SectionItem[] = [];

    isPathMode: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setPathMode(mode: boolean) {
        this.isPathMode = mode;
    }

    setGraph(graph: RawGraph) {
        this.parseGraph(graph);
    }

    private parseGraph(graph: RawGraph) {
        const map = new Map<number, NodeMapItem>();
        const nodes = graph.Nodes?.Node ?? [];
        nodes.forEach((node) => {
            map.set(node.Id, {
                X: node.X,
                Y: node.Y,
                Z: node.Z,
            });
        });
        this._nodesMap = map;

        const rawSections = graph.Sections?.Section ?? [];
        this._sections = rawSections
            .filter((s) => s && s.StartNodeId !== undefined && s.EndNodeId !== undefined)
            .map((section) => ({
                startId: section.StartNodeId,
                endId: section.EndNodeId,
                thickness: section.Thickness ?? 1,
            }));

        const rawHorizons = graph.Horizons?.Horizon ?? [];
        this._horizons = rawHorizons.map((h) => ({
            id: h.Id,
            name: h.Name,
            altitude: h.Altitude,
            sections: h.Sections,
        }));
    }

    get nodesMap(): ReadonlyMap<number, NodeMapItem> {
        return this._nodesMap;
    }

    get sections(): SectionItem[] {
        return this._sections;
    }

    get horizons(): HorizonItem[] {
        return this._horizons;
    }

    setSelectedSection(section: SectionItem) {
        if (this.selectedSections.length >= 2) {
            this.selectedSections = [section];
        } else {
            this.selectedSections = [...this.selectedSections, section];
        }
    }

    clearSelectedSections() {
        this.selectedSections = [];
    }
}

export const mineStore = new MineStore();
