export interface ElementData {
    nodes: Node[];
    edges: Edge[];
}
export interface Edge {
    data: EdgeData;
    classes: string;
}
export interface Node {
    data: NodeData;
    classes: string;
}
export interface EdgeData {
    id?: string;
    source: string;
    target: string;
    color?: string;
    width?: number;
}
export interface NodeData {
    id: string;
    label: string;
    color?: string;
    size?: number;
}
export declare class NodeMenuSettings {
    id: string;
    items: MenuItem[];
    hideAfter: number;
    sticky: boolean;
    conditionalDisplay: (node: any) => boolean;
    positionDef: (node: any, style: CSSStyleDeclaration) => void;
    constructor(id?: string);
}
export interface MenuItem {
    icon: string;
    click: (node: any) => void;
}
