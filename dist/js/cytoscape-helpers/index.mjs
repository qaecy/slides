function w(o, e = !0, a = 1e-4, d = 0.02) {
  let t = 0;
  function n() {
    o.nodes().forEach((l, r) => {
      const s = l.position(), f = Math.sin(performance.now() * a + r) * d, c = Math.cos(performance.now() * a + r) * d;
      l.position({
        x: s.x + f,
        y: s.y + c
      });
    }), t = requestAnimationFrame(n);
  }
  t = requestAnimationFrame(n);
  let i = !0;
  return e && i && o.on("mouseover", "node", () => {
    cancelAnimationFrame(t), i = !1;
  }), t;
}
function x(o, e) {
  if (o.nodes() === void 0)
    return;
  const d = { x: e.offsetX, y: e.offsetY };
  let t, n = 1 / 0;
  return o.nodes().forEach((i) => {
    n = i.renderedBoundingBox().h;
    const l = E(d, i.renderedPosition());
    l < n && (n = l, t = i);
  }), t;
}
function E(o, e) {
  const a = e.x - o.x, d = e.y - o.y;
  return Math.sqrt(a * a + d * d);
}
class $ {
  constructor(e = "node-menu") {
    this.id = e, this.items = [], this.hideAfter = 2e3, this.sticky = !1, this.conditionalDisplay = (a) => !0, this.positionDef = (a, d) => {
      const n = a.renderedBoundingBox().h / 2, i = Math.sin(Math.PI / 4) * n;
      d.bottom = `${i}px`, d.left = `${i}px`;
    };
  }
}
function v(o, e) {
  function a() {
    o.nodes().forEach((d) => {
      const t = d.renderedPosition();
      let n = document.getElementById(`box-${d.id()}`);
      n || (n = document.createElement("div"), n.id = `box-${d.id()}`, n.style.position = "absolute", e.appendChild(n)), n.style.left = `${t.x}px`, n.style.top = `${t.y}px`;
    });
  }
  a(), o.on("position", "node", a), o.on("pan zoom", a), window.addEventListener("resize", a);
}
function C(o, e, a) {
  v(o, e);
  let d = !1;
  function t(r) {
    const s = document.createElement("div");
    s.id = `${a.id}-${r.id()}`, s.classList.add("node-menu"), s.classList.add(a.id), s.addEventListener("mouseover", () => d = !0), s.addEventListener("mouseout", () => d = !1), a.items.forEach((c) => {
      const p = document.createElement("div");
      s.appendChild(p), p.innerText = c.icon, p.addEventListener("click", (m) => {
        m.preventDefault(), m.stopImmediatePropagation(), c.click(r);
      }), p.classList.add("entry"), p.classList.add("material-icons");
    });
    const f = document.getElementById(`box-${r.id()}`);
    return a.positionDef(r, s.style), f && f.appendChild(s), s;
  }
  function n(r) {
    let s = document.getElementById(`${a.id}-${r.id()}`);
    s || (s = t(r)), s.style.display = "flex";
  }
  function i(r) {
    const s = document.getElementById(`${a.id}-${r.id()}`);
    s && (s.style.display = "none");
  }
  function l() {
    o.nodes().forEach((r) => {
      const s = document.getElementById(`${a.id}-${r.id()}`);
      s && a.positionDef(r, s.style);
    });
  }
  a.sticky ? o.nodes().forEach((r) => {
    a.conditionalDisplay(r) && n(r);
  }) : o.on("mouseover", "node", (r) => {
    if (!a.conditionalDisplay(r.target))
      return;
    n(r.target);
    const s = setInterval(() => {
      d || (i(r.target), clearInterval(s));
    }, a.hideAfter);
  }), o.on("pan zoom", l), window.addEventListener("resize", l);
}
const B = {
  props: {
    displayOnlyOnHover: !0
  },
  boxLabels: {
    displayOnlyOnHover: !1
  }
};
function N(o, e, a = B) {
  v(o, e);
  function d() {
    o.nodes().forEach((t) => {
      const n = t.renderedBoundingBox().h, i = document.getElementById(`box-${t.id()}`);
      if (!i)
        return;
      const l = t.data().boxLabels;
      if (l !== void 0) {
        let s = document.getElementById(
          `labels-box-${t.id()}`
        );
        s ? s.style.bottom = `${n / 2 - 10}px` : (s = document.createElement("div"), s.id = `labels-box-${t.id()}`, s.className = "box-label", s.style.bottom = `${n / 2 - 10}px`, a.boxLabels.displayOnlyOnHover && (s.style.display = "none"), i.appendChild(s), l.forEach((f, c) => {
          if (!s)
            return;
          const p = document.createElement("div");
          p.id = `labels-box-${t.id()}-${c}`, p.className = "entry", p.innerHTML = f, s.appendChild(p);
        }));
      }
      const r = t.data().properties;
      if (r !== void 0) {
        let s = document.getElementById(
          `props-box-${t.id()}`
        );
        s ? s.style.top = `${n / 2 - 10}px` : (s = document.createElement("div"), s.id = `props-box-${t.id()}`, s.style.right = "0px", s.className = "property", s.style.top = `${n / 2 - 10}px`, a.props.displayOnlyOnHover && (s.style.display = "none"), i.appendChild(s), Object.keys(r).forEach((f, c) => {
          if (!s)
            return;
          const p = document.createElement("div");
          p.id = `props-box-${t.id()}-${c}`, p.className = "entry", p.innerHTML = `<span class="key">${f}</span><span class="value">${r[f]}</span>`, s.appendChild(p);
        }));
      }
    });
  }
  d(), o.on("zoom", d), o.on("mouseover", "node", (t) => {
    const n = t.target;
    if (a.props.displayOnlyOnHover) {
      const i = document.getElementById(`props-box-${n.id()}`);
      i && (i.style.display = "flex");
    }
    if (a.boxLabels.displayOnlyOnHover) {
      const i = document.getElementById(`labels-box-${n.id()}`);
      i && (i.style.display = "flex");
    }
  }), o.on("mouseout", "node", (t) => {
    const n = t.target;
    if (a.props.displayOnlyOnHover) {
      const i = document.getElementById(`props-box-${n.id()}`);
      i && (i.style.display = "none");
    }
    if (a.boxLabels.displayOnlyOnHover) {
      const i = document.getElementById(`labels-box-${n.id()}`);
      i && (i.style.display = "none");
    }
  });
}
function L(o, e, a) {
  const d = Object.keys(a)[0], t = Object.values(a)[0], n = new $("expand-menu");
  n.items = [
    {
      icon: "add",
      click: (c) => r(c)
    }
  ], n.sticky = !0, n.positionDef = (c, p) => {
    const u = c.renderedBoundingBox().h / 2, y = Math.sin(Math.PI / 4) * u - 8;
    p.top = `${y}px`, p.right = `${y}px`;
  }, n.conditionalDisplay = (c) => c.data("canExpand");
  const i = [], l = [];
  o.nodes().filter((c) => c.data(d) === t).forEach((c) => {
    i.push(c), l.push(c.id());
  }), i.forEach((c) => {
    const p = c.neighborhood(), m = /* @__PURE__ */ new Set(), u = {};
    p.filter((h) => !l.includes(h.id())).forEach((h) => {
      const b = h.data(e);
      b !== void 0 && (m.add(b), Object.keys(u).includes(b) || (u[b] = []), u[b].push(h), h.hide());
    });
    const y = [];
    m.forEach((h) => {
      const b = `${c.id()}-${h}`;
      y.push(
        {
          group: "nodes",
          data: {
            id: b,
            label: h,
            collapsedNodes: u[h],
            canExpand: !0,
            boxLabels: [u[h].length]
          }
        },
        {
          group: "edges",
          data: { source: c.id(), target: b }
        }
      );
    }), o.add(y);
  });
  function r(c) {
    const p = c.data();
    if (!Object.keys(p).includes("collapsedNodes"))
      return;
    p.collapsedNodes.forEach((u) => {
      u.show();
    }), c.hide();
    const m = document.getElementById(`box-${c.id()}`);
    m && Array.from(m.children).forEach(
      (u) => u.style.display = "none"
    ), s();
  }
  function s() {
    o.layout({
      name: "cose"
    }).run();
  }
  s();
  const f = document.getElementById("cy");
  f && (C(o, f, n), N(o, f));
}
class z {
  constructor(e) {
    this._cy = e, this._initEventListeners();
  }
  _initEventListeners() {
    var e, a;
    (e = this._cy.container()) == null || e.addEventListener("dragover", (d) => {
      var n;
      d.preventDefault(), d.stopPropagation();
      const t = this._getClosestNode(d);
      if (t === void 0 && this._lastHoveredNode !== void 0)
        this._lastHoveredNode.removeClass("dropzone"), this._cy.emit("filesHoverEnd", t), this._lastHoveredNode.emit("filesHoverEnd");
      else if (this._lastHoveredNode !== t && t !== void 0) {
        t.addClass("dropzone");
        const i = (n = d.dataTransfer) == null ? void 0 : n.files;
        this._cy.emit("filesHoverStart", { node: t, files: i }), t.emit("filesHoverStart", i);
      }
      this._lastHoveredNode = t;
    }), (a = this._cy.container()) == null || a.addEventListener("drop", (d) => {
      var n;
      d.preventDefault(), d.stopPropagation();
      const t = this._getClosestNode(d);
      if (t !== void 0) {
        t.removeClass("dropzone");
        const i = (n = d.dataTransfer) == null ? void 0 : n.files;
        i !== void 0 && t.emit("filesDropped", i), this._cy.emit("filesDropped", { node: t, files: i });
      }
    });
  }
  _getClosestNode(e) {
    var i, l;
    if (((i = this._cy) == null ? void 0 : i.nodes()) === void 0)
      return;
    const d = { x: e.offsetX, y: e.offsetY };
    let t, n = 1 / 0;
    return (l = this._cy) == null || l.nodes().forEach((r) => {
      n = r.renderedBoundingBox().h;
      const s = this._distance(d, r.renderedPosition());
      s < n && (n = s, t = r);
    }), t;
  }
  _distance(e, a) {
    const d = a.x - e.x, t = a.y - e.y;
    return Math.sqrt(d * d + t * t);
  }
}
const g = {
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
}, H = (o = g) => [
  {
    selector: "node",
    style: {
      label: (e) => e.data(o.labelSelector) && o.showNodeLabels ? e.data(o.labelSelector) : "",
      "text-valign": "center",
      "font-family": o.font,
      "font-size": "10rem",
      opacity: o.nodeOpacity,
      color: "white",
      "text-outline-color": (e) => e.data("color") ? e.data("color") : o.nodeColor,
      "text-outline-width": 1,
      // Set the outline width
      "background-color": (e) => e.data("color") ? e.data("color") : o.nodeColor,
      width: (e) => e.data("size") ? e.data("size") : "",
      height: (e) => e.data("size") ? e.data("size") : ""
    }
  },
  {
    selector: "edge",
    style: {
      label: (e) => e.data(o.labelSelector) && o.showEdgeLabels ? e.data(o.labelSelector) : "",
      "text-valign": "center",
      "font-family": o.font,
      "font-size": o.edgeFontSize,
      color: o.edgeColor,
      "target-arrow-color": o.edgeColor,
      "curve-style": "bezier",
      "target-arrow-shape": o.directed ? "triangle" : "none",
      "line-color": o.edgeColor,
      width: (e) => e.data("width") ? e.data("width") : o.edgeWidth,
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
      "border-color": (e) => e.data("color") ? e.data("color") : o.nodeColor
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
      label: (e) => e.data(o.labelSelector) ? e.data(o.labelSelector) : "",
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
      "pie-1-background-color": g.nodeColor,
      // Color A
      "pie-1-background-size": (e) => `${e.data("pct")}%`,
      "pie-2-background-color": g.edgeColor,
      // Color B
      "pie-2-background-size": (e) => `${100 - parseInt(e.data("pct"))}%`,
      label: (e) => `${e.data("pct")}%`,
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
], I = {
  name: "grid",
  padding: 100
};
function D(o) {
  o.on("dragfree", "node", e), o.on("viewport", e);
  function e() {
    const a = o.json(), d = [];
    a.elements.nodes.forEach((t) => {
      const n = {};
      n.data = t.data, n.position = { x: Math.round(t.position.x), y: Math.round(t.position.y) }, t.classes && (n.classes = t.classes), d.push(n);
    }), console.log(d);
  }
}
function O(o) {
  o.on("dragfree", "node", e), o.on("viewport", e);
  function e() {
    const a = o.json(), d = [], t = [];
    a.elements.nodes.forEach((n) => {
      const i = {};
      i.data = n.data, n.classes && (i.classes = n.classes), d.push(i);
    }), a.elements.edges.forEach((n) => {
      const i = {};
      i.data = n.data, n.classes && (i.classes = n.classes), t.push(i);
    }), console.log({ nodes: d, edges: t });
  }
}
function S(o) {
  let e;
  a(o);
  function a(d) {
    var t, n;
    (t = d.container()) == null || t.addEventListener("dragover", (i) => {
      var r;
      i.preventDefault(), i.stopPropagation();
      const l = x(d, i);
      if (l === void 0 && e !== void 0)
        e.removeClass("dropzone"), d.emit("nodeFileDropHoverEnd", { node: e }), e.emit("filesHoverEnd");
      else if (e !== l && l !== void 0) {
        l.addClass("dropzone");
        const s = (r = i.dataTransfer) == null ? void 0 : r.files;
        d.emit("nodeFileDropHoverStart", { node: l, files: s }), l.emit("filesHoverStart", s);
      }
      e = l;
    }), (n = d.container()) == null || n.addEventListener("drop", (i) => {
      var r;
      i.preventDefault(), i.stopPropagation();
      const l = x(d, i);
      if (l !== void 0) {
        l.removeClass("dropzone");
        const s = (r = i.dataTransfer) == null ? void 0 : r.files;
        s !== void 0 && l.emit("filesDropped", s), d.emit("nodeFileDropDropped", { node: l, files: s });
      }
    });
  }
}
export {
  z as FileDropHandler,
  $ as NodeMenuSettings,
  w as animateGraph,
  N as appendHTMLLabels,
  v as appendHostContainers,
  S as appendNodeFileDrop,
  C as appendNodeMenu,
  H as buildStyles,
  L as collapseGraph,
  g as defaultSettings,
  x as getClosestNode,
  I as layout,
  D as logNodePositions,
  O as logNodesEdges
};
