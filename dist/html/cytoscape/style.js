export const style = [
    {
      selector: "node",
      style: {
        'label': node => node.data('label') ? node.data('label') : '',
        "text-valign": "center",
        "font-family": "Poppins",
        "font-size": "10rem",
        color: "white",
        'text-outline-color': node => node.data('color') ? node.data('color') : '#0d5be9',
        'text-outline-width': 1, // Set the outline width
        "background-color": node => node.data('color') ? node.data('color') : '#0d5be9'
      },
    },
    {
      selector: "edge",
      style: {
        label: "data(label)",
        "text-valign": "center",
        "font-family": "Poppins",
        "font-size": "10rem",
        'text-outline-color': "black",
        'text-outline-width': 0.7, // Set the outline width
        color: "white",
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': "black",
        "line-color": "black",
      },
    },
    {
      selector: ".triple",
      style: {
        "background-color": "white",
        "border-color": node => node.data('color') ? node.data('color') : '#0d5be9'
      },
    },
    {
      selector: ".literal",
      style: {
        'shape': 'rectangle',
        'width': 'label', // Set width to match label
        'height': 'label', // Set height to match label
        'label': node => node.data('label') ? node.data('label') : '',
        'padding': '2rem',
        "border-color": "black",
        "border-width": 0.3,
        "background-color": "white",
        'text-outline-width': 0,
        "color": "black"
        // 'background-color': "red",
        // "background-color": "white",
        // "border-color": node => node.data('color') ? 'data(color)' : '#0d5be9'
      },
    },
];

export const layout = {
    name: 'grid',
    padding: 100,
};