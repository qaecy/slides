import { Core, NodeSingular } from 'cytoscape';

export declare function closestNode(cy: Core, position: {
    x: number;
    y: number;
}): NodeSingular | undefined;
