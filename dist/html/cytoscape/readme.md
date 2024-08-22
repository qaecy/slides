# Cytoscape

1. To make a new graph start with the following template:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="../../js/cytoscape.min.js"></script>

    <style>
      #cy {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
      }
    </style>
  </head>
  <body>
    <div id="cy"></div>
    <script type="module">
      import { style, layout } from "./style.js";
      import { logNodePositions } from "./helpers/helpers.js";

      const cy = cytoscape({
        container: document.getElementById("cy"),
        style,
        layout: {
          padding: 100
        },
        elements: {
          nodes: [
            {
              data: {
                id: "door",
                label: "Door",
              }
            },
            {
              data: {
                id: "red",
                label: "Red",
                color: "red",
              }
            }
          ],
          edges: [
            {
              data: {
                id: "a",
                source: "door",
                target: "red",
                label: "has color",
              },
            }
          ],
        },
      });

      logNodePositions(cy);
    </script>
  </body>
</html>
```

2. Adjust nodes and edges to create the graph you wish

3. You might not be satisfied with the layout as it looks per default, but you will notice that the `logJSONOnDrag()`-function will take care of logging the nodes' positions every time you drag a node. You can simply copy this and replace your nodes-section of the elements. In order for this to work you also need to adjust the layout-settings name must be set to "preset" (`name: "preset"`) and if the graph content is minimal, you might need to adjust the padding. For example:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="../../js/cytoscape.min.js"></script>

    <style>
      #cy {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
      }
    </style>
  </head>
  <body>
    <div id="cy"></div>
    <script type="module">
      import { style, layout } from "./style.js";
      import { logNodePositions, isMobile } from "./helpers/helpers.js";

      const cy = cytoscape({
        container: document.getElementById("cy"),
        style,
        layout: {
          name: "preset",
          padding: padding: () => isMobile() ? 5 : 300,
        },
        elements: {
          nodes: [
            {
              data: {
                id: "door",
                label: "Door",
              },
              classes: "",
              position: {
                x: 537.8913043478261,
                y: 376.3695652173913,
              },
            },
            {
              data: {
                id: "red",
                label: "Red",
                color: "red",
              },
              classes: "",
              position: {
                x: 732.6521739130434,
                y: 508.9565217391305,
              },
            },
          ],
          edges: [
            {
              data: {
                id: "a",
                source: "door",
                target: "red",
                label: "has color",
              },
            },
          ],
        },
      });

      logNodePositions(cy);
    </script>
  </body>
</html>
```