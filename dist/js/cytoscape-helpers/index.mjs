function w(o, t = !0, n = 1e-4, l = 0.02) {
  let a = 0;
  function s() {
    o.nodes().forEach((u, i) => {
      const e = u.position(), c = Math.sin(performance.now() * n + i) * l, p = Math.cos(performance.now() * n + i) * l;
      u.position({
        x: e.x + c,
        y: e.y + p
      });
    }), a = requestAnimationFrame(s);
  }
  a = requestAnimationFrame(s);
  let d = !0;
  return t && d && o.on("mouseover", "node", () => {
    cancelAnimationFrame(a), d = !1;
  }), a;
}
function g(o, t) {
  if (o.nodes() === void 0)
    return;
  let l, a = 1 / 0;
  return o.nodes().forEach((s) => {
    a = s.renderedBoundingBox().h;
    const d = x(t, s.renderedPosition());
    d < a && (a = d, l = s);
  }), l;
}
function x(o, t) {
  const n = t.x - o.x, l = t.y - o.y;
  return Math.sqrt(n * n + l * l);
}
class E {
  constructor(t = "node-menu") {
    this.id = t, this.items = [], this.hideAfter = 2e3, this.sticky = !1, this.conditionalDisplay = (n) => !0, this.positionDef = (n, l) => {
      const s = n.renderedBoundingBox().h / 2, d = Math.sin(Math.PI / 4) * s;
      l.bottom = `${d}px`, l.left = `${d}px`;
    };
  }
}
function y(o, t) {
  function n() {
    o.nodes().forEach((l) => {
      const a = l.renderedPosition();
      let s = document.getElementById(`box-${l.id()}`);
      s || (s = document.createElement("div"), s.id = `box-${l.id()}`, s.style.position = "absolute", t.appendChild(s)), s.style.left = `${a.x}px`, s.style.top = `${a.y}px`;
    });
  }
  n(), o.on("position", "node", n), o.on("pan zoom", n), window.addEventListener("resize", n);
}
function v(o, t, n) {
  y(o, t);
  let l = !1;
  function a(i) {
    const e = document.createElement("div");
    e.id = `${n.id}-${i.id()}`, e.classList.add("node-menu"), e.classList.add(n.id), e.addEventListener("mouseover", () => l = !0), e.addEventListener("mouseout", () => l = !1), n.items.forEach((p) => {
      const r = document.createElement("div");
      e.appendChild(r), r.innerText = p.icon, r.addEventListener("click", (f) => {
        f.preventDefault(), f.stopImmediatePropagation(), p.click(i);
      }), r.addEventListener("touchstart", (f) => {
        f.preventDefault(), f.stopImmediatePropagation(), p.click(i);
      }), r.classList.add("entry"), r.classList.add("material-icons");
    });
    const c = document.getElementById(`box-${i.id()}`);
    return n.positionDef(i, e.style), c && c.appendChild(e), e;
  }
  function s(i) {
    let e = document.getElementById(`${n.id}-${i.id()}`);
    e || (e = a(i)), e.style.display = "flex";
  }
  function d(i) {
    const e = document.getElementById(`${n.id}-${i.id()}`);
    e && (e.style.display = "none");
  }
  function u() {
    o.nodes().forEach((i) => {
      const e = document.getElementById(`${n.id}-${i.id()}`);
      e && n.positionDef(i, e.style);
    });
  }
  n.sticky ? o.nodes().forEach((i) => {
    n.conditionalDisplay(i) && s(i);
  }) : o.on("mouseover", "node", (i) => {
    if (!n.conditionalDisplay(i.target))
      return;
    s(i.target);
    const e = setInterval(() => {
      l || (d(i.target), clearInterval(e));
    }, n.hideAfter);
  }), o.on("pan zoom", u), window.addEventListener("resize", u);
}
const $ = {
  props: {
    displayOnlyOnHover: !0
  },
  boxLabels: {
    displayOnlyOnHover: !1
  }
};
function B(o, t, n = $) {
  y(o, t);
  function l() {
    o.nodes().forEach((a) => {
      const s = a.renderedBoundingBox().h, d = document.getElementById(`box-${a.id()}`);
      if (!d)
        return;
      const u = a.data().boxLabels;
      if (u !== void 0) {
        let e = document.getElementById(
          `labels-box-${a.id()}`
        );
        e ? e.style.bottom = `${s / 2 - 10}px` : (e = document.createElement("div"), e.id = `labels-box-${a.id()}`, e.className = "box-label", e.style.bottom = `${s / 2 - 10}px`, n.boxLabels.displayOnlyOnHover && (e.style.display = "none"), d.appendChild(e), u.forEach((c, p) => {
          if (!e)
            return;
          const r = document.createElement("div");
          r.id = `labels-box-${a.id()}-${p}`, r.className = "entry", r.innerHTML = c, e.appendChild(r);
        }));
      }
      const i = a.data().properties;
      if (i !== void 0) {
        let e = document.getElementById(
          `props-box-${a.id()}`
        );
        e ? e.style.top = `${s / 2 - 10}px` : (e = document.createElement("div"), e.id = `props-box-${a.id()}`, e.style.right = "0px", e.className = "property", e.style.top = `${s / 2 - 10}px`, n.props.displayOnlyOnHover && (e.style.display = "none"), d.appendChild(e), Object.keys(i).forEach((c, p) => {
          if (!e)
            return;
          const r = document.createElement("div");
          r.id = `props-box-${a.id()}-${p}`, r.className = "entry", r.innerHTML = `<span class="key">${c}</span><span class="value">${i[c]}</span>`, e.appendChild(r);
        }));
      }
    });
  }
  l(), o.on("zoom", l), o.on("mouseover", "node", (a) => {
    const s = a.target;
    if (n.props.displayOnlyOnHover) {
      const d = document.getElementById(`props-box-${s.id()}`);
      d && (d.style.display = "flex");
    }
    if (n.boxLabels.displayOnlyOnHover) {
      const d = document.getElementById(`labels-box-${s.id()}`);
      d && (d.style.display = "flex");
    }
  }), o.on("mouseout", "node", (a) => {
    const s = a.target;
    if (n.props.displayOnlyOnHover) {
      const d = document.getElementById(`props-box-${s.id()}`);
      d && (d.style.display = "none");
    }
    if (n.boxLabels.displayOnlyOnHover) {
      const d = document.getElementById(`labels-box-${s.id()}`);
      d && (d.style.display = "none");
    }
  });
}
class C {
  constructor() {
    this.groupByField = "category", this.groupFor = { type: "folder" }, this.layoutOptions = { name: "cose" }, this.collapseThreshold = 1;
  }
  // How many outgoing relationships should there be befor it collapses?
}
function O(o, t) {
  const n = Object.keys(t.groupFor)[0], l = Object.values(t.groupFor)[0], a = new E("expand-menu");
  a.items = [
    {
      icon: "add",
      click: (e) => u(e)
    }
  ], a.sticky = !0, a.positionDef = (e, c) => {
    const r = e.renderedBoundingBox().h / 2, f = Math.sin(Math.PI / 4) * r - 8;
    c.top = `${f}px`, c.right = `${f}px`;
  }, a.conditionalDisplay = (e) => e.data("canExpand");
  const s = [], d = [];
  o.nodes().filter((e) => e.data(n) === l).forEach((e) => {
    s.push(e), d.push(e.id());
  }), s.forEach((e) => {
    const c = e.neighborhood().filter((h) => h.isNode() && !d.includes(h.id()));
    if (c.length <= t.collapseThreshold)
      return;
    const p = /* @__PURE__ */ new Set(), r = {};
    c.forEach((h) => {
      const m = h.data(t.groupByField);
      m !== void 0 && (p.add(m), Object.keys(r).includes(m) || (r[m] = []), r[m].push(h), h.hide());
    });
    const f = [];
    p.forEach((h) => {
      const m = `${e.id()}-${h}`;
      f.push(
        {
          group: "nodes",
          data: {
            id: m,
            label: h,
            collapsedNodes: r[h],
            canExpand: !0,
            boxLabels: [r[h].length]
          }
        },
        {
          group: "edges",
          data: { source: e.id(), target: m }
        }
      );
    }), o.add(f);
  });
  function u(e) {
    const c = e.data();
    if (!Object.keys(c).includes("collapsedNodes"))
      return;
    c.collapsedNodes.forEach((r) => {
      r.show();
    }), e.hide();
    const p = document.getElementById(`box-${e.id()}`);
    p && Array.from(p.children).forEach(
      (r) => r.style.display = "none"
    ), o.layout(t.layoutOptions).run();
  }
  o.layout(t.layoutOptions).run();
  const i = o.container();
  i && (v(o, i, a), B(o, i));
}
const b = {
  backgroundColor: "#fff",
  edgeColor: "#0d5be9",
  edgeFontSize: "5rem",
  edgeWidth: "3rem",
  nodeColor: "#03337a",
  nodeOpacity: "0.9",
  font: "Poppins",
  directed: !0,
  labelSelector: "label",
  showNodeLabels: !0,
  showEdgeLabels: !0,
  hoverBorderColor: "#0d5be9"
}, L = (o = b) => [
  {
    selector: "node",
    style: {
      label: (t) => t.data(o.labelSelector) && o.showNodeLabels ? t.data(o.labelSelector) : "",
      "text-valign": "center",
      "font-family": o.font,
      "font-size": "10rem",
      opacity: o.nodeOpacity,
      color: "white",
      "text-outline-color": (t) => t.data("color") ? t.data("color") : o.nodeColor,
      "text-outline-width": 1,
      // Set the outline width
      "background-color": (t) => t.data("color") ? t.data("color") : o.nodeColor,
      width: (t) => t.data("size") ? t.data("size") : "",
      height: (t) => t.data("size") ? t.data("size") : ""
    }
  },
  {
    selector: "edge",
    style: {
      label: (t) => t.data(o.labelSelector) && o.showEdgeLabels ? t.data(o.labelSelector) : "",
      "text-valign": "center",
      "font-family": o.font,
      "font-size": o.edgeFontSize,
      color: o.edgeColor,
      "target-arrow-color": o.edgeColor,
      "curve-style": "bezier",
      "target-arrow-shape": o.directed ? "triangle" : "none",
      "line-color": o.edgeColor,
      width: (t) => t.data("width") ? t.data("width") : o.edgeWidth,
      "text-rotation": "autorotate",
      // Rotate label with the edge.
      "text-background-opacity": 1,
      // Make the background fully opaque.
      "text-background-color": o.backgroundColor,
      // Use the same color as your background to "break" the edge.
      "text-background-padding": 4
      // Padding around the label text.
    }
  },
  {
    selector: ".triple",
    style: {
      "background-color": "white",
      "border-color": (t) => t.data("color") ? t.data("color") : o.nodeColor
    }
  },
  {
    selector: ".literal",
    style: {
      shape: "rectangle",
      width: "label",
      // Set width to match label
      height: "label",
      // Set height to match label
      label: (t) => t.data(o.labelSelector) ? t.data(o.labelSelector) : "",
      padding: "2rem",
      "border-color": "black",
      "border-width": 0.3,
      "background-color": "white",
      "text-outline-width": 0,
      color: "black"
      // 'background-color': "red",
      // "background-color": "white",
      // "border-color": node => node.data('color') ? 'data(color)' : '#0d5be9'
    }
  },
  {
    selector: ".loading",
    style: {
      "pie-size": "100%",
      "pie-1-background-color": b.nodeColor,
      // Color A
      "pie-1-background-size": (t) => `${t.data("pct")}%`,
      "pie-2-background-color": b.edgeColor,
      // Color B
      "pie-2-background-size": (t) => `${100 - parseInt(t.data("pct"))}%`,
      label: (t) => `${t.data("pct")}%`,
      "font-size": "5rem"
    }
  },
  {
    selector: ".dropzone",
    style: {
      "border-color": o.hoverBorderColor,
      "border-width": 6,
      "border-opacity": 1
    }
  }
], z = {
  name: "cose",
  padding: 100
};
function I(o) {
  o.on("dragfree", "node", t), o.on("viewport", t);
  function t() {
    const n = o.json(), l = [];
    n.elements.nodes.forEach((a) => {
      const s = {};
      s.data = a.data, s.position = { x: Math.round(a.position.x), y: Math.round(a.position.y) }, a.classes && (s.classes = a.classes), l.push(s);
    }), console.log(l);
  }
}
function N(o) {
  o.on("dragfree", "node", t), o.on("viewport", t);
  function t() {
    const n = o.json(), l = [], a = [];
    n.elements.nodes.forEach((s) => {
      const d = {};
      d.data = s.data, s.classes && (d.classes = s.classes), l.push(d);
    }), n.elements.edges.forEach((s) => {
      const d = {};
      d.data = s.data, s.classes && (d.classes = s.classes), a.push(d);
    }), console.log({ nodes: l, edges: a });
  }
}
function k(o, t = (n) => !0) {
  let n;
  l(o);
  function l(a) {
    var s, d;
    (s = a.container()) == null || s.addEventListener("dragover", (u) => {
      var c;
      u.preventDefault(), u.stopPropagation();
      const i = { x: u.offsetX, y: u.offsetY }, e = g(a, i);
      if (e === void 0 && n !== void 0)
        n.removeClass("dropzone"), a.emit("nodeFileDropHoverEnd", { node: n }), n.emit("filesHoverEnd");
      else if (n !== e && e !== void 0) {
        if (!t(e))
          return;
        e.addClass("dropzone");
        const p = (c = u.dataTransfer) == null ? void 0 : c.files;
        a.emit("nodeFileDropHoverStart", { node: e, files: p }), e.emit("filesHoverStart", p);
      }
      n = e;
    }), (d = a.container()) == null || d.addEventListener("drop", (u) => {
      var c;
      u.preventDefault(), u.stopPropagation();
      const i = { x: u.offsetX, y: u.offsetY }, e = g(a, i);
      if (e !== void 0) {
        if (!t(e))
          return;
        e.removeClass("dropzone");
        const p = (c = u.dataTransfer) == null ? void 0 : c.files;
        p !== void 0 && e.emit("filesDropped", p), a.emit("nodeFileDropDropped", { node: e, files: p });
      }
    });
  }
}
function S(o) {
  o.on("mouseover", "node", (t) => {
    const n = t.target;
    n.style("label", n.data("label"));
  }), o.on("mouseout", "node", (t) => {
    t.target.style("label", "");
  });
}
export {
  C as CollapseSettings,
  E as NodeMenuSettings,
  w as animateGraph,
  B as appendHTMLLabels,
  y as appendHostContainers,
  k as appendNodeFileDrop,
  v as appendNodeMenu,
  L as buildStyles,
  g as closestNode,
  O as collapseGraph,
  b as defaultSettings,
  z as layoutOptions,
  I as logNodePositions,
  N as logNodesEdges,
  S as showNodeLabelOnHover
};
