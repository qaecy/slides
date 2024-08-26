import { Core } from 'cytoscape';

/**
 *
 * @param {*} cy Cytoscape core
 * @param {*} frequency Adjust this value for faster/slower waves
 * @param {*} amplitude Adjust this value for larger/smaller waves
 */
export declare function animateGraph(cy: Core, stopAfterFirstNodeHover?: boolean, frequency?: number, amplitude?: number): number;
