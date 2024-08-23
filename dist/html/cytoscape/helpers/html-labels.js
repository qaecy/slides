const labelPropsSettings = {
    props: {
        className: "property",
        distanceBetween: 20,
        displayOnlyOnHover: true
    },
    boxLabels: {
        distanceBetween: 35,
        displayOnlyOnHover: false
    }
}

// Appends the following DOM elements to each node:
// - div (Host container, placed right in middle of node)
//     - div .box-label (Optional box-label container if there are box labels in the node data)
//        - div .entry (One appended for each box label)
//     - div .property (Optional property container if there are properties in the node data)
//        - div .entry (One appended for each property)
//           - span .key (For the property key)
//           - span .value (For the property value)

export function appendLabelsAndProps(cy, parent, settings = labelPropsSettings){

    // First append the host containers
    appendHostContainers(cy, parent)
    
    function updateLabelBoxes(){
        cy.nodes().forEach(node => {
            const size = node.renderedBoundingBox().h;
            const host = document.getElementById(`box-${node.id()}`);
    
            // Append box labels on top
            const labels = node.data().boxLabels;
            if(labels !== undefined){
                let labelsBox = document.getElementById(`labels-box-${node.id()}`);

                if(!labelsBox){
                    labelsBox = document.createElement("div");
                    labelsBox.id = `labels-box-${node.id()}`;
                    labelsBox.className = "box-label";
                    labelsBox.style.bottom = `${size/2-10}px`;
                    if(settings.boxLabels.displayOnlyOnHover) labelsBox.style.display = "none";
                    host.appendChild(labelsBox);
        
                    labels.forEach((label, i) => {
                        const boxChild = document.createElement('div');
                        boxChild.id = `labels-box-${node.id()}-${i}`;
                        boxChild.className = "entry";
                        boxChild.innerHTML = label;
                        labelsBox.appendChild(boxChild);
                    })
                }

                else{
                    labelsBox.style.bottom = `${size/2-10}px`;
                }
            }
    
            // Append properties at bottom
            const properties = node.data().properties;
            if(properties !== undefined){
                let propsBox = document.getElementById(`props-box-${node.id()}`);
                if(!propsBox){
                    const propsBox = document.createElement("div");
                    propsBox.id = `props-box-${node.id()}`;
                    propsBox.style.right = "0px";
                    propsBox.className = "property";
                    propsBox.style.top = `${size/2-10}px`;
                    if(settings.props.displayOnlyOnHover) propsBox.style.display = "none";
                    host.appendChild(propsBox);
        
                    Object.keys(properties).forEach((key, i) => {
                        const propChild = document.createElement('div');
                        propChild.id = `props-box-${node.id()}-${i}`;
                        propChild.className = "entry";
                        propChild.innerHTML = `<span class="key">${key}</span><span class="value">${properties[key]}</span>`;
                        propsBox.appendChild(propChild);
                    });
                }
                else{
                    propsBox.style.top = `${size/2-10}px`;
                }
                
            }
        });
    }

    // Update boxes initially
    updateLabelBoxes();

    // Update boxes on zoom
    cy.on('zoom', updateLabelBoxes);

    // Update hover display on node hover
    cy.on('mouseover', 'node', (ev) => {
        const node = ev.target;
        if(settings.props.displayOnlyOnHover){
            const propsBox = document.getElementById(`props-box-${node.id()}`);
            if(propsBox) propsBox.style.display = "flex";
        }
        if(settings.boxLabels.displayOnlyOnHover){
            const labelsBox = document.getElementById(`labels-box-${node.id()}`);
            if(labelsBox) labelsBox.style.display = "flex";
        }
    });

    // Update hover display on node hover
    cy.on('mouseout', 'node', (ev) => {
        const node = ev.target;
        if(settings.props.displayOnlyOnHover){
            const propsBox = document.getElementById(`props-box-${node.id()}`);
            if(propsBox) propsBox.style.display = "none";
        }
        if(settings.boxLabels.displayOnlyOnHover){
            const labelsBox = document.getElementById(`labels-box-${node.id()}`);
            if(labelsBox) labelsBox.style.display = "none";
        }
    });
}

// This function creates a div on top of each node that can be used as host for box labels
function appendHostContainers(cy, parent){

    function updateHostBoxes() {
        cy.nodes().forEach(node => {

            const position = node.renderedPosition();

            const bl = node.data().boxLabels;
            
            if(bl?.length){
                let box = document.getElementById(`box-${node.id()}`);
            
                if (!box) {
                    box = document.createElement('div');
                    box.id = `box-${node.id()}`;
                    box.style.position = "absolute";
                    parent.appendChild(box);
                }

                box.style.left = `${position.x}px`; // Adjust position
                box.style.top = `${position.y}px`; // Adjust position
            }
        });
    }

    // Update boxes initially
    updateHostBoxes();

    // Update boxes on node position change
    cy.on('position', 'node', updateHostBoxes);

    // Update boxes on pan and zoom
    cy.on('pan zoom', updateHostBoxes);

    // Optionally update on resize
    window.addEventListener('resize', updateHostBoxes);
}