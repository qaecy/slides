import { Core } from 'cytoscape';

export declare class CollapseSettings {
    groupByField: string;
    groupFor: {
        type: string;
    };
    layoutOptions: {
        name: string;
    };
    collapseThreshold: number;
}
export declare function collapseGraph(cy: Core, settings: CollapseSettings): void;
