export function logNodePositions(cy){
    // Used to capture positions after a node is dragged
    cy.on("dragfree", "node", lnp);
    cy.on('viewport', lnp);

    function lnp(){
        const graphJSON = cy.json();
        const nodesSimple = [];
        graphJSON.elements.nodes.forEach((n) => {
            const obj = {};
            obj.data = n.data;
            obj.position = {x: Math.round(n.position.x), y: Math.round(n.position.y)};
            if(n.classes) obj.classes = n.classes;
            nodesSimple.push(obj);
        });
    }
}

export function logJSONOnDrag(cy){
    // Used to capture positions after a node is dragged
    cy.on("dragfree", "node", lnp);
    cy.on('zoomend', 'viewport', lnp);
    cy.on('dragend', 'viewport', lnp);

    function lnp(){
    const graphJSON = cy.json();
    console.log(graphJSON)
    }
}

export function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * 
 * @param {*} cy Cytoscape core
 * @param {*} frequency Adjust this value for faster/slower waves
 * @param {*} amplitude Adjust this value for larger/smaller waves
 */
export function animateGraph(cy, frequency = 0.0001, amplitude = 0.02){
    function animateNodes() {
      
        cy.nodes().forEach((node, i) => {
          const originalPosition = node.position(); // Get the original position
      
          const dx = Math.sin(performance.now() * frequency + i) * amplitude;
          const dy = Math.cos(performance.now() * frequency + i) * amplitude;
      
          node.position({
            x: originalPosition.x + dx,
            y: originalPosition.y + dy
          });
        });
      
        requestAnimationFrame(animateNodes); // Continue the animation
      }
      
      requestAnimationFrame(animateNodes); // Start the animation
}