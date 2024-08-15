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
            obj.position = n.position;
            if(n.classes) obj.classes = n.classes;
            nodesSimple.push(obj);
            console.log(nodesSimple);
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