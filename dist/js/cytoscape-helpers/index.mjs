function z(e, t = !0, n = 1e-4, r = 0.02) {
  let a = 0;
  function d() {
    e.nodes().forEach((p, l) => {
      const o = p.position(), u = Math.sin(performance.now() * n + l) * r, i = Math.cos(performance.now() * n + l) * r;
      p.position({
        x: o.x + u,
        y: o.y + i
      });
    }), a = requestAnimationFrame(d);
  }
  a = requestAnimationFrame(d);
  let s = !0;
  return t && s && e.on("mouseover", "node", () => {
    cancelAnimationFrame(a), s = !1;
  }), a;
}
function y(e, t) {
  if (e.nodes() === void 0)
    return;
  let r, a = 1 / 0;
  return e.nodes().forEach((d) => {
    a = d.renderedBoundingBox().h;
    const s = v(t, d.renderedPosition());
    s < a && (a = s, r = d);
  }), r;
}
function v(e, t) {
  const n = t.x - e.x, r = t.y - e.y;
  return Math.sqrt(n * n + r * r);
}
class $ {
  constructor(t = "node-menu") {
    this.id = t, this.items = [], this.hideAfter = 2e3, this.sticky = !1, this.conditionalDisplay = (n) => !0, this.positionDef = (n, r) => {
      const d = n.renderedBoundingBox().h / 2, s = Math.sin(Math.PI / 4) * d;
      r.bottom = `${s}px`, r.left = `${s}px`;
    };
  }
}
function E(e, t) {
  function n() {
    e.nodes().forEach((r) => {
      const a = r.renderedPosition();
      let d = document.getElementById(`box-${r.id()}`);
      d || (d = document.createElement("div"), d.id = `box-${r.id()}`, d.style.position = "absolute", t.appendChild(d)), d.style.left = `${a.x}px`, d.style.top = `${a.y}px`;
    });
  }
  n(), e.on("position", "node", n), e.on("pan zoom", n), window.addEventListener("resize", n);
}
function B(e, t, n) {
  E(e, t);
  let r = !1;
  function a(l) {
    const o = document.createElement("div");
    o.id = `${n.id}-${l.id()}`, o.classList.add("node-menu"), o.classList.add(n.id), o.addEventListener("mouseover", () => r = !0), o.addEventListener("mouseout", () => r = !1), n.items.forEach((i) => {
      const c = document.createElement("div");
      o.appendChild(c), c.innerText = i.icon, c.addEventListener("click", (f) => {
        f.preventDefault(), f.stopImmediatePropagation(), i.click(l);
      }), c.addEventListener("touchstart", (f) => {
        f.preventDefault(), f.stopImmediatePropagation(), i.click(l);
      }), c.classList.add("entry"), c.classList.add("material-icons");
    });
    const u = document.getElementById(`box-${l.id()}`);
    return n.positionDef(l, o.style), u && u.appendChild(o), o;
  }
  function d(l) {
    let o = document.getElementById(`${n.id}-${l.id()}`);
    o || (o = a(l)), o.style.display = "flex";
  }
  function s(l) {
    const o = document.getElementById(`${n.id}-${l.id()}`);
    o && (o.style.display = "none");
  }
  function p() {
    e.nodes().forEach((l) => {
      const o = document.getElementById(`${n.id}-${l.id()}`);
      o && n.positionDef(l, o.style);
    });
  }
  n.sticky ? e.nodes().forEach((l) => {
    n.conditionalDisplay(l) && d(l);
  }) : e.on("mouseover", "node", (l) => {
    if (!n.conditionalDisplay(l.target))
      return;
    d(l.target);
    const o = setInterval(() => {
      r || (s(l.target), clearInterval(o));
    }, n.hideAfter);
  }), e.on("pan zoom", p), window.addEventListener("resize", p);
}
const w = {
  props: {
    displayOnlyOnHover: !0
  },
  boxLabels: {
    displayOnlyOnHover: !1
  }
};
function C(e, t, n = w) {
  E(e, t);
  function r() {
    e.nodes().forEach((a) => {
      const d = a.renderedBoundingBox().h, s = document.getElementById(`box-${a.id()}`);
      if (!s)
        return;
      const p = a.data().boxLabels;
      if (p !== void 0) {
        let o = document.getElementById(
          `labels-box-${a.id()}`
        );
        o ? o.style.bottom = `${d / 2 - 10}px` : (o = document.createElement("div"), o.id = `labels-box-${a.id()}`, o.className = "box-label", o.style.bottom = `${d / 2 - 10}px`, n.boxLabels.displayOnlyOnHover && (o.style.display = "none"), s.appendChild(o), p.forEach((u, i) => {
          if (!o)
            return;
          const c = document.createElement("div");
          c.id = `labels-box-${a.id()}-${i}`, c.className = "entry", c.innerHTML = u, o.appendChild(c);
        }));
      }
      const l = a.data().properties;
      if (l !== void 0) {
        let o = document.getElementById(
          `props-box-${a.id()}`
        );
        o ? o.style.top = `${d / 2 - 10}px` : (o = document.createElement("div"), o.id = `props-box-${a.id()}`, o.style.right = "0px", o.className = "property", o.style.top = `${d / 2 - 10}px`, n.props.displayOnlyOnHover && (o.style.display = "none"), s.appendChild(o), Object.keys(l).forEach((u, i) => {
          if (!o)
            return;
          const c = document.createElement("div");
          c.id = `props-box-${a.id()}-${i}`, c.className = "entry", c.innerHTML = `<span class="key">${u}</span><span class="value">${l[u]}</span>`, o.appendChild(c);
        }));
      }
    });
  }
  r(), e.on("zoom", r), e.on("mouseover", "node", (a) => {
    const d = a.target;
    if (n.props.displayOnlyOnHover) {
      const s = document.getElementById(`props-box-${d.id()}`);
      s && (s.style.display = "flex");
    }
    if (n.boxLabels.displayOnlyOnHover) {
      const s = document.getElementById(`labels-box-${d.id()}`);
      s && (s.style.display = "flex");
    }
  }), e.on("mouseout", "node", (a) => {
    const d = a.target;
    if (n.props.displayOnlyOnHover) {
      const s = document.getElementById(`props-box-${d.id()}`);
      s && (s.style.display = "none");
    }
    if (n.boxLabels.displayOnlyOnHover) {
      const s = document.getElementById(`labels-box-${d.id()}`);
      s && (s.style.display = "none");
    }
  });
}
function L(e, t, n, r) {
  const a = Object.keys(n)[0], d = Object.values(n)[0], s = new $("expand-menu");
  s.items = [
    {
      icon: "add",
      click: (i) => o(i)
    }
  ], s.sticky = !0, s.positionDef = (i, c) => {
    const m = i.renderedBoundingBox().h / 2, g = Math.sin(Math.PI / 4) * m - 8;
    c.top = `${g}px`, c.right = `${g}px`;
  }, s.conditionalDisplay = (i) => i.data("canExpand");
  const p = [], l = [];
  e.nodes().filter((i) => i.data(a) === d).forEach((i) => {
    p.push(i), l.push(i.id());
  }), p.forEach((i) => {
    const c = i.neighborhood(), f = /* @__PURE__ */ new Set(), m = {};
    c.filter((b) => !l.includes(b.id())).forEach((b) => {
      const h = b.data(t);
      h !== void 0 && (f.add(h), Object.keys(m).includes(h) || (m[h] = []), m[h].push(b), b.hide());
    });
    const g = [];
    f.forEach((b) => {
      const h = `${i.id()}-${b}`;
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
          data: { source: i.id(), target: h }
        }
      );
    }), e.add(g);
  });
  function o(i) {
    const c = i.data();
    if (!Object.keys(c).includes("collapsedNodes"))
      return;
    c.collapsedNodes.forEach((m) => {
      m.show();
    }), i.hide();
    const f = document.getElementById(`box-${i.id()}`);
    f && Array.from(f.children).forEach(
      (m) => m.style.display = "none"
    ), e.layout(r).run();
  }
  e.layout(r).run();
  const u = document.getElementById("cy");
  u && (B(e, u, s), C(e, u));
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
      label: (t) => t.data(e.labelSelector) && e.showNodeLabels ? t.data(e.labelSelector) : "",
      "text-valign": "center",
      "font-family": e.font,
      "font-size": "10rem",
      opacity: e.nodeOpacity,
      color: "white",
      "text-outline-color": (t) => t.data("color") ? t.data("color") : e.nodeColor,
      "text-outline-width": 1,
      // Set the outline width
      "background-color": (t) => t.data("color") ? t.data("color") : e.nodeColor,
      width: (t) => t.data("size") ? t.data("size") : "",
      height: (t) => t.data("size") ? t.data("size") : ""
    }
  },
  {
    selector: "edge",
    style: {
      label: (t) => t.data(e.labelSelector) && e.showEdgeLabels ? t.data(e.labelSelector) : "",
      "text-valign": "center",
      "font-family": e.font,
      "font-size": e.edgeFontSize,
      color: e.edgeColor,
      "target-arrow-color": e.edgeColor,
      "curve-style": "bezier",
      "target-arrow-shape": e.directed ? "triangle" : "none",
      "line-color": e.edgeColor,
      width: (t) => t.data("width") ? t.data("width") : e.edgeWidth,
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
      "border-color": (t) => t.data("color") ? t.data("color") : e.nodeColor
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
      label: (t) => t.data(e.labelSelector) ? t.data(e.labelSelector) : "",
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
      "pie-1-background-size": (t) => `${t.data("pct")}%`,
      "pie-2-background-color": x.edgeColor,
      // Color B
      "pie-2-background-size": (t) => `${100 - parseInt(t.data("pct"))}%`,
      label: (t) => `${t.data("pct")}%`,
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
  e.on("dragfree", "node", t), e.on("viewport", t);
  function t() {
    const n = e.json(), r = [];
    n.elements.nodes.forEach((a) => {
      const d = {};
      d.data = a.data, d.position = { x: Math.round(a.position.x), y: Math.round(a.position.y) }, a.classes && (d.classes = a.classes), r.push(d);
    }), console.log(r);
  }
}
function N(e) {
  e.on("dragfree", "node", t), e.on("viewport", t);
  function t() {
    const n = e.json(), r = [], a = [];
    n.elements.nodes.forEach((d) => {
      const s = {};
      s.data = d.data, d.classes && (s.classes = d.classes), r.push(s);
    }), n.elements.edges.forEach((d) => {
      const s = {};
      s.data = d.data, d.classes && (s.classes = d.classes), a.push(s);
    }), console.log({ nodes: r, edges: a });
  }
}
function M(e, t = (n) => !0) {
  let n;
  r(e);
  function r(a) {
    var d, s;
    (d = a.container()) == null || d.addEventListener("dragover", (p) => {
      var u;
      p.preventDefault(), p.stopPropagation();
      const l = { x: p.offsetX, y: p.offsetY }, o = y(a, l);
      if (o === void 0 && n !== void 0)
        n.removeClass("dropzone"), a.emit("nodeFileDropHoverEnd", { node: n }), n.emit("filesHoverEnd");
      else if (n !== o && o !== void 0) {
        if (!t(o))
          return;
        o.addClass("dropzone");
        const i = (u = p.dataTransfer) == null ? void 0 : u.files;
        a.emit("nodeFileDropHoverStart", { node: o, files: i }), o.emit("filesHoverStart", i);
      }
      n = o;
    }), (s = a.container()) == null || s.addEventListener("drop", (p) => {
      var u;
      p.preventDefault(), p.stopPropagation();
      const l = { x: p.offsetX, y: p.offsetY }, o = y(a, l);
      if (o !== void 0) {
        if (!t(o))
          return;
        o.removeClass("dropzone");
        const i = (u = p.dataTransfer) == null ? void 0 : u.files;
        i !== void 0 && o.emit("filesDropped", i), a.emit("nodeFileDropDropped", { node: o, files: i });
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
