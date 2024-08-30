import { Core } from 'cytoscape';

export declare class FileDropHandler {
    private _cy;
    private _lastHoveredNode?;
    constructor(_cy: Core);
    private _initEventListeners;
    private _getClosestNode;
    private _distance;
}
