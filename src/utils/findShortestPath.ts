import type {GraphInput} from "../components/PipesScene.tsx";

type NodeMapItem = {
    X: number;
    Y: number;
    Z: number;
};

type SectionItem = {
    startId: number;
    endId: number;
    thickness: number;
};

function calculateDistance(a: NodeMapItem, b: NodeMapItem): number {
    const dx = a.X - b.X;
    const dy = a.Y - b.Y;
    const dz = a.Z - b.Z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function findShortestPath(
    graph: GraphInput,
    fromId: number,
    toId: number
): { distance: number; path: number[] } {
    const distances = new Map<number, number>();
    const visited = new Set<number>();
    const prev = new Map<number, number | null>();
    const queue: Array<{ id: number; distance: number }> = [];

    queue.push({ id: fromId, distance: 0 });
    distances.set(fromId, 0);
    prev.set(fromId, null);

    const adjacency = new Map<number, Array<{ id: number; weight: number }>>();

    for (const section of graph.sections) {
        const start = graph.nodesMap.get(section.startId);
        const end = graph.nodesMap.get(section.endId);
        if (!start || !end) continue;

        const length = calculateDistance(start, end);

        if (!adjacency.has(section.startId)) adjacency.set(section.startId, []);
        if (!adjacency.has(section.endId)) adjacency.set(section.endId, []);

        adjacency.get(section.startId)!.push({ id: section.endId, weight: length });
        adjacency.get(section.endId)!.push({ id: section.startId, weight: length });
    }

    while (queue.length > 0) {
        queue.sort((a, b) => a.distance - b.distance);
        const { id: currentId, distance: currentDistance } = queue.shift()!;
        if (visited.has(currentId)) continue;

        visited.add(currentId);

        if (currentId === toId) {
            const path: number[] = [];
            let node: number | null = toId;
            while (node !== null) {
                path.unshift(node);
                node = prev.get(node) ?? null;
            }

            return { distance: currentDistance, path };
        }

        const neighbors = adjacency.get(currentId) || [];
        for (const neighbor of neighbors) {
            if (visited.has(neighbor.id)) continue;

            const newDist = currentDistance + neighbor.weight;
            const existingDist = distances.get(neighbor.id);

            if (existingDist === undefined || newDist < existingDist) {
                distances.set(neighbor.id, newDist);
                prev.set(neighbor.id, currentId);
                queue.push({ id: neighbor.id, distance: newDist });
            }
        }
    }

    return { distance: -1, path: [] };
}


export function getSectionsOnPath(path: number[], sections: SectionItem[]): number[] {
    const sectionIndices: number[] = [];

    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];

        const index = sections.findIndex(
            (s) =>
                (s.startId === from && s.endId === to) ||
                (s.startId === to && s.endId === from)
        );

        if (index !== -1) {
            sectionIndices.push(index);
        }
    }

    return sectionIndices;
}

