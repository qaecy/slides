export const defaultSettings = {
  backgroundColor: "#fff",
  edgeColor: "#0d5be9",
  edgeFontSize: "5rem",
  edgeWidth: "3rem",
  nodeColor: "#03337a",
  nodeOpacity: "0.9",
  font: "Poppins",
  directed: true
}
export const buildStyles = (s = defaultSettings) => [
  {
    selector: "node",
    style: {
      label: (node) => (node.data("label") ? node.data("label") : ""),
      "text-valign": "center",
      "font-family": s.font,
      "font-size": "10rem",
      "opacity": s.nodeOpacity,
      color: "white",
      "text-outline-color": (node) =>
        node.data("color") ? node.data("color") : s.nodeColor,
      "text-outline-width": 1, // Set the outline width
      "background-color": (node) =>
        node.data("color") ? node.data("color") : s.nodeColor,
    },
  },
  {
    selector: "edge",
    style: {
      label: "data(label)",
      "text-valign": "center",
      "font-family": s.font,
      "font-size": s.edgeFontSize,
      color: s.edgeColor,
      "target-arrow-color": s.edgeColor,
      "curve-style": "bezier",
      "target-arrow-shape": (s.directed) ? "triangle" : "none",
      "line-color": s.edgeColor,
      "width": s.edgeWidth,
      "text-rotation": "autorotate", // Rotate label with the edge.
      "text-background-opacity": 1, // Make the background fully opaque.
      "text-background-color": s.backgroundColor, // Use the same color as your background to "break" the edge.
      "text-background-padding": 4, // Padding around the label text.
    },
  },
  {
    selector: ".triple",
    style: {
      "background-color": "white",
      "border-color": (node) =>
        node.data("color") ? node.data("color") : s.nodeColor,
    },
  },
  {
    selector: ".literal",
    style: {
      shape: "rectangle",
      width: "label", // Set width to match label
      height: "label", // Set height to match label
      label: (node) => (node.data("label") ? node.data("label") : ""),
      padding: "2rem",
      "border-color": "black",
      "border-width": 0.3,
      "background-color": "white",
      "text-outline-width": 0,
      color: "black",
      // 'background-color': "red",
      // "background-color": "white",
      // "border-color": node => node.data('color') ? 'data(color)' : '#0d5be9'
    },
  },
];

export const layout = {
  name: "grid",
  padding: 100,
};
