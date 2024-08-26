import { EventEmitter } from 'tsee';
import { Core, NodeSingular } from 'cytoscape';

export declare class FileDropHandler {
    private _cy;
    events: EventEmitter<{
        fileOverNodeStart: (node: NodeSingular) => void;
        fileOverNodeEnd: (node: NodeSingular) => void;
        filesDroppedOnNode: (node: NodeSingular, fileList: FileList) => void;
    }>;
    private _lastHoveredNode?;
    constructor(_cy: Core);
    private _initEventListeners;
    private _getClosestNode;
    private _distance;
}
