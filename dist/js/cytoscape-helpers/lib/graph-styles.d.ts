import { LayoutOptions } from 'cytoscape';

export declare const defaultSettings: {
    backgroundColor: string;
    edgeColor: string;
    edgeFontSize: string;
    edgeWidth: string;
    nodeColor: string;
    nodeOpacity: string;
    font: string;
    directed: boolean;
    labelSelector: string;
    showNodeLabels: boolean;
    showEdgeLabels: boolean;
    hoverBorderColor: string;
};
export declare const buildStyles: (s?: {
    backgroundColor: string;
    edgeColor: string;
    edgeFontSize: string;
    edgeWidth: string;
    nodeColor: string;
    nodeOpacity: string;
    font: string;
    directed: boolean;
    labelSelector: string;
    showNodeLabels: boolean;
    showEdgeLabels: boolean;
    hoverBorderColor: string;
}) => any[];
export declare const layoutOptions: LayoutOptions;
