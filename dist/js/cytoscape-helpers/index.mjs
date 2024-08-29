function k(o, e = !0, t = 1e-4, s = 0.02) {
  let n = 0;
  function i() {
    o.nodes().forEach((u, d) => {
      const a = u.position(), p = Math.sin(performance.now() * t + d) * s, l = Math.cos(performance.now() * t + d) * s;
      u.position({
        x: a.x + p,
        y: a.y + l
      });
    }), n = requestAnimationFrame(i);
  }
  n = requestAnimationFrame(i);
  let r = !0;
  return e && r && o.on("mouseover", "node", () => {
    cancelAnimationFrame(n), r = !1;
  }), n;
}
class w {
  constructor(e = "node-menu") {
    this.id = e, this.items = [], this.hideAfter = 2e3, this.sticky = !1, this.conditionalDisplay = (t) => !0, this.positionDef = (t, s) => {
      const i = t.renderedBoundingBox().h / 2, r = Math.sin(Math.PI / 4) * i;
      s.bottom = `${r}px`, s.left = `${r}px`;
    };
  }
}
function L(o, e) {
  function t() {
    o.nodes().forEach((s) => {
      const n = s.renderedPosition();
      let i = document.getElementById(`box-${s.id()}`);
      i || (i = document.createElement("div"), i.id = `box-${s.id()}`, i.style.position = "absolute", e.appendChild(i)), i.style.left = `${n.x}px`, i.style.top = `${n.y}px`;
    });
  }
  t(), o.on("position", "node", t), o.on("pan zoom", t), window.addEventListener("resize", t);
}
function O(o, e, t) {
  L(o, e);
  let s = !1;
  function n(d) {
    const a = document.createElement("div");
    a.id = `${t.id}-${d.id()}`, a.classList.add("node-menu"), a.classList.add(t.id), a.addEventListener("mouseover", () => s = !0), a.addEventListener("mouseout", () => s = !1), t.items.forEach((l) => {
      const c = document.createElement("div");
      a.appendChild(c), c.innerText = l.icon, c.addEventListener("click", (m) => {
        m.preventDefault(), m.stopImmediatePropagation(), l.click(d);
      }), c.classList.add("entry"), c.classList.add("material-icons");
    });
    const p = document.getElementById(`box-${d.id()}`);
    return t.positionDef(d, a.style), p && p.appendChild(a), a;
  }
  function i(d) {
    let a = document.getElementById(`${t.id}-${d.id()}`);
    a || (a = n(d)), a.style.display = "flex";
  }
  function r(d) {
    const a = document.getElementById(`${t.id}-${d.id()}`);
    a && (a.style.display = "none");
  }
  function u() {
    o.nodes().forEach((d) => {
      const a = document.getElementById(`${t.id}-${d.id()}`);
      a && t.positionDef(d, a.style);
    });
  }
  t.sticky ? o.nodes().forEach((d) => {
    t.conditionalDisplay(d) && i(d);
  }) : o.on("mouseover", "node", (d) => {
    if (!t.conditionalDisplay(d.target))
      return;
    i(d.target);
    const a = setInterval(() => {
      s || (r(d.target), clearInterval(a));
    }, t.hideAfter);
  }), o.on("pan zoom", u), window.addEventListener("resize", u);
}
const N = {
  props: {
    displayOnlyOnHover: !0
  },
  boxLabels: {
    displayOnlyOnHover: !1
  }
};
function B(o, e, t = N) {
  L(o, e);
  function s() {
    o.nodes().forEach((n) => {
      const i = n.renderedBoundingBox().h, r = document.getElementById(`box-${n.id()}`);
      if (!r)
        return;
      const u = n.data().boxLabels;
      if (u !== void 0) {
        let a = document.getElementById(
          `labels-box-${n.id()}`
        );
        a ? a.style.bottom = `${i / 2 - 10}px` : (a = document.createElement("div"), a.id = `labels-box-${n.id()}`, a.className = "box-label", a.style.bottom = `${i / 2 - 10}px`, t.boxLabels.displayOnlyOnHover && (a.style.display = "none"), r.appendChild(a), u.forEach((p, l) => {
          if (!a)
            return;
          const c = document.createElement("div");
          c.id = `labels-box-${n.id()}-${l}`, c.className = "entry", c.innerHTML = p, a.appendChild(c);
        }));
      }
      const d = n.data().properties;
      if (d !== void 0) {
        let a = document.getElementById(
          `props-box-${n.id()}`
        );
        a ? a.style.top = `${i / 2 - 10}px` : (a = document.createElement("div"), a.id = `props-box-${n.id()}`, a.style.right = "0px", a.className = "property", a.style.top = `${i / 2 - 10}px`, t.props.displayOnlyOnHover && (a.style.display = "none"), r.appendChild(a), Object.keys(d).forEach((p, l) => {
          if (!a)
            return;
          const c = document.createElement("div");
          c.id = `props-box-${n.id()}-${l}`, c.className = "entry", c.innerHTML = `<span class="key">${p}</span><span class="value">${d[p]}</span>`, a.appendChild(c);
        }));
      }
    });
  }
  s(), o.on("zoom", s), o.on("mouseover", "node", (n) => {
    const i = n.target;
    if (t.props.displayOnlyOnHover) {
      const r = document.getElementById(`props-box-${i.id()}`);
      r && (r.style.display = "flex");
    }
    if (t.boxLabels.displayOnlyOnHover) {
      const r = document.getElementById(`labels-box-${i.id()}`);
      r && (r.style.display = "flex");
    }
  }), o.on("mouseout", "node", (n) => {
    const i = n.target;
    if (t.props.displayOnlyOnHover) {
      const r = document.getElementById(`props-box-${i.id()}`);
      r && (r.style.display = "none");
    }
    if (t.boxLabels.displayOnlyOnHover) {
      const r = document.getElementById(`labels-box-${i.id()}`);
      r && (r.style.display = "none");
    }
  });
}
function z(o, e, t) {
  const s = Object.keys(t)[0], n = Object.values(t)[0], i = new w("expand-menu");
  i.items = [
    {
      icon: "add",
      click: (l) => d(l)
    }
  ], i.sticky = !0, i.positionDef = (l, c) => {
    const f = l.renderedBoundingBox().h / 2, b = Math.sin(Math.PI / 4) * f - 8;
    c.top = `${b}px`, c.right = `${b}px`;
  }, i.conditionalDisplay = (l) => l.data("canExpand");
  const r = [], u = [];
  o.nodes().filter((l) => l.data(s) === n).forEach((l) => {
    r.push(l), u.push(l.id());
  }), r.forEach((l) => {
    const c = l.neighborhood(), m = /* @__PURE__ */ new Set(), f = {};
    c.filter((h) => !u.includes(h.id())).forEach((h) => {
      const g = h.data(e);
      g !== void 0 && (m.add(g), Object.keys(f).includes(g) || (f[g] = []), f[g].push(h), h.hide());
    });
    const b = [];
    m.forEach((h) => {
      const g = `${l.id()}-${h}`;
      b.push(
        {
          group: "nodes",
          data: {
            id: g,
            label: h,
            collapsedNodes: f[h],
            canExpand: !0,
            boxLabels: [f[h].length]
          }
        },
        {
          group: "edges",
          data: { source: l.id(), target: g }
        }
      );
    }), o.add(b);
  });
  function d(l) {
    const c = l.data();
    if (!Object.keys(c).includes("collapsedNodes"))
      return;
    c.collapsedNodes.forEach((f) => {
      f.show();
    }), l.hide();
    const m = document.getElementById(`box-${l.id()}`);
    m && Array.from(m.children).forEach(
      (f) => f.style.display = "none"
    ), a();
  }
  function a() {
    o.layout({
      name: "cose"
    }).run();
  }
  a();
  const p = document.getElementById("cy");
  p && (O(o, p, i), B(o, p));
}
var E = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, $ = {}, y = {};
Object.defineProperty(y, "__esModule", { value: !0 });
function M(o) {
  return o;
}
y.asTypedEventEmitter = M;
var x = {}, C = E && E.__spreadArrays || function() {
  for (var o = 0, e = 0, t = arguments.length; e < t; e++)
    o += arguments[e].length;
  for (var s = Array(o), n = 0, e = 0; e < t; e++)
    for (var i = arguments[e], r = 0, u = i.length; r < u; r++, n++)
      s[n] = i[r];
  return s;
};
Object.defineProperty(x, "__esModule", { value: !0 });
var I = (
  /** @class */
  function() {
    function o() {
      var e = this;
      this.events = {}, this.maxListeners = 1 / 0, this.emit = function(t) {
        for (var s = [], n = 1; n < arguments.length; n++)
          s[n - 1] = arguments[n];
        if (e.events[t]) {
          for (var i = e.events[t].length, r = Array.from(e.events[t]), u = 0, d = r; u < d.length; u++) {
            var a = d[u];
            a.apply(void 0, s);
          }
          return !!i;
        }
        return !1;
      }, this.on = function(t, s) {
        return e.addListener(t, s), e;
      }, this.once = function(t, s) {
        var n = function() {
          for (var i = [], r = 0; r < arguments.length; r++)
            i[r] = arguments[r];
          s.apply(void 0, i), e.removeListener(t, n);
        };
        return e.addListener(t, n), e;
      }, this.addListener = function(t, s) {
        return t in e.events ? e.events[t].push(s) : e.events[t] = [s], e.maxListeners !== 1 / 0 && e.maxListeners <= e.events[t].length && console.warn('Maximum event listeners for "' + t + '" event!'), e;
      }, this.removeListener = function(t, s) {
        if (t in e.events) {
          var n = e.events[t].indexOf(s);
          n !== -1 && e.events[t].splice(n, 1);
        }
        return e;
      }, this.hasListeners = function(t) {
        return e.events[t] && !!e.events[t].length;
      }, this.prependListener = function(t, s) {
        return t in e.events ? e.events[t].unshift(s) : e.events[t] = [s], e;
      }, this.prependOnceListener = function(t, s) {
        var n = function() {
          for (var i = [], r = 0; r < arguments.length; r++)
            i[r] = arguments[r];
          s.apply(void 0, i), e.removeListener(t, n);
        };
        return e.prependListener(t, n), e;
      }, this.off = function(t, s) {
        return e.removeListener(t, s);
      }, this.removeAllListeners = function(t) {
        return delete e.events[t], e;
      }, this.setMaxListeners = function(t) {
        return e.maxListeners = t, e;
      }, this.getMaxListeners = function() {
        return e.maxListeners;
      }, this.listeners = function(t) {
        return C(e.events[t]);
      }, this.rawListeners = function(t) {
        return e.events[t];
      }, this.eventNames = function() {
        return Object.keys(e.events);
      }, this.listenerCount = function(t) {
        return e.events[t] && e.events[t].length || 0;
      };
    }
    return o;
  }()
);
x.EventEmitter = I;
(function(o) {
  function e(t) {
    for (var s in t)
      o.hasOwnProperty(s) || (o[s] = t[s]);
  }
  Object.defineProperty(o, "__esModule", { value: !0 }), e(y), e(x);
})($);
class S {
  constructor(e) {
    this._cy = e, this.events = new $.EventEmitter(), this._initEventListeners();
  }
  _initEventListeners() {
    var e, t;
    (e = this._cy.container()) == null || e.addEventListener("dragover", (s) => {
      s.preventDefault(), s.stopPropagation();
      const n = this._getClosestNode(s);
      n === void 0 && this._lastHoveredNode !== void 0 ? this.events.emit("fileOverNodeEnd", this._lastHoveredNode) : this._lastHoveredNode !== n && n !== void 0 && this.events.emit("fileOverNodeStart", n), this._lastHoveredNode = n;
    }), (t = this._cy.container()) == null || t.addEventListener("drop", (s) => {
      var i;
      s.preventDefault(), s.stopPropagation();
      const n = this._getClosestNode(s);
      if (n !== void 0) {
        const r = (i = s.dataTransfer) == null ? void 0 : i.files;
        r !== void 0 && this.events.emit("filesDroppedOnNode", n, r);
      }
    });
  }
  _getClosestNode(e, t = 20) {
    var u, d;
    if (((u = this._cy) == null ? void 0 : u.nodes()) === void 0)
      return;
    const n = { x: e.offsetX, y: e.offsetY };
    let i, r = t;
    return (d = this._cy) == null || d.nodes().forEach((a) => {
      const p = this._distance(n, a.renderedPosition());
      p < r && (r = p, i = a);
    }), i;
  }
  _distance(e, t) {
    const s = t.x - e.x, n = t.y - e.y;
    return Math.sqrt(s * s + n * n);
  }
}
const v = {
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
  showEdgeLabels: !0
}, H = (o = v) => [
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
      "pie-1-background-color": v.nodeColor,
      // Color A
      "pie-1-background-size": (e) => `${e.data("pct")}%`,
      "pie-2-background-color": v.edgeColor,
      // Color B
      "pie-2-background-size": (e) => `${100 - parseInt(e.data("pct"))}%`,
      label: (e) => `${e.data("pct")}%`,
      "font-size": "5rem"
    }
  }
], _ = {
  name: "grid",
  padding: 100
};
function D(o) {
  o.on("dragfree", "node", e), o.on("viewport", e);
  function e() {
    const t = o.json(), s = [];
    t.elements.nodes.forEach((n) => {
      const i = {};
      i.data = n.data, i.position = { x: Math.round(n.position.x), y: Math.round(n.position.y) }, n.classes && (i.classes = n.classes), s.push(i);
    }), console.log(s);
  }
}
function P(o) {
  o.on("dragfree", "node", e), o.on("viewport", e);
  function e() {
    const t = o.json(), s = [], n = [];
    t.elements.nodes.forEach((i) => {
      const r = {};
      r.data = i.data, i.classes && (r.classes = i.classes), s.push(r);
    }), t.elements.edges.forEach((i) => {
      const r = {};
      r.data = i.data, i.classes && (r.classes = i.classes), n.push(r);
    }), console.log({ nodes: s, edges: n });
  }
}
export {
  S as FileDropHandler,
  w as NodeMenuSettings,
  k as animateGraph,
  B as appendHTMLLabels,
  L as appendHostContainers,
  O as appendNodeMenu,
  H as buildStyles,
  z as collapseGraph,
  v as defaultSettings,
  _ as layout,
  D as logNodePositions,
  P as logNodesEdges
};
