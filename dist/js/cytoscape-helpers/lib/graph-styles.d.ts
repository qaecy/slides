export declare const defaultSettings: {
    backgroundColor: string;
    edgeColor: string;
    edgeFontSize: string;
    edgeWidth: string;
    nodeColor: string;
    nodeOpacity: string;
    font: string;
    directed: boolean;
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
}) => ({
    selector: string;
    style: {
        label: (node: any) => any;
        'text-valign': string;
        'font-family': string;
        'font-size': string;
        opacity: string;
        color: string;
        'text-outline-color': (node: any) => any;
        'text-outline-width': number;
        'background-color': (node: any) => any;
        'target-arrow-color'?: undefined;
        'curve-style'?: undefined;
        'target-arrow-shape'?: undefined;
        'line-color'?: undefined;
        width?: undefined;
        'text-rotation'?: undefined;
        'text-background-opacity'?: undefined;
        'text-background-color'?: undefined;
        'text-background-padding'?: undefined;
        'border-color'?: undefined;
        shape?: undefined;
        height?: undefined;
        padding?: undefined;
        'border-width'?: undefined;
    };
} | {
    selector: string;
    style: {
        label: string;
        'text-valign': string;
        'font-family': string;
        'font-size': string;
        color: string;
        'target-arrow-color': string;
        'curve-style': string;
        'target-arrow-shape': string;
        'line-color': string;
        width: string;
        'text-rotation': string;
        'text-background-opacity': number;
        'text-background-color': string;
        'text-background-padding': number;
        opacity?: undefined;
        'text-outline-color'?: undefined;
        'text-outline-width'?: undefined;
        'background-color'?: undefined;
        'border-color'?: undefined;
        shape?: undefined;
        height?: undefined;
        padding?: undefined;
        'border-width'?: undefined;
    };
} | {
    selector: string;
    style: {
        'background-color': string;
        'border-color': (node: any) => any;
        label?: undefined;
        'text-valign'?: undefined;
        'font-family'?: undefined;
        'font-size'?: undefined;
        opacity?: undefined;
        color?: undefined;
        'text-outline-color'?: undefined;
        'text-outline-width'?: undefined;
        'target-arrow-color'?: undefined;
        'curve-style'?: undefined;
        'target-arrow-shape'?: undefined;
        'line-color'?: undefined;
        width?: undefined;
        'text-rotation'?: undefined;
        'text-background-opacity'?: undefined;
        'text-background-color'?: undefined;
        'text-background-padding'?: undefined;
        shape?: undefined;
        height?: undefined;
        padding?: undefined;
        'border-width'?: undefined;
    };
} | {
    selector: string;
    style: {
        shape: string;
        width: string;
        height: string;
        label: (node: any) => any;
        padding: string;
        'border-color': string;
        'border-width': number;
        'background-color': string;
        'text-outline-width': number;
        color: string;
        'text-valign'?: undefined;
        'font-family'?: undefined;
        'font-size'?: undefined;
        opacity?: undefined;
        'text-outline-color'?: undefined;
        'target-arrow-color'?: undefined;
        'curve-style'?: undefined;
        'target-arrow-shape'?: undefined;
        'line-color'?: undefined;
        'text-rotation'?: undefined;
        'text-background-opacity'?: undefined;
        'text-background-color'?: undefined;
        'text-background-padding'?: undefined;
    };
})[];
export declare const layout: {
    name: string;
    padding: number;
};