function O(s, e = !0, t = 1e-4, n = 0.02) {
  let o = 0;
  function r() {
    s.nodes().forEach((l, d) => {
      const a = l.position(), c = Math.sin(performance.now() * t + d) * n, u = Math.cos(performance.now() * t + d) * n;
      l.position({
        x: a.x + c,
        y: a.y + u
      });
    }), o = requestAnimationFrame(r);
  }
  o = requestAnimationFrame(r);
  let i = !0;
  return e && i && s.on("mouseover", "node", () => {
    cancelAnimationFrame(o), i = !1;
  }), o;
}
var m = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, y = {}, h = {};
Object.defineProperty(h, "__esModule", { value: !0 });
function b(s) {
  return s;
}
h.asTypedEventEmitter = b;
var v = {}, g = m && m.__spreadArrays || function() {
  for (var s = 0, e = 0, t = arguments.length; e < t; e++)
    s += arguments[e].length;
  for (var n = Array(s), o = 0, e = 0; e < t; e++)
    for (var r = arguments[e], i = 0, l = r.length; i < l; i++, o++)
      n[o] = r[i];
  return n;
};
Object.defineProperty(v, "__esModule", { value: !0 });
var x = (
  /** @class */
  function() {
    function s() {
      var e = this;
      this.events = {}, this.maxListeners = 1 / 0, this.emit = function(t) {
        for (var n = [], o = 1; o < arguments.length; o++)
          n[o - 1] = arguments[o];
        if (e.events[t]) {
          for (var r = e.events[t].length, i = Array.from(e.events[t]), l = 0, d = i; l < d.length; l++) {
            var a = d[l];
            a.apply(void 0, n);
          }
          return !!r;
        }
        return !1;
      }, this.on = function(t, n) {
        return e.addListener(t, n), e;
      }, this.once = function(t, n) {
        var o = function() {
          for (var r = [], i = 0; i < arguments.length; i++)
            r[i] = arguments[i];
          n.apply(void 0, r), e.removeListener(t, o);
        };
        return e.addListener(t, o), e;
      }, this.addListener = function(t, n) {
        return t in e.events ? e.events[t].push(n) : e.events[t] = [n], e.maxListeners !== 1 / 0 && e.maxListeners <= e.events[t].length && console.warn('Maximum event listeners for "' + t + '" event!'), e;
      }, this.removeListener = function(t, n) {
        if (t in e.events) {
          var o = e.events[t].indexOf(n);
          o !== -1 && e.events[t].splice(o, 1);
        }
        return e;
      }, this.hasListeners = function(t) {
        return e.events[t] && !!e.events[t].length;
      }, this.prependListener = function(t, n) {
        return t in e.events ? e.events[t].unshift(n) : e.events[t] = [n], e;
      }, this.prependOnceListener = function(t, n) {
        var o = function() {
          for (var r = [], i = 0; i < arguments.length; i++)
            r[i] = arguments[i];
          n.apply(void 0, r), e.removeListener(t, o);
        };
        return e.prependListener(t, o), e;
      }, this.off = function(t, n) {
        return e.removeListener(t, n);
      }, this.removeAllListeners = function(t) {
        return delete e.events[t], e;
      }, this.setMaxListeners = function(t) {
        return e.maxListeners = t, e;
      }, this.getMaxListeners = function() {
        return e.maxListeners;
      }, this.listeners = function(t) {
        return g(e.events[t]);
      }, this.rawListeners = function(t) {
        return e.events[t];
      }, this.eventNames = function() {
        return Object.keys(e.events);
      }, this.listenerCount = function(t) {
        return e.events[t] && e.events[t].length || 0;
      };
    }
    return s;
  }()
);
v.EventEmitter = x;
(function(s) {
  function e(t) {
    for (var n in t)
      s.hasOwnProperty(n) || (s[n] = t[n]);
  }
  Object.defineProperty(s, "__esModule", { value: !0 }), e(h), e(v);
})(y);
class w {
  constructor(e) {
    this._cy = e, this.events = new y.EventEmitter(), this._initEventListeners();
  }
  _initEventListeners() {
    var e, t;
    (e = this._cy.container()) == null || e.addEventListener("dragover", (n) => {
      n.preventDefault(), n.stopPropagation();
      const o = this._getClosestNode(n);
      o === void 0 && this._lastHoveredNode !== void 0 ? this.events.emit("fileOverNodeEnd", this._lastHoveredNode) : this._lastHoveredNode !== o && o !== void 0 && this.events.emit("fileOverNodeStart", o), this._lastHoveredNode = o;
    }), (t = this._cy.container()) == null || t.addEventListener("drop", (n) => {
      var r;
      n.preventDefault(), n.stopPropagation();
      const o = this._getClosestNode(n);
      if (o !== void 0) {
        const i = (r = n.dataTransfer) == null ? void 0 : r.files;
        i !== void 0 && this.events.emit("filesDroppedOnNode", o, i);
      }
    });
  }
  _getClosestNode(e, t = 20) {
    var l, d;
    if (((l = this._cy) == null ? void 0 : l.nodes()) === void 0)
      return;
    const o = { x: e.offsetX, y: e.offsetY };
    let r, i = t;
    return (d = this._cy) == null || d.nodes().forEach((a) => {
      const c = this._distance(o, a.renderedPosition());
      c < i && (i = c, r = a);
    }), r;
  }
  _distance(e, t) {
    const n = t.x - e.x, o = t.y - e.y;
    return Math.sqrt(n * n + o * o);
  }
}
const f = {
  backgroundColor: "#fff",
  edgeColor: "#0d5be9",
  edgeFontSize: "5rem",
  edgeWidth: "3rem",
  nodeColor: "#03337a",
  nodeOpacity: "0.9",
  font: "Poppins",
  directed: !0
}, $ = (s = f) => [
  {
    selector: "node",
    style: {
      label: (e) => e.data("label") ? e.data("label") : "",
      "text-valign": "center",
      "font-family": s.font,
      "font-size": "10rem",
      opacity: s.nodeOpacity,
      color: "white",
      "text-outline-color": (e) => e.data("color") ? e.data("color") : s.nodeColor,
      "text-outline-width": 1,
      // Set the outline width
      "background-color": (e) => e.data("color") ? e.data("color") : s.nodeColor,
      width: (e) => e.data("size") ? e.data("size") : "",
      height: (e) => e.data("size") ? e.data("size") : ""
    }
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
      "target-arrow-shape": s.directed ? "triangle" : "none",
      "line-color": s.edgeColor,
      width: (e) => e.data("width") ? e.data("width") : s.edgeWidth,
      "text-rotation": "autorotate",
      // Rotate label with the edge.
      "text-background-opacity": 1,
      // Make the background fully opaque.
      "text-background-color": s.backgroundColor,
      // Use the same color as your background to "break" the edge.
      "text-background-padding": 4
      // Padding around the label text.
    }
  },
  {
    selector: ".triple",
    style: {
      "background-color": "white",
      "border-color": (e) => e.data("color") ? e.data("color") : s.nodeColor
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
      label: (e) => e.data("label") ? e.data("label") : "",
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
      "pie-1-background-color": f.nodeColor,
      // Color A
      "pie-1-background-size": (e) => `${e.data("pct")}%`,
      "pie-2-background-color": f.edgeColor,
      // Color B
      "pie-2-background-size": (e) => `${100 - parseInt(e.data("pct"))}%`,
      label: (e) => `${e.data("pct")}%`,
      "font-size": "5rem"
    }
  }
], C = {
  name: "grid",
  padding: 100
};
function N(s) {
  s.on("dragfree", "node", e), s.on("viewport", e);
  function e() {
    const t = s.json(), n = [];
    t.elements.nodes.forEach((o) => {
      const r = {};
      r.data = o.data, r.position = { x: Math.round(o.position.x), y: Math.round(o.position.y) }, o.classes && (r.classes = o.classes), n.push(r);
    }), console.log(n);
  }
}
function E(s, e) {
  function t() {
    s.nodes().forEach((n) => {
      const o = n.renderedPosition();
      let r = document.getElementById(`box-${n.id()}`);
      r || (r = document.createElement("div"), r.id = `box-${n.id()}`, r.style.position = "absolute", e.appendChild(r)), r.style.left = `${o.x}px`, r.style.top = `${o.y}px`;
    });
  }
  t(), s.on("position", "node", t), s.on("pan zoom", t), window.addEventListener("resize", t);
}
const L = {
  props: {
    displayOnlyOnHover: !0
  },
  boxLabels: {
    displayOnlyOnHover: !1
  }
};
function B(s, e, t = L) {
  E(s, e);
  function n() {
    s.nodes().forEach((o) => {
      const r = o.renderedBoundingBox().h, i = document.getElementById(`box-${o.id()}`);
      if (!i)
        return;
      const l = o.data().boxLabels;
      if (l !== void 0) {
        let a = document.getElementById(
          `labels-box-${o.id()}`
        );
        a ? a.style.bottom = `${r / 2 - 10}px` : (a = document.createElement("div"), a.id = `labels-box-${o.id()}`, a.className = "box-label", a.style.bottom = `${r / 2 - 10}px`, t.boxLabels.displayOnlyOnHover && (a.style.display = "none"), i.appendChild(a), l.forEach((c, u) => {
          if (!a)
            return;
          const p = document.createElement("div");
          p.id = `labels-box-${o.id()}-${u}`, p.className = "entry", p.innerHTML = c, a.appendChild(p);
        }));
      }
      const d = o.data().properties;
      if (d !== void 0) {
        let a = document.getElementById(
          `props-box-${o.id()}`
        );
        a ? a.style.top = `${r / 2 - 10}px` : (a = document.createElement("div"), a.id = `props-box-${o.id()}`, a.style.right = "0px", a.className = "property", a.style.top = `${r / 2 - 10}px`, t.props.displayOnlyOnHover && (a.style.display = "none"), i.appendChild(a), Object.keys(d).forEach((c, u) => {
          if (!a)
            return;
          const p = document.createElement("div");
          p.id = `props-box-${o.id()}-${u}`, p.className = "entry", p.innerHTML = `<span class="key">${c}</span><span class="value">${d[c]}</span>`, a.appendChild(p);
        }));
      }
    });
  }
  n(), s.on("zoom", n), s.on("mouseover", "node", (o) => {
    const r = o.target;
    if (t.props.displayOnlyOnHover) {
      const i = document.getElementById(`props-box-${r.id()}`);
      i && (i.style.display = "flex");
    }
    if (t.boxLabels.displayOnlyOnHover) {
      const i = document.getElementById(`labels-box-${r.id()}`);
      i && (i.style.display = "flex");
    }
  }), s.on("mouseout", "node", (o) => {
    const r = o.target;
    if (t.props.displayOnlyOnHover) {
      const i = document.getElementById(`props-box-${r.id()}`);
      i && (i.style.display = "none");
    }
    if (t.boxLabels.displayOnlyOnHover) {
      const i = document.getElementById(`labels-box-${r.id()}`);
      i && (i.style.display = "none");
    }
  });
}
export {
  w as FileDropHandler,
  O as animateGraph,
  B as appendHTMLLabels,
  E as appendHostContainers,
  $ as buildStyles,
  f as defaultSettings,
  C as layout,
  N as logNodePositions
};
