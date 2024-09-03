function C(o, t = !0, s = 1e-4, r = 0.02) {
  let n = 0;
  function a() {
    o.nodes().forEach((c, d) => {
      const e = c.position(), f = Math.sin(performance.now() * s + d) * r, p = Math.cos(performance.now() * s + d) * r;
      c.position({
        x: e.x + f,
        y: e.y + p
      });
    }), n = requestAnimationFrame(a);
  }
  n = requestAnimationFrame(a);
  let i = !0;
  return t && i && o.on("mouseover", "node", () => {
    cancelAnimationFrame(n), i = !1;
  }), n;
}
function y(o, t) {
  if (o.nodes() === void 0)
    return;
  let r, n = 1 / 0;
  return o.nodes().forEach((a) => {
    n = a.renderedBoundingBox().h;
    const i = v(t, a.renderedPosition());
    i < n && (n = i, r = a);
  }), r;
}
function v(o, t) {
  const s = t.x - o.x, r = t.y - o.y;
  return Math.sqrt(s * s + r * r);
}
class E {
  constructor(t = "node-menu") {
    this.id = t, this.items = [], this.hideAfter = 2e3, this.sticky = !1, this.conditionalDisplay = (s) => !0, this.positionDef = (s, r) => {
      const a = s.renderedBoundingBox().h / 2, i = Math.sin(Math.PI / 4) * a;
      r.bottom = `${i}px`, r.left = `${i}px`;
    };
  }
}
function g(o, t) {
  function s() {
    o.nodes().forEach((r) => {
      const n = r.renderedPosition();
      let a = document.getElementById(`box-${r.id()}`);
      a || (a = document.createElement("div"), a.id = `box-${r.id()}`, a.style.position = "absolute", t.appendChild(a)), a.style.left = `${n.x}px`, a.style.top = `${n.y}px`;
    });
  }
  s(), o.on("position", "node", s), o.on("pan zoom", s), window.addEventListener("resize", s);
}
function $(o, t, s) {
  g(o, t);
  let r = !1;
  function n(d) {
    const e = document.createElement("div");
    e.id = `${s.id}-${d.id()}`, e.classList.add("node-menu"), e.classList.add(s.id), e.addEventListener("mouseover", () => r = !0), e.addEventListener("mouseout", () => r = !1), s.items.forEach((p) => {
      const l = document.createElement("div");
      if (l.style.position = "relative", e.appendChild(l), l.innerText = p.icon, l.addEventListener("click", (h) => {
        h.preventDefault(), h.stopImmediatePropagation(), p.click(d);
      }), l.addEventListener("touchstart", (h) => {
        h.preventDefault(), h.stopImmediatePropagation(), p.click(d);
      }), l.classList.add("entry"), l.classList.add("material-icons"), p.tooltip !== void 0) {
        const h = document.createElement("div");
        h.innerText = p.tooltip;
        const u = h.style;
        u.position = "absolute", u.display = "none", u.bottom = "100%", u.left = "50%", u.transform = "translate(-50%)", h.classList.add("tooltip"), l.appendChild(h), l.addEventListener("mouseover", () => u.display = "block"), l.addEventListener("mouseleave", () => u.display = "none");
      }
    });
    const f = document.getElementById(`box-${d.id()}`);
    return s.positionDef(d, e.style), f && f.appendChild(e), e;
  }
  function a(d) {
    let e = document.getElementById(`${s.id}-${d.id()}`);
    e || (e = n(d)), e.style.display = "flex";
  }
  function i(d) {
    const e = document.getElementById(`${s.id}-${d.id()}`);
    e && (e.style.display = "none");
  }
  function c() {
    o.nodes().forEach((d) => {
      const e = document.getElementById(`${s.id}-${d.id()}`);
      e && s.positionDef(d, e.style);
    });
  }
  s.sticky ? o.nodes().forEach((d) => {
    s.conditionalDisplay(d) && a(d);
  }) : o.on("mouseover", "node", (d) => {
    if (!s.conditionalDisplay(d.target))
      return;
    a(d.target);
    const e = setInterval(() => {
      r || (i(d.target), clearInterval(e));
    }, s.hideAfter);
  }), o.on("pan zoom", c), window.addEventListener("resize", c);
}
const w = {
  props: {
    displayOnlyOnHover: !0
  },
  boxLabels: {
    displayOnlyOnHover: !1
  }
};
function B(o, t, s = w) {
  g(o, t);
  function r() {
    o.nodes().forEach((n) => {
      const a = n.renderedBoundingBox().h, i = document.getElementById(`box-${n.id()}`);
      if (!i)
        return;
      const c = n.data().boxLabels;
      if (c !== void 0) {
        let e = document.getElementById(
          `labels-box-${n.id()}`
        );
        e ? e.style.bottom = `${a / 2 - 10}px` : (e = document.createElement("div"), e.id = `labels-box-${n.id()}`, e.className = "box-label", e.style.bottom = `${a / 2 - 10}px`, s.boxLabels.displayOnlyOnHover && (e.style.display = "none"), i.appendChild(e), c.forEach((f, p) => {
          if (!e)
            return;
          const l = document.createElement("div");
          l.id = `labels-box-${n.id()}-${p}`, l.className = "entry", l.innerHTML = f, e.appendChild(l);
        }));
      }
      const d = n.data().properties;
      if (d !== void 0) {
        let e = document.getElementById(
          `props-box-${n.id()}`
        );
        e ? e.style.top = `${a / 2 - 10}px` : (e = document.createElement("div"), e.id = `props-box-${n.id()}`, e.style.right = "0px", e.className = "property", e.style.top = `${a / 2 - 10}px`, s.props.displayOnlyOnHover && (e.style.display = "none"), i.appendChild(e), Object.keys(d).forEach((f, p) => {
          if (!e)
            return;
          const l = document.createElement("div");
          l.id = `props-box-${n.id()}-${p}`, l.className = "entry", l.innerHTML = `<span class="key">${f}</span><span class="value">${d[f]}</span>`, e.appendChild(l);
        }));
      }
    });
  }
  r(), o.on("zoom", r), o.on("mouseover", "node", (n) => {
    const a = n.target;
    if (s.props.displayOnlyOnHover) {
      const i = document.getElementById(`props-box-${a.id()}`);
      i && (i.style.display = "flex");
    }
    if (s.boxLabels.displayOnlyOnHover) {
      const i = document.getElementById(`labels-box-${a.id()}`);
      i && (i.style.display = "flex");
    }
  }), o.on("mouseout", "node", (n) => {
    const a = n.target;
    if (s.props.displayOnlyOnHover) {
      const i = document.getElementById(`props-box-${a.id()}`);
      i && (i.style.display = "none");
    }
    if (s.boxLabels.displayOnlyOnHover) {
      const i = document.getElementById(`labels-box-${a.id()}`);
      i && (i.style.display = "none");
    }
  });
}
class O {
  constructor() {
    this.groupByField = "category", this.groupFor = { type: "folder" }, this.layoutOptions = { name: "cose" }, this.collapseThreshold = 1;
  }
  // How many outgoing relationships should there be befor it collapses?
}
function z(o, t) {
  const s = Object.keys(t.groupFor)[0], r = Object.values(t.groupFor)[0], n = new E("expand-menu");
  n.items = [
    {
      icon: "add",
      click: (e) => c(e)
    }
  ], n.sticky = !0, n.positionDef = (e, f) => {
    const l = e.renderedBoundingBox().h / 2, h = Math.sin(Math.PI / 4) * l - 8;
    f.top = `${h}px`, f.right = `${h}px`;
  }, n.conditionalDisplay = (e) => e.data("canExpand");
  const a = [], i = [];
  o.nodes().filter((e) => e.data(s) === r).forEach((e) => {
    a.push(e), i.push(e.id());
  }), a.forEach((e) => {
    const f = e.neighborhood().filter((u) => u.isNode() && !i.includes(u.id())), p = /* @__PURE__ */ new Set(), l = {};
    f.forEach((u) => {
      const m = u.data(t.groupByField);
      m !== void 0 && (p.add(m), Object.keys(l).includes(m) || (l[m] = []), l[m].push(u), u.hide());
    });
    const h = [];
    p.forEach((u) => {
      if (l[u].length <= t.collapseThreshold) {
        l[u].forEach((x) => x.show());
        return;
      }
      const m = `${e.id()}-${u}`;
      h.push(
        {
          group: "nodes",
          data: {
            id: m,
            label: u,
            collapsedNodes: l[u],
            canExpand: !0,
            boxLabels: [l[u].length]
          }
        },
        {
          group: "edges",
          data: { source: e.id(), target: m }
        }
      );
    }), o.add(h);
  });
  function c(e) {
    const f = e.data();
    if (!Object.keys(f).includes("collapsedNodes"))
      return;
    f.collapsedNodes.forEach((l) => {
      l.show();
    }), e.hide();
    const p = document.getElementById(`box-${e.id()}`);
    p && Array.from(p.children).forEach(
      (l) => l.style.display = "none"
    ), o.layout(t.layoutOptions).run();
  }
  o.layout(t.layoutOptions).run();
  const d = o.container();
  d && ($(o, d, n), B(o, d));
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
}, k = (o = b) => [
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
      width: (t) => t.data("size") ? t.data("size") : "20",
      height: (t) => t.data("size") ? t.data("size") : "20"
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
      label: (t) => t.data("pct") !== void 0 && t.data("pct") !== 100 ? `${parseInt(t.data("pct"))}%` : "",
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
  name: "cose",
  padding: 100
};
function N(o) {
  o.on("dragfree", "node", t), o.on("viewport", t);
  function t() {
    const s = o.json(), r = [];
    s.elements.nodes.forEach((n) => {
      const a = {};
      a.data = n.data, a.position = { x: Math.round(n.position.x), y: Math.round(n.position.y) }, n.classes && (a.classes = n.classes), r.push(a);
    }), console.log(r);
  }
}
function S(o) {
  o.on("dragfree", "node", t), o.on("viewport", t);
  function t() {
    const s = o.json(), r = [], n = [];
    s.elements.nodes.forEach((a) => {
      const i = {};
      i.data = a.data, a.classes && (i.classes = a.classes), r.push(i);
    }), s.elements.edges.forEach((a) => {
      const i = {};
      i.data = a.data, a.classes && (i.classes = a.classes), n.push(i);
    }), console.log({ nodes: r, edges: n });
  }
}
function L(o) {
  function t(r, n = "") {
    return new Promise((a) => {
      r && (r.isFile ? r.file((i) => {
        i.filepath = n + i.name, s.push(i), a(i);
      }) : r.isDirectory && r.createReader().readEntries((c) => {
        const d = [];
        for (const e of c)
          d.push(t(e, n + r.name + "/"));
        a(Promise.all(d));
      }));
    });
  }
  const s = [];
  return new Promise((r) => {
    const n = [];
    for (const a of o)
      n.push(t(a.webkitGetAsEntry()));
    Promise.all(n).then(() => {
      r(s);
    });
  });
}
function D(o, t = (s) => !0) {
  let s;
  r(o);
  function r(n) {
    var a, i;
    (a = n.container()) == null || a.addEventListener("dragover", async (c) => {
      c.preventDefault(), c.stopPropagation();
      const d = { x: c.offsetX, y: c.offsetY }, e = y(n, d);
      if (e === void 0 && s !== void 0)
        s.removeClass("dropzone"), n.emit("nodeFileDropHoverEnd", { node: s }), s.emit("filesHoverEnd");
      else if (s !== e && e !== void 0) {
        if (!t(e))
          return;
        e.addClass("dropzone"), n.emit("nodeFileDropHoverStart", { node: e }), e.emit("filesHoverStart");
      }
      s = e;
    }), (i = n.container()) == null || i.addEventListener("drop", async (c) => {
      var f;
      c.preventDefault(), c.stopPropagation();
      const d = { x: c.offsetX, y: c.offsetY }, e = y(n, d);
      if (e !== void 0) {
        if (!t(e))
          return;
        e.removeClass("dropzone");
        const p = await L((f = c.dataTransfer) == null ? void 0 : f.items);
        p !== void 0 && e.emit("filesDropped", p), n.emit("nodeFileDropDropped", { node: e, files: p });
      }
    });
  }
}
function M(o) {
  o.on("mouseover", "node", (t) => {
    const s = t.target;
    s.style("label", s.data("label"));
  }), o.on("mouseout", "node", (t) => {
    t.target.style("label", "");
  });
}
export {
  O as CollapseSettings,
  E as NodeMenuSettings,
  C as animateGraph,
  B as appendHTMLLabels,
  g as appendHostContainers,
  D as appendNodeFileDrop,
  $ as appendNodeMenu,
  k as buildStyles,
  y as closestNode,
  z as collapseGraph,
  b as defaultSettings,
  I as layoutOptions,
  N as logNodePositions,
  S as logNodesEdges,
  M as showNodeLabelOnHover
};
