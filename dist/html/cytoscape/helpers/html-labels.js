const labelPropsSettings = {
    props: {
        className: "property",
        distanceBetween: 20,
        displayOnlyOnHover: true
    },
    boxLabels: {
        className: "box-label",
        distanceBetween: 35,
        displayOnlyOnHover: false
    }
}
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
                    if(settings.boxLabels.displayOnlyOnHover) labelsBox.style.display = "none";
                    host.appendChild(labelsBox);
        
                    labels.forEach((label, i) => {
                        const boxChild = document.createElement('div');
                        boxChild.id = `labels-box-${node.id()}-${i}`;
                        boxChild.className = settings.boxLabels.className;
                        boxChild.innerHTML = label;
                        boxChild.style.bottom = `${size/2-10+(i*settings.boxLabels.distanceBetween)}px`;
                        labelsBox.appendChild(boxChild);
                    })
                }

                else{
                    labels.forEach((_label, i) => {
                        const boxChild = document.getElementById(`labels-box-${node.id()}-${i}`);
                        boxChild.style.bottom = `${size/2-10+(i*settings.boxLabels.distanceBetween)}px`;
                    })
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
                    if(settings.props.displayOnlyOnHover) propsBox.style.display = "none";
                    host.appendChild(propsBox);
        
                    Object.keys(properties).forEach((key, i) => {
                        const propChild = document.createElement('div');
                        propChild.id = `props-box-${node.id()}-${i}`;
                        propChild.className = settings.props.className;
                        propChild.innerHTML = `<span>${key}</span><span>${properties[key]}</span>`;
                        propChild.style.top = `${size/2-10+(i*settings.props.distanceBetween)}px`;
                        propsBox.appendChild(propChild);
                    });
                }
                else{
                    Object.keys(properties).forEach((key, i) => {
                        const propChild = document.getElementById(`props-box-${node.id()}-${i}`);
                        propChild.style.top = `${size/2-10+(i*settings.props.distanceBetween)}px`;
                    })
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
            if(propsBox) propsBox.style.display = "block";
        }
        if(settings.boxLabels.displayOnlyOnHover){
            const labelsBox = document.getElementById(`labels-box-${node.id()}`);
            if(labelsBox) labelsBox.style.display = "block";
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