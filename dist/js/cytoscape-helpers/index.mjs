function z(e, o = !0, d = 1e-4, l = 0.02) {
  let s = 0;
  function a() {
    e.nodes().forEach((u, i) => {
      const t = u.position(), p = Math.sin(performance.now() * d + i) * l, r = Math.cos(performance.now() * d + i) * l;
      u.position({
        x: t.x + p,
        y: t.y + r
      });
    }), s = requestAnimationFrame(a);
  }
  s = requestAnimationFrame(a);
  let n = !0;
  return o && n && e.on("mouseover", "node", () => {
    cancelAnimationFrame(s), n = !1;
  }), s;
}
function y(e, o) {
  if (e.nodes() === void 0)
    return;
  let l, s = 1 / 0;
  return e.nodes().forEach((a) => {
    s = a.renderedBoundingBox().h;
    const n = v(o, a.renderedPosition());
    n < s && (s = n, l = a);
  }), l;
}
function v(e, o) {
  const d = o.x - e.x, l = o.y - e.y;
  return Math.sqrt(d * d + l * l);
}
class $ {
  constructor(o = "node-menu") {
    this.id = o, this.items = [], this.hideAfter = 2e3, this.sticky = !1, this.conditionalDisplay = (d) => !0, this.positionDef = (d, l) => {
      const a = d.renderedBoundingBox().h / 2, n = Math.sin(Math.PI / 4) * a;
      l.bottom = `${n}px`, l.left = `${n}px`;
    };
  }
}
function E(e, o) {
  function d() {
    e.nodes().forEach((l) => {
      const s = l.renderedPosition();
      let a = document.getElementById(`box-${l.id()}`);
      a || (a = document.createElement("div"), a.id = `box-${l.id()}`, a.style.position = "absolute", o.appendChild(a)), a.style.left = `${s.x}px`, a.style.top = `${s.y}px`;
    });
  }
  d(), e.on("position", "node", d), e.on("pan zoom", d), window.addEventListener("resize", d);
}
function B(e, o, d) {
  E(e, o);
  let l = !1;
  function s(i) {
    const t = document.createElement("div");
    t.id = `${d.id}-${i.id()}`, t.classList.add("node-menu"), t.classList.add(d.id), t.addEventListener("mouseover", () => l = !0), t.addEventListener("mouseout", () => l = !1), d.items.forEach((r) => {
      const c = document.createElement("div");
      t.appendChild(c), c.innerText = r.icon, c.addEventListener("click", (f) => {
        f.preventDefault(), f.stopImmediatePropagation(), r.click(i);
      }), c.addEventListener("touchstart", (f) => {
        f.preventDefault(), f.stopImmediatePropagation(), r.click(i);
      }), c.classList.add("entry"), c.classList.add("material-icons");
    });
    const p = document.getElementById(`box-${i.id()}`);
    return d.positionDef(i, t.style), p && p.appendChild(t), t;
  }
  function a(i) {
    let t = document.getElementById(`${d.id}-${i.id()}`);
    t || (t = s(i)), t.style.display = "flex";
  }
  function n(i) {
    const t = document.getElementById(`${d.id}-${i.id()}`);
    t && (t.style.display = "none");
  }
  function u() {
    e.nodes().forEach((i) => {
      const t = document.getElementById(`${d.id}-${i.id()}`);
      t && d.positionDef(i, t.style);
    });
  }
  d.sticky ? e.nodes().forEach((i) => {
    d.conditionalDisplay(i) && a(i);
  }) : e.on("mouseover", "node", (i) => {
    if (!d.conditionalDisplay(i.target))
      return;
    a(i.target);
    const t = setInterval(() => {
      l || (n(i.target), clearInterval(t));
    }, d.hideAfter);
  }), e.on("pan zoom", u), window.addEventListener("resize", u);
}
const w = {
  props: {
    displayOnlyOnHover: !0
  },
  boxLabels: {
    displayOnlyOnHover: !1
  }
};
function C(e, o, d = w) {
  E(e, o);
  function l() {
    e.nodes().forEach((s) => {
      const a = s.renderedBoundingBox().h, n = document.getElementById(`box-${s.id()}`);
      if (!n)
        return;
      const u = s.data().boxLabels;
      if (u !== void 0) {
        let t = document.getElementById(
          `labels-box-${s.id()}`
        );
        t ? t.style.bottom = `${a / 2 - 10}px` : (t = document.createElement("div"), t.id = `labels-box-${s.id()}`, t.className = "box-label", t.style.bottom = `${a / 2 - 10}px`, d.boxLabels.displayOnlyOnHover && (t.style.display = "none"), n.appendChild(t), u.forEach((p, r) => {
          if (!t)
            return;
          const c = document.createElement("div");
          c.id = `labels-box-${s.id()}-${r}`, c.className = "entry", c.innerHTML = p, t.appendChild(c);
        }));
      }
      const i = s.data().properties;
      if (i !== void 0) {
        let t = document.getElementById(
          `props-box-${s.id()}`
        );
        t ? t.style.top = `${a / 2 - 10}px` : (t = document.createElement("div"), t.id = `props-box-${s.id()}`, t.style.right = "0px", t.className = "property", t.style.top = `${a / 2 - 10}px`, d.props.displayOnlyOnHover && (t.style.display = "none"), n.appendChild(t), Object.keys(i).forEach((p, r) => {
          if (!t)
            return;
          const c = document.createElement("div");
          c.id = `props-box-${s.id()}-${r}`, c.className = "entry", c.innerHTML = `<span class="key">${p}</span><span class="value">${i[p]}</span>`, t.appendChild(c);
        }));
      }
    });
  }
  l(), e.on("zoom", l), e.on("mouseover", "node", (s) => {
    const a = s.target;
    if (d.props.displayOnlyOnHover) {
      const n = document.getElementById(`props-box-${a.id()}`);
      n && (n.style.display = "flex");
    }
    if (d.boxLabels.displayOnlyOnHover) {
      const n = document.getElementById(`labels-box-${a.id()}`);
      n && (n.style.display = "flex");
    }
  }), e.on("mouseout", "node", (s) => {
    const a = s.target;
    if (d.props.displayOnlyOnHover) {
      const n = document.getElementById(`props-box-${a.id()}`);
      n && (n.style.display = "none");
    }
    if (d.boxLabels.displayOnlyOnHover) {
      const n = document.getElementById(`labels-box-${a.id()}`);
      n && (n.style.display = "none");
    }
  });
}
function L(e, o, d, l) {
  const s = Object.keys(d)[0], a = Object.values(d)[0], n = new $("expand-menu");
  n.items = [
    {
      icon: "add",
      click: (r) => t(r)
    }
  ], n.sticky = !0, n.positionDef = (r, c) => {
    const m = r.renderedBoundingBox().h / 2, g = Math.sin(Math.PI / 4) * m - 8;
    c.top = `${g}px`, c.right = `${g}px`;
  }, n.conditionalDisplay = (r) => r.data("canExpand");
  const u = [], i = [];
  e.nodes().filter((r) => r.data(s) === a).forEach((r) => {
    u.push(r), i.push(r.id());
  }), u.forEach((r) => {
    const c = r.neighborhood(), f = /* @__PURE__ */ new Set(), m = {};
    c.filter((b) => !i.includes(b.id())).forEach((b) => {
      const h = b.data(o);
      h !== void 0 && (f.add(h), Object.keys(m).includes(h) || (m[h] = []), m[h].push(b), b.hide());
    });
    const g = [];
    f.forEach((b) => {
      const h = `${r.id()}-${b}`;
      g.push(
        {
          group: "nodes",
          data: {
            id: h,
            label: b,
            collapsedNodes: m[b],
            canExpand: !0,
            boxLabels: [m[b].length]
          }
        },
        {
          group: "edges",
          data: { source: r.id(), target: h }
        }
      );
    }), e.add(g);
  });
  function t(r) {
    const c = r.data();
    if (!Object.keys(c).includes("collapsedNodes"))
      return;
    c.collapsedNodes.forEach((m) => {
      m.show();
    }), r.hide();
    const f = document.getElementById(`box-${r.id()}`);
    f && Array.from(f.children).forEach(
      (m) => m.style.display = "none"
    ), e.layout(l).run();
  }
  e.layout(l).run();
  const p = document.getElementById("cy");
  p && (B(e, p, n), C(e, p));
}
const x = {
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
}, I = (e = x) => [
  {
    selector: "node",
    style: {
      label: (o) => o.data(e.labelSelector) && e.showNodeLabels ? o.data(e.labelSelector) : "",
      "text-valign": "center",
      "font-family": e.font,
      "font-size": "10rem",
      opacity: e.nodeOpacity,
      color: "white",
      "text-outline-color": (o) => o.data("color") ? o.data("color") : e.nodeColor,
      "text-outline-width": 1,
      // Set the outline width
      "background-color": (o) => o.data("color") ? o.data("color") : e.nodeColor,
      width: (o) => o.data("size") ? o.data("size") : "",
      height: (o) => o.data("size") ? o.data("size") : ""
    }
  },
  {
    selector: "edge",
    style: {
      label: (o) => o.data(e.labelSelector) && e.showEdgeLabels ? o.data(e.labelSelector) : "",
      "text-valign": "center",
      "font-family": e.font,
      "font-size": e.edgeFontSize,
      color: e.edgeColor,
      "target-arrow-color": e.edgeColor,
      "curve-style": "bezier",
      "target-arrow-shape": e.directed ? "triangle" : "none",
      "line-color": e.edgeColor,
      width: (o) => o.data("width") ? o.data("width") : e.edgeWidth,
      "text-rotation": "autorotate",
      // Rotate label with the edge.
      "text-background-opacity": 1,
      // Make the background fully opaque.
      "text-background-color": e.backgroundColor,
      // Use the same color as your background to "break" the edge.
      "text-background-padding": 4
      // Padding around the label text.
    }
  },
  {
    selector: ".triple",
    style: {
      "background-color": "white",
      "border-color": (o) => o.data("color") ? o.data("color") : e.nodeColor
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
      label: (o) => o.data(e.labelSelector) ? o.data(e.labelSelector) : "",
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
      "pie-1-background-color": x.nodeColor,
      // Color A
      "pie-1-background-size": (o) => `${o.data("pct")}%`,
      "pie-2-background-color": x.edgeColor,
      // Color B
      "pie-2-background-size": (o) => `${100 - parseInt(o.data("pct"))}%`,
      label: (o) => `${o.data("pct")}%`,
      "font-size": "5rem"
    }
  },
  {
    selector: ".dropzone",
    style: {
      "border-color": e.hoverBorderColor,
      "border-width": 6,
      "border-opacity": 1
    }
  }
], k = {
  name: "cose",
  padding: 100
};
function O(e) {
  e.on("dragfree", "node", o), e.on("viewport", o);
  function o() {
    const d = e.json(), l = [];
    d.elements.nodes.forEach((s) => {
      const a = {};
      a.data = s.data, a.position = { x: Math.round(s.position.x), y: Math.round(s.position.y) }, s.classes && (a.classes = s.classes), l.push(a);
    }), console.log(l);
  }
}
function N(e) {
  e.on("dragfree", "node", o), e.on("viewport", o);
  function o() {
    const d = e.json(), l = [], s = [];
    d.elements.nodes.forEach((a) => {
      const n = {};
      n.data = a.data, a.classes && (n.classes = a.classes), l.push(n);
    }), d.elements.edges.forEach((a) => {
      const n = {};
      n.data = a.data, a.classes && (n.classes = a.classes), s.push(n);
    }), console.log({ nodes: l, edges: s });
  }
}
function M(e) {
  let o;
  d(e);
  function d(l) {
    var s, a;
    (s = l.container()) == null || s.addEventListener("dragover", (n) => {
      var t;
      n.preventDefault(), n.stopPropagation();
      const u = { x: n.offsetX, y: n.offsetY }, i = y(l, u);
      if (i === void 0 && o !== void 0)
        o.removeClass("dropzone"), l.emit("nodeFileDropHoverEnd", { node: o }), o.emit("filesHoverEnd");
      else if (o !== i && i !== void 0) {
        i.addClass("dropzone");
        const p = (t = n.dataTransfer) == null ? void 0 : t.files;
        l.emit("nodeFileDropHoverStart", { node: i, files: p }), i.emit("filesHoverStart", p);
      }
      o = i;
    }), (a = l.container()) == null || a.addEventListener("drop", (n) => {
      var t;
      n.preventDefault(), n.stopPropagation();
      const u = { x: n.offsetX, y: n.offsetY }, i = y(l, u);
      if (i !== void 0) {
        i.removeClass("dropzone");
        const p = (t = n.dataTransfer) == null ? void 0 : t.files;
        p !== void 0 && i.emit("filesDropped", p), l.emit("nodeFileDrop", { node: i, files: p });
      }
    });
  }
}
export {
  $ as NodeMenuSettings,
  z as animateGraph,
  C as appendHTMLLabels,
  E as appendHostContainers,
  M as appendNodeFileDrop,
  B as appendNodeMenu,
  I as buildStyles,
  y as closestNode,
  L as collapseGraph,
  x as defaultSettings,
  k as layoutOptions,
  O as logNodePositions,
  N as logNodesEdges
};
