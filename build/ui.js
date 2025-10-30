(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a3, b2) => {
    for (var prop in b2 || (b2 = {}))
      if (__hasOwnProp.call(b2, prop))
        __defNormalProp(a3, prop, b2[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b2)) {
        if (__propIsEnum.call(b2, prop))
          __defNormalProp(a3, prop, b2[prop]);
      }
    return a3;
  };
  var __spreadProps = (a3, b2) => __defProps(a3, __getOwnPropDescs(b2));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/@create-figma-plugin/utilities/lib/events.js
  function on(name, handler) {
    const id = `${currentId}`;
    currentId += 1;
    eventHandlers[id] = { handler, name };
    return function() {
      delete eventHandlers[id];
    };
  }
  function invokeEventHandler(name, args) {
    let invoked = false;
    for (const id in eventHandlers) {
      if (eventHandlers[id].name === name) {
        eventHandlers[id].handler.apply(null, args);
        invoked = true;
      }
    }
    if (invoked === false) {
      throw new Error(`No event handler with name \`${name}\``);
    }
  }
  var eventHandlers, currentId, emit;
  var init_events = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/events.js"() {
      eventHandlers = {};
      currentId = 0;
      emit = typeof window === "undefined" ? function(name, ...args) {
        figma.ui.postMessage([name, ...args]);
      } : function(name, ...args) {
        window.parent.postMessage({
          pluginMessage: [name, ...args]
        }, "*");
      };
      if (typeof window === "undefined") {
        figma.ui.onmessage = function(args) {
          if (!Array.isArray(args)) {
            return;
          }
          const [name, ...rest] = args;
          if (typeof name !== "string") {
            return;
          }
          invokeEventHandler(name, rest);
        };
      } else {
        window.onmessage = function(event) {
          if (typeof event.data.pluginMessage === "undefined") {
            return;
          }
          const args = event.data.pluginMessage;
          if (!Array.isArray(args)) {
            return;
          }
          const [name, ...rest] = event.data.pluginMessage;
          if (typeof name !== "string") {
            return;
          }
          invokeEventHandler(name, rest);
        };
      }
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/mixed-values.js
  var MIXED_BOOLEAN, MIXED_STRING;
  var init_mixed_values = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/mixed-values.js"() {
      MIXED_BOOLEAN = null;
      MIXED_STRING = "999999999999999";
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/index.js
  var init_lib = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
      init_events();
      init_mixed_values();
    }
  });

  // node_modules/preact/dist/preact.module.js
  function d(n2, l3) {
    for (var u3 in l3) n2[u3] = l3[u3];
    return n2;
  }
  function g(n2) {
    n2 && n2.parentNode && n2.parentNode.removeChild(n2);
  }
  function _(l3, u3, t3) {
    var i3, r3, o3, e3 = {};
    for (o3 in u3) "key" == o3 ? i3 = u3[o3] : "ref" == o3 ? r3 = u3[o3] : e3[o3] = u3[o3];
    if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
    return m(l3, e3, i3, r3, null);
  }
  function m(n2, t3, i3, r3, o3) {
    var e3 = { type: n2, props: t3, key: i3, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
    return null == o3 && null != l.vnode && l.vnode(e3), e3;
  }
  function k(n2) {
    return n2.children;
  }
  function x(n2, l3) {
    this.props = n2, this.context = l3;
  }
  function S(n2, l3) {
    if (null == l3) return n2.__ ? S(n2.__, n2.__i + 1) : null;
    for (var u3; l3 < n2.__k.length; l3++) if (null != (u3 = n2.__k[l3]) && null != u3.__e) return u3.__e;
    return "function" == typeof n2.type ? S(n2) : null;
  }
  function C(n2) {
    var l3, u3;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++) if (null != (u3 = n2.__k[l3]) && null != u3.__e) {
        n2.__e = n2.__c.base = u3.__e;
        break;
      }
      return C(n2);
    }
  }
  function M(n2) {
    (!n2.__d && (n2.__d = true) && i.push(n2) && !$.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)($);
  }
  function $() {
    for (var n2, u3, t3, r3, o3, f3, c3, s3 = 1; i.length; ) i.length > s3 && i.sort(e), n2 = i.shift(), s3 = i.length, n2.__d && (t3 = void 0, r3 = void 0, o3 = (r3 = (u3 = n2).__v).__e, f3 = [], c3 = [], u3.__P && ((t3 = d({}, r3)).__v = r3.__v + 1, l.vnode && l.vnode(t3), O(u3.__P, t3, r3, u3.__n, u3.__P.namespaceURI, 32 & r3.__u ? [o3] : null, f3, null == o3 ? S(r3) : o3, !!(32 & r3.__u), c3), t3.__v = r3.__v, t3.__.__k[t3.__i] = t3, N(f3, t3, c3), r3.__e = r3.__ = null, t3.__e != o3 && C(t3)));
    $.__r = 0;
  }
  function I(n2, l3, u3, t3, i3, r3, o3, e3, f3, c3, s3) {
    var a3, h3, y3, w3, d3, g4, _3, m3 = t3 && t3.__k || v, b2 = l3.length;
    for (f3 = P(u3, l3, m3, f3, b2), a3 = 0; a3 < b2; a3++) null != (y3 = u3.__k[a3]) && (h3 = -1 == y3.__i ? p : m3[y3.__i] || p, y3.__i = a3, g4 = O(n2, y3, h3, i3, r3, o3, e3, f3, c3, s3), w3 = y3.__e, y3.ref && h3.ref != y3.ref && (h3.ref && B(h3.ref, null, y3), s3.push(y3.ref, y3.__c || w3, y3)), null == d3 && null != w3 && (d3 = w3), (_3 = !!(4 & y3.__u)) || h3.__k === y3.__k ? f3 = A(y3, f3, n2, _3) : "function" == typeof y3.type && void 0 !== g4 ? f3 = g4 : w3 && (f3 = w3.nextSibling), y3.__u &= -7);
    return u3.__e = d3, f3;
  }
  function P(n2, l3, u3, t3, i3) {
    var r3, o3, e3, f3, c3, s3 = u3.length, a3 = s3, h3 = 0;
    for (n2.__k = new Array(i3), r3 = 0; r3 < i3; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? (f3 = r3 + h3, (o3 = n2.__k[r3] = "string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? m(null, o3, null, null, null) : w(o3) ? m(k, { children: o3 }, null, null, null) : null == o3.constructor && o3.__b > 0 ? m(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : o3).__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = L(o3, u3, f3, a3)) && (a3--, (e3 = u3[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i3 > s3 ? h3-- : i3 < s3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f3 && (c3 == f3 - 1 ? h3-- : c3 == f3 + 1 ? h3++ : (c3 > f3 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
    if (a3) for (r3 = 0; r3 < s3; r3++) null != (e3 = u3[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = S(e3)), D(e3, e3));
    return t3;
  }
  function A(n2, l3, u3, t3) {
    var i3, r3;
    if ("function" == typeof n2.type) {
      for (i3 = n2.__k, r3 = 0; i3 && r3 < i3.length; r3++) i3[r3] && (i3[r3].__ = n2, l3 = A(i3[r3], l3, u3, t3));
      return l3;
    }
    n2.__e != l3 && (t3 && (l3 && n2.type && !l3.parentNode && (l3 = S(n2)), u3.insertBefore(n2.__e, l3 || null)), l3 = n2.__e);
    do {
      l3 = l3 && l3.nextSibling;
    } while (null != l3 && 8 == l3.nodeType);
    return l3;
  }
  function H(n2, l3) {
    return l3 = l3 || [], null == n2 || "boolean" == typeof n2 || (w(n2) ? n2.some(function(n3) {
      H(n3, l3);
    }) : l3.push(n2)), l3;
  }
  function L(n2, l3, u3, t3) {
    var i3, r3, o3, e3 = n2.key, f3 = n2.type, c3 = l3[u3], s3 = null != c3 && 0 == (2 & c3.__u);
    if (null === c3 && null == n2.key || s3 && e3 == c3.key && f3 == c3.type) return u3;
    if (t3 > (s3 ? 1 : 0)) {
      for (i3 = u3 - 1, r3 = u3 + 1; i3 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o3 = i3 >= 0 ? i3-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f3 == c3.type) return o3;
    }
    return -1;
  }
  function T(n2, l3, u3) {
    "-" == l3[0] ? n2.setProperty(l3, null == u3 ? "" : u3) : n2[l3] = null == u3 ? "" : "number" != typeof u3 || y.test(l3) ? u3 : u3 + "px";
  }
  function j(n2, l3, u3, t3, i3) {
    var r3, o3;
    n: if ("style" == l3) if ("string" == typeof u3) n2.style.cssText = u3;
    else {
      if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u3 && l3 in u3 || T(n2.style, l3, "");
      if (u3) for (l3 in u3) t3 && u3[l3] == t3[l3] || T(n2.style, l3, u3[l3]);
    }
    else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(f, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u3, u3 ? t3 ? u3.u = t3.u : (u3.u = c, n2.addEventListener(l3, r3 ? a : s, r3)) : n2.removeEventListener(l3, r3 ? a : s, r3);
    else {
      if ("http://www.w3.org/2000/svg" == i3) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
        n2[l3] = null == u3 ? "" : u3;
        break n;
      } catch (n3) {
      }
      "function" == typeof u3 || (null == u3 || false === u3 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u3 ? "" : u3));
    }
  }
  function F(n2) {
    return function(u3) {
      if (this.l) {
        var t3 = this.l[u3.type + n2];
        if (null == u3.t) u3.t = c++;
        else if (u3.t < t3.u) return;
        return t3(l.event ? l.event(u3) : u3);
      }
    };
  }
  function O(n2, u3, t3, i3, r3, o3, e3, f3, c3, s3) {
    var a3, h3, p3, v3, y3, _3, m3, b2, S2, C3, M2, $3, P4, A4, H3, L2, T4, j4 = u3.type;
    if (null != u3.constructor) return null;
    128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f3 = u3.__e = t3.__e]), (a3 = l.__b) && a3(u3);
    n: if ("function" == typeof j4) try {
      if (b2 = u3.props, S2 = "prototype" in j4 && j4.prototype.render, C3 = (a3 = j4.contextType) && i3[a3.__c], M2 = a3 ? C3 ? C3.props.value : a3.__ : i3, t3.__c ? m3 = (h3 = u3.__c = t3.__c).__ = h3.__E : (S2 ? u3.__c = h3 = new j4(b2, M2) : (u3.__c = h3 = new x(b2, M2), h3.constructor = j4, h3.render = E), C3 && C3.sub(h3), h3.props = b2, h3.state || (h3.state = {}), h3.context = M2, h3.__n = i3, p3 = h3.__d = true, h3.__h = [], h3._sb = []), S2 && null == h3.__s && (h3.__s = h3.state), S2 && null != j4.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = d({}, h3.__s)), d(h3.__s, j4.getDerivedStateFromProps(b2, h3.__s))), v3 = h3.props, y3 = h3.state, h3.__v = u3, p3) S2 && null == j4.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), S2 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
      else {
        if (S2 && null == j4.getDerivedStateFromProps && b2 !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(b2, M2), !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(b2, h3.__s, M2) || u3.__v == t3.__v) {
          for (u3.__v != t3.__v && (h3.props = b2, h3.state = h3.__s, h3.__d = false), u3.__e = t3.__e, u3.__k = t3.__k, u3.__k.some(function(n3) {
            n3 && (n3.__ = u3);
          }), $3 = 0; $3 < h3._sb.length; $3++) h3.__h.push(h3._sb[$3]);
          h3._sb = [], h3.__h.length && e3.push(h3);
          break n;
        }
        null != h3.componentWillUpdate && h3.componentWillUpdate(b2, h3.__s, M2), S2 && null != h3.componentDidUpdate && h3.__h.push(function() {
          h3.componentDidUpdate(v3, y3, _3);
        });
      }
      if (h3.context = M2, h3.props = b2, h3.__P = n2, h3.__e = false, P4 = l.__r, A4 = 0, S2) {
        for (h3.state = h3.__s, h3.__d = false, P4 && P4(u3), a3 = h3.render(h3.props, h3.state, h3.context), H3 = 0; H3 < h3._sb.length; H3++) h3.__h.push(h3._sb[H3]);
        h3._sb = [];
      } else do {
        h3.__d = false, P4 && P4(u3), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
      } while (h3.__d && ++A4 < 25);
      h3.state = h3.__s, null != h3.getChildContext && (i3 = d(d({}, i3), h3.getChildContext())), S2 && !p3 && null != h3.getSnapshotBeforeUpdate && (_3 = h3.getSnapshotBeforeUpdate(v3, y3)), L2 = a3, null != a3 && a3.type === k && null == a3.key && (L2 = V(a3.props.children)), f3 = I(n2, w(L2) ? L2 : [L2], u3, t3, i3, r3, o3, e3, f3, c3, s3), h3.base = u3.__e, u3.__u &= -161, h3.__h.length && e3.push(h3), m3 && (h3.__E = h3.__ = null);
    } catch (n3) {
      if (u3.__v = null, c3 || null != o3) if (n3.then) {
        for (u3.__u |= c3 ? 160 : 128; f3 && 8 == f3.nodeType && f3.nextSibling; ) f3 = f3.nextSibling;
        o3[o3.indexOf(f3)] = null, u3.__e = f3;
      } else {
        for (T4 = o3.length; T4--; ) g(o3[T4]);
        z(u3);
      }
      else u3.__e = t3.__e, u3.__k = t3.__k, n3.then || z(u3);
      l.__e(n3, u3, t3);
    }
    else null == o3 && u3.__v == t3.__v ? (u3.__k = t3.__k, u3.__e = t3.__e) : f3 = u3.__e = q(t3.__e, u3, t3, i3, r3, o3, e3, c3, s3);
    return (a3 = l.diffed) && a3(u3), 128 & u3.__u ? void 0 : f3;
  }
  function z(n2) {
    n2 && n2.__c && (n2.__c.__e = true), n2 && n2.__k && n2.__k.forEach(z);
  }
  function N(n2, u3, t3) {
    for (var i3 = 0; i3 < t3.length; i3++) B(t3[i3], t3[++i3], t3[++i3]);
    l.__c && l.__c(u3, n2), n2.some(function(u4) {
      try {
        n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
          n3.call(u4);
        });
      } catch (n3) {
        l.__e(n3, u4.__v);
      }
    });
  }
  function V(n2) {
    return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w(n2) ? n2.map(V) : d({}, n2);
  }
  function q(u3, t3, i3, r3, o3, e3, f3, c3, s3) {
    var a3, h3, v3, y3, d3, _3, m3, b2 = i3.props, k3 = t3.props, x3 = t3.type;
    if ("svg" == x3 ? o3 = "http://www.w3.org/2000/svg" : "math" == x3 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
      for (a3 = 0; a3 < e3.length; a3++) if ((d3 = e3[a3]) && "setAttribute" in d3 == !!x3 && (x3 ? d3.localName == x3 : 3 == d3.nodeType)) {
        u3 = d3, e3[a3] = null;
        break;
      }
    }
    if (null == u3) {
      if (null == x3) return document.createTextNode(k3);
      u3 = document.createElementNS(o3, x3, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
    }
    if (null == x3) b2 === k3 || c3 && u3.data == k3 || (u3.data = k3);
    else {
      if (e3 = e3 && n.call(u3.childNodes), b2 = i3.props || p, !c3 && null != e3) for (b2 = {}, a3 = 0; a3 < u3.attributes.length; a3++) b2[(d3 = u3.attributes[a3]).name] = d3.value;
      for (a3 in b2) if (d3 = b2[a3], "children" == a3) ;
      else if ("dangerouslySetInnerHTML" == a3) v3 = d3;
      else if (!(a3 in k3)) {
        if ("value" == a3 && "defaultValue" in k3 || "checked" == a3 && "defaultChecked" in k3) continue;
        j(u3, a3, null, d3, o3);
      }
      for (a3 in k3) d3 = k3[a3], "children" == a3 ? y3 = d3 : "dangerouslySetInnerHTML" == a3 ? h3 = d3 : "value" == a3 ? _3 = d3 : "checked" == a3 ? m3 = d3 : c3 && "function" != typeof d3 || b2[a3] === d3 || j(u3, a3, d3, b2[a3], o3);
      if (h3) c3 || v3 && (h3.__html == v3.__html || h3.__html == u3.innerHTML) || (u3.innerHTML = h3.__html), t3.__k = [];
      else if (v3 && (u3.innerHTML = ""), I("template" == t3.type ? u3.content : u3, w(y3) ? y3 : [y3], t3, i3, r3, "foreignObject" == x3 ? "http://www.w3.org/1999/xhtml" : o3, e3, f3, e3 ? e3[0] : i3.__k && S(i3, 0), c3, s3), null != e3) for (a3 = e3.length; a3--; ) g(e3[a3]);
      c3 || (a3 = "value", "progress" == x3 && null == _3 ? u3.removeAttribute("value") : null != _3 && (_3 !== u3[a3] || "progress" == x3 && !_3 || "option" == x3 && _3 != b2[a3]) && j(u3, a3, _3, b2[a3], o3), a3 = "checked", null != m3 && m3 != u3[a3] && j(u3, a3, m3, b2[a3], o3));
    }
    return u3;
  }
  function B(n2, u3, t3) {
    try {
      if ("function" == typeof n2) {
        var i3 = "function" == typeof n2.__u;
        i3 && n2.__u(), i3 && null == u3 || (n2.__u = n2(u3));
      } else n2.current = u3;
    } catch (n3) {
      l.__e(n3, t3);
    }
  }
  function D(n2, u3, t3) {
    var i3, r3;
    if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current != n2.__e || B(i3, null, u3)), null != (i3 = n2.__c)) {
      if (i3.componentWillUnmount) try {
        i3.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u3);
      }
      i3.base = i3.__P = null;
    }
    if (i3 = n2.__k) for (r3 = 0; r3 < i3.length; r3++) i3[r3] && D(i3[r3], u3, t3 || "function" != typeof n2.type);
    t3 || g(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
  }
  function E(n2, l3, u3) {
    return this.constructor(n2, u3);
  }
  function G(u3, t3, i3) {
    var r3, o3, e3, f3;
    t3 == document && (t3 = document.documentElement), l.__ && l.__(u3, t3), o3 = (r3 = "function" == typeof i3) ? null : i3 && i3.__k || t3.__k, e3 = [], f3 = [], O(t3, u3 = (!r3 && i3 || t3).__k = _(k, null, [u3]), o3 || p, p, t3.namespaceURI, !r3 && i3 ? [i3] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i3 ? i3 : o3 ? o3.__e : t3.firstChild, r3, f3), N(e3, u3, f3);
  }
  var n, l, u, t, i, r, o, e, f, c, s, a, h, p, v, y, w;
  var init_preact_module = __esm({
    "node_modules/preact/dist/preact.module.js"() {
      p = {};
      v = [];
      y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
      w = Array.isArray;
      n = v.slice, l = { __e: function(n2, l3, u3, t3) {
        for (var i3, r3, o3; l3 = l3.__; ) if ((i3 = l3.__c) && !i3.__) try {
          if ((r3 = i3.constructor) && null != r3.getDerivedStateFromError && (i3.setState(r3.getDerivedStateFromError(n2)), o3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t3 || {}), o3 = i3.__d), o3) return i3.__E = i3;
        } catch (l4) {
          n2 = l4;
        }
        throw n2;
      } }, u = 0, t = function(n2) {
        return null != n2 && null == n2.constructor;
      }, x.prototype.setState = function(n2, l3) {
        var u3;
        u3 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n2 && (n2 = n2(d({}, u3), this.props)), n2 && d(u3, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), M(this));
      }, x.prototype.forceUpdate = function(n2) {
        this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
      }, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
        return n2.__v.__b - l3.__v.__b;
      }, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/create-class-name.js
  function createClassName(classNames) {
    return classNames.filter(function(className) {
      return className !== null;
    }).join(" ");
  }
  var init_create_class_name = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/create-class-name.js"() {
    }
  });

  // node_modules/preact/hooks/dist/hooks.module.js
  function p2(n2, t3) {
    c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
    var u3 = r2.__H || (r2.__H = { __: [], __h: [] });
    return n2 >= u3.__.length && u3.__.push({}), u3.__[n2];
  }
  function d2(n2) {
    return o2 = 1, h2(D2, n2);
  }
  function h2(n2, u3, i3) {
    var o3 = p2(t2++, 2);
    if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u3) : D2(void 0, u3), function(n3) {
      var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
      t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
    }], o3.__c = r2, !r2.__f)) {
      var f3 = function(n3, t3, r3) {
        if (!o3.__c.__H) return true;
        var u4 = o3.__c.__H.__.filter(function(n4) {
          return !!n4.__c;
        });
        if (u4.every(function(n4) {
          return !n4.__N;
        })) return !c3 || c3.call(this, n3, t3, r3);
        var i4 = o3.__c.props !== n3;
        return u4.forEach(function(n4) {
          if (n4.__N) {
            var t4 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i4 = true);
          }
        }), c3 && c3.call(this, n3, t3, r3) || i4;
      };
      r2.__f = true;
      var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
      r2.componentWillUpdate = function(n3, t3, r3) {
        if (this.__e) {
          var u4 = c3;
          c3 = void 0, f3(n3, t3, r3), c3 = u4;
        }
        e3 && e3.call(this, n3, t3, r3);
      }, r2.shouldComponentUpdate = f3;
    }
    return o3.__N || o3.__;
  }
  function y2(n2, u3) {
    var i3 = p2(t2++, 3);
    !c2.__s && C2(i3.__H, u3) && (i3.__ = n2, i3.u = u3, r2.__H.__h.push(i3));
  }
  function A2(n2) {
    return o2 = 5, T2(function() {
      return { current: n2 };
    }, []);
  }
  function T2(n2, r3) {
    var u3 = p2(t2++, 7);
    return C2(u3.__H, r3) && (u3.__ = n2(), u3.__H = r3, u3.__h = n2), u3.__;
  }
  function q2(n2, t3) {
    return o2 = 8, T2(function() {
      return n2;
    }, t3);
  }
  function j2() {
    for (var n2; n2 = f2.shift(); ) if (n2.__P && n2.__H) try {
      n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
    } catch (t3) {
      n2.__H.__h = [], c2.__e(t3, n2.__v);
    }
  }
  function w2(n2) {
    var t3, r3 = function() {
      clearTimeout(u3), k2 && cancelAnimationFrame(t3), setTimeout(n2);
    }, u3 = setTimeout(r3, 35);
    k2 && (t3 = requestAnimationFrame(r3));
  }
  function z2(n2) {
    var t3 = r2, u3 = n2.__c;
    "function" == typeof u3 && (n2.__c = void 0, u3()), r2 = t3;
  }
  function B2(n2) {
    var t3 = r2;
    n2.__c = n2.__(), r2 = t3;
  }
  function C2(n2, t3) {
    return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
      return t4 !== n2[r3];
    });
  }
  function D2(n2, t3) {
    return "function" == typeof t3 ? t3(n2) : t3;
  }
  var t2, r2, u2, i2, o2, f2, c2, e2, a2, v2, l2, m2, s2, k2;
  var init_hooks_module = __esm({
    "node_modules/preact/hooks/dist/hooks.module.js"() {
      init_preact_module();
      o2 = 0;
      f2 = [];
      c2 = l;
      e2 = c2.__b;
      a2 = c2.__r;
      v2 = c2.diffed;
      l2 = c2.__c;
      m2 = c2.unmount;
      s2 = c2.__;
      c2.__b = function(n2) {
        r2 = null, e2 && e2(n2);
      }, c2.__ = function(n2, t3) {
        n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
      }, c2.__r = function(n2) {
        a2 && a2(n2), t2 = 0;
        var i3 = (r2 = n2.__c).__H;
        i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.forEach(function(n3) {
          n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
        })) : (i3.__h.forEach(z2), i3.__h.forEach(B2), i3.__h = [], t2 = 0)), u2 = r2;
      }, c2.diffed = function(n2) {
        v2 && v2(n2);
        var t3 = n2.__c;
        t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
          n3.u && (n3.__H = n3.u), n3.u = void 0;
        })), u2 = r2 = null;
      }, c2.__c = function(n2, t3) {
        t3.some(function(n3) {
          try {
            n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
              return !n4.__ || B2(n4);
            });
          } catch (r3) {
            t3.some(function(n4) {
              n4.__h && (n4.__h = []);
            }), t3 = [], c2.__e(r3, n3.__v);
          }
        }), l2 && l2(n2, t3);
      }, c2.unmount = function(n2) {
        m2 && m2(n2);
        var t3, r3 = n2.__c;
        r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
          try {
            z2(n3);
          } catch (n4) {
            t3 = n4;
          }
        }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
      };
      k2 = "function" == typeof requestAnimationFrame;
    }
  });

  // node_modules/preact/compat/dist/compat.module.js
  function g3(n2, t3) {
    for (var e3 in t3) n2[e3] = t3[e3];
    return n2;
  }
  function E2(n2, t3) {
    for (var e3 in n2) if ("__source" !== e3 && !(e3 in t3)) return true;
    for (var r3 in t3) if ("__source" !== r3 && n2[r3] !== t3[r3]) return true;
    return false;
  }
  function N2(n2, t3) {
    this.props = n2, this.context = t3;
  }
  function D3(n2) {
    function t3(t4) {
      var e3 = g3({}, t4);
      return delete e3.ref, n2(e3, t4.ref || null);
    }
    return t3.$$typeof = A3, t3.render = n2, t3.prototype.isReactComponent = t3.__f = true, t3.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t3;
  }
  function V2(n2, t3, e3) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g3({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t3), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return V2(n3, t3, e3);
    })), n2;
  }
  function W(n2, t3, e3) {
    return n2 && e3 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return W(n3, t3, e3);
    }), n2.__c && n2.__c.__P === t3 && (n2.__e && e3.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e3)), n2;
  }
  function P3() {
    this.__u = 0, this.o = null, this.__b = null;
  }
  function j3(n2) {
    var t3 = n2.__.__c;
    return t3 && t3.__a && t3.__a(n2);
  }
  function B3() {
    this.i = null, this.l = null;
  }
  function Z(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function Y(n2) {
    var e3 = this, r3 = n2.h;
    if (e3.componentWillUnmount = function() {
      G(null, e3.v), e3.v = null, e3.h = null;
    }, e3.h && e3.h !== r3 && e3.componentWillUnmount(), !e3.v) {
      for (var u3 = e3.__v; null !== u3 && !u3.__m && null !== u3.__; ) u3 = u3.__;
      e3.h = r3, e3.v = { nodeType: 1, parentNode: r3, childNodes: [], __k: { __m: u3.__m }, contains: function() {
        return true;
      }, insertBefore: function(n3, t3) {
        this.childNodes.push(n3), e3.h.insertBefore(n3, t3);
      }, removeChild: function(n3) {
        this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e3.h.removeChild(n3);
      } };
    }
    G(_(Z, { context: e3.context }, n2.__v), e3.v);
  }
  function $2(n2, e3) {
    var r3 = _(Y, { __v: n2, h: e3 });
    return r3.containerInfo = e3, r3;
  }
  function rn() {
  }
  function un() {
    return this.cancelBubble;
  }
  function on2() {
    return this.defaultPrevented;
  }
  var T3, A3, F3, U, H2, q3, G2, J2, K2, Q2, X, en, ln, cn, fn, an, sn;
  var init_compat_module = __esm({
    "node_modules/preact/compat/dist/compat.module.js"() {
      init_preact_module();
      init_preact_module();
      init_hooks_module();
      init_hooks_module();
      (N2.prototype = new x()).isPureReactComponent = true, N2.prototype.shouldComponentUpdate = function(n2, t3) {
        return E2(this.props, n2) || E2(this.state, t3);
      };
      T3 = l.__b;
      l.__b = function(n2) {
        n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T3 && T3(n2);
      };
      A3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
      F3 = l.__e;
      l.__e = function(n2, t3, e3, r3) {
        if (n2.then) {
          for (var u3, o3 = t3; o3 = o3.__; ) if ((u3 = o3.__c) && u3.__c) return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k), u3.__c(n2, t3);
        }
        F3(n2, t3, e3, r3);
      };
      U = l.unmount;
      l.unmount = function(n2) {
        var t3 = n2.__c;
        t3 && t3.__R && t3.__R(), t3 && 32 & n2.__u && (n2.type = null), U && U(n2);
      }, (P3.prototype = new x()).__c = function(n2, t3) {
        var e3 = t3.__c, r3 = this;
        null == r3.o && (r3.o = []), r3.o.push(e3);
        var u3 = j3(r3.__v), o3 = false, i3 = function() {
          o3 || (o3 = true, e3.__R = null, u3 ? u3(l3) : l3());
        };
        e3.__R = i3;
        var l3 = function() {
          if (!--r3.__u) {
            if (r3.state.__a) {
              var n3 = r3.state.__a;
              r3.__v.__k[0] = W(n3, n3.__c.__P, n3.__c.__O);
            }
            var t4;
            for (r3.setState({ __a: r3.__b = null }); t4 = r3.o.pop(); ) t4.forceUpdate();
          }
        };
        r3.__u++ || 32 & t3.__u || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i3, i3);
      }, P3.prototype.componentWillUnmount = function() {
        this.o = [];
      }, P3.prototype.render = function(n2, e3) {
        if (this.__b) {
          if (this.__v.__k) {
            var r3 = document.createElement("div"), o3 = this.__v.__k[0].__c;
            this.__v.__k[0] = V2(this.__b, r3, o3.__O = o3.__P);
          }
          this.__b = null;
        }
        var i3 = e3.__a && _(k, null, n2.fallback);
        return i3 && (i3.__u &= -33), [_(k, null, e3.__a ? null : n2.children), i3];
      };
      H2 = function(n2, t3, e3) {
        if (++e3[1] === e3[0] && n2.l.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size)) for (e3 = n2.i; e3; ) {
          for (; e3.length > 3; ) e3.pop()();
          if (e3[1] < e3[0]) break;
          n2.i = e3 = e3[2];
        }
      };
      (B3.prototype = new x()).__a = function(n2) {
        var t3 = this, e3 = j3(t3.__v), r3 = t3.l.get(n2);
        return r3[0]++, function(u3) {
          var o3 = function() {
            t3.props.revealOrder ? (r3.push(u3), H2(t3, n2, r3)) : u3();
          };
          e3 ? e3(o3) : o3();
        };
      }, B3.prototype.render = function(n2) {
        this.i = null, this.l = /* @__PURE__ */ new Map();
        var t3 = H(n2.children);
        n2.revealOrder && "b" === n2.revealOrder[0] && t3.reverse();
        for (var e3 = t3.length; e3--; ) this.l.set(t3[e3], this.i = [1, 0, this.i]);
        return n2.children;
      }, B3.prototype.componentDidUpdate = B3.prototype.componentDidMount = function() {
        var n2 = this;
        this.l.forEach(function(t3, e3) {
          H2(n2, e3, t3);
        });
      };
      q3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
      G2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
      J2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
      K2 = /[A-Z0-9]/g;
      Q2 = "undefined" != typeof document;
      X = function(n2) {
        return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
      };
      x.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t3) {
        Object.defineProperty(x.prototype, t3, { configurable: true, get: function() {
          return this["UNSAFE_" + t3];
        }, set: function(n2) {
          Object.defineProperty(this, t3, { configurable: true, writable: true, value: n2 });
        } });
      });
      en = l.event;
      l.event = function(n2) {
        return en && (n2 = en(n2)), n2.persist = rn, n2.isPropagationStopped = un, n2.isDefaultPrevented = on2, n2.nativeEvent = n2;
      };
      cn = { enumerable: false, configurable: true, get: function() {
        return this.class;
      } };
      fn = l.vnode;
      l.vnode = function(n2) {
        "string" == typeof n2.type && function(n3) {
          var t3 = n3.props, e3 = n3.type, u3 = {}, o3 = -1 === e3.indexOf("-");
          for (var i3 in t3) {
            var l3 = t3[i3];
            if (!("value" === i3 && "defaultValue" in t3 && null == l3 || Q2 && "children" === i3 && "noscript" === e3 || "class" === i3 || "className" === i3)) {
              var c3 = i3.toLowerCase();
              "defaultValue" === i3 && "value" in t3 && null == t3.value ? i3 = "value" : "download" === i3 && true === l3 ? l3 = "" : "translate" === c3 && "no" === l3 ? l3 = false : "o" === c3[0] && "n" === c3[1] ? "ondoubleclick" === c3 ? i3 = "ondblclick" : "onchange" !== c3 || "input" !== e3 && "textarea" !== e3 || X(t3.type) ? "onfocus" === c3 ? i3 = "onfocusin" : "onblur" === c3 ? i3 = "onfocusout" : J2.test(i3) && (i3 = c3) : c3 = i3 = "oninput" : o3 && G2.test(i3) ? i3 = i3.replace(K2, "-$&").toLowerCase() : null === l3 && (l3 = void 0), "oninput" === c3 && u3[i3 = c3] && (i3 = "oninputCapture"), u3[i3] = l3;
            }
          }
          "select" == e3 && u3.multiple && Array.isArray(u3.value) && (u3.value = H(t3.children).forEach(function(n4) {
            n4.props.selected = -1 != u3.value.indexOf(n4.props.value);
          })), "select" == e3 && null != u3.defaultValue && (u3.value = H(t3.children).forEach(function(n4) {
            n4.props.selected = u3.multiple ? -1 != u3.defaultValue.indexOf(n4.props.value) : u3.defaultValue == n4.props.value;
          })), t3.class && !t3.className ? (u3.class = t3.class, Object.defineProperty(u3, "className", cn)) : (t3.className && !t3.class || t3.class && t3.className) && (u3.class = u3.className = t3.className), n3.props = u3;
        }(n2), n2.$$typeof = q3, fn && fn(n2);
      };
      an = l.__r;
      l.__r = function(n2) {
        an && an(n2), ln = n2.__c;
      };
      sn = l.diffed;
      l.diffed = function(n2) {
        sn && sn(n2);
        var t3 = n2.props, e3 = n2.__e;
        null != e3 && "textarea" === n2.type && "value" in t3 && t3.value !== e3.value && (e3.value = null == t3.value ? "" : t3.value), ln = null;
      };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/create-component.js
  function createComponent(fn2) {
    return D3(fn2);
  }
  var init_create_component = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/create-component.js"() {
      init_compat_module();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/no-op.js
  function noop() {
  }
  var init_no_op = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/no-op.js"() {
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/bbbb08c0-b7a1-4944-939d-374281591554/loading-indicator.module.js
  var loading_indicator_module_default;
  var init_loading_indicator_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/bbbb08c0-b7a1-4944-939d-374281591554/loading-indicator.module.js"() {
      if (document.getElementById("cf41a494a6") === null) {
        const element = document.createElement("style");
        element.id = "cf41a494a6";
        element.textContent = `._loadingIndicator_18hv6_1 {
  position: relative;
  width: var(--space-16);
  height: var(--space-16);
  margin: auto;
}

._svg_18hv6_8 {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--space-16);
  height: var(--space-16);
  animation: _rotating_18hv6_1 0.5s linear infinite;
  fill: currentColor;
}

@keyframes _rotating_18hv6_1 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9sb2FkaW5nLWluZGljYXRvci9sb2FkaW5nLWluZGljYXRvci5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHNCQUFzQjtFQUN0Qix1QkFBdUI7RUFDdkIsWUFBWTtBQUNkOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLE1BQU07RUFDTixPQUFPO0VBQ1Asc0JBQXNCO0VBQ3RCLHVCQUF1QjtFQUN2QixpREFBd0M7RUFDeEMsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0U7SUFDRSx1QkFBdUI7RUFDekI7RUFDQTtJQUNFLHlCQUF5QjtFQUMzQjtBQUNGIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9sb2FkaW5nLWluZGljYXRvci9sb2FkaW5nLWluZGljYXRvci5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmxvYWRpbmdJbmRpY2F0b3Ige1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiB2YXIoLS1zcGFjZS0xNik7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtMTYpO1xuICBtYXJnaW46IGF1dG87XG59XG5cbi5zdmcge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IHZhcigtLXNwYWNlLTE2KTtcbiAgaGVpZ2h0OiB2YXIoLS1zcGFjZS0xNik7XG4gIGFuaW1hdGlvbjogcm90YXRpbmcgMC41cyBsaW5lYXIgaW5maW5pdGU7XG4gIGZpbGw6IGN1cnJlbnRDb2xvcjtcbn1cblxuQGtleWZyYW1lcyByb3RhdGluZyB7XG4gIGZyb20ge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xuICB9XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG4iXX0= */`;
        document.head.append(element);
      }
      loading_indicator_module_default = { "loadingIndicator": "_loadingIndicator_18hv6_1", "svg": "_svg_18hv6_8", "rotating": "_rotating_18hv6_1" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/loading-indicator/loading-indicator.js
  var LoadingIndicator;
  var init_loading_indicator = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/loading-indicator/loading-indicator.js"() {
      init_preact_module();
      init_create_component();
      init_loading_indicator_module();
      LoadingIndicator = createComponent(function(_a, ref) {
        var _b = _a, { color } = _b, rest = __objRest(_b, ["color"]);
        return _(
          "div",
          __spreadProps(__spreadValues({}, rest), { ref, class: loading_indicator_module_default.loadingIndicator }),
          _(
            "svg",
            { class: loading_indicator_module_default.svg, style: typeof color === "undefined" ? void 0 : {
              fill: `var(--figma-color-icon-${color})`
            } },
            _("path", { d: "M11.333 3.011a6 6 0 0 0-2.834-.99A.534.534 0 0 1 8 1.5c.001-.276.225-.502.5-.482A7 7 0 1 1 1.019 8.5.473.473 0 0 1 1.5 8c.276 0 .498.224.52.5a6 6 0 1 0 9.313-5.489Z" })
          )
        );
      });
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/5d1a85da-7fde-4b67-a482-7bbc673e68b3/button.module.js
  var button_module_default;
  var init_button_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/5d1a85da-7fde-4b67-a482-7bbc673e68b3/button.module.js"() {
      if (document.getElementById("db3485b5b5") === null) {
        const element = document.createElement("style");
        element.id = "db3485b5b5";
        element.textContent = `._button_avmy7_1 {
  position: relative;
  z-index: var(--z-index-1);
  display: inline-block;
}

._fullWidth_avmy7_7 {
  display: block;
}

._disabled_avmy7_11,
._disabled_avmy7_11 * {
  cursor: not-allowed;
}

._button_avmy7_1 button {
  position: relative;
  display: inline-block;
  height: var(--space-24);
  padding: var(--space-0) var(--space-8);
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-6);
}

._fullWidth_avmy7_7 button {
  display: block;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._default_avmy7_33 button {
  border-color: transparent;
  background-color: var(--figma-color-bg-brand);
  color: var(--figma-color-text-onbrand);
}

._default_avmy7_33:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-onbrand);
}
._default_avmy7_33:not(._disabled_avmy7_11) button:focus-visible {
  box-shadow: 0 0 0 var(--border-width-1) var(--figma-color-bg) inset;
}
._default_avmy7_33:not(._disabled_avmy7_11) button:active {
  background-color: var(--figma-color-bg-brand-pressed);
}
._default_avmy7_33._disabled_avmy7_11 button {
  background-color: var(--figma-color-bg-disabled);
  color: var(--figma-color-text-ondisabled);
}

._default_avmy7_33._danger_avmy7_53 button {
  background-color: var(--figma-color-bg-danger);
  color: var(--figma-color-text-ondanger);
}
._default_avmy7_33._danger_avmy7_53:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-danger-strong);
}
._default_avmy7_33._danger_avmy7_53:not(._disabled_avmy7_11) button:active {
  background-color: var(--figma-color-bg-danger-pressed);
}
._default_avmy7_33._danger_avmy7_53._disabled_avmy7_11 button {
  background-color: var(--figma-color-bg-disabled);
  color: var(--figma-color-text-ondisabled);
}

._secondary_avmy7_68 button {
  border-color: var(--figma-color-border);
  background-color: transparent;
  color: var(--figma-color-text);
}
._secondary_avmy7_68:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-selected);
}
._secondary_avmy7_68:not(._disabled_avmy7_11) button:active {
  background-color: var(--figma-color-bg-pressed);
}
._secondary_avmy7_68._disabled_avmy7_11 button {
  border-color: var(--figma-color-border-disabled);
  color: var(--figma-color-text-disabled);
}

._secondary_avmy7_68._danger_avmy7_53 button {
  border-color: var(--figma-color-border-danger);
  color: var(--figma-color-text-danger);
}
._secondary_avmy7_68._danger_avmy7_53:not(._disabled_avmy7_11) button:focus {
  border-color: var(--figma-color-border-danger-strong);
}
._secondary_avmy7_68._danger_avmy7_53._disabled_avmy7_11 button {
  border-color: var(--figma-color-border-disabled-strong);
  color: var(--figma-color-text-disabled);
}

._loadingIndicator_avmy7_96 {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

._default_avmy7_33 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-onbrand);
}
._default_avmy7_33._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-ondisabled);
}

._default_avmy7_33._danger_avmy7_53 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-ondanger);
}
._default_avmy7_33._danger_avmy7_53._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-icon-ondisabled);
}

._secondary_avmy7_68 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text);
}
._secondary_avmy7_68._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text-disabled);
}

._secondary_avmy7_68._danger_avmy7_53 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text-danger);
}
._secondary_avmy7_68._danger_avmy7_53._disabled_avmy7_11 ._loadingIndicator_avmy7_96 {
  color: var(--figma-color-text-disabled);
}

._children_avmy7_132 {
  display: inline;
  pointer-events: none;
}
._loading_avmy7_96 ._children_avmy7_132 {
  visibility: hidden;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9idXR0b24vYnV0dG9uLm1vZHVsZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7O0VBRUUsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLHFCQUFxQjtFQUNyQix1QkFBdUI7RUFDdkIsc0NBQXNDO0VBQ3RDLCtDQUErQztFQUMvQyxxQ0FBcUM7QUFDdkM7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLFdBQVc7RUFDWCx1QkFBdUI7RUFDdkIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLDZDQUE2QztFQUM3QyxzQ0FBc0M7QUFDeEM7O0FBRUE7RUFDRSwrQ0FBK0M7QUFDakQ7QUFDQTtFQUNFLG1FQUFtRTtBQUNyRTtBQUNBO0VBQ0UscURBQXFEO0FBQ3ZEO0FBQ0E7RUFDRSxnREFBZ0Q7RUFDaEQseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UsOENBQThDO0VBQzlDLHVDQUF1QztBQUN6QztBQUNBO0VBQ0UscURBQXFEO0FBQ3ZEO0FBQ0E7RUFDRSxzREFBc0Q7QUFDeEQ7QUFDQTtFQUNFLGdEQUFnRDtFQUNoRCx5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx1Q0FBdUM7RUFDdkMsNkJBQTZCO0VBQzdCLDhCQUE4QjtBQUNoQztBQUNBO0VBQ0UsZ0RBQWdEO0FBQ2xEO0FBQ0E7RUFDRSwrQ0FBK0M7QUFDakQ7QUFDQTtFQUNFLGdEQUFnRDtFQUNoRCx1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSw4Q0FBOEM7RUFDOUMscUNBQXFDO0FBQ3ZDO0FBQ0E7RUFDRSxxREFBcUQ7QUFDdkQ7QUFDQTtFQUNFLHVEQUF1RDtFQUN2RCx1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsUUFBUTtFQUNSLFNBQVM7RUFDVCxvQkFBb0I7RUFDcEIsZ0NBQWdDO0FBQ2xDOztBQUVBO0VBQ0Usc0NBQXNDO0FBQ3hDO0FBQ0E7RUFDRSx5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx1Q0FBdUM7QUFDekM7QUFDQTtFQUNFLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLDhCQUE4QjtBQUNoQztBQUNBO0VBQ0UsdUNBQXVDO0FBQ3pDOztBQUVBO0VBQ0UscUNBQXFDO0FBQ3ZDO0FBQ0E7RUFDRSx1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSxlQUFlO0VBQ2Ysb0JBQW9CO0FBQ3RCO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEIiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jb21wb25lbnRzL2J1dHRvbi9idXR0b24ubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5idXR0b24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMSk7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLmZ1bGxXaWR0aCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4uZGlzYWJsZWQsXG4uZGlzYWJsZWQgKiB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5idXR0b24gYnV0dG9uIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtMjQpO1xuICBwYWRkaW5nOiB2YXIoLS1zcGFjZS0wKSB2YXIoLS1zcGFjZS04KTtcbiAgYm9yZGVyOiB2YXIoLS1ib3JkZXItd2lkdGgtMSkgc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtNik7XG59XG5cbi5mdWxsV2lkdGggYnV0dG9uIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAxMDAlO1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cblxuLmRlZmF1bHQgYnV0dG9uIHtcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctYnJhbmQpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dC1vbmJyYW5kKTtcbn1cblxuLmRlZmF1bHQ6bm90KC5kaXNhYmxlZCkgYnV0dG9uOmZvY3VzIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItb25icmFuZCk7XG59XG4uZGVmYXVsdDpub3QoLmRpc2FibGVkKSBidXR0b246Zm9jdXMtdmlzaWJsZSB7XG4gIGJveC1zaGFkb3c6IDAgMCAwIHZhcigtLWJvcmRlci13aWR0aC0xKSB2YXIoLS1maWdtYS1jb2xvci1iZykgaW5zZXQ7XG59XG4uZGVmYXVsdDpub3QoLmRpc2FibGVkKSBidXR0b246YWN0aXZlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctYnJhbmQtcHJlc3NlZCk7XG59XG4uZGVmYXVsdC5kaXNhYmxlZCBidXR0b24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1kaXNhYmxlZCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LW9uZGlzYWJsZWQpO1xufVxuXG4uZGVmYXVsdC5kYW5nZXIgYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctZGFuZ2VyKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtb25kYW5nZXIpO1xufVxuLmRlZmF1bHQuZGFuZ2VyOm5vdCguZGlzYWJsZWQpIGJ1dHRvbjpmb2N1cyB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLWRhbmdlci1zdHJvbmcpO1xufVxuLmRlZmF1bHQuZGFuZ2VyOm5vdCguZGlzYWJsZWQpIGJ1dHRvbjphY3RpdmUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1kYW5nZXItcHJlc3NlZCk7XG59XG4uZGVmYXVsdC5kYW5nZXIuZGlzYWJsZWQgYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctZGlzYWJsZWQpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dC1vbmRpc2FibGVkKTtcbn1cblxuLnNlY29uZGFyeSBidXR0b24ge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlcik7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG4uc2Vjb25kYXJ5Om5vdCguZGlzYWJsZWQpIGJ1dHRvbjpmb2N1cyB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLXNlbGVjdGVkKTtcbn1cbi5zZWNvbmRhcnk6bm90KC5kaXNhYmxlZCkgYnV0dG9uOmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLXByZXNzZWQpO1xufVxuLnNlY29uZGFyeS5kaXNhYmxlZCBidXR0b24ge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1kaXNhYmxlZCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cblxuLnNlY29uZGFyeS5kYW5nZXIgYnV0dG9uIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItZGFuZ2VyKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtZGFuZ2VyKTtcbn1cbi5zZWNvbmRhcnkuZGFuZ2VyOm5vdCguZGlzYWJsZWQpIGJ1dHRvbjpmb2N1cyB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLWRhbmdlci1zdHJvbmcpO1xufVxuLnNlY29uZGFyeS5kYW5nZXIuZGlzYWJsZWQgYnV0dG9uIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItZGlzYWJsZWQtc3Ryb25nKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtZGlzYWJsZWQpO1xufVxuXG4ubG9hZGluZ0luZGljYXRvciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xufVxuXG4uZGVmYXVsdCAubG9hZGluZ0luZGljYXRvciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1pY29uLW9uYnJhbmQpO1xufVxuLmRlZmF1bHQuZGlzYWJsZWQgLmxvYWRpbmdJbmRpY2F0b3Ige1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1vbmRpc2FibGVkKTtcbn1cblxuLmRlZmF1bHQuZGFuZ2VyIC5sb2FkaW5nSW5kaWNhdG9yIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tb25kYW5nZXIpO1xufVxuLmRlZmF1bHQuZGFuZ2VyLmRpc2FibGVkIC5sb2FkaW5nSW5kaWNhdG9yIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tb25kaXNhYmxlZCk7XG59XG5cbi5zZWNvbmRhcnkgLmxvYWRpbmdJbmRpY2F0b3Ige1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG4uc2Vjb25kYXJ5LmRpc2FibGVkIC5sb2FkaW5nSW5kaWNhdG9yIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtZGlzYWJsZWQpO1xufVxuXG4uc2Vjb25kYXJ5LmRhbmdlciAubG9hZGluZ0luZGljYXRvciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRhbmdlcik7XG59XG4uc2Vjb25kYXJ5LmRhbmdlci5kaXNhYmxlZCAubG9hZGluZ0luZGljYXRvciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cblxuLmNoaWxkcmVuIHtcbiAgZGlzcGxheTogaW5saW5lO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cbi5sb2FkaW5nIC5jaGlsZHJlbiB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      button_module_default = { "button": "_button_avmy7_1", "fullWidth": "_fullWidth_avmy7_7", "disabled": "_disabled_avmy7_11", "default": "_default_avmy7_33", "danger": "_danger_avmy7_53", "secondary": "_secondary_avmy7_68", "loadingIndicator": "_loadingIndicator_avmy7_96", "children": "_children_avmy7_132", "loading": "_loading_avmy7_96" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/button/button.js
  var Button;
  var init_button = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/button/button.js"() {
      init_preact_module();
      init_hooks_module();
      init_create_class_name();
      init_create_component();
      init_no_op();
      init_loading_indicator();
      init_button_module();
      Button = createComponent(function(_a, ref) {
        var _b = _a, { children, danger = false, disabled = false, fullWidth = false, loading = false, onClick = noop, onKeyDown = noop, propagateEscapeKeyDown = true, secondary = false } = _b, rest = __objRest(_b, ["children", "danger", "disabled", "fullWidth", "loading", "onClick", "onKeyDown", "propagateEscapeKeyDown", "secondary"]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        return _(
          "div",
          { class: createClassName([
            button_module_default.button,
            secondary === true ? button_module_default.secondary : button_module_default.default,
            danger === true ? button_module_default.danger : null,
            fullWidth === true ? button_module_default.fullWidth : null,
            disabled === true ? button_module_default.disabled : null,
            loading === true ? button_module_default.loading : null
          ]) },
          _(
            "button",
            __spreadProps(__spreadValues({}, rest), { ref, disabled: disabled === true, onClick: loading === true ? void 0 : onClick, onKeyDown: handleKeyDown, tabIndex: 0 }),
            _("div", { class: button_module_default.children }, children)
          ),
          loading === true ? _(
            "div",
            { class: button_module_default.loadingIndicator },
            _(LoadingIndicator, null)
          ) : null
        );
      });
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/create-icon.js
  function createIcon(svg) {
    return createComponent(function(_a) {
      var _b = _a, { color } = _b, rest = __objRest(_b, ["color"]);
      return _("div", __spreadProps(__spreadValues({}, rest), { style: {
        color: typeof color === "undefined" ? "currentColor" : `var(--figma-color-icon-${color})`
      } }), svg);
    });
  }
  var init_create_icon = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/create-icon.js"() {
      init_preact_module();
      init_create_component();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-check-16.js
  var IconCheck16;
  var init_icon_check_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-check-16.js"() {
      init_preact_module();
      init_create_icon();
      IconCheck16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M11.7773 4.084c.2298.15317.2919.46361.1387.69337L7.91603 10.7774a.5002.5002 0 0 1-.36676.2202.5003.5003 0 0 1-.40282-.144l-3-3.00002c-.19527-.19527-.19527-.51185 0-.70711.19526-.19526.51184-.19526.7071 0L7.42229 9.7152 11.084 4.22267c.1532-.22976.4636-.29185.6933-.13867", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-mixed-16.js
  var IconMixed16;
  var init_icon_mixed_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-mixed-16.js"() {
      init_preact_module();
      init_create_icon();
      IconMixed16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { d: "M4 8c0-.27614.22386-.5.5-.5h7c.2761 0 .5.22386.5.5s-.2239.5-.5.5h-7c-.27614 0-.5-.22386-.5-.5", fill: "currentColor" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/get-current-from-ref.js
  function getCurrentFromRef(ref) {
    if (ref.current === null) {
      throw new Error("`ref.current` is `undefined`");
    }
    return ref.current;
  }
  var init_get_current_from_ref = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/get-current-from-ref.js"() {
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/8254e355-5e7c-467d-9d70-c7db81d6f9a2/checkbox.module.js
  var checkbox_module_default;
  var init_checkbox_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/8254e355-5e7c-467d-9d70-c7db81d6f9a2/checkbox.module.js"() {
      if (document.getElementById("931ef78339") === null) {
        const element = document.createElement("style");
        element.id = "931ef78339";
        element.textContent = `._checkbox_9p65z_1 {
  position: relative;
  z-index: var(--z-index-1);
  display: flex;
  gap: var(--space-8);
}

._disabled_9p65z_8,
._disabled_9p65z_8 * {
  cursor: not-allowed;
}

._input_9p65z_13 {
  position: absolute;
  z-index: var(
    --z-index-1
  ); /* stack \`.input\` over all other elements within \`.checkbox\` */
  top: calc(-1 * var(--space-8));
  right: calc(-1 * var(--space-8));
  bottom: calc(-1 * var(--space-8));
  left: calc(-1 * var(--space-8));
  display: block;
}

._box_9p65z_25 {
  position: relative;
  width: var(--space-16);
  height: var(--space-16);
  border: var(--border-width-1) solid var(--figma-color-border);
  border-radius: var(--border-radius-4);
  background-color: var(--figma-color-bg-secondary);
}
._checkbox_9p65z_1:not(._disabled_9p65z_8) ._input_9p65z_13:focus-visible ~ ._box_9p65z_25 {
  box-shadow: 0 0 0 var(--border-width-1) var(--figma-color-bg) inset;
}
._checkbox_9p65z_1:not(._disabled_9p65z_8) ._input_9p65z_13:focus ~ ._box_9p65z_25 {
  border-color: var(--figma-color-border-selected);
}
._checkbox_9p65z_1:not(._disabled_9p65z_8) ._input_9p65z_13:checked ~ ._box_9p65z_25,
._checkbox_9p65z_1:not(._disabled_9p65z_8) ._input_9p65z_13:indeterminate ~ ._box_9p65z_25 {
  border-color: var(--figma-color-border-brand-strong);
  background-color: var(--figma-color-bg-brand);
}

._disabled_9p65z_8 ._input_9p65z_13 ~ ._box_9p65z_25 {
  background-color: transparent;
}
._disabled_9p65z_8 ._input_9p65z_13:checked ~ ._box_9p65z_25,
._disabled_9p65z_8 ._input_9p65z_13:indeterminate ~ ._box_9p65z_25 {
  border-color: transparent;
  background-color: var(--figma-color-bg-disabled);
}

._icon_9p65z_54 {
  position: absolute;
  top: calc(-1 * var(--border-width-1));
  left: calc(-1 * var(--border-width-1));
  color: var(--figma-color-icon-onbrand);
}

._children_9p65z_61 {
  flex: 1;
  padding-top: var(--space-4);
  color: var(--figma-color-text);
}
._disabled_9p65z_8 ._children_9p65z_61 {
  opacity: var(--opacity-30);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9jaGVja2JveC9jaGVja2JveC5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixhQUFhO0VBQ2IsbUJBQW1CO0FBQ3JCOztBQUVBOztFQUVFLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQjs7R0FFQyxFQUFFLDhEQUE4RDtFQUNqRSw4QkFBOEI7RUFDOUIsZ0NBQWdDO0VBQ2hDLGlDQUFpQztFQUNqQywrQkFBK0I7RUFDL0IsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixzQkFBc0I7RUFDdEIsdUJBQXVCO0VBQ3ZCLDZEQUE2RDtFQUM3RCxxQ0FBcUM7RUFDckMsaURBQWlEO0FBQ25EO0FBQ0E7RUFDRSxtRUFBbUU7QUFDckU7QUFDQTtFQUNFLGdEQUFnRDtBQUNsRDtBQUNBOztFQUVFLG9EQUFvRDtFQUNwRCw2Q0FBNkM7QUFDL0M7O0FBRUE7RUFDRSw2QkFBNkI7QUFDL0I7QUFDQTs7RUFFRSx5QkFBeUI7RUFDekIsZ0RBQWdEO0FBQ2xEOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLHFDQUFxQztFQUNyQyxzQ0FBc0M7RUFDdEMsc0NBQXNDO0FBQ3hDOztBQUVBO0VBQ0UsT0FBTztFQUNQLDJCQUEyQjtFQUMzQiw4QkFBOEI7QUFDaEM7QUFDQTtFQUNFLDBCQUEwQjtBQUM1QiIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2NvbXBvbmVudHMvY2hlY2tib3gvY2hlY2tib3gubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jaGVja2JveCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogdmFyKC0tei1pbmRleC0xKTtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiB2YXIoLS1zcGFjZS04KTtcbn1cblxuLmRpc2FibGVkLFxuLmRpc2FibGVkICoge1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4uaW5wdXQge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IHZhcihcbiAgICAtLXotaW5kZXgtMVxuICApOyAvKiBzdGFjayBgLmlucHV0YCBvdmVyIGFsbCBvdGhlciBlbGVtZW50cyB3aXRoaW4gYC5jaGVja2JveGAgKi9cbiAgdG9wOiBjYWxjKC0xICogdmFyKC0tc3BhY2UtOCkpO1xuICByaWdodDogY2FsYygtMSAqIHZhcigtLXNwYWNlLTgpKTtcbiAgYm90dG9tOiBjYWxjKC0xICogdmFyKC0tc3BhY2UtOCkpO1xuICBsZWZ0OiBjYWxjKC0xICogdmFyKC0tc3BhY2UtOCkpO1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLmJveCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6IHZhcigtLXNwYWNlLTE2KTtcbiAgaGVpZ2h0OiB2YXIoLS1zcGFjZS0xNik7XG4gIGJvcmRlcjogdmFyKC0tYm9yZGVyLXdpZHRoLTEpIHNvbGlkIHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlcik7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtNCk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLXNlY29uZGFyeSk7XG59XG4uY2hlY2tib3g6bm90KC5kaXNhYmxlZCkgLmlucHV0OmZvY3VzLXZpc2libGUgfiAuYm94IHtcbiAgYm94LXNoYWRvdzogMCAwIDAgdmFyKC0tYm9yZGVyLXdpZHRoLTEpIHZhcigtLWZpZ21hLWNvbG9yLWJnKSBpbnNldDtcbn1cbi5jaGVja2JveDpub3QoLmRpc2FibGVkKSAuaW5wdXQ6Zm9jdXMgfiAuYm94IHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItc2VsZWN0ZWQpO1xufVxuLmNoZWNrYm94Om5vdCguZGlzYWJsZWQpIC5pbnB1dDpjaGVja2VkIH4gLmJveCxcbi5jaGVja2JveDpub3QoLmRpc2FibGVkKSAuaW5wdXQ6aW5kZXRlcm1pbmF0ZSB+IC5ib3gge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1icmFuZC1zdHJvbmcpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1iZy1icmFuZCk7XG59XG5cbi5kaXNhYmxlZCAuaW5wdXQgfiAuYm94IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG4uZGlzYWJsZWQgLmlucHV0OmNoZWNrZWQgfiAuYm94LFxuLmRpc2FibGVkIC5pbnB1dDppbmRldGVybWluYXRlIH4gLmJveCB7XG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLWRpc2FibGVkKTtcbn1cblxuLmljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogY2FsYygtMSAqIHZhcigtLWJvcmRlci13aWR0aC0xKSk7XG4gIGxlZnQ6IGNhbGMoLTEgKiB2YXIoLS1ib3JkZXItd2lkdGgtMSkpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1vbmJyYW5kKTtcbn1cblxuLmNoaWxkcmVuIHtcbiAgZmxleDogMTtcbiAgcGFkZGluZy10b3A6IHZhcigtLXNwYWNlLTQpO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG59XG4uZGlzYWJsZWQgLmNoaWxkcmVuIHtcbiAgb3BhY2l0eTogdmFyKC0tb3BhY2l0eS0zMCk7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      checkbox_module_default = { "checkbox": "_checkbox_9p65z_1", "disabled": "_disabled_9p65z_8", "input": "_input_9p65z_13", "box": "_box_9p65z_25", "icon": "_icon_9p65z_54", "children": "_children_9p65z_61" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/checkbox/checkbox.js
  var Checkbox;
  var init_checkbox = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/checkbox/checkbox.js"() {
      init_lib();
      init_preact_module();
      init_hooks_module();
      init_icon_check_16();
      init_icon_mixed_16();
      init_create_class_name();
      init_create_component();
      init_get_current_from_ref();
      init_no_op();
      init_checkbox_module();
      Checkbox = createComponent(function(_a, ref) {
        var _b = _a, { children, disabled = false, onChange = noop, onKeyDown = noop, onValueChange = noop, propagateEscapeKeyDown = true, value } = _b, rest = __objRest(_b, ["children", "disabled", "onChange", "onKeyDown", "onValueChange", "propagateEscapeKeyDown", "value"]);
        const inputElementRef = A2(null);
        const handleChange = q2(function(event) {
          onChange(event);
          const newValue = event.currentTarget.checked === true;
          onValueChange(newValue);
        }, [onChange, onValueChange]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        y2(function() {
          const inputElement = getCurrentFromRef(inputElementRef);
          inputElement.indeterminate = value === MIXED_BOOLEAN ? true : false;
        }, [value]);
        const refCallback = q2(function(inputElement) {
          inputElementRef.current = inputElement;
          if (ref === null) {
            return;
          }
          if (typeof ref === "function") {
            ref(inputElement);
            return;
          }
          ref.current = inputElement;
        }, [ref]);
        return _(
          "label",
          { class: createClassName([
            checkbox_module_default.checkbox,
            disabled === true ? checkbox_module_default.disabled : null,
            value === MIXED_BOOLEAN ? checkbox_module_default.mixed : null
          ]) },
          _("input", __spreadProps(__spreadValues({}, rest), { ref: refCallback, checked: value === true, class: checkbox_module_default.input, disabled: disabled === true, onChange: handleChange, onKeyDown: handleKeyDown, tabIndex: 0, type: "checkbox" })),
          _("div", { class: checkbox_module_default.box }, value === MIXED_BOOLEAN ? _(
            "div",
            { class: checkbox_module_default.icon },
            _(IconMixed16, null)
          ) : value === true ? _(
            "div",
            { class: checkbox_module_default.icon },
            _(IconCheck16, null)
          ) : null),
          _("div", { class: checkbox_module_default.children }, children)
        );
      });
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/306c6e5c-a6d1-43f5-8ace-d39bd45af694/menu.module.js
  var menu_module_default;
  var init_menu_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/306c6e5c-a6d1-43f5-8ace-d39bd45af694/menu.module.js"() {
      if (document.getElementById("208e501b67") === null) {
        const element = document.createElement("style");
        element.id = "208e501b67";
        element.textContent = `._menu_1f0pn_1 {
  position: absolute;
  z-index: var(--z-index-2);
  left: 0;
  min-width: 100%;
  padding: var(--space-8);
  border-radius: var(--border-radius-12);
  background-color: var(--color-bg-menu);
  box-shadow: var(--box-shadow-menu);
  color: var(--figma-color-text-onbrand);
  font-size: var(--font-size-12);
  overflow-y: auto;
}
._menu_1f0pn_1::-webkit-scrollbar {
  display: none;
}
._menu_1f0pn_1:empty {
  display: none;
}

._hidden_1f0pn_21 {
  position: fixed;
  pointer-events: none;
  visibility: hidden;
}

@media screen and (-webkit-min-device-pixel-ratio: 1.5),
  screen and (min-resolution: 1.5dppx) {
  ._menu_1f0pn_1 {
    -webkit-font-smoothing: antialiased;
  }
}

._optionHeader_1f0pn_34,
._optionValue_1f0pn_35 {
  overflow: hidden;
  padding: var(--space-4) var(--space-12) var(--space-4) var(--space-28);
  text-overflow: ellipsis;
  white-space: nowrap;
}

._optionHeader_1f0pn_34 {
  color: rgba(255, 255, 255, 0.7); /* FIXME */
  font-size: var(--font-size-12);
}

._optionValue_1f0pn_35 {
  position: relative;
  border-radius: var(--border-radius-4);
}
._optionValueSelected_1f0pn_51 {
  background-color: var(--figma-color-bg-brand);
}
._optionValueDisabled_1f0pn_54 {
  color: rgba(255, 255, 255, 0.4); /* FIXME */
}

._optionSeparator_1f0pn_58 {
  width: 100%;
  height: 1px;
  margin: var(--space-extra-small) 0;
  background-color: #444444; /* FIXME */
}

._input_1f0pn_65 {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
}

._checkIcon_1f0pn_76 {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY3NzL21lbnUubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFrQjtFQUNsQix5QkFBeUI7RUFDekIsT0FBTztFQUNQLGVBQWU7RUFDZix1QkFBdUI7RUFDdkIsc0NBQXNDO0VBQ3RDLHNDQUFzQztFQUN0QyxrQ0FBa0M7RUFDbEMsc0NBQXNDO0VBQ3RDLDhCQUE4QjtFQUM5QixnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLGFBQWE7QUFDZjtBQUNBO0VBQ0UsYUFBYTtBQUNmOztBQUVBO0VBQ0UsZUFBZTtFQUNmLG9CQUFvQjtFQUNwQixrQkFBa0I7QUFDcEI7O0FBRUE7O0VBRUU7SUFDRSxtQ0FBbUM7RUFDckM7QUFDRjs7QUFFQTs7RUFFRSxnQkFBZ0I7RUFDaEIsc0VBQXNFO0VBQ3RFLHVCQUF1QjtFQUN2QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSwrQkFBK0IsRUFBRSxVQUFVO0VBQzNDLDhCQUE4QjtBQUNoQzs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixxQ0FBcUM7QUFDdkM7QUFDQTtFQUNFLDZDQUE2QztBQUMvQztBQUNBO0VBQ0UsK0JBQStCLEVBQUUsVUFBVTtBQUM3Qzs7QUFFQTtFQUNFLFdBQVc7RUFDWCxXQUFXO0VBQ1gsa0NBQWtDO0VBQ2xDLHlCQUF5QixFQUFFLFVBQVU7QUFDdkM7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLFFBQVE7RUFDUixTQUFTO0VBQ1QsT0FBTztFQUNQLGNBQWM7RUFDZCxXQUFXO0VBQ1gsWUFBWTtBQUNkOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLG1CQUFtQjtFQUNuQixvQkFBb0I7QUFDdEIiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jc3MvbWVudS5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLm1lbnUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMik7XG4gIGxlZnQ6IDA7XG4gIG1pbi13aWR0aDogMTAwJTtcbiAgcGFkZGluZzogdmFyKC0tc3BhY2UtOCk7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtMTIpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvci1iZy1tZW51KTtcbiAgYm94LXNoYWRvdzogdmFyKC0tYm94LXNoYWRvdy1tZW51KTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtb25icmFuZCk7XG4gIGZvbnQtc2l6ZTogdmFyKC0tZm9udC1zaXplLTEyKTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbn1cbi5tZW51Ojotd2Via2l0LXNjcm9sbGJhciB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG4ubWVudTplbXB0eSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi5oaWRkZW4ge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG59XG5cbkBtZWRpYSBzY3JlZW4gYW5kICgtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXG4gIHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAxLjVkcHB4KSB7XG4gIC5tZW51IHtcbiAgICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcbiAgfVxufVxuXG4ub3B0aW9uSGVhZGVyLFxuLm9wdGlvblZhbHVlIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgcGFkZGluZzogdmFyKC0tc3BhY2UtNCkgdmFyKC0tc3BhY2UtMTIpIHZhcigtLXNwYWNlLTQpIHZhcigtLXNwYWNlLTI4KTtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG5cbi5vcHRpb25IZWFkZXIge1xuICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpOyAvKiBGSVhNRSAqL1xuICBmb250LXNpemU6IHZhcigtLWZvbnQtc2l6ZS0xMik7XG59XG5cbi5vcHRpb25WYWx1ZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cy00KTtcbn1cbi5vcHRpb25WYWx1ZVNlbGVjdGVkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctYnJhbmQpO1xufVxuLm9wdGlvblZhbHVlRGlzYWJsZWQge1xuICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjQpOyAvKiBGSVhNRSAqL1xufVxuXG4ub3B0aW9uU2VwYXJhdG9yIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMXB4O1xuICBtYXJnaW46IHZhcigtLXNwYWNlLWV4dHJhLXNtYWxsKSAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNDQ0NDQ0OyAvKiBGSVhNRSAqL1xufVxuXG4uaW5wdXQge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5jaGVja0ljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogdmFyKC0tc3BhY2UtNCk7XG4gIGxlZnQ6IHZhcigtLXNwYWNlLTQpO1xufVxuIl19 */`;
        document.head.append(element);
      }
      menu_module_default = { "menu": "_menu_1f0pn_1", "hidden": "_hidden_1f0pn_21", "optionHeader": "_optionHeader_1f0pn_34", "optionValue": "_optionValue_1f0pn_35", "optionValueSelected": "_optionValueSelected_1f0pn_51", "optionValueDisabled": "_optionValueDisabled_1f0pn_54", "optionSeparator": "_optionSeparator_1f0pn_58", "input": "_input_1f0pn_65", "checkIcon": "_checkIcon_1f0pn_76" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/hooks/use-mouse-down-outside.js
  function useMouseDownOutside(options) {
    const { ref, onMouseDownOutside } = options;
    y2(function() {
      function handleBlur() {
        onMouseDownOutside();
      }
      function handleMouseDown(event) {
        const element = getCurrentFromRef(ref);
        if (element === event.target || element.contains(event.target)) {
          return;
        }
        onMouseDownOutside();
      }
      window.addEventListener("blur", handleBlur);
      window.addEventListener("mousedown", handleMouseDown);
      return function() {
        window.removeEventListener("blur", handleBlur);
        window.removeEventListener("mousedown", handleMouseDown);
      };
    }, [ref, onMouseDownOutside]);
  }
  var init_use_mouse_down_outside = __esm({
    "node_modules/@create-figma-plugin/ui/lib/hooks/use-mouse-down-outside.js"() {
      init_hooks_module();
      init_get_current_from_ref();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/hooks/use-scrollable-menu.js
  function useScrollableMenu(options) {
    const { itemIdDataAttributeName, menuElementRef, selectedId, setSelectedId } = options;
    const getItemElements = q2(function() {
      return Array.from(getCurrentFromRef(menuElementRef).querySelectorAll(`[${itemIdDataAttributeName}]`)).filter(function(element) {
        return element.hasAttribute("disabled") === false;
      });
    }, [itemIdDataAttributeName, menuElementRef]);
    const findIndexByItemId = q2(function(id) {
      if (id === null) {
        return -1;
      }
      const index = getItemElements().findIndex(function(element) {
        return element.getAttribute(itemIdDataAttributeName) === id;
      });
      if (index === -1) {
        throw new Error("`index` is `-1`");
      }
      return index;
    }, [getItemElements, itemIdDataAttributeName]);
    const updateScrollPosition = q2(function(id) {
      const itemElements = getItemElements();
      const index = findIndexByItemId(id);
      const selectedElement = itemElements[index];
      const selectedElementOffsetTop = selectedElement.getBoundingClientRect().top;
      const menuElement = getCurrentFromRef(menuElementRef);
      const menuElementOffsetTop = menuElement.getBoundingClientRect().top;
      if (selectedElementOffsetTop < menuElementOffsetTop) {
        selectedElement.scrollIntoView();
        return;
      }
      const offsetBottom = selectedElementOffsetTop + selectedElement.offsetHeight;
      if (offsetBottom > menuElementOffsetTop + menuElement.offsetHeight) {
        selectedElement.scrollIntoView();
      }
    }, [findIndexByItemId, getItemElements, menuElementRef]);
    const handleScrollableMenuKeyDown = q2(function(event) {
      const key = event.key;
      if (key === "ArrowDown" || key === "ArrowUp") {
        const itemElements = getItemElements();
        const index = findIndexByItemId(selectedId);
        let newIndex;
        if (key === "ArrowDown") {
          newIndex = index === -1 || index === itemElements.length - 1 ? 0 : index + 1;
        } else {
          newIndex = index === -1 || index === 0 ? itemElements.length - 1 : index - 1;
        }
        const selectedElement = itemElements[newIndex];
        const newSelectedId = selectedElement.getAttribute(itemIdDataAttributeName);
        setSelectedId(newSelectedId);
        updateScrollPosition(newSelectedId);
      }
    }, [
      getItemElements,
      findIndexByItemId,
      itemIdDataAttributeName,
      setSelectedId,
      selectedId,
      updateScrollPosition
    ]);
    const handleScrollableMenuItemMouseMove = q2(function(event) {
      const id = event.currentTarget.getAttribute(itemIdDataAttributeName);
      if (id !== selectedId) {
        setSelectedId(id);
      }
    }, [itemIdDataAttributeName, selectedId, setSelectedId]);
    return {
      handleScrollableMenuItemMouseMove,
      handleScrollableMenuKeyDown
    };
  }
  var init_use_scrollable_menu = __esm({
    "node_modules/@create-figma-plugin/ui/lib/hooks/use-scrollable-menu.js"() {
      init_hooks_module();
      init_get_current_from_ref();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-chevron-down-16.js
  var IconChevronDown16;
  var init_icon_chevron_down_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-chevron-down-16.js"() {
      init_preact_module();
      init_create_icon();
      IconChevronDown16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M10.4751 7.47486c.1953-.19526.1953-.51184 0-.70711-.1953-.19526-.51184-.19526-.7071 0L8.00023 8.53552 6.23246 6.76775c-.19526-.19526-.51184-.19526-.70711 0-.19526.19527-.19526.51185 0 .70711l2.12133 2.12132.35355.35355.35355-.35355z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/private/constants.js
  var INVALID_ID, VIEWPORT_MARGIN, ITEM_ID_DATA_ATTRIBUTE_NAME;
  var init_constants = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/private/constants.js"() {
      INVALID_ID = null;
      VIEWPORT_MARGIN = 12;
      ITEM_ID_DATA_ATTRIBUTE_NAME = "data-item-id";
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/b3151fdd-7855-4c18-8d0f-0b7e25e6ebd2/dropdown.module.js
  var dropdown_module_default;
  var init_dropdown_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/b3151fdd-7855-4c18-8d0f-0b7e25e6ebd2/dropdown.module.js"() {
      if (document.getElementById("a12e202715") === null) {
        const element = document.createElement("style");
        element.id = "a12e202715";
        element.textContent = `._dropdown_i81qm_1 {
  position: relative;
  z-index: var(--z-index-1);
  display: flex;
  width: 100%;
  min-width: 0; /* See https://css-tricks.com/flexbox-truncated-text/ */
  height: var(--space-24);
  align-items: center;
  border: var(--border-width-1) solid var(--figma-color-border);
  border-radius: var(--border-radius-4);
  color: var(--figma-color-text);
}

._dropdown_i81qm_1:not(._disabled_i81qm_14):focus-visible {
  border-color: var(--figma-color-border-selected);
}
._dropdown_i81qm_1:not(._disabled_i81qm_14):focus-within {
  z-index: var(--z-index-2); /* stack \`.dropdown\` over its sibling elements */
  outline: 0;
}

._disabled_i81qm_14,
._disabled_i81qm_14 * {
  cursor: not-allowed;
}

._menu_i81qm_27 {
  position: fixed;
}

._icon_i81qm_31 {
  position: absolute;
  top: 50%;
  left: var(--space-12);
  color: var(--figma-color-icon-secondary);
  pointer-events: none;
  text-align: center;
  transform: translate(-50%, -50%);
}
._disabled_i81qm_14 ._icon_i81qm_31 {
  color: var(--figma-color-icon-disabled);
}

._empty_i81qm_44,
._placeholder_i81qm_45,
._value_i81qm_46 {
  flex-grow: 1;
}

._value_i81qm_46,
._placeholder_i81qm_45 {
  overflow: hidden;
  padding-left: calc(var(--space-8) - var(--border-width-1));
  text-overflow: ellipsis;
  white-space: nowrap;
}
._hasIcon_i81qm_57 ._value_i81qm_46,
._hasIcon_i81qm_57 ._placeholder_i81qm_45 {
  padding-left: calc(var(--space-24) - var(--border-width-1));
}
._placeholder_i81qm_45 {
  color: var(--figma-color-text-tertiary);
}

._disabled_i81qm_14 ._value_i81qm_46 {
  color: var(--figma-color-text-disabled);
}

._chevronIcon_i81qm_69 {
  padding-right: var(--space-4);
  color: var(--figma-color-icon);
}
._disabled_i81qm_14 ._chevronIcon_i81qm_69 {
  color: var(--figma-color-icon-disabled);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9kcm9wZG93bi9kcm9wZG93bi5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixhQUFhO0VBQ2IsV0FBVztFQUNYLFlBQVksRUFBRSx1REFBdUQ7RUFDckUsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQiw2REFBNkQ7RUFDN0QscUNBQXFDO0VBQ3JDLDhCQUE4QjtBQUNoQzs7QUFFQTtFQUNFLGdEQUFnRDtBQUNsRDtBQUNBO0VBQ0UseUJBQXlCLEVBQUUsZ0RBQWdEO0VBQzNFLFVBQVU7QUFDWjs7QUFFQTs7RUFFRSxtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLFFBQVE7RUFDUixxQkFBcUI7RUFDckIsd0NBQXdDO0VBQ3hDLG9CQUFvQjtFQUNwQixrQkFBa0I7RUFDbEIsZ0NBQWdDO0FBQ2xDO0FBQ0E7RUFDRSx1Q0FBdUM7QUFDekM7O0FBRUE7OztFQUdFLFlBQVk7QUFDZDs7QUFFQTs7RUFFRSxnQkFBZ0I7RUFDaEIsMERBQTBEO0VBQzFELHVCQUF1QjtFQUN2QixtQkFBbUI7QUFDckI7QUFDQTs7RUFFRSwyREFBMkQ7QUFDN0Q7QUFDQTtFQUNFLHVDQUF1QztBQUN6Qzs7QUFFQTtFQUNFLHVDQUF1QztBQUN6Qzs7QUFFQTtFQUNFLDZCQUE2QjtFQUM3Qiw4QkFBOEI7QUFDaEM7QUFDQTtFQUNFLHVDQUF1QztBQUN6QyIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2NvbXBvbmVudHMvZHJvcGRvd24vZHJvcGRvd24ubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5kcm9wZG93biB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogdmFyKC0tei1pbmRleC0xKTtcbiAgZGlzcGxheTogZmxleDtcbiAgd2lkdGg6IDEwMCU7XG4gIG1pbi13aWR0aDogMDsgLyogU2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZmxleGJveC10cnVuY2F0ZWQtdGV4dC8gKi9cbiAgaGVpZ2h0OiB2YXIoLS1zcGFjZS0yNCk7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlcjogdmFyKC0tYm9yZGVyLXdpZHRoLTEpIHNvbGlkIHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlcik7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtNCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0KTtcbn1cblxuLmRyb3Bkb3duOm5vdCguZGlzYWJsZWQpOmZvY3VzLXZpc2libGUge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1zZWxlY3RlZCk7XG59XG4uZHJvcGRvd246bm90KC5kaXNhYmxlZCk6Zm9jdXMtd2l0aGluIHtcbiAgei1pbmRleDogdmFyKC0tei1pbmRleC0yKTsgLyogc3RhY2sgYC5kcm9wZG93bmAgb3ZlciBpdHMgc2libGluZyBlbGVtZW50cyAqL1xuICBvdXRsaW5lOiAwO1xufVxuXG4uZGlzYWJsZWQsXG4uZGlzYWJsZWQgKiB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5tZW51IHtcbiAgcG9zaXRpb246IGZpeGVkO1xufVxuXG4uaWNvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IHZhcigtLXNwYWNlLTEyKTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tc2Vjb25kYXJ5KTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG59XG4uZGlzYWJsZWQgLmljb24ge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1kaXNhYmxlZCk7XG59XG5cbi5lbXB0eSxcbi5wbGFjZWhvbGRlcixcbi52YWx1ZSB7XG4gIGZsZXgtZ3JvdzogMTtcbn1cblxuLnZhbHVlLFxuLnBsYWNlaG9sZGVyIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgcGFkZGluZy1sZWZ0OiBjYWxjKHZhcigtLXNwYWNlLTgpIC0gdmFyKC0tYm9yZGVyLXdpZHRoLTEpKTtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG4uaGFzSWNvbiAudmFsdWUsXG4uaGFzSWNvbiAucGxhY2Vob2xkZXIge1xuICBwYWRkaW5nLWxlZnQ6IGNhbGModmFyKC0tc3BhY2UtMjQpIC0gdmFyKC0tYm9yZGVyLXdpZHRoLTEpKTtcbn1cbi5wbGFjZWhvbGRlciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LXRlcnRpYXJ5KTtcbn1cblxuLmRpc2FibGVkIC52YWx1ZSB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cblxuLmNoZXZyb25JY29uIHtcbiAgcGFkZGluZy1yaWdodDogdmFyKC0tc3BhY2UtNCk7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1pY29uKTtcbn1cbi5kaXNhYmxlZCAuY2hldnJvbkljb24ge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbi1kaXNhYmxlZCk7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      dropdown_module_default = { "dropdown": "_dropdown_i81qm_1", "disabled": "_disabled_i81qm_14", "menu": "_menu_i81qm_27", "icon": "_icon_i81qm_31", "empty": "_empty_i81qm_44", "placeholder": "_placeholder_i81qm_45", "value": "_value_i81qm_46", "hasIcon": "_hasIcon_i81qm_57", "chevronIcon": "_chevronIcon_i81qm_69" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/dropdown/private/update-menu-element-layout.js
  function updateMenuElementLayout(rootElement, menuElement, selectedId) {
    const rootElementBoundingClientRect = rootElement.getBoundingClientRect();
    const rootWidth = rootElement.offsetWidth;
    const rootHeight = rootElement.offsetHeight;
    const rootLeft = rootElementBoundingClientRect.left;
    const rootTop = rootElementBoundingClientRect.top;
    menuElement.style.minWidth = `${rootWidth}px`;
    const menuElementMaxWidth = window.innerWidth - 2 * VIEWPORT_MARGIN;
    menuElement.style.maxWidth = `${menuElementMaxWidth}px`;
    const menuElementMaxHeight = window.innerHeight - 2 * VIEWPORT_MARGIN;
    menuElement.style.maxHeight = `${menuElementMaxHeight}px`;
    const menuWidth = menuElement.offsetWidth;
    const menuHeight = menuElement.offsetHeight;
    const menuScrollHeight = menuElement.scrollHeight;
    const menuPaddingTop = parseInt(window.getComputedStyle(menuElement).paddingTop, 10);
    const labelElement = getSelectedLabelElement(menuElement, selectedId);
    const left = computeLeft({
      menuWidth,
      rootLeft
    });
    menuElement.style.left = `${left}px`;
    const top = computeTop({
      menuHeight,
      rootTop,
      selectedTop: labelElement.offsetTop
    });
    menuElement.style.top = `${top}px`;
    const isScrollable = menuScrollHeight > menuHeight;
    if (isScrollable === false) {
      return;
    }
    menuElement.scrollTop = computeScrollTop({
      menuHeight,
      menuPaddingTop,
      menuScrollHeight,
      rootHeight,
      rootTop,
      selectedTop: labelElement.offsetTop
    });
  }
  function getSelectedLabelElement(menuElement, selectedId) {
    const inputElement = menuElement.querySelector(selectedId === INVALID_ID ? `[${ITEM_ID_DATA_ATTRIBUTE_NAME}]` : `[${ITEM_ID_DATA_ATTRIBUTE_NAME}='${selectedId}']`);
    if (inputElement === null) {
      throw new Error("`inputElement` is `null`");
    }
    const labelElement = inputElement.parentElement;
    if (labelElement === null) {
      throw new Error("`labelElement` is `null`");
    }
    return labelElement;
  }
  function computeLeft(options) {
    const { menuWidth, rootLeft } = options;
    if (rootLeft <= VIEWPORT_MARGIN) {
      return VIEWPORT_MARGIN;
    }
    const viewportWidth = window.innerWidth;
    if (rootLeft + menuWidth > viewportWidth - VIEWPORT_MARGIN) {
      return viewportWidth - VIEWPORT_MARGIN - menuWidth;
    }
    return rootLeft;
  }
  function computeTop(options) {
    const { menuHeight, rootTop, selectedTop } = options;
    const viewportHeight = window.innerHeight;
    if (rootTop <= VIEWPORT_MARGIN || menuHeight === viewportHeight - 2 * VIEWPORT_MARGIN) {
      return VIEWPORT_MARGIN;
    }
    const top = rootTop - selectedTop;
    const minimumTop = VIEWPORT_MARGIN;
    const maximumTop = viewportHeight - VIEWPORT_MARGIN - menuHeight;
    return restrictToRange(top, minimumTop, maximumTop);
  }
  function computeScrollTop(options) {
    const { menuHeight, menuPaddingTop, menuScrollHeight, rootHeight, rootTop, selectedTop } = options;
    const restrictedRootTop = restrictToRange(rootTop, VIEWPORT_MARGIN, window.innerHeight - VIEWPORT_MARGIN - rootHeight + menuPaddingTop / 2);
    const scrollTop = selectedTop - (restrictedRootTop - VIEWPORT_MARGIN);
    const minimumScrollTop = 0;
    const maximumScrollTop = menuScrollHeight - menuHeight;
    return restrictToRange(scrollTop, minimumScrollTop, maximumScrollTop);
  }
  function restrictToRange(number, minimum, maximum) {
    return Math.min(Math.max(number, minimum), maximum);
  }
  var init_update_menu_element_layout = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/dropdown/private/update-menu-element-layout.js"() {
      init_constants();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/dropdown/dropdown.js
  function getDropdownOptionValue(option) {
    if (typeof option !== "string") {
      if ("text" in option) {
        return option.text;
      }
      if ("value" in option) {
        return option.value;
      }
    }
    throw new Error("Invariant violation");
  }
  function findOptionIndexByValue(options, value) {
    if (value === null) {
      return -1;
    }
    let index = 0;
    for (const option of options) {
      if (typeof option !== "string" && "value" in option && option.value === value) {
        return index;
      }
      index += 1;
    }
    return -1;
  }
  var Dropdown;
  var init_dropdown = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/dropdown/dropdown.js"() {
      init_preact_module();
      init_compat_module();
      init_hooks_module();
      init_menu_module();
      init_use_mouse_down_outside();
      init_use_scrollable_menu();
      init_icon_check_16();
      init_icon_chevron_down_16();
      init_create_class_name();
      init_create_component();
      init_get_current_from_ref();
      init_no_op();
      init_constants();
      init_dropdown_module();
      init_update_menu_element_layout();
      Dropdown = createComponent(function(_a, ref) {
        var _b = _a, { disabled = false, icon, onChange = noop, onKeyDown = noop, onMouseDown = noop, onValueChange = noop, options, placeholder, propagateEscapeKeyDown = true, value } = _b, rest = __objRest(_b, ["disabled", "icon", "onChange", "onKeyDown", "onMouseDown", "onValueChange", "options", "placeholder", "propagateEscapeKeyDown", "value"]);
        if (typeof icon === "string" && icon.length !== 1) {
          throw new Error(`String \`icon\` must be a single character: "${icon}"`);
        }
        const rootElementRef = A2(null);
        const menuElementRef = A2(null);
        const [isMenuVisible, setIsMenuVisible] = d2(false);
        const index = findOptionIndexByValue(options, value);
        if (value !== null && index === -1) {
          throw new Error(`Invalid \`value\`: ${value}`);
        }
        const [selectedId, setSelectedId] = d2(index === -1 ? INVALID_ID : `${index}`);
        const children = typeof options[index] === "undefined" ? "" : getDropdownOptionValue(options[index]);
        const { handleScrollableMenuKeyDown, handleScrollableMenuItemMouseMove } = useScrollableMenu({
          itemIdDataAttributeName: ITEM_ID_DATA_ATTRIBUTE_NAME,
          menuElementRef,
          selectedId,
          setSelectedId
        });
        const triggerRootBlur = q2(function() {
          getCurrentFromRef(rootElementRef).blur();
        }, []);
        const triggerRootFocus = q2(function() {
          getCurrentFromRef(rootElementRef).focus();
        }, []);
        const triggerMenuUpdateLayout = q2(function(selectedId2) {
          const rootElement = getCurrentFromRef(rootElementRef);
          const menuElement = getCurrentFromRef(menuElementRef);
          updateMenuElementLayout(rootElement, menuElement, selectedId2);
        }, []);
        const triggerMenuHide = q2(function() {
          setIsMenuVisible(false);
          setSelectedId(INVALID_ID);
        }, []);
        const triggerMenuShow = q2(function() {
          if (isMenuVisible === true) {
            return;
          }
          setIsMenuVisible(true);
          if (value === null) {
            triggerMenuUpdateLayout(selectedId);
            return;
          }
          const index2 = findOptionIndexByValue(options, value);
          if (index2 === -1) {
            throw new Error(`Invalid \`value\`: ${value}`);
          }
          const newSelectedId = `${index2}`;
          setSelectedId(newSelectedId);
          triggerMenuUpdateLayout(newSelectedId);
        }, [isMenuVisible, options, selectedId, triggerMenuUpdateLayout, value]);
        const handleRootKeyDown = q2(function(event) {
          onKeyDown(event);
          const key = event.key;
          if (key === "ArrowUp" || key === "ArrowDown") {
            event.preventDefault();
            if (isMenuVisible === false) {
              triggerMenuShow();
              return;
            }
            handleScrollableMenuKeyDown(event);
            return;
          }
          if (key === "Escape") {
            event.preventDefault();
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            if (isMenuVisible === true) {
              triggerMenuHide();
              return;
            }
            triggerRootBlur();
            return;
          }
          if (key === "Enter") {
            event.preventDefault();
            if (isMenuVisible === false) {
              triggerMenuShow();
              return;
            }
            if (selectedId !== INVALID_ID) {
              const selectedElement = getCurrentFromRef(menuElementRef).querySelector(`[${ITEM_ID_DATA_ATTRIBUTE_NAME}='${selectedId}']`);
              if (selectedElement === null) {
                throw new Error("`selectedElement` is `null`");
              }
              selectedElement.checked = true;
              const changeEvent = new window.Event("change", {
                bubbles: true,
                cancelable: true
              });
              selectedElement.dispatchEvent(changeEvent);
            }
            triggerMenuHide();
            return;
          }
          if (key === "Tab") {
            triggerMenuHide();
            return;
          }
        }, [
          handleScrollableMenuKeyDown,
          isMenuVisible,
          onKeyDown,
          propagateEscapeKeyDown,
          selectedId,
          triggerMenuHide,
          triggerMenuShow,
          triggerRootBlur
        ]);
        const handleRootMouseDown = q2(function(event) {
          onMouseDown(event);
          if (isMenuVisible === false) {
            triggerMenuShow();
          }
        }, [isMenuVisible, onMouseDown, triggerMenuShow]);
        const handleMenuMouseDown = q2(function(event) {
          event.stopPropagation();
        }, []);
        const handleOptionChange = q2(function(event) {
          onChange(event);
          const id = event.currentTarget.getAttribute(ITEM_ID_DATA_ATTRIBUTE_NAME);
          if (id === null) {
            throw new Error("`id` is `null`");
          }
          const optionValue = options[parseInt(id, 10)];
          const newValue = optionValue.value;
          onValueChange(newValue);
          triggerRootFocus();
          triggerMenuHide();
        }, [onChange, onValueChange, options, triggerMenuHide, triggerRootFocus]);
        const handleSelectedOptionClick = q2(function() {
          triggerRootFocus();
          triggerMenuHide();
        }, [triggerMenuHide, triggerRootFocus]);
        const handleMouseDownOutside = q2(function() {
          if (isMenuVisible === false) {
            return;
          }
          triggerMenuHide();
          triggerRootBlur();
        }, [isMenuVisible, triggerRootBlur, triggerMenuHide]);
        useMouseDownOutside({
          onMouseDownOutside: handleMouseDownOutside,
          ref: rootElementRef
        });
        y2(function() {
          function handleWindowScroll() {
            if (isMenuVisible === false) {
              return;
            }
            triggerRootFocus();
            triggerMenuHide();
          }
          window.addEventListener("scroll", handleWindowScroll);
          return function() {
            window.removeEventListener("scroll", handleWindowScroll);
          };
        }, [isMenuVisible, triggerMenuHide, triggerRootFocus]);
        const refCallback = q2(function(rootElement) {
          rootElementRef.current = rootElement;
          if (ref === null) {
            return;
          }
          if (typeof ref === "function") {
            ref(rootElement);
            return;
          }
          ref.current = rootElement;
        }, [ref, rootElementRef]);
        return _(
          "div",
          __spreadProps(__spreadValues({}, rest), { ref: refCallback, class: createClassName([
            dropdown_module_default.dropdown,
            typeof icon !== "undefined" ? dropdown_module_default.hasIcon : null,
            disabled === true ? dropdown_module_default.disabled : null
          ]), onKeyDown: disabled === true ? void 0 : handleRootKeyDown, onMouseDown: handleRootMouseDown, tabIndex: 0 }),
          typeof icon === "undefined" ? null : _("div", { class: dropdown_module_default.icon }, icon),
          value === null ? _("div", { class: createClassName([
            dropdown_module_default.value,
            dropdown_module_default.placeholder
          ]) }, placeholder) : _("div", { class: dropdown_module_default.value }, children),
          _(
            "div",
            { class: dropdown_module_default.chevronIcon },
            _(IconChevronDown16, null)
          ),
          $2(_("div", { ref: menuElementRef, class: createClassName([
            menu_module_default.menu,
            dropdown_module_default.menu,
            disabled === true || isMenuVisible === false ? menu_module_default.hidden : null
          ]), onMouseDown: handleMenuMouseDown }, options.map(function(option, index2) {
            if (typeof option === "string") {
              return _("hr", { key: index2, class: menu_module_default.optionSeparator });
            }
            if ("header" in option) {
              return _("h1", { key: index2, class: menu_module_default.optionHeader }, option.header);
            }
            return _(
              "label",
              { key: index2, class: createClassName([
                menu_module_default.optionValue,
                option.disabled === true ? menu_module_default.optionValueDisabled : null,
                option.disabled !== true && `${index2}` === selectedId ? menu_module_default.optionValueSelected : null
              ]) },
              _("input", { checked: value === option.value, class: menu_module_default.input, disabled: option.disabled === true, onChange: value === option.value ? void 0 : handleOptionChange, onClick: value === option.value ? handleSelectedOptionClick : void 0, onMouseMove: handleScrollableMenuItemMouseMove, tabIndex: -1, type: "radio", value: `${option.value}`, [ITEM_ID_DATA_ATTRIBUTE_NAME]: `${index2}` }),
              option.value === value ? _(
                "div",
                { class: menu_module_default.checkIcon },
                _(IconCheck16, null)
              ) : null,
              typeof option.text === "undefined" ? option.value : option.text
            );
          })), document.body)
        );
      });
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/7d724caa-bbe3-4bf4-8f8a-59ad7cdd12ad/icon-button.module.js
  var icon_button_module_default;
  var init_icon_button_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/7d724caa-bbe3-4bf4-8f8a-59ad7cdd12ad/icon-button.module.js"() {
      if (document.getElementById("80755cba03") === null) {
        const element = document.createElement("style");
        element.id = "80755cba03";
        element.textContent = `._iconButton_5h86m_1 {
  position: relative;
  width: var(--space-24);
  height: var(--space-24);
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-4);
}

._iconButton_5h86m_1:not(._disabled_5h86m_9) {
  color: var(--figma-color-icon);
}
._iconButton_5h86m_1:not(._disabled_5h86m_9):hover,
._iconButton_5h86m_1:not(._disabled_5h86m_9):active {
  background-color: var(--figma-color-bg-hover);
}
._iconButton_5h86m_1:not(._disabled_5h86m_9):focus-visible {
  border-color: var(--figma-color-border-selected);
}

._disabled_5h86m_9,
._disabled_5h86m_9 * {
  cursor: not-allowed;
}

._icon_5h86m_1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
._disabled_5h86m_9 ._icon_5h86m_1 {
  color: var(--figma-color-icon-disabled);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9pY29uLWJ1dHRvbi9pY29uLWJ1dHRvbi5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHNCQUFzQjtFQUN0Qix1QkFBdUI7RUFDdkIsK0NBQStDO0VBQy9DLHFDQUFxQztBQUN2Qzs7QUFFQTtFQUNFLDhCQUE4QjtBQUNoQztBQUNBOztFQUVFLDZDQUE2QztBQUMvQztBQUNBO0VBQ0UsZ0RBQWdEO0FBQ2xEOztBQUVBOztFQUVFLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IsU0FBUztFQUNULGdDQUFnQztBQUNsQztBQUNBO0VBQ0UsdUNBQXVDO0FBQ3pDIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9pY29uLWJ1dHRvbi9pY29uLWJ1dHRvbi5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmljb25CdXR0b24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiB2YXIoLS1zcGFjZS0yNCk7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtMjQpO1xuICBib3JkZXI6IHZhcigtLWJvcmRlci13aWR0aC0xKSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cy00KTtcbn1cblxuLmljb25CdXR0b246bm90KC5kaXNhYmxlZCkge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItaWNvbik7XG59XG4uaWNvbkJ1dHRvbjpub3QoLmRpc2FibGVkKTpob3Zlcixcbi5pY29uQnV0dG9uOm5vdCguZGlzYWJsZWQpOmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLWhvdmVyKTtcbn1cbi5pY29uQnV0dG9uOm5vdCguZGlzYWJsZWQpOmZvY3VzLXZpc2libGUge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1zZWxlY3RlZCk7XG59XG5cbi5kaXNhYmxlZCxcbi5kaXNhYmxlZCAqIHtcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbn1cblxuLmljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xufVxuLmRpc2FibGVkIC5pY29uIHtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWljb24tZGlzYWJsZWQpO1xufVxuIl19 */`;
        document.head.append(element);
      }
      icon_button_module_default = { "iconButton": "_iconButton_5h86m_1", "disabled": "_disabled_5h86m_9", "icon": "_icon_5h86m_1" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/icon-button/icon-button.js
  var IconButton;
  var init_icon_button = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/icon-button/icon-button.js"() {
      init_preact_module();
      init_hooks_module();
      init_create_class_name();
      init_create_component();
      init_no_op();
      init_icon_button_module();
      IconButton = createComponent(function(_a, ref) {
        var _b = _a, { children, disabled = false, onClick, onKeyDown = noop, propagateEscapeKeyDown = true } = _b, rest = __objRest(_b, ["children", "disabled", "onClick", "onKeyDown", "propagateEscapeKeyDown"]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        return _(
          "button",
          __spreadProps(__spreadValues({}, rest), { ref, class: createClassName([
            icon_button_module_default.iconButton,
            disabled === true ? icon_button_module_default.disabled : null
          ]), disabled: disabled === true, onClick, onKeyDown: handleKeyDown, tabIndex: 0 }),
          _("div", { class: icon_button_module_default.icon }, children)
        );
      });
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-24/icon-close-24.js
  var IconClose24;
  var init_icon_close_24 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-24/icon-close-24.js"() {
      init_preact_module();
      init_create_icon();
      IconClose24 = createIcon(_(
        "svg",
        { fill: "none", height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M17.3536 6.64645c.1952.19526.1952.51184 0 .7071L12.7071 12l4.6465 4.6464c.1952.1953.1952.5119 0 .7072-.1953.1952-.5119.1952-.7072 0L12 12.7071l-4.64645 4.6465c-.19526.1952-.51184.1952-.7071 0-.19527-.1953-.19527-.5119 0-.7072L11.2929 12 6.64645 7.35365c-.19526-.19526-.19527-.51184-.00001-.70711.19527-.19526.51185-.19526.70711 0L12 11.2929l4.6464-4.64645c.1953-.19527.5119-.19527.7072 0", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/private/get-focusable-elements.js
  function getFocusableElements(rootElement) {
    const elements = (typeof rootElement === "undefined" ? document : rootElement).querySelectorAll(':not([disabled])[tabindex]:not([tabindex="-1"])');
    return Array.prototype.slice.call(elements);
  }
  var init_get_focusable_elements = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/private/get-focusable-elements.js"() {
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/private/create-focus-trap-key-down-handler.js
  function createFocusTrapKeyDownHandler(rootElement) {
    return function(event) {
      if (event.key !== "Tab") {
        return;
      }
      event.preventDefault();
      const focusableElements = getFocusableElements(rootElement);
      if (focusableElements.length === 0) {
        return;
      }
      const index = findElementIndex(event.target, focusableElements);
      if (index === focusableElements.length - 1 && event.shiftKey === false) {
        focusableElements[0].focus();
        return;
      }
      if (index === 0 && event.shiftKey === true) {
        focusableElements[focusableElements.length - 1].focus();
        return;
      }
      focusableElements[event.shiftKey === true ? index - 1 : index + 1].focus();
    };
  }
  function findElementIndex(targetElement, elements) {
    return elements.reduce(function(result, element, index) {
      if (result === -1 && element.isSameNode(targetElement) === true) {
        return index;
      }
      return result;
    }, -1);
  }
  var init_create_focus_trap_key_down_handler = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/private/create-focus-trap-key-down-handler.js"() {
      init_get_focusable_elements();
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/65e7d5b8-0cf3-415f-a499-74a3ee2796a1/text.module.js
  var text_module_default;
  var init_text_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/65e7d5b8-0cf3-415f-a499-74a3ee2796a1/text.module.js"() {
      if (document.getElementById("569767d532") === null) {
        const element = document.createElement("style");
        element.id = "569767d532";
        element.textContent = `._text_mh6mm_1 {
  padding-top: 1px;
  color: var(--figma-color-text);
  pointer-events: none;
  transform: translateY(4px);
}
._text_mh6mm_1:before {
  display: block;
  height: 0;
  margin-top: -9px;
  content: '';
  pointer-events: none;
}

._numeric_mh6mm_15 {
  font-variant-numeric: tabular-nums;
}

._left_mh6mm_19 {
  text-align: left;
}
._center_mh6mm_22 {
  text-align: center;
}
._right_mh6mm_25 {
  text-align: right;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90ZXh0L3RleHQubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGdCQUFnQjtFQUNoQiw4QkFBOEI7RUFDOUIsb0JBQW9CO0VBQ3BCLDBCQUEwQjtBQUM1QjtBQUNBO0VBQ0UsY0FBYztFQUNkLFNBQVM7RUFDVCxnQkFBZ0I7RUFDaEIsV0FBVztFQUNYLG9CQUFvQjtBQUN0Qjs7QUFFQTtFQUNFLGtDQUFrQztBQUNwQzs7QUFFQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUNBO0VBQ0Usa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxpQkFBaUI7QUFDbkIiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jb21wb25lbnRzL3RleHQvdGV4dC5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnRleHQge1xuICBwYWRkaW5nLXRvcDogMXB4O1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoNHB4KTtcbn1cbi50ZXh0OmJlZm9yZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBoZWlnaHQ6IDA7XG4gIG1hcmdpbi10b3A6IC05cHg7XG4gIGNvbnRlbnQ6ICcnO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cblxuLm51bWVyaWMge1xuICBmb250LXZhcmlhbnQtbnVtZXJpYzogdGFidWxhci1udW1zO1xufVxuXG4ubGVmdCB7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG59XG4uY2VudGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuLnJpZ2h0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG4iXX0= */`;
        document.head.append(element);
      }
      text_module_default = { "text": "_text_mh6mm_1", "numeric": "_numeric_mh6mm_15", "left": "_left_mh6mm_19", "center": "_center_mh6mm_22", "right": "_right_mh6mm_25" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/text/text.js
  var Text;
  var init_text = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/text/text.js"() {
      init_preact_module();
      init_create_class_name();
      init_create_component();
      init_text_module();
      Text = createComponent(function(_a) {
        var _b = _a, { align = "left", children, numeric = false } = _b, rest = __objRest(_b, ["align", "children", "numeric"]);
        return _("div", __spreadProps(__spreadValues({}, rest), { class: createClassName([
          text_module_default.text,
          text_module_default[align],
          numeric === true ? text_module_default.numeric : null
        ]) }), children);
      });
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/b0dbff8e-4c79-44c3-bd47-16c73ec2e458/modal.module.js
  var modal_module_default;
  var init_modal_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/b0dbff8e-4c79-44c3-bd47-16c73ec2e458/modal.module.js"() {
      if (document.getElementById("e7dbc6f728") === null) {
        const element = document.createElement("style");
        element.id = "e7dbc6f728";
        element.textContent = `._modal_6vogs_1 {
  position: fixed;
  z-index: var(--z-index-2);
  display: flex;
  flex-direction: column;
  background-color: var(--figma-color-bg);
  transition-duration: 0.3s;
  transition-timing-function: ease;
}
._noTransition_6vogs_10 {
  transition: none;
}

._center_6vogs_14 {
  top: 50%;
  left: 50%;
  border-radius: var(--border-radius-2);
  box-shadow: var(--box-shadow-modal);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition-property: opacity;
}
._open_6vogs_24._center_6vogs_14 {
  opacity: 1;
  pointer-events: all;
}

._bottom_6vogs_29 {
  top: 100%;
  left: 0;
  width: 100%;
}
._open_6vogs_24._bottom_6vogs_29 {
  box-shadow: var(--box-shadow-modal);
  transform: translate(0, -100%);
}

._left_6vogs_39 {
  top: 0;
  right: 100%;
  height: 100%;
}
._open_6vogs_24._left_6vogs_39 {
  box-shadow: var(--box-shadow-modal);
  transform: translate(100%, 0);
}

._right_6vogs_49 {
  top: 0;
  left: 100%;
  height: 100%;
}
._open_6vogs_24._right_6vogs_49 {
  box-shadow: var(--box-shadow-modal);
  transform: translate(-100%, 0);
}

._topBar_6vogs_59 {
  display: flex;
  min-height: 41px;
  align-items: center;
  order: -1;
  padding: 4px;
  border-color: var(--figma-color-border);
  border-bottom-width: 1px;
}

._closeButton_6vogs_69 {
  display: flex;
}
._closeButtonLeft_6vogs_72 {
  order: -1;
}

._title_6vogs_76 {
  flex-grow: 1;
  padding: 0 var(--space-extra-small);
}

._overlay_6vogs_81 {
  position: fixed;
  z-index: var(--z-index-1);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--color-bg-overlay);
  opacity: 0;
  pointer-events: none;
  transition: opacity ease 0.3s;
}
._open_6vogs_24 ~ ._overlay_6vogs_81 {
  opacity: 1;
  pointer-events: all;
}
._noTransition_6vogs_10 ~ ._overlay_6vogs_81 {
  transition: none;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9tb2RhbC9tb2RhbC5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZUFBZTtFQUNmLHlCQUF5QjtFQUN6QixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLHVDQUF1QztFQUN2Qyx5QkFBeUI7RUFDekIsZ0NBQWdDO0FBQ2xDO0FBQ0E7RUFDRSxnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxRQUFRO0VBQ1IsU0FBUztFQUNULHFDQUFxQztFQUNyQyxtQ0FBbUM7RUFDbkMsVUFBVTtFQUNWLG9CQUFvQjtFQUNwQixnQ0FBZ0M7RUFDaEMsNEJBQTRCO0FBQzlCO0FBQ0E7RUFDRSxVQUFVO0VBQ1YsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsU0FBUztFQUNULE9BQU87RUFDUCxXQUFXO0FBQ2I7QUFDQTtFQUNFLG1DQUFtQztFQUNuQyw4QkFBOEI7QUFDaEM7O0FBRUE7RUFDRSxNQUFNO0VBQ04sV0FBVztFQUNYLFlBQVk7QUFDZDtBQUNBO0VBQ0UsbUNBQW1DO0VBQ25DLDZCQUE2QjtBQUMvQjs7QUFFQTtFQUNFLE1BQU07RUFDTixVQUFVO0VBQ1YsWUFBWTtBQUNkO0FBQ0E7RUFDRSxtQ0FBbUM7RUFDbkMsOEJBQThCO0FBQ2hDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLGdCQUFnQjtFQUNoQixtQkFBbUI7RUFDbkIsU0FBUztFQUNULFlBQVk7RUFDWix1Q0FBdUM7RUFDdkMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UsYUFBYTtBQUNmO0FBQ0E7RUFDRSxTQUFTO0FBQ1g7O0FBRUE7RUFDRSxZQUFZO0VBQ1osbUNBQW1DO0FBQ3JDOztBQUVBO0VBQ0UsZUFBZTtFQUNmLHlCQUF5QjtFQUN6QixNQUFNO0VBQ04sUUFBUTtFQUNSLFNBQVM7RUFDVCxPQUFPO0VBQ1AseUNBQXlDO0VBQ3pDLFVBQVU7RUFDVixvQkFBb0I7RUFDcEIsNkJBQTZCO0FBQy9CO0FBQ0E7RUFDRSxVQUFVO0VBQ1YsbUJBQW1CO0FBQ3JCO0FBQ0E7RUFDRSxnQkFBZ0I7QUFDbEIiLCJmaWxlIjoibm9kZV9tb2R1bGVzL0BjcmVhdGUtZmlnbWEtcGx1Z2luL3VpL2xpYi9jb21wb25lbnRzL21vZGFsL21vZGFsLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubW9kYWwge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMik7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnKTtcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogMC4zcztcbiAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2U7XG59XG4ubm9UcmFuc2l0aW9uIHtcbiAgdHJhbnNpdGlvbjogbm9uZTtcbn1cblxuLmNlbnRlciB7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWJvcmRlci1yYWRpdXMtMik7XG4gIGJveC1zaGFkb3c6IHZhcigtLWJveC1zaGFkb3ctbW9kYWwpO1xuICBvcGFjaXR5OiAwO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHk7XG59XG4ub3Blbi5jZW50ZXIge1xuICBvcGFjaXR5OiAxO1xuICBwb2ludGVyLWV2ZW50czogYWxsO1xufVxuXG4uYm90dG9tIHtcbiAgdG9wOiAxMDAlO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbn1cbi5vcGVuLmJvdHRvbSB7XG4gIGJveC1zaGFkb3c6IHZhcigtLWJveC1zaGFkb3ctbW9kYWwpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtMTAwJSk7XG59XG5cbi5sZWZ0IHtcbiAgdG9wOiAwO1xuICByaWdodDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuLm9wZW4ubGVmdCB7XG4gIGJveC1zaGFkb3c6IHZhcigtLWJveC1zaGFkb3ctbW9kYWwpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMDAlLCAwKTtcbn1cblxuLnJpZ2h0IHtcbiAgdG9wOiAwO1xuICBsZWZ0OiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG4ub3Blbi5yaWdodCB7XG4gIGJveC1zaGFkb3c6IHZhcigtLWJveC1zaGFkb3ctbW9kYWwpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMCk7XG59XG5cbi50b3BCYXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBtaW4taGVpZ2h0OiA0MXB4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBvcmRlcjogLTE7XG4gIHBhZGRpbmc6IDRweDtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXIpO1xuICBib3JkZXItYm90dG9tLXdpZHRoOiAxcHg7XG59XG5cbi5jbG9zZUJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG4uY2xvc2VCdXR0b25MZWZ0IHtcbiAgb3JkZXI6IC0xO1xufVxuXG4udGl0bGUge1xuICBmbGV4LWdyb3c6IDE7XG4gIHBhZGRpbmc6IDAgdmFyKC0tc3BhY2UtZXh0cmEtc21hbGwpO1xufVxuXG4ub3ZlcmxheSB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgei1pbmRleDogdmFyKC0tei1pbmRleC0xKTtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvci1iZy1vdmVybGF5KTtcbiAgb3BhY2l0eTogMDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgZWFzZSAwLjNzO1xufVxuLm9wZW4gfiAub3ZlcmxheSB7XG4gIG9wYWNpdHk6IDE7XG4gIHBvaW50ZXItZXZlbnRzOiBhbGw7XG59XG4ubm9UcmFuc2l0aW9uIH4gLm92ZXJsYXkge1xuICB0cmFuc2l0aW9uOiBub25lO1xufVxuIl19 */`;
        document.head.append(element);
      }
      modal_module_default = { "modal": "_modal_6vogs_1", "noTransition": "_noTransition_6vogs_10", "center": "_center_6vogs_14", "open": "_open_6vogs_24", "bottom": "_bottom_6vogs_29", "left": "_left_6vogs_39", "right": "_right_6vogs_49", "topBar": "_topBar_6vogs_59", "closeButton": "_closeButton_6vogs_69", "closeButtonLeft": "_closeButtonLeft_6vogs_72", "title": "_title_6vogs_76", "overlay": "_overlay_6vogs_81" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/modal/modal.js
  var Modal;
  var init_modal = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/modal/modal.js"() {
      init_preact_module();
      init_hooks_module();
      init_icon_close_24();
      init_create_class_name();
      init_create_component();
      init_get_current_from_ref();
      init_create_focus_trap_key_down_handler();
      init_get_focusable_elements();
      init_icon_button();
      init_text();
      init_modal_module();
      Modal = createComponent(function(_a, ref) {
        var _b = _a, { children, closeButtonIcon = _(IconClose24, null), closeButtonPosition = "right", open, transition = true, onCloseButtonClick, onEscapeKeyDown, onOverlayClick, position = "center", title } = _b, rest = __objRest(_b, ["children", "closeButtonIcon", "closeButtonPosition", "open", "transition", "onCloseButtonClick", "onEscapeKeyDown", "onOverlayClick", "position", "title"]);
        const portalElementRef = A2(null);
        const modalElementsRef = A2([]);
        const previousFocusedElementRef = A2(null);
        y2(function() {
          const portalElement = document.createElement("div");
          document.body.appendChild(portalElement);
          portalElementRef.current = portalElement;
          return function() {
            document.body.removeChild(portalElement);
          };
        }, []);
        y2(function() {
          const portalElement = getCurrentFromRef(portalElementRef);
          const focusTrapKeyDownHandler = createFocusTrapKeyDownHandler(portalElement);
          function handleTabKeyDown(event) {
            if (open === true) {
              focusTrapKeyDownHandler(event);
            }
          }
          window.addEventListener("keydown", handleTabKeyDown);
          return function() {
            window.removeEventListener("keydown", handleTabKeyDown);
          };
        }, [open]);
        y2(function() {
          function handleEscapeKeyDown(event) {
            const modalElements = getCurrentFromRef(modalElementsRef);
            const portalElement = getCurrentFromRef(portalElementRef);
            if (open === false || event.key !== "Escape" || typeof onEscapeKeyDown === "undefined" || modalElements[modalElements.length - 1] !== portalElement) {
              return;
            }
            onEscapeKeyDown(event);
          }
          window.addEventListener("keydown", handleEscapeKeyDown);
          return function() {
            window.removeEventListener("keydown", handleEscapeKeyDown);
          };
        }, [open, onEscapeKeyDown]);
        y2(function() {
          const modalElements = getCurrentFromRef(modalElementsRef);
          const portalElement = getCurrentFromRef(portalElementRef);
          const bodyElement = document.body;
          if (open === true) {
            if (modalElements.length === 0) {
              const scrollY = window.scrollY;
              bodyElement.style.cssText += `position:fixed;top:-${scrollY}px;width:100%;overflow-y:hidden;`;
            }
            modalElements.push(portalElement);
            portalElement.style.cssText = "position:absolute;top:0;right:0;bottom:0;left:0;z-index:1";
            previousFocusedElementRef.current = document.activeElement;
            const focusableElements = getFocusableElements(portalElement);
            if (focusableElements.length > 0) {
              focusableElements[0].focus();
            } else {
              previousFocusedElementRef.current.blur();
            }
          } else {
            if (modalElements.length === 1) {
              const top = parseInt(document.body.style.top);
              bodyElement.style.removeProperty("position");
              bodyElement.style.removeProperty("top");
              bodyElement.style.removeProperty("overflow-y");
              bodyElement.style.removeProperty("width");
              window.scrollTo({ top: top * -1 });
            }
            modalElements.pop();
            portalElement.style.cssText = "position:static";
          }
          return function() {
            if (previousFocusedElementRef.current !== null) {
              previousFocusedElementRef.current.focus();
            }
          };
        }, [open]);
        y2(function() {
          const portalElement = getCurrentFromRef(portalElementRef);
          G(_(
            "div",
            { ref },
            _(
              "div",
              __spreadProps(__spreadValues({}, rest), { class: createClassName([
                modal_module_default.modal,
                open === true ? modal_module_default.open : null,
                transition === false ? modal_module_default.noTransition : null,
                modal_module_default[position]
              ]) }),
              children,
              typeof onCloseButtonClick === "undefined" && typeof title === "undefined" ? null : _(
                "div",
                { class: modal_module_default.topBar },
                _("div", { class: modal_module_default.title }, typeof title === "undefined" ? null : _(
                  Text,
                  null,
                  _("strong", null, title)
                )),
                typeof onCloseButtonClick === "undefined" ? null : _(
                  "div",
                  { class: createClassName([
                    modal_module_default.closeButton,
                    closeButtonPosition === "left" ? modal_module_default.closeButtonLeft : null
                  ]) },
                  _(IconButton, { onClick: onCloseButtonClick }, closeButtonIcon)
                )
              )
            ),
            _("div", { class: modal_module_default.overlay, onClick: typeof onOverlayClick === "undefined" ? void 0 : onOverlayClick })
          ), portalElement);
        }, [
          children,
          closeButtonIcon,
          closeButtonPosition,
          onCloseButtonClick,
          onOverlayClick,
          open,
          position,
          ref,
          rest,
          title,
          transition
        ]);
        return null;
      });
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/36fd0e19-4031-4e40-a3d3-f6a88de8a341/selectable-item.module.js
  var selectable_item_module_default;
  var init_selectable_item_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/36fd0e19-4031-4e40-a3d3-f6a88de8a341/selectable-item.module.js"() {
      if (document.getElementById("e9504ce0e1") === null) {
        const element = document.createElement("style");
        element.id = "e9504ce0e1";
        element.textContent = `._selectableItem_1plom_1 {
  position: relative;
  z-index: var(--z-index-1);
  padding: var(--space-4) var(--space-12);
}

._disabled_1plom_7,
._disabled_1plom_7 * {
  cursor: not-allowed;
}

._input_1plom_12 {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

._input_1plom_12 {
  z-index: var(--z-index-1); /* stack \`.input\` on top of everything else */
  display: block;
}

._box_1plom_25 {
  display: flex;
  padding: 3px var(--space-4) 3px var(--space-8);
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-6);
  gap: var(--space-8);
}
._input_1plom_12:hover ~ ._box_1plom_25 {
  background-color: var(--figma-color-bg-hover);
}
._input_1plom_12:focus-visible ~ ._box_1plom_25 {
  border-color: var(--figma-color-border-selected);
}
._input_1plom_12:checked ~ ._box_1plom_25 {
  background-color: var(--figma-color-bg-selected);
}
._disabled_1plom_7 ._input_1plom_12 ~ ._box_1plom_25 {
  background-color: transparent;
}
._disabled_1plom_7 ._input_1plom_12:checked ~ ._box_1plom_25 {
  background-color: var(--figma-color-bg-secondary);
}

._children_1plom_48 {
  overflow: hidden;
  flex-grow: 1;
  color: var(--figma-color-text);
  text-overflow: ellipsis;
  white-space: nowrap;
}
._disabled_1plom_7 ._children_1plom_48 {
  color: var(--figma-color-text-disabled);
}
._bold_1plom_58 ._children_1plom_48 {
  font-weight: var(--font-weight-bold);
}
._indent_1plom_61 ._children_1plom_48 {
  padding-left: var(--space-16);
}

._icon_1plom_65 {
  height: var(--space-16);
  flex: 0 0 var(--space-16);
  color: var(--figma-color-icon-brand);
}
._disabled_1plom_7 ._icon_1plom_65 {
  color: var(--figma-color-icon-disabled);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9zZWxlY3RhYmxlLWl0ZW0vc2VsZWN0YWJsZS1pdGVtLm1vZHVsZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLHVDQUF1QztBQUN6Qzs7QUFFQTs7RUFFRSxtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLFFBQVE7RUFDUixTQUFTO0VBQ1QsT0FBTztBQUNUOztBQUVBO0VBQ0UseUJBQXlCLEVBQUUsNkNBQTZDO0VBQ3hFLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsOENBQThDO0VBQzlDLCtDQUErQztFQUMvQyxxQ0FBcUM7RUFDckMsbUJBQW1CO0FBQ3JCO0FBQ0E7RUFDRSw2Q0FBNkM7QUFDL0M7QUFDQTtFQUNFLGdEQUFnRDtBQUNsRDtBQUNBO0VBQ0UsZ0RBQWdEO0FBQ2xEO0FBQ0E7RUFDRSw2QkFBNkI7QUFDL0I7QUFDQTtFQUNFLGlEQUFpRDtBQUNuRDs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixZQUFZO0VBQ1osOEJBQThCO0VBQzlCLHVCQUF1QjtFQUN2QixtQkFBbUI7QUFDckI7QUFDQTtFQUNFLHVDQUF1QztBQUN6QztBQUNBO0VBQ0Usb0NBQW9DO0FBQ3RDO0FBQ0E7RUFDRSw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSx1QkFBdUI7RUFDdkIseUJBQXlCO0VBQ3pCLG9DQUFvQztBQUN0QztBQUNBO0VBQ0UsdUNBQXVDO0FBQ3pDIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy9zZWxlY3RhYmxlLWl0ZW0vc2VsZWN0YWJsZS1pdGVtLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc2VsZWN0YWJsZUl0ZW0ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IHZhcigtLXotaW5kZXgtMSk7XG4gIHBhZGRpbmc6IHZhcigtLXNwYWNlLTQpIHZhcigtLXNwYWNlLTEyKTtcbn1cblxuLmRpc2FibGVkLFxuLmRpc2FibGVkICoge1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4uaW5wdXQge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcbn1cblxuLmlucHV0IHtcbiAgei1pbmRleDogdmFyKC0tei1pbmRleC0xKTsgLyogc3RhY2sgYC5pbnB1dGAgb24gdG9wIG9mIGV2ZXJ5dGhpbmcgZWxzZSAqL1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLmJveCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDNweCB2YXIoLS1zcGFjZS00KSAzcHggdmFyKC0tc3BhY2UtOCk7XG4gIGJvcmRlcjogdmFyKC0tYm9yZGVyLXdpZHRoLTEpIHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItcmFkaXVzOiB2YXIoLS1ib3JkZXItcmFkaXVzLTYpO1xuICBnYXA6IHZhcigtLXNwYWNlLTgpO1xufVxuLmlucHV0OmhvdmVyIH4gLmJveCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLWhvdmVyKTtcbn1cbi5pbnB1dDpmb2N1cy12aXNpYmxlIH4gLmJveCB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYm9yZGVyLXNlbGVjdGVkKTtcbn1cbi5pbnB1dDpjaGVja2VkIH4gLmJveCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJnLXNlbGVjdGVkKTtcbn1cbi5kaXNhYmxlZCAuaW5wdXQgfiAuYm94IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG4uZGlzYWJsZWQgLmlucHV0OmNoZWNrZWQgfiAuYm94IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctc2Vjb25kYXJ5KTtcbn1cblxuLmNoaWxkcmVuIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgZmxleC1ncm93OiAxO1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dCk7XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xufVxuLmRpc2FibGVkIC5jaGlsZHJlbiB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LWRpc2FibGVkKTtcbn1cbi5ib2xkIC5jaGlsZHJlbiB7XG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mb250LXdlaWdodC1ib2xkKTtcbn1cbi5pbmRlbnQgLmNoaWxkcmVuIHtcbiAgcGFkZGluZy1sZWZ0OiB2YXIoLS1zcGFjZS0xNik7XG59XG5cbi5pY29uIHtcbiAgaGVpZ2h0OiB2YXIoLS1zcGFjZS0xNik7XG4gIGZsZXg6IDAgMCB2YXIoLS1zcGFjZS0xNik7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1pY29uLWJyYW5kKTtcbn1cbi5kaXNhYmxlZCAuaWNvbiB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1pY29uLWRpc2FibGVkKTtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      selectable_item_module_default = { "selectableItem": "_selectableItem_1plom_1", "disabled": "_disabled_1plom_7", "input": "_input_1plom_12", "box": "_box_1plom_25", "children": "_children_1plom_48", "bold": "_bold_1plom_58", "indent": "_indent_1plom_61", "icon": "_icon_1plom_65" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/selectable-item/selectable-item.js
  var SelectableItem;
  var init_selectable_item = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/selectable-item/selectable-item.js"() {
      init_preact_module();
      init_hooks_module();
      init_icon_check_16();
      init_create_class_name();
      init_create_component();
      init_no_op();
      init_selectable_item_module();
      SelectableItem = createComponent(function(_a, ref) {
        var _b = _a, { bold = false, children, disabled = false, indent = false, onChange = noop, onKeyDown = noop, onValueChange = noop, propagateEscapeKeyDown = true, value } = _b, rest = __objRest(_b, ["bold", "children", "disabled", "indent", "onChange", "onKeyDown", "onValueChange", "propagateEscapeKeyDown", "value"]);
        const handleChange = q2(function(event) {
          onChange(event);
          const newValue = event.currentTarget.checked === true;
          onValueChange(newValue);
        }, [onChange, onValueChange]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
          }
        }, [onKeyDown, propagateEscapeKeyDown]);
        return _(
          "label",
          { class: createClassName([
            selectable_item_module_default.selectableItem,
            disabled === true ? selectable_item_module_default.disabled : null,
            bold === true ? selectable_item_module_default.bold : null,
            indent === true ? selectable_item_module_default.indent : null
          ]) },
          _("input", __spreadProps(__spreadValues({}, rest), { ref, checked: value === true, class: selectable_item_module_default.input, disabled: disabled === true, onChange: handleChange, onKeyDown: disabled === true ? void 0 : handleKeyDown, tabIndex: 0, type: "checkbox" })),
          _(
            "div",
            { class: selectable_item_module_default.box },
            _("div", { class: selectable_item_module_default.children }, children),
            value === true ? _(
              "div",
              { class: selectable_item_module_default.icon },
              _(IconCheck16, null)
            ) : null
          )
        );
      });
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/private/is-keycode-character-generating.js
  function isKeyCodeCharacterGenerating(keyCode) {
    return keyCode === 32 || keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode >= 96 && keyCode <= 105 || keyCode >= 186 && keyCode <= 192 || keyCode >= 219 && keyCode <= 222;
  }
  var init_is_keycode_character_generating = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/private/is-keycode-character-generating.js"() {
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/b5583899-f037-4f7b-8639-a9cf1bf7ff08/textbox-multiline.module.js
  var textbox_multiline_module_default;
  var init_textbox_multiline_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/b5583899-f037-4f7b-8639-a9cf1bf7ff08/textbox-multiline.module.js"() {
      if (document.getElementById("97ee6329c7") === null) {
        const element = document.createElement("style");
        element.id = "97ee6329c7";
        element.textContent = `._textboxMultiline_1etpk_1 {
  position: relative;
  z-index: var(--z-index-1);
}

._disabled_1etpk_6,
._disabled_1etpk_6 * {
  cursor: not-allowed;
}

._grow_1etpk_11 {
  display: grid;
}

._ghost_1etpk_15,
._grow_1etpk_11 ._textarea_1etpk_16 {
  grid-area: 1 / 1 / 2 / 2;
}

._ghost_1etpk_15 {
  padding: var(--space-4) var(--space-8);
  white-space: pre-wrap;
}

._textarea_1etpk_16 {
  display: block;
  width: 100%;
  padding: calc(var(--space-4) - var(--border-width-1))
    calc(var(--space-8) - var(--border-width-1));
  border: var(--border-width-1) solid transparent;
  border-radius: var(--border-radius-4);
  background-color: var(--figma-color-bg-secondary);
  color: var(--figma-color-text);
  resize: none;
}
._textarea_1etpk_16:focus {
  border-color: var(--figma-color-border-selected);
}
._disabled_1etpk_6 ._textarea_1etpk_16 {
  border-color: var(--figma-color-border-disabled);
  background-color: transparent;
  color: var(--figma-color-text-disabled);
}
._grow_1etpk_11 ._textarea_1etpk_16 {
  overflow: hidden;
}

._textarea_1etpk_16::placeholder {
  color: var(--figma-color-text-tertiary);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90ZXh0Ym94L3RleHRib3gtbXVsdGlsaW5lL3RleHRib3gtbXVsdGlsaW5lLm1vZHVsZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBa0I7RUFDbEIseUJBQXlCO0FBQzNCOztBQUVBOztFQUVFLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGFBQWE7QUFDZjs7QUFFQTs7RUFFRSx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRSxzQ0FBc0M7RUFDdEMscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsY0FBYztFQUNkLFdBQVc7RUFDWDtnREFDOEM7RUFDOUMsK0NBQStDO0VBQy9DLHFDQUFxQztFQUNyQyxpREFBaUQ7RUFDakQsOEJBQThCO0VBQzlCLFlBQVk7QUFDZDtBQUNBO0VBQ0UsZ0RBQWdEO0FBQ2xEO0FBQ0E7RUFDRSxnREFBZ0Q7RUFDaEQsNkJBQTZCO0VBQzdCLHVDQUF1QztBQUN6QztBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsdUNBQXVDO0FBQ3pDIiwiZmlsZSI6Im5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvY29tcG9uZW50cy90ZXh0Ym94L3RleHRib3gtbXVsdGlsaW5lL3RleHRib3gtbXVsdGlsaW5lLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudGV4dGJveE11bHRpbGluZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogdmFyKC0tei1pbmRleC0xKTtcbn1cblxuLmRpc2FibGVkLFxuLmRpc2FibGVkICoge1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4uZ3JvdyB7XG4gIGRpc3BsYXk6IGdyaWQ7XG59XG5cbi5naG9zdCxcbi5ncm93IC50ZXh0YXJlYSB7XG4gIGdyaWQtYXJlYTogMSAvIDEgLyAyIC8gMjtcbn1cblxuLmdob3N0IHtcbiAgcGFkZGluZzogdmFyKC0tc3BhY2UtNCkgdmFyKC0tc3BhY2UtOCk7XG4gIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbn1cblxuLnRleHRhcmVhIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nOiBjYWxjKHZhcigtLXNwYWNlLTQpIC0gdmFyKC0tYm9yZGVyLXdpZHRoLTEpKVxuICAgIGNhbGModmFyKC0tc3BhY2UtOCkgLSB2YXIoLS1ib3JkZXItd2lkdGgtMSkpO1xuICBib3JkZXI6IHZhcigtLWJvcmRlci13aWR0aC0xKSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cy00KTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItYmctc2Vjb25kYXJ5KTtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQpO1xuICByZXNpemU6IG5vbmU7XG59XG4udGV4dGFyZWE6Zm9jdXMge1xuICBib3JkZXItY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLWJvcmRlci1zZWxlY3RlZCk7XG59XG4uZGlzYWJsZWQgLnRleHRhcmVhIHtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci1ib3JkZXItZGlzYWJsZWQpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgY29sb3I6IHZhcigtLWZpZ21hLWNvbG9yLXRleHQtZGlzYWJsZWQpO1xufVxuLmdyb3cgLnRleHRhcmVhIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLnRleHRhcmVhOjpwbGFjZWhvbGRlciB7XG4gIGNvbG9yOiB2YXIoLS1maWdtYS1jb2xvci10ZXh0LXRlcnRpYXJ5KTtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      textbox_multiline_module_default = { "textboxMultiline": "_textboxMultiline_1etpk_1", "disabled": "_disabled_1etpk_6", "grow": "_grow_1etpk_11", "ghost": "_ghost_1etpk_15", "textarea": "_textarea_1etpk_16" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-multiline/textbox-multiline.js
  var EMPTY_STRING, TextboxMultiline;
  var init_textbox_multiline = __esm({
    "node_modules/@create-figma-plugin/ui/lib/components/textbox/textbox-multiline/textbox-multiline.js"() {
      init_lib();
      init_preact_module();
      init_hooks_module();
      init_create_class_name();
      init_create_component();
      init_get_current_from_ref();
      init_no_op();
      init_is_keycode_character_generating();
      init_textbox_multiline_module();
      EMPTY_STRING = "";
      TextboxMultiline = createComponent(function(_a, ref) {
        var _b = _a, { grow = false, disabled = false, onBlur = noop, onFocus = noop, onInput = noop, onKeyDown = noop, onValueInput = noop, onMouseDown = noop, placeholder, propagateEscapeKeyDown = true, revertOnEscapeKeyDown = false, rows = 3, spellCheck = false, validateOnBlur, value } = _b, rest = __objRest(_b, ["grow", "disabled", "onBlur", "onFocus", "onInput", "onKeyDown", "onValueInput", "onMouseDown", "placeholder", "propagateEscapeKeyDown", "revertOnEscapeKeyDown", "rows", "spellCheck", "validateOnBlur", "value"]);
        const textAreaElementRef = A2(null);
        const [originalValue, setOriginalValue] = d2(EMPTY_STRING);
        const setTextAreaElementValue = q2(function(value2) {
          const textAreaElement = getCurrentFromRef(textAreaElementRef);
          textAreaElement.value = value2;
          const inputEvent = new window.Event("input", {
            bubbles: true,
            cancelable: true
          });
          textAreaElement.dispatchEvent(inputEvent);
        }, []);
        const handleBlur = q2(function(event) {
          onBlur(event);
          if (typeof validateOnBlur !== "undefined") {
            const result = validateOnBlur(value);
            if (typeof result === "string") {
              setTextAreaElementValue(result);
              setOriginalValue(EMPTY_STRING);
              return;
            }
            if (result === false) {
              if (value !== originalValue) {
                setTextAreaElementValue(originalValue);
              }
              setOriginalValue(EMPTY_STRING);
              return;
            }
          }
          setOriginalValue(EMPTY_STRING);
        }, [onBlur, originalValue, setTextAreaElementValue, validateOnBlur, value]);
        const handleFocus = q2(function(event) {
          onFocus(event);
          setOriginalValue(value);
          event.currentTarget.select();
        }, [onFocus, value]);
        const handleInput = q2(function(event) {
          onInput(event);
          const newValue = event.currentTarget.value;
          onValueInput(newValue);
        }, [onInput, onValueInput]);
        const handleKeyDown = q2(function(event) {
          onKeyDown(event);
          if (event.key === "Escape") {
            if (revertOnEscapeKeyDown === true) {
              setTextAreaElementValue(originalValue);
              setOriginalValue(EMPTY_STRING);
            }
            if (propagateEscapeKeyDown === false) {
              event.stopPropagation();
            }
            event.currentTarget.blur();
            return;
          }
          if (value === MIXED_STRING && isKeyCodeCharacterGenerating(event.keyCode) === false) {
            event.preventDefault();
            event.currentTarget.select();
          }
        }, [
          onKeyDown,
          originalValue,
          propagateEscapeKeyDown,
          revertOnEscapeKeyDown,
          setTextAreaElementValue,
          value
        ]);
        const handleMouseDown = q2(function(event) {
          onMouseDown(event);
          if (value === MIXED_STRING) {
            event.preventDefault();
            event.currentTarget.select();
          }
        }, [onMouseDown, value]);
        const refCallback = q2(function(textAreaElement) {
          textAreaElementRef.current = textAreaElement;
          if (ref === null) {
            return;
          }
          if (typeof ref === "function") {
            ref(textAreaElement);
            return;
          }
          ref.current = textAreaElement;
        }, [ref]);
        return _(
          "div",
          { class: createClassName([
            textbox_multiline_module_default.textboxMultiline,
            grow === true ? textbox_multiline_module_default.grow : null,
            disabled === true ? textbox_multiline_module_default.disabled : null
          ]) },
          grow === true ? _("div", { class: textbox_multiline_module_default.ghost }, value === MIXED_STRING ? "Mixed" : `${value} `) : null,
          _("textarea", __spreadProps(__spreadValues({}, rest), { ref: refCallback, class: textbox_multiline_module_default.textarea, disabled: disabled === true, onBlur: handleBlur, onFocus: handleFocus, onInput: handleInput, onKeyDown: handleKeyDown, onMouseDown: handleMouseDown, placeholder, rows, spellcheck: spellCheck, tabIndex: 0, value: value === MIXED_STRING ? "Mixed" : value }))
        );
      });
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-boolean-16.js
  var IconBoolean16;
  var init_icon_boolean_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-boolean-16.js"() {
      init_preact_module();
      init_create_icon();
      IconBoolean16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M10 5H6C4.34315 5 3 6.34315 3 8s1.34315 3 3 3h4c1.6569 0 3-1.34315 3-3 0-1.65686-1.3431-3-3-3m0 7c2.2091 0 4-1.7909 4-4 0-2.20914-1.7909-4-4-4H6C3.79086 4 2 5.79086 2 8c0 2.2091 1.79086 4 4 4zm1-4c0 .55228-.4477 1-1 1-.55228 0-1-.44772-1-1s.44772-1 1-1c.5523 0 1 .44771 1 1m1 0c0 1.10457-.8954 2-2 2-1.10457 0-2-.89543-2-2s.89543-2 2-2c1.1046 0 2 .89543 2 2", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-close-16.js
  var IconClose16;
  var init_icon_close_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-close-16.js"() {
      init_preact_module();
      init_create_icon();
      IconClose16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M4.14645 4.14645c.19526-.19527.51184-.19527.7071 0L8 7.29289l3.1464-3.14644c.1953-.19527.5119-.19527.7072 0 .1952.19526.1952.51184 0 .7071L8.70711 8l3.14649 3.1464c.1952.1953.1952.5119 0 .7072-.1953.1952-.5119.1952-.7072 0L8 8.70711 4.85355 11.8536c-.19526.1952-.51184.1952-.7071 0-.19527-.1953-.19527-.5119 0-.7072L7.29289 8 4.14645 4.85355c-.19527-.19526-.19527-.51184 0-.7071", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-component-property-16.js
  var IconComponentProperty16;
  var init_icon_component_property_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-component-property-16.js"() {
      init_preact_module();
      init_create_icon();
      IconComponentProperty16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M5.39383 10.6009c-.19526-.1953-.51185-.1953-.70711 0-.19526.1952-.19526.5118 0 .7071l2.24919 2.2492c.58579.5858 1.53553.5858 2.12132 0l4.49837-4.49841c.5858-.58579.5858-1.53553 0-2.12132L9.05723 2.4391c-.58579-.58579-1.53553-.58579-2.12132 0L4.68672 4.68828c-.19526.19527-.19526.51185 0 .70711s.51185.19526.70711 0L7.64302 3.1462c.19526-.19526.51184-.19526.7071 0l4.49838 4.49838c.1953.19526.1953.51184 0 .7071L8.35012 12.8501c-.19526.1952-.51184.1952-.7071 0zM8 9.00002c.55228 0 1-.44771 1-1s-.44772-1-1-1-1 .44772-1 1v.00023c.00012.55218.44779.99977 1 .99977m0-3c-.93185 0-1.71485.63729-1.93694 1.49981l-3.56309.00019c-.27614.00002-.49998.22389-.49997.50003.00002.27614.22388.49999.50003.49997l3.56293-.00019C6.28491 9.36254 7.06801 10 8 10c1.10457 0 2-.89541 2-1.99998s-.89543-2-2-2", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-instance-16.js
  var IconInstance16;
  var init_icon_instance_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-instance-16.js"() {
      init_preact_module();
      init_create_icon();
      IconInstance16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M7.29289 2.29289c.39053-.39052 1.02369-.39052 1.41422 0l4.99999 5c.3905.39053.3905 1.02369 0 1.41422L8.70711 13.7071c-.39053.3905-1.02369.3905-1.41422 0l-5-4.99999c-.39052-.39053-.39052-1.02369 0-1.41422zM3.70711 8.70711 3 8l.70711-.70711 3.58578-3.58578L8 3l.70711.70711 3.58579 3.58578L13 8l-.7071.70711-3.58579 3.58579L8 13l-.70711-.7071z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-plus-16.js
  var IconPlus16;
  var init_icon_plus_16 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/icons/icon-16/icon-plus-16.js"() {
      init_preact_module();
      init_create_icon();
      IconPlus16 = createIcon(_(
        "svg",
        { fill: "none", height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg" },
        _("path", { "clip-rule": "evenodd", d: "M8.5 2.5c0-.27614-.22386-.5-.5-.5s-.5.22386-.5.5v5h-5c-.27614 0-.5.22386-.5.5s.22386.5.5.5h5v5c0 .2761.22386.5.5.5s.5-.2239.5-.5v-5h5c.2761 0 .5-.22386.5-.5s-.2239-.5-.5-.5h-5z", fill: "currentColor", "fill-rule": "evenodd" })
      ));
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/a1d10025-0b25-441e-b1c1-1a5a2239070a/muted.module.js
  var muted_module_default;
  var init_muted_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/a1d10025-0b25-441e-b1c1-1a5a2239070a/muted.module.js"() {
      if (document.getElementById("6ce13d64c8") === null) {
        const element = document.createElement("style");
        element.id = "6ce13d64c8";
        element.textContent = `._muted_139yx_1 {
  color: var(--figma-color-text-secondary);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvaW5saW5lLXRleHQvbXV0ZWQvbXV0ZWQubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHdDQUF3QztBQUMxQyIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2lubGluZS10ZXh0L211dGVkL211dGVkLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubXV0ZWQge1xuICBjb2xvcjogdmFyKC0tZmlnbWEtY29sb3ItdGV4dC1zZWNvbmRhcnkpO1xufVxuIl19 */`;
        document.head.append(element);
      }
      muted_module_default = { "muted": "_muted_139yx_1" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/inline-text/muted/muted.js
  var Muted;
  var init_muted = __esm({
    "node_modules/@create-figma-plugin/ui/lib/inline-text/muted/muted.js"() {
      init_preact_module();
      init_create_component();
      init_muted_module();
      Muted = createComponent(function(_a, ref) {
        var _b = _a, { children } = _b, rest = __objRest(_b, ["children"]);
        return _("span", __spreadProps(__spreadValues({}, rest), { ref, class: muted_module_default.muted }), children);
      });
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/031157b3-d54e-4b65-a41e-8afff4ca0b9e/vertical-space.module.js
  var vertical_space_module_default;
  var init_vertical_space_module = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/031157b3-d54e-4b65-a41e-8afff4ca0b9e/vertical-space.module.js"() {
      if (document.getElementById("07af95abe2") === null) {
        const element = document.createElement("style");
        element.id = "07af95abe2";
        element.textContent = `._extraSmall_zc4n0_1 {
  height: var(--space-extra-small);
}
._small_zc4n0_4 {
  height: var(--space-small);
}
._medium_zc4n0_7 {
  height: var(--space-medium);
}
._large_zc4n0_10 {
  height: var(--space-large);
}
._extraLarge_zc4n0_13 {
  height: var(--space-extra-large);
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91aS9saWIvbGF5b3V0L3ZlcnRpY2FsLXNwYWNlL3ZlcnRpY2FsLXNwYWNlLm1vZHVsZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxnQ0FBZ0M7QUFDbEM7QUFDQTtFQUNFLDBCQUEwQjtBQUM1QjtBQUNBO0VBQ0UsMkJBQTJCO0FBQzdCO0FBQ0E7RUFDRSwwQkFBMEI7QUFDNUI7QUFDQTtFQUNFLGdDQUFnQztBQUNsQyIsImZpbGUiOiJub2RlX21vZHVsZXMvQGNyZWF0ZS1maWdtYS1wbHVnaW4vdWkvbGliL2xheW91dC92ZXJ0aWNhbC1zcGFjZS92ZXJ0aWNhbC1zcGFjZS5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmV4dHJhU21hbGwge1xuICBoZWlnaHQ6IHZhcigtLXNwYWNlLWV4dHJhLXNtYWxsKTtcbn1cbi5zbWFsbCB7XG4gIGhlaWdodDogdmFyKC0tc3BhY2Utc21hbGwpO1xufVxuLm1lZGl1bSB7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtbWVkaXVtKTtcbn1cbi5sYXJnZSB7XG4gIGhlaWdodDogdmFyKC0tc3BhY2UtbGFyZ2UpO1xufVxuLmV4dHJhTGFyZ2Uge1xuICBoZWlnaHQ6IHZhcigtLXNwYWNlLWV4dHJhLWxhcmdlKTtcbn1cbiJdfQ== */`;
        document.head.append(element);
      }
      vertical_space_module_default = { "extraSmall": "_extraSmall_zc4n0_1", "small": "_small_zc4n0_4", "medium": "_medium_zc4n0_7", "large": "_large_zc4n0_10", "extraLarge": "_extraLarge_zc4n0_13" };
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/layout/vertical-space/vertical-space.js
  var VerticalSpace;
  var init_vertical_space = __esm({
    "node_modules/@create-figma-plugin/ui/lib/layout/vertical-space/vertical-space.js"() {
      init_preact_module();
      init_create_component();
      init_vertical_space_module();
      VerticalSpace = createComponent(function(_a, ref) {
        var _b = _a, { space } = _b, rest = __objRest(_b, ["space"]);
        return _("div", __spreadProps(__spreadValues({}, rest), { ref, class: vertical_space_module_default[space] }));
      });
    }
  });

  // ../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/d642fe70-2f45-45f5-8310-c677007aba42/base.js
  var init_base = __esm({
    "../../../../private/var/folders/q1/zcllv9c54951yp5j5dk_7s2c0000gp/T/d642fe70-2f45-45f5-8310-c677007aba42/base.js"() {
      if (document.getElementById("779e0f5e90") === null) {
        const element = document.createElement("style");
        element.id = "779e0f5e90";
        element.textContent = `:root {
  --border-width-1: 1px;
  --border-width-4: 4px;
  --border-radius-2: 2px;
  --border-radius-4: 4px;
  --border-radius-6: 6px;
  --border-radius-12: 12px;
  --box-shadow: var(--box-shadow-menu);
  --box-shadow-menu:
    0 5px 17px rgba(0, 0, 0, 0.2), 0 2px 7px rgba(0, 0, 0, 0.15),
    inset 0 0 0 0.5px #000000, 0 0 0 0.5px rgba(0, 0, 0, 0.1);
  --box-shadow-modal:
    0 2px 14px rgba(0, 0, 0, 0.15), 0 0 0 0.5px rgba(0, 0, 0, 0.2);
  --box-shadow-range-slider:
    0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 3px 8px 0 rgba(0, 0, 0, 0.1),
    0 0 0.5px 0 rgba(0, 0, 0, 0.18), inset 0 0 0 0.5px rgba(0, 0, 0, 0.1);
  --color-bg-menu: #1e1e1e;
  --color-bg-overlay: rgba(0, 0, 0, 0.5);
  --font-family: 'Inter', 'Helvetica', sans-serif;
  --font-family-code:
    SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  --font-size-11: 11px;
  --font-size-12: 12px;
  --font-weight-regular: 400;
  --font-weight-bold: 600;
  --line-height-16: 16px;
  --opacity-30: 0.3;
  --space-extra-small: 8px;
  --space-small: 12px;
  --space-medium: 16px;
  --space-large: 20px;
  --space-extra-large: 24px;
  --space-0: 0;
  --space-4: 4px;
  --space-6: 6px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-20: 20px;
  --space-24: 24px;
  --space-28: 28px;
  --space-32: 32px;
  --transition-duration-100: 0.1s;
  --transition-duration-300: 0.3s;
  --z-index-1: 1;
  --z-index-2: 2;
}

.figma-dark {
  color-scheme: dark;
}

* {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}

body {
  margin: 0;
  background-color: var(--figma-color-bg);
  color: var(--figma-color-text);
  font-family: var(--font-family);
  font-size: var(--font-size-11);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-16);
}

div,
span {
  cursor: default;
  user-select: none;
}

h1,
h2,
h3 {
  margin: 0;
  font-weight: inherit;
}

button {
  padding: 0;
  border: 0;
  -webkit-appearance: none;
  background-color: transparent;
  font: inherit;
  outline: 0;
}

hr {
  border: 0;
  margin: 0;
}

label {
  display: block;
}

input,
textarea {
  padding: 0;
  border: 0;
  margin: 0;
  -webkit-appearance: none;
  cursor: default;
  font: inherit;
  outline: 0;
}

svg {
  display: block;
}

::selection {
  background-color: var(--figma-color-bg-onselected);
}
`;
        document.head.prepend(element);
      }
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/utilities/render.js
  function render(Plugin2) {
    return function(rootNode2, props) {
      G(_(Plugin2, __spreadValues({}, props)), rootNode2);
    };
  }
  var init_render = __esm({
    "node_modules/@create-figma-plugin/ui/lib/utilities/render.js"() {
      init_base();
      init_preact_module();
    }
  });

  // node_modules/@create-figma-plugin/ui/lib/index.js
  var init_lib2 = __esm({
    "node_modules/@create-figma-plugin/ui/lib/index.js"() {
      init_button();
      init_checkbox();
      init_dropdown();
      init_icon_button();
      init_loading_indicator();
      init_modal();
      init_selectable_item();
      init_text();
      init_textbox_multiline();
      init_icon_boolean_16();
      init_icon_chevron_down_16();
      init_icon_close_16();
      init_icon_component_property_16();
      init_icon_instance_16();
      init_icon_plus_16();
      init_muted();
      init_vertical_space();
      init_render();
    }
  });

  // node_modules/js-yaml/dist/js-yaml.mjs
  function isNothing(subject) {
    return typeof subject === "undefined" || subject === null;
  }
  function isObject(subject) {
    return typeof subject === "object" && subject !== null;
  }
  function toArray(sequence) {
    if (Array.isArray(sequence)) return sequence;
    else if (isNothing(sequence)) return [];
    return [sequence];
  }
  function extend(target, source) {
    var index, length, key, sourceKeys;
    if (source) {
      sourceKeys = Object.keys(source);
      for (index = 0, length = sourceKeys.length; index < length; index += 1) {
        key = sourceKeys[index];
        target[key] = source[key];
      }
    }
    return target;
  }
  function repeat(string, count) {
    var result = "", cycle;
    for (cycle = 0; cycle < count; cycle += 1) {
      result += string;
    }
    return result;
  }
  function isNegativeZero(number) {
    return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
  }
  function formatError(exception2, compact) {
    var where = "", message = exception2.reason || "(unknown reason)";
    if (!exception2.mark) return message;
    if (exception2.mark.name) {
      where += 'in "' + exception2.mark.name + '" ';
    }
    where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
    if (!compact && exception2.mark.snippet) {
      where += "\n\n" + exception2.mark.snippet;
    }
    return message + " " + where;
  }
  function YAMLException$1(reason, mark) {
    Error.call(this);
    this.name = "YAMLException";
    this.reason = reason;
    this.mark = mark;
    this.message = formatError(this, false);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack || "";
    }
  }
  function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
    var head = "";
    var tail = "";
    var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
    if (position - lineStart > maxHalfLength) {
      head = " ... ";
      lineStart = position - maxHalfLength + head.length;
    }
    if (lineEnd - position > maxHalfLength) {
      tail = " ...";
      lineEnd = position + maxHalfLength - tail.length;
    }
    return {
      str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
      pos: position - lineStart + head.length
      // relative position
    };
  }
  function padStart(string, max) {
    return common.repeat(" ", max - string.length) + string;
  }
  function makeSnippet(mark, options) {
    options = Object.create(options || null);
    if (!mark.buffer) return null;
    if (!options.maxLength) options.maxLength = 79;
    if (typeof options.indent !== "number") options.indent = 1;
    if (typeof options.linesBefore !== "number") options.linesBefore = 3;
    if (typeof options.linesAfter !== "number") options.linesAfter = 2;
    var re = /\r?\n|\r|\0/g;
    var lineStarts = [0];
    var lineEnds = [];
    var match;
    var foundLineNo = -1;
    while (match = re.exec(mark.buffer)) {
      lineEnds.push(match.index);
      lineStarts.push(match.index + match[0].length);
      if (mark.position <= match.index && foundLineNo < 0) {
        foundLineNo = lineStarts.length - 2;
      }
    }
    if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
    var result = "", i3, line;
    var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
    var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
    for (i3 = 1; i3 <= options.linesBefore; i3++) {
      if (foundLineNo - i3 < 0) break;
      line = getLine(
        mark.buffer,
        lineStarts[foundLineNo - i3],
        lineEnds[foundLineNo - i3],
        mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i3]),
        maxLineLength
      );
      result = common.repeat(" ", options.indent) + padStart((mark.line - i3 + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
    }
    line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
    result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
    result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
    for (i3 = 1; i3 <= options.linesAfter; i3++) {
      if (foundLineNo + i3 >= lineEnds.length) break;
      line = getLine(
        mark.buffer,
        lineStarts[foundLineNo + i3],
        lineEnds[foundLineNo + i3],
        mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i3]),
        maxLineLength
      );
      result += common.repeat(" ", options.indent) + padStart((mark.line + i3 + 1).toString(), lineNoLength) + " | " + line.str + "\n";
    }
    return result.replace(/\n$/, "");
  }
  function compileStyleAliases(map2) {
    var result = {};
    if (map2 !== null) {
      Object.keys(map2).forEach(function(style) {
        map2[style].forEach(function(alias) {
          result[String(alias)] = style;
        });
      });
    }
    return result;
  }
  function Type$1(tag, options) {
    options = options || {};
    Object.keys(options).forEach(function(name) {
      if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
        throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
      }
    });
    this.options = options;
    this.tag = tag;
    this.kind = options["kind"] || null;
    this.resolve = options["resolve"] || function() {
      return true;
    };
    this.construct = options["construct"] || function(data) {
      return data;
    };
    this.instanceOf = options["instanceOf"] || null;
    this.predicate = options["predicate"] || null;
    this.represent = options["represent"] || null;
    this.representName = options["representName"] || null;
    this.defaultStyle = options["defaultStyle"] || null;
    this.multi = options["multi"] || false;
    this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
    if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
      throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
    }
  }
  function compileList(schema2, name) {
    var result = [];
    schema2[name].forEach(function(currentType) {
      var newIndex = result.length;
      result.forEach(function(previousType, previousIndex) {
        if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
          newIndex = previousIndex;
        }
      });
      result[newIndex] = currentType;
    });
    return result;
  }
  function compileMap() {
    var result = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, index, length;
    function collectType(type2) {
      if (type2.multi) {
        result.multi[type2.kind].push(type2);
        result.multi["fallback"].push(type2);
      } else {
        result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
      }
    }
    for (index = 0, length = arguments.length; index < length; index += 1) {
      arguments[index].forEach(collectType);
    }
    return result;
  }
  function Schema$1(definition) {
    return this.extend(definition);
  }
  function resolveYamlNull(data) {
    if (data === null) return true;
    var max = data.length;
    return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
  }
  function constructYamlNull() {
    return null;
  }
  function isNull(object) {
    return object === null;
  }
  function resolveYamlBoolean(data) {
    if (data === null) return false;
    var max = data.length;
    return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
  }
  function constructYamlBoolean(data) {
    return data === "true" || data === "True" || data === "TRUE";
  }
  function isBoolean(object) {
    return Object.prototype.toString.call(object) === "[object Boolean]";
  }
  function isHexCode(c3) {
    return 48 <= c3 && c3 <= 57 || 65 <= c3 && c3 <= 70 || 97 <= c3 && c3 <= 102;
  }
  function isOctCode(c3) {
    return 48 <= c3 && c3 <= 55;
  }
  function isDecCode(c3) {
    return 48 <= c3 && c3 <= 57;
  }
  function resolveYamlInteger(data) {
    if (data === null) return false;
    var max = data.length, index = 0, hasDigits = false, ch;
    if (!max) return false;
    ch = data[index];
    if (ch === "-" || ch === "+") {
      ch = data[++index];
    }
    if (ch === "0") {
      if (index + 1 === max) return true;
      ch = data[++index];
      if (ch === "b") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (ch !== "0" && ch !== "1") return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "x") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isHexCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "o") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isOctCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
    }
    if (ch === "_") return false;
    for (; index < max; index++) {
      ch = data[index];
      if (ch === "_") continue;
      if (!isDecCode(data.charCodeAt(index))) {
        return false;
      }
      hasDigits = true;
    }
    if (!hasDigits || ch === "_") return false;
    return true;
  }
  function constructYamlInteger(data) {
    var value = data, sign = 1, ch;
    if (value.indexOf("_") !== -1) {
      value = value.replace(/_/g, "");
    }
    ch = value[0];
    if (ch === "-" || ch === "+") {
      if (ch === "-") sign = -1;
      value = value.slice(1);
      ch = value[0];
    }
    if (value === "0") return 0;
    if (ch === "0") {
      if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
      if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
      if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
    }
    return sign * parseInt(value, 10);
  }
  function isInteger(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
  }
  function resolveYamlFloat(data) {
    if (data === null) return false;
    if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    data[data.length - 1] === "_") {
      return false;
    }
    return true;
  }
  function constructYamlFloat(data) {
    var value, sign;
    value = data.replace(/_/g, "").toLowerCase();
    sign = value[0] === "-" ? -1 : 1;
    if ("+-".indexOf(value[0]) >= 0) {
      value = value.slice(1);
    }
    if (value === ".inf") {
      return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    } else if (value === ".nan") {
      return NaN;
    }
    return sign * parseFloat(value, 10);
  }
  function representYamlFloat(object, style) {
    var res;
    if (isNaN(object)) {
      switch (style) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    } else if (Number.POSITIVE_INFINITY === object) {
      switch (style) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    } else if (Number.NEGATIVE_INFINITY === object) {
      switch (style) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    } else if (common.isNegativeZero(object)) {
      return "-0.0";
    }
    res = object.toString(10);
    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
  }
  function isFloat(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
  }
  function resolveYamlTimestamp(data) {
    if (data === null) return false;
    if (YAML_DATE_REGEXP.exec(data) !== null) return true;
    if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
    return false;
  }
  function constructYamlTimestamp(data) {
    var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
    match = YAML_DATE_REGEXP.exec(data);
    if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
    if (match === null) throw new Error("Date resolve error");
    year = +match[1];
    month = +match[2] - 1;
    day = +match[3];
    if (!match[4]) {
      return new Date(Date.UTC(year, month, day));
    }
    hour = +match[4];
    minute = +match[5];
    second = +match[6];
    if (match[7]) {
      fraction = match[7].slice(0, 3);
      while (fraction.length < 3) {
        fraction += "0";
      }
      fraction = +fraction;
    }
    if (match[9]) {
      tz_hour = +match[10];
      tz_minute = +(match[11] || 0);
      delta = (tz_hour * 60 + tz_minute) * 6e4;
      if (match[9] === "-") delta = -delta;
    }
    date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
    if (delta) date.setTime(date.getTime() - delta);
    return date;
  }
  function representYamlTimestamp(object) {
    return object.toISOString();
  }
  function resolveYamlMerge(data) {
    return data === "<<" || data === null;
  }
  function resolveYamlBinary(data) {
    if (data === null) return false;
    var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
    for (idx = 0; idx < max; idx++) {
      code = map2.indexOf(data.charAt(idx));
      if (code > 64) continue;
      if (code < 0) return false;
      bitlen += 6;
    }
    return bitlen % 8 === 0;
  }
  function constructYamlBinary(data) {
    var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
    for (idx = 0; idx < max; idx++) {
      if (idx % 4 === 0 && idx) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
      }
      bits = bits << 6 | map2.indexOf(input.charAt(idx));
    }
    tailbits = max % 4 * 6;
    if (tailbits === 0) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    } else if (tailbits === 18) {
      result.push(bits >> 10 & 255);
      result.push(bits >> 2 & 255);
    } else if (tailbits === 12) {
      result.push(bits >> 4 & 255);
    }
    return new Uint8Array(result);
  }
  function representYamlBinary(object) {
    var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
    for (idx = 0; idx < max; idx++) {
      if (idx % 3 === 0 && idx) {
        result += map2[bits >> 18 & 63];
        result += map2[bits >> 12 & 63];
        result += map2[bits >> 6 & 63];
        result += map2[bits & 63];
      }
      bits = (bits << 8) + object[idx];
    }
    tail = max % 3;
    if (tail === 0) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    } else if (tail === 2) {
      result += map2[bits >> 10 & 63];
      result += map2[bits >> 4 & 63];
      result += map2[bits << 2 & 63];
      result += map2[64];
    } else if (tail === 1) {
      result += map2[bits >> 2 & 63];
      result += map2[bits << 4 & 63];
      result += map2[64];
      result += map2[64];
    }
    return result;
  }
  function isBinary(obj) {
    return Object.prototype.toString.call(obj) === "[object Uint8Array]";
  }
  function resolveYamlOmap(data) {
    if (data === null) return true;
    var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      pairHasKey = false;
      if (_toString$2.call(pair) !== "[object Object]") return false;
      for (pairKey in pair) {
        if (_hasOwnProperty$3.call(pair, pairKey)) {
          if (!pairHasKey) pairHasKey = true;
          else return false;
        }
      }
      if (!pairHasKey) return false;
      if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
      else return false;
    }
    return true;
  }
  function constructYamlOmap(data) {
    return data !== null ? data : [];
  }
  function resolveYamlPairs(data) {
    if (data === null) return true;
    var index, length, pair, keys, result, object = data;
    result = new Array(object.length);
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      if (_toString$1.call(pair) !== "[object Object]") return false;
      keys = Object.keys(pair);
      if (keys.length !== 1) return false;
      result[index] = [keys[0], pair[keys[0]]];
    }
    return true;
  }
  function constructYamlPairs(data) {
    if (data === null) return [];
    var index, length, pair, keys, result, object = data;
    result = new Array(object.length);
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      keys = Object.keys(pair);
      result[index] = [keys[0], pair[keys[0]]];
    }
    return result;
  }
  function resolveYamlSet(data) {
    if (data === null) return true;
    var key, object = data;
    for (key in object) {
      if (_hasOwnProperty$2.call(object, key)) {
        if (object[key] !== null) return false;
      }
    }
    return true;
  }
  function constructYamlSet(data) {
    return data !== null ? data : {};
  }
  function _class(obj) {
    return Object.prototype.toString.call(obj);
  }
  function is_EOL(c3) {
    return c3 === 10 || c3 === 13;
  }
  function is_WHITE_SPACE(c3) {
    return c3 === 9 || c3 === 32;
  }
  function is_WS_OR_EOL(c3) {
    return c3 === 9 || c3 === 32 || c3 === 10 || c3 === 13;
  }
  function is_FLOW_INDICATOR(c3) {
    return c3 === 44 || c3 === 91 || c3 === 93 || c3 === 123 || c3 === 125;
  }
  function fromHexCode(c3) {
    var lc;
    if (48 <= c3 && c3 <= 57) {
      return c3 - 48;
    }
    lc = c3 | 32;
    if (97 <= lc && lc <= 102) {
      return lc - 97 + 10;
    }
    return -1;
  }
  function escapedHexLen(c3) {
    if (c3 === 120) {
      return 2;
    }
    if (c3 === 117) {
      return 4;
    }
    if (c3 === 85) {
      return 8;
    }
    return 0;
  }
  function fromDecimalCode(c3) {
    if (48 <= c3 && c3 <= 57) {
      return c3 - 48;
    }
    return -1;
  }
  function simpleEscapeSequence(c3) {
    return c3 === 48 ? "\0" : c3 === 97 ? "\x07" : c3 === 98 ? "\b" : c3 === 116 ? "	" : c3 === 9 ? "	" : c3 === 110 ? "\n" : c3 === 118 ? "\v" : c3 === 102 ? "\f" : c3 === 114 ? "\r" : c3 === 101 ? "\x1B" : c3 === 32 ? " " : c3 === 34 ? '"' : c3 === 47 ? "/" : c3 === 92 ? "\\" : c3 === 78 ? "\x85" : c3 === 95 ? "\xA0" : c3 === 76 ? "\u2028" : c3 === 80 ? "\u2029" : "";
  }
  function charFromCodepoint(c3) {
    if (c3 <= 65535) {
      return String.fromCharCode(c3);
    }
    return String.fromCharCode(
      (c3 - 65536 >> 10) + 55296,
      (c3 - 65536 & 1023) + 56320
    );
  }
  function State$1(input, options) {
    this.input = input;
    this.filename = options["filename"] || null;
    this.schema = options["schema"] || _default;
    this.onWarning = options["onWarning"] || null;
    this.legacy = options["legacy"] || false;
    this.json = options["json"] || false;
    this.listener = options["listener"] || null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.typeMap = this.schema.compiledTypeMap;
    this.length = input.length;
    this.position = 0;
    this.line = 0;
    this.lineStart = 0;
    this.lineIndent = 0;
    this.firstTabInLine = -1;
    this.documents = [];
  }
  function generateError(state, message) {
    var mark = {
      name: state.filename,
      buffer: state.input.slice(0, -1),
      // omit trailing \0
      position: state.position,
      line: state.line,
      column: state.position - state.lineStart
    };
    mark.snippet = snippet(mark);
    return new exception(message, mark);
  }
  function throwError(state, message) {
    throw generateError(state, message);
  }
  function throwWarning(state, message) {
    if (state.onWarning) {
      state.onWarning.call(null, generateError(state, message));
    }
  }
  function captureSegment(state, start, end, checkJson) {
    var _position, _length, _character, _result;
    if (start < end) {
      _result = state.input.slice(start, end);
      if (checkJson) {
        for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
          _character = _result.charCodeAt(_position);
          if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
            throwError(state, "expected valid JSON character");
          }
        }
      } else if (PATTERN_NON_PRINTABLE.test(_result)) {
        throwError(state, "the stream contains non-printable characters");
      }
      state.result += _result;
    }
  }
  function mergeMappings(state, destination, source, overridableKeys) {
    var sourceKeys, key, index, quantity;
    if (!common.isObject(source)) {
      throwError(state, "cannot merge mappings; the provided source object is unacceptable");
    }
    sourceKeys = Object.keys(source);
    for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
      key = sourceKeys[index];
      if (!_hasOwnProperty$1.call(destination, key)) {
        destination[key] = source[key];
        overridableKeys[key] = true;
      }
    }
  }
  function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
    var index, quantity;
    if (Array.isArray(keyNode)) {
      keyNode = Array.prototype.slice.call(keyNode);
      for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
        if (Array.isArray(keyNode[index])) {
          throwError(state, "nested arrays are not supported inside keys");
        }
        if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
          keyNode[index] = "[object Object]";
        }
      }
    }
    if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
      keyNode = "[object Object]";
    }
    keyNode = String(keyNode);
    if (_result === null) {
      _result = {};
    }
    if (keyTag === "tag:yaml.org,2002:merge") {
      if (Array.isArray(valueNode)) {
        for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
          mergeMappings(state, _result, valueNode[index], overridableKeys);
        }
      } else {
        mergeMappings(state, _result, valueNode, overridableKeys);
      }
    } else {
      if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
        state.line = startLine || state.line;
        state.lineStart = startLineStart || state.lineStart;
        state.position = startPos || state.position;
        throwError(state, "duplicated mapping key");
      }
      if (keyNode === "__proto__") {
        Object.defineProperty(_result, keyNode, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: valueNode
        });
      } else {
        _result[keyNode] = valueNode;
      }
      delete overridableKeys[keyNode];
    }
    return _result;
  }
  function readLineBreak(state) {
    var ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 10) {
      state.position++;
    } else if (ch === 13) {
      state.position++;
      if (state.input.charCodeAt(state.position) === 10) {
        state.position++;
      }
    } else {
      throwError(state, "a line break is expected");
    }
    state.line += 1;
    state.lineStart = state.position;
    state.firstTabInLine = -1;
  }
  function skipSeparationSpace(state, allowComments, checkIndent) {
    var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        if (ch === 9 && state.firstTabInLine === -1) {
          state.firstTabInLine = state.position;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      if (allowComments && ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 10 && ch !== 13 && ch !== 0);
      }
      if (is_EOL(ch)) {
        readLineBreak(state);
        ch = state.input.charCodeAt(state.position);
        lineBreaks++;
        state.lineIndent = 0;
        while (ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
      } else {
        break;
      }
    }
    if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
      throwWarning(state, "deficient indentation");
    }
    return lineBreaks;
  }
  function testDocumentSeparator(state) {
    var _position = state.position, ch;
    ch = state.input.charCodeAt(_position);
    if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
      _position += 3;
      ch = state.input.charCodeAt(_position);
      if (ch === 0 || is_WS_OR_EOL(ch)) {
        return true;
      }
    }
    return false;
  }
  function writeFoldedLines(state, count) {
    if (count === 1) {
      state.result += " ";
    } else if (count > 1) {
      state.result += common.repeat("\n", count - 1);
    }
  }
  function readPlainScalar(state, nodeIndent, withinFlowCollection) {
    var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
    ch = state.input.charCodeAt(state.position);
    if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
      return false;
    }
    if (ch === 63 || ch === 45) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        return false;
      }
    }
    state.kind = "scalar";
    state.result = "";
    captureStart = captureEnd = state.position;
    hasPendingContent = false;
    while (ch !== 0) {
      if (ch === 58) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          break;
        }
      } else if (ch === 35) {
        preceding = state.input.charCodeAt(state.position - 1);
        if (is_WS_OR_EOL(preceding)) {
          break;
        }
      } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
        break;
      } else if (is_EOL(ch)) {
        _line = state.line;
        _lineStart = state.lineStart;
        _lineIndent = state.lineIndent;
        skipSeparationSpace(state, false, -1);
        if (state.lineIndent >= nodeIndent) {
          hasPendingContent = true;
          ch = state.input.charCodeAt(state.position);
          continue;
        } else {
          state.position = captureEnd;
          state.line = _line;
          state.lineStart = _lineStart;
          state.lineIndent = _lineIndent;
          break;
        }
      }
      if (hasPendingContent) {
        captureSegment(state, captureStart, captureEnd, false);
        writeFoldedLines(state, state.line - _line);
        captureStart = captureEnd = state.position;
        hasPendingContent = false;
      }
      if (!is_WHITE_SPACE(ch)) {
        captureEnd = state.position + 1;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, captureEnd, false);
    if (state.result) {
      return true;
    }
    state.kind = _kind;
    state.result = _result;
    return false;
  }
  function readSingleQuotedScalar(state, nodeIndent) {
    var ch, captureStart, captureEnd;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 39) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 39) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (ch === 39) {
          captureStart = state.position;
          state.position++;
          captureEnd = state.position;
        } else {
          return true;
        }
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a single quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a single quoted scalar");
  }
  function readDoubleQuotedScalar(state, nodeIndent) {
    var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 34) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 34) {
        captureSegment(state, captureStart, state.position, true);
        state.position++;
        return true;
      } else if (ch === 92) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (is_EOL(ch)) {
          skipSeparationSpace(state, false, nodeIndent);
        } else if (ch < 256 && simpleEscapeCheck[ch]) {
          state.result += simpleEscapeMap[ch];
          state.position++;
        } else if ((tmp = escapedHexLen(ch)) > 0) {
          hexLength = tmp;
          hexResult = 0;
          for (; hexLength > 0; hexLength--) {
            ch = state.input.charCodeAt(++state.position);
            if ((tmp = fromHexCode(ch)) >= 0) {
              hexResult = (hexResult << 4) + tmp;
            } else {
              throwError(state, "expected hexadecimal character");
            }
          }
          state.result += charFromCodepoint(hexResult);
          state.position++;
        } else {
          throwError(state, "unknown escape sequence");
        }
        captureStart = captureEnd = state.position;
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a double quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a double quoted scalar");
  }
  function readFlowCollection(state, nodeIndent) {
    var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 91) {
      terminator = 93;
      isMapping = false;
      _result = [];
    } else if (ch === 123) {
      terminator = 125;
      isMapping = true;
      _result = {};
    } else {
      return false;
    }
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(++state.position);
    while (ch !== 0) {
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === terminator) {
        state.position++;
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = isMapping ? "mapping" : "sequence";
        state.result = _result;
        return true;
      } else if (!readNext) {
        throwError(state, "missed comma between flow collection entries");
      } else if (ch === 44) {
        throwError(state, "expected the node content, but found ','");
      }
      keyTag = keyNode = valueNode = null;
      isPair = isExplicitPair = false;
      if (ch === 63) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following)) {
          isPair = isExplicitPair = true;
          state.position++;
          skipSeparationSpace(state, true, nodeIndent);
        }
      }
      _line = state.line;
      _lineStart = state.lineStart;
      _pos = state.position;
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      keyTag = state.tag;
      keyNode = state.result;
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if ((isExplicitPair || state.line === _line) && ch === 58) {
        isPair = true;
        ch = state.input.charCodeAt(++state.position);
        skipSeparationSpace(state, true, nodeIndent);
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        valueNode = state.result;
      }
      if (isMapping) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
      } else if (isPair) {
        _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
      } else {
        _result.push(keyNode);
      }
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === 44) {
        readNext = true;
        ch = state.input.charCodeAt(++state.position);
      } else {
        readNext = false;
      }
    }
    throwError(state, "unexpected end of the stream within a flow collection");
  }
  function readBlockScalar(state, nodeIndent) {
    var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 124) {
      folding = false;
    } else if (ch === 62) {
      folding = true;
    } else {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    while (ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
      if (ch === 43 || ch === 45) {
        if (CHOMPING_CLIP === chomping) {
          chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
        } else {
          throwError(state, "repeat of a chomping mode identifier");
        }
      } else if ((tmp = fromDecimalCode(ch)) >= 0) {
        if (tmp === 0) {
          throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
        } else if (!detectedIndent) {
          textIndent = nodeIndent + tmp - 1;
          detectedIndent = true;
        } else {
          throwError(state, "repeat of an indentation width identifier");
        }
      } else {
        break;
      }
    }
    if (is_WHITE_SPACE(ch)) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (is_WHITE_SPACE(ch));
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (!is_EOL(ch) && ch !== 0);
      }
    }
    while (ch !== 0) {
      readLineBreak(state);
      state.lineIndent = 0;
      ch = state.input.charCodeAt(state.position);
      while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
      if (!detectedIndent && state.lineIndent > textIndent) {
        textIndent = state.lineIndent;
      }
      if (is_EOL(ch)) {
        emptyLines++;
        continue;
      }
      if (state.lineIndent < textIndent) {
        if (chomping === CHOMPING_KEEP) {
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        } else if (chomping === CHOMPING_CLIP) {
          if (didReadContent) {
            state.result += "\n";
          }
        }
        break;
      }
      if (folding) {
        if (is_WHITE_SPACE(ch)) {
          atMoreIndented = true;
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        } else if (atMoreIndented) {
          atMoreIndented = false;
          state.result += common.repeat("\n", emptyLines + 1);
        } else if (emptyLines === 0) {
          if (didReadContent) {
            state.result += " ";
          }
        } else {
          state.result += common.repeat("\n", emptyLines);
        }
      } else {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      }
      didReadContent = true;
      detectedIndent = true;
      emptyLines = 0;
      captureStart = state.position;
      while (!is_EOL(ch) && ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, state.position, false);
    }
    return true;
  }
  function readBlockSequence(state, nodeIndent) {
    var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
    if (state.firstTabInLine !== -1) return false;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, "tab characters must not be used in indentation");
      }
      if (ch !== 45) {
        break;
      }
      following = state.input.charCodeAt(state.position + 1);
      if (!is_WS_OR_EOL(following)) {
        break;
      }
      detected = true;
      state.position++;
      if (skipSeparationSpace(state, true, -1)) {
        if (state.lineIndent <= nodeIndent) {
          _result.push(null);
          ch = state.input.charCodeAt(state.position);
          continue;
        }
      }
      _line = state.line;
      composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
      _result.push(state.result);
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a sequence entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "sequence";
      state.result = _result;
      return true;
    }
    return false;
  }
  function readBlockMapping(state, nodeIndent, flowIndent) {
    var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
    if (state.firstTabInLine !== -1) return false;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (!atExplicitKey && state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, "tab characters must not be used in indentation");
      }
      following = state.input.charCodeAt(state.position + 1);
      _line = state.line;
      if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
        if (ch === 63) {
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = true;
          allowCompact = true;
        } else if (atExplicitKey) {
          atExplicitKey = false;
          allowCompact = true;
        } else {
          throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
        }
        state.position += 1;
        ch = following;
      } else {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
        if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
          break;
        }
        if (state.line === _line) {
          ch = state.input.charCodeAt(state.position);
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 58) {
            ch = state.input.charCodeAt(++state.position);
            if (!is_WS_OR_EOL(ch)) {
              throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
            }
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = false;
            allowCompact = false;
            keyTag = state.tag;
            keyNode = state.result;
          } else if (detected) {
            throwError(state, "can not read an implicit mapping pair; a colon is missed");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        } else if (detected) {
          throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      }
      if (state.line === _line || state.lineIndent > nodeIndent) {
        if (atExplicitKey) {
          _keyLine = state.line;
          _keyLineStart = state.lineStart;
          _keyPos = state.position;
        }
        if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
          if (atExplicitKey) {
            keyNode = state.result;
          } else {
            valueNode = state.result;
          }
        }
        if (!atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
      }
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a mapping entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (atExplicitKey) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "mapping";
      state.result = _result;
    }
    return detected;
  }
  function readTagProperty(state) {
    var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 33) return false;
    if (state.tag !== null) {
      throwError(state, "duplication of a tag property");
    }
    ch = state.input.charCodeAt(++state.position);
    if (ch === 60) {
      isVerbatim = true;
      ch = state.input.charCodeAt(++state.position);
    } else if (ch === 33) {
      isNamed = true;
      tagHandle = "!!";
      ch = state.input.charCodeAt(++state.position);
    } else {
      tagHandle = "!";
    }
    _position = state.position;
    if (isVerbatim) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0 && ch !== 62);
      if (state.position < state.length) {
        tagName = state.input.slice(_position, state.position);
        ch = state.input.charCodeAt(++state.position);
      } else {
        throwError(state, "unexpected end of the stream within a verbatim tag");
      }
    } else {
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        if (ch === 33) {
          if (!isNamed) {
            tagHandle = state.input.slice(_position - 1, state.position + 1);
            if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
              throwError(state, "named tag handle cannot contain such characters");
            }
            isNamed = true;
            _position = state.position + 1;
          } else {
            throwError(state, "tag suffix cannot contain exclamation marks");
          }
        }
        ch = state.input.charCodeAt(++state.position);
      }
      tagName = state.input.slice(_position, state.position);
      if (PATTERN_FLOW_INDICATORS.test(tagName)) {
        throwError(state, "tag suffix cannot contain flow indicator characters");
      }
    }
    if (tagName && !PATTERN_TAG_URI.test(tagName)) {
      throwError(state, "tag name cannot contain such characters: " + tagName);
    }
    try {
      tagName = decodeURIComponent(tagName);
    } catch (err) {
      throwError(state, "tag name is malformed: " + tagName);
    }
    if (isVerbatim) {
      state.tag = tagName;
    } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
      state.tag = state.tagMap[tagHandle] + tagName;
    } else if (tagHandle === "!") {
      state.tag = "!" + tagName;
    } else if (tagHandle === "!!") {
      state.tag = "tag:yaml.org,2002:" + tagName;
    } else {
      throwError(state, 'undeclared tag handle "' + tagHandle + '"');
    }
    return true;
  }
  function readAnchorProperty(state) {
    var _position, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 38) return false;
    if (state.anchor !== null) {
      throwError(state, "duplication of an anchor property");
    }
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an anchor node must contain at least one character");
    }
    state.anchor = state.input.slice(_position, state.position);
    return true;
  }
  function readAlias(state) {
    var _position, alias, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 42) return false;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an alias node must contain at least one character");
    }
    alias = state.input.slice(_position, state.position);
    if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
      throwError(state, 'unidentified alias "' + alias + '"');
    }
    state.result = state.anchorMap[alias];
    skipSeparationSpace(state, true, -1);
    return true;
  }
  function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
    if (state.listener !== null) {
      state.listener("open", state);
    }
    state.tag = null;
    state.anchor = null;
    state.kind = null;
    state.result = null;
    allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
    if (allowToSeek) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      }
    }
    if (indentStatus === 1) {
      while (readTagProperty(state) || readAnchorProperty(state)) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          allowBlockCollections = allowBlockStyles;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        } else {
          allowBlockCollections = false;
        }
      }
    }
    if (allowBlockCollections) {
      allowBlockCollections = atNewLine || allowCompact;
    }
    if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
      if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
        flowIndent = parentIndent;
      } else {
        flowIndent = parentIndent + 1;
      }
      blockIndent = state.position - state.lineStart;
      if (indentStatus === 1) {
        if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
          hasContent = true;
        } else {
          if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
            hasContent = true;
          } else if (readAlias(state)) {
            hasContent = true;
            if (state.tag !== null || state.anchor !== null) {
              throwError(state, "alias node should not have any properties");
            }
          } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
            hasContent = true;
            if (state.tag === null) {
              state.tag = "?";
            }
          }
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      } else if (indentStatus === 0) {
        hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
      }
    }
    if (state.tag === null) {
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    } else if (state.tag === "?") {
      if (state.result !== null && state.kind !== "scalar") {
        throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
      }
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
        type2 = state.implicitTypes[typeIndex];
        if (type2.resolve(state.result)) {
          state.result = type2.construct(state.result);
          state.tag = type2.tag;
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (state.tag !== "!") {
      if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
        type2 = state.typeMap[state.kind || "fallback"][state.tag];
      } else {
        type2 = null;
        typeList = state.typeMap.multi[state.kind || "fallback"];
        for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
          if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
            type2 = typeList[typeIndex];
            break;
          }
        }
      }
      if (!type2) {
        throwError(state, "unknown tag !<" + state.tag + ">");
      }
      if (state.result !== null && type2.kind !== state.kind) {
        throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
      }
      if (!type2.resolve(state.result, state.tag)) {
        throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
      } else {
        state.result = type2.construct(state.result, state.tag);
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    }
    if (state.listener !== null) {
      state.listener("close", state);
    }
    return state.tag !== null || state.anchor !== null || hasContent;
  }
  function readDocument(state) {
    var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
    state.version = null;
    state.checkLineBreaks = state.legacy;
    state.tagMap = /* @__PURE__ */ Object.create(null);
    state.anchorMap = /* @__PURE__ */ Object.create(null);
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if (state.lineIndent > 0 || ch !== 37) {
        break;
      }
      hasDirectives = true;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveName = state.input.slice(_position, state.position);
      directiveArgs = [];
      if (directiveName.length < 1) {
        throwError(state, "directive name must not be less than one character in length");
      }
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0 && !is_EOL(ch));
          break;
        }
        if (is_EOL(ch)) break;
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveArgs.push(state.input.slice(_position, state.position));
      }
      if (ch !== 0) readLineBreak(state);
      if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
        directiveHandlers[directiveName](state, directiveName, directiveArgs);
      } else {
        throwWarning(state, 'unknown document directive "' + directiveName + '"');
      }
    }
    skipSeparationSpace(state, true, -1);
    if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    } else if (hasDirectives) {
      throwError(state, "directives end mark is expected");
    }
    composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
    skipSeparationSpace(state, true, -1);
    if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
      throwWarning(state, "non-ASCII line breaks are interpreted as content");
    }
    state.documents.push(state.result);
    if (state.position === state.lineStart && testDocumentSeparator(state)) {
      if (state.input.charCodeAt(state.position) === 46) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      }
      return;
    }
    if (state.position < state.length - 1) {
      throwError(state, "end of the stream or a document separator is expected");
    } else {
      return;
    }
  }
  function loadDocuments(input, options) {
    input = String(input);
    options = options || {};
    if (input.length !== 0) {
      if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
        input += "\n";
      }
      if (input.charCodeAt(0) === 65279) {
        input = input.slice(1);
      }
    }
    var state = new State$1(input, options);
    var nullpos = input.indexOf("\0");
    if (nullpos !== -1) {
      state.position = nullpos;
      throwError(state, "null byte is not allowed in input");
    }
    state.input += "\0";
    while (state.input.charCodeAt(state.position) === 32) {
      state.lineIndent += 1;
      state.position += 1;
    }
    while (state.position < state.length - 1) {
      readDocument(state);
    }
    return state.documents;
  }
  function loadAll$1(input, iterator, options) {
    if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
      options = iterator;
      iterator = null;
    }
    var documents = loadDocuments(input, options);
    if (typeof iterator !== "function") {
      return documents;
    }
    for (var index = 0, length = documents.length; index < length; index += 1) {
      iterator(documents[index]);
    }
  }
  function load$1(input, options) {
    var documents = loadDocuments(input, options);
    if (documents.length === 0) {
      return void 0;
    } else if (documents.length === 1) {
      return documents[0];
    }
    throw new exception("expected a single document in the stream, but found more");
  }
  function compileStyleMap(schema2, map2) {
    var result, keys, index, length, tag, style, type2;
    if (map2 === null) return {};
    result = {};
    keys = Object.keys(map2);
    for (index = 0, length = keys.length; index < length; index += 1) {
      tag = keys[index];
      style = String(map2[tag]);
      if (tag.slice(0, 2) === "!!") {
        tag = "tag:yaml.org,2002:" + tag.slice(2);
      }
      type2 = schema2.compiledTypeMap["fallback"][tag];
      if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
        style = type2.styleAliases[style];
      }
      result[tag] = style;
    }
    return result;
  }
  function encodeHex(character) {
    var string, handle, length;
    string = character.toString(16).toUpperCase();
    if (character <= 255) {
      handle = "x";
      length = 2;
    } else if (character <= 65535) {
      handle = "u";
      length = 4;
    } else if (character <= 4294967295) {
      handle = "U";
      length = 8;
    } else {
      throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
    }
    return "\\" + handle + common.repeat("0", length - string.length) + string;
  }
  function State(options) {
    this.schema = options["schema"] || _default;
    this.indent = Math.max(1, options["indent"] || 2);
    this.noArrayIndent = options["noArrayIndent"] || false;
    this.skipInvalid = options["skipInvalid"] || false;
    this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
    this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
    this.sortKeys = options["sortKeys"] || false;
    this.lineWidth = options["lineWidth"] || 80;
    this.noRefs = options["noRefs"] || false;
    this.noCompatMode = options["noCompatMode"] || false;
    this.condenseFlow = options["condenseFlow"] || false;
    this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
    this.forceQuotes = options["forceQuotes"] || false;
    this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.explicitTypes = this.schema.compiledExplicit;
    this.tag = null;
    this.result = "";
    this.duplicates = [];
    this.usedDuplicates = null;
  }
  function indentString(string, spaces) {
    var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
    while (position < length) {
      next = string.indexOf("\n", position);
      if (next === -1) {
        line = string.slice(position);
        position = length;
      } else {
        line = string.slice(position, next + 1);
        position = next + 1;
      }
      if (line.length && line !== "\n") result += ind;
      result += line;
    }
    return result;
  }
  function generateNextLine(state, level) {
    return "\n" + common.repeat(" ", state.indent * level);
  }
  function testImplicitResolving(state, str2) {
    var index, length, type2;
    for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
      type2 = state.implicitTypes[index];
      if (type2.resolve(str2)) {
        return true;
      }
    }
    return false;
  }
  function isWhitespace(c3) {
    return c3 === CHAR_SPACE || c3 === CHAR_TAB;
  }
  function isPrintable(c3) {
    return 32 <= c3 && c3 <= 126 || 161 <= c3 && c3 <= 55295 && c3 !== 8232 && c3 !== 8233 || 57344 <= c3 && c3 <= 65533 && c3 !== CHAR_BOM || 65536 <= c3 && c3 <= 1114111;
  }
  function isNsCharOrWhitespace(c3) {
    return isPrintable(c3) && c3 !== CHAR_BOM && c3 !== CHAR_CARRIAGE_RETURN && c3 !== CHAR_LINE_FEED;
  }
  function isPlainSafe(c3, prev, inblock) {
    var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c3);
    var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c3);
    return (
      // ns-plain-safe
      (inblock ? (
        // c = flow-in
        cIsNsCharOrWhitespace
      ) : cIsNsCharOrWhitespace && c3 !== CHAR_COMMA && c3 !== CHAR_LEFT_SQUARE_BRACKET && c3 !== CHAR_RIGHT_SQUARE_BRACKET && c3 !== CHAR_LEFT_CURLY_BRACKET && c3 !== CHAR_RIGHT_CURLY_BRACKET) && c3 !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c3 === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
    );
  }
  function isPlainSafeFirst(c3) {
    return isPrintable(c3) && c3 !== CHAR_BOM && !isWhitespace(c3) && c3 !== CHAR_MINUS && c3 !== CHAR_QUESTION && c3 !== CHAR_COLON && c3 !== CHAR_COMMA && c3 !== CHAR_LEFT_SQUARE_BRACKET && c3 !== CHAR_RIGHT_SQUARE_BRACKET && c3 !== CHAR_LEFT_CURLY_BRACKET && c3 !== CHAR_RIGHT_CURLY_BRACKET && c3 !== CHAR_SHARP && c3 !== CHAR_AMPERSAND && c3 !== CHAR_ASTERISK && c3 !== CHAR_EXCLAMATION && c3 !== CHAR_VERTICAL_LINE && c3 !== CHAR_EQUALS && c3 !== CHAR_GREATER_THAN && c3 !== CHAR_SINGLE_QUOTE && c3 !== CHAR_DOUBLE_QUOTE && c3 !== CHAR_PERCENT && c3 !== CHAR_COMMERCIAL_AT && c3 !== CHAR_GRAVE_ACCENT;
  }
  function isPlainSafeLast(c3) {
    return !isWhitespace(c3) && c3 !== CHAR_COLON;
  }
  function codePointAt(string, pos) {
    var first = string.charCodeAt(pos), second;
    if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
      second = string.charCodeAt(pos + 1);
      if (second >= 56320 && second <= 57343) {
        return (first - 55296) * 1024 + second - 56320 + 65536;
      }
    }
    return first;
  }
  function needIndentIndicator(string) {
    var leadingSpaceRe = /^\n* /;
    return leadingSpaceRe.test(string);
  }
  function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
    var i3;
    var char = 0;
    var prevChar = null;
    var hasLineBreak = false;
    var hasFoldableLine = false;
    var shouldTrackWidth = lineWidth !== -1;
    var previousLineBreak = -1;
    var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
    if (singleLineOnly || forceQuotes) {
      for (i3 = 0; i3 < string.length; char >= 65536 ? i3 += 2 : i3++) {
        char = codePointAt(string, i3);
        if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
    } else {
      for (i3 = 0; i3 < string.length; char >= 65536 ? i3 += 2 : i3++) {
        char = codePointAt(string, i3);
        if (char === CHAR_LINE_FEED) {
          hasLineBreak = true;
          if (shouldTrackWidth) {
            hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
            i3 - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
            previousLineBreak = i3;
          }
        } else if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
      hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i3 - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
    }
    if (!hasLineBreak && !hasFoldableLine) {
      if (plain && !forceQuotes && !testAmbiguousType(string)) {
        return STYLE_PLAIN;
      }
      return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
    }
    if (indentPerLevel > 9 && needIndentIndicator(string)) {
      return STYLE_DOUBLE;
    }
    if (!forceQuotes) {
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  function writeScalar(state, string, level, iskey, inblock) {
    state.dump = function() {
      if (string.length === 0) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
      }
      if (!state.noCompatMode) {
        if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
          return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
        }
      }
      var indent = state.indent * Math.max(1, level);
      var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
      var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
      function testAmbiguity(string2) {
        return testImplicitResolving(state, string2);
      }
      switch (chooseScalarStyle(
        string,
        singleLineOnly,
        state.indent,
        lineWidth,
        testAmbiguity,
        state.quotingType,
        state.forceQuotes && !iskey,
        inblock
      )) {
        case STYLE_PLAIN:
          return string;
        case STYLE_SINGLE:
          return "'" + string.replace(/'/g, "''") + "'";
        case STYLE_LITERAL:
          return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
        case STYLE_FOLDED:
          return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
        case STYLE_DOUBLE:
          return '"' + escapeString(string) + '"';
        default:
          throw new exception("impossible error: invalid scalar style");
      }
    }();
  }
  function blockHeader(string, indentPerLevel) {
    var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
    var clip = string[string.length - 1] === "\n";
    var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
    var chomp = keep ? "+" : clip ? "" : "-";
    return indentIndicator + chomp + "\n";
  }
  function dropEndingNewline(string) {
    return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
  }
  function foldString(string, width) {
    var lineRe = /(\n+)([^\n]*)/g;
    var result = function() {
      var nextLF = string.indexOf("\n");
      nextLF = nextLF !== -1 ? nextLF : string.length;
      lineRe.lastIndex = nextLF;
      return foldLine(string.slice(0, nextLF), width);
    }();
    var prevMoreIndented = string[0] === "\n" || string[0] === " ";
    var moreIndented;
    var match;
    while (match = lineRe.exec(string)) {
      var prefix = match[1], line = match[2];
      moreIndented = line[0] === " ";
      result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
      prevMoreIndented = moreIndented;
    }
    return result;
  }
  function foldLine(line, width) {
    if (line === "" || line[0] === " ") return line;
    var breakRe = / [^ ]/g;
    var match;
    var start = 0, end, curr = 0, next = 0;
    var result = "";
    while (match = breakRe.exec(line)) {
      next = match.index;
      if (next - start > width) {
        end = curr > start ? curr : next;
        result += "\n" + line.slice(start, end);
        start = end + 1;
      }
      curr = next;
    }
    result += "\n";
    if (line.length - start > width && curr > start) {
      result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
    } else {
      result += line.slice(start);
    }
    return result.slice(1);
  }
  function escapeString(string) {
    var result = "";
    var char = 0;
    var escapeSeq;
    for (var i3 = 0; i3 < string.length; char >= 65536 ? i3 += 2 : i3++) {
      char = codePointAt(string, i3);
      escapeSeq = ESCAPE_SEQUENCES[char];
      if (!escapeSeq && isPrintable(char)) {
        result += string[i3];
        if (char >= 65536) result += string[i3 + 1];
      } else {
        result += escapeSeq || encodeHex(char);
      }
    }
    return result;
  }
  function writeFlowSequence(state, level, object) {
    var _result = "", _tag = state.tag, index, length, value;
    for (index = 0, length = object.length; index < length; index += 1) {
      value = object[index];
      if (state.replacer) {
        value = state.replacer.call(object, String(index), value);
      }
      if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
        if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = "[" + _result + "]";
  }
  function writeBlockSequence(state, level, object, compact) {
    var _result = "", _tag = state.tag, index, length, value;
    for (index = 0, length = object.length; index < length; index += 1) {
      value = object[index];
      if (state.replacer) {
        value = state.replacer.call(object, String(index), value);
      }
      if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
        if (!compact || _result !== "") {
          _result += generateNextLine(state, level);
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          _result += "-";
        } else {
          _result += "- ";
        }
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = _result || "[]";
  }
  function writeFlowMapping(state, level, object) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = "";
      if (_result !== "") pairBuffer += ", ";
      if (state.condenseFlow) pairBuffer += '"';
      objectKey = objectKeyList[index];
      objectValue = object[objectKey];
      if (state.replacer) {
        objectValue = state.replacer.call(object, objectKey, objectValue);
      }
      if (!writeNode(state, level, objectKey, false, false)) {
        continue;
      }
      if (state.dump.length > 1024) pairBuffer += "? ";
      pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
      if (!writeNode(state, level, objectValue, false, false)) {
        continue;
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = "{" + _result + "}";
  }
  function writeBlockMapping(state, level, object, compact) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
    if (state.sortKeys === true) {
      objectKeyList.sort();
    } else if (typeof state.sortKeys === "function") {
      objectKeyList.sort(state.sortKeys);
    } else if (state.sortKeys) {
      throw new exception("sortKeys must be a boolean or a function");
    }
    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = "";
      if (!compact || _result !== "") {
        pairBuffer += generateNextLine(state, level);
      }
      objectKey = objectKeyList[index];
      objectValue = object[objectKey];
      if (state.replacer) {
        objectValue = state.replacer.call(object, objectKey, objectValue);
      }
      if (!writeNode(state, level + 1, objectKey, true, true, true)) {
        continue;
      }
      explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
      if (explicitPair) {
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += "?";
        } else {
          pairBuffer += "? ";
        }
      }
      pairBuffer += state.dump;
      if (explicitPair) {
        pairBuffer += generateNextLine(state, level);
      }
      if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
        continue;
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += ":";
      } else {
        pairBuffer += ": ";
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = _result || "{}";
  }
  function detectType(state, object, explicit) {
    var _result, typeList, index, length, type2, style;
    typeList = explicit ? state.explicitTypes : state.implicitTypes;
    for (index = 0, length = typeList.length; index < length; index += 1) {
      type2 = typeList[index];
      if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
        if (explicit) {
          if (type2.multi && type2.representName) {
            state.tag = type2.representName(object);
          } else {
            state.tag = type2.tag;
          }
        } else {
          state.tag = "?";
        }
        if (type2.represent) {
          style = state.styleMap[type2.tag] || type2.defaultStyle;
          if (_toString.call(type2.represent) === "[object Function]") {
            _result = type2.represent(object, style);
          } else if (_hasOwnProperty.call(type2.represent, style)) {
            _result = type2.represent[style](object, style);
          } else {
            throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
          }
          state.dump = _result;
        }
        return true;
      }
    }
    return false;
  }
  function writeNode(state, level, object, block, compact, iskey, isblockseq) {
    state.tag = null;
    state.dump = object;
    if (!detectType(state, object, false)) {
      detectType(state, object, true);
    }
    var type2 = _toString.call(state.dump);
    var inblock = block;
    var tagStr;
    if (block) {
      block = state.flowLevel < 0 || state.flowLevel > level;
    }
    var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
    if (objectOrArray) {
      duplicateIndex = state.duplicates.indexOf(object);
      duplicate = duplicateIndex !== -1;
    }
    if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
      compact = false;
    }
    if (duplicate && state.usedDuplicates[duplicateIndex]) {
      state.dump = "*ref_" + duplicateIndex;
    } else {
      if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
        state.usedDuplicates[duplicateIndex] = true;
      }
      if (type2 === "[object Object]") {
        if (block && Object.keys(state.dump).length !== 0) {
          writeBlockMapping(state, level, state.dump, compact);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowMapping(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type2 === "[object Array]") {
        if (block && state.dump.length !== 0) {
          if (state.noArrayIndent && !isblockseq && level > 0) {
            writeBlockSequence(state, level - 1, state.dump, compact);
          } else {
            writeBlockSequence(state, level, state.dump, compact);
          }
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowSequence(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type2 === "[object String]") {
        if (state.tag !== "?") {
          writeScalar(state, state.dump, level, iskey, inblock);
        }
      } else if (type2 === "[object Undefined]") {
        return false;
      } else {
        if (state.skipInvalid) return false;
        throw new exception("unacceptable kind of an object to dump " + type2);
      }
      if (state.tag !== null && state.tag !== "?") {
        tagStr = encodeURI(
          state.tag[0] === "!" ? state.tag.slice(1) : state.tag
        ).replace(/!/g, "%21");
        if (state.tag[0] === "!") {
          tagStr = "!" + tagStr;
        } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
          tagStr = "!!" + tagStr.slice(18);
        } else {
          tagStr = "!<" + tagStr + ">";
        }
        state.dump = tagStr + " " + state.dump;
      }
    }
    return true;
  }
  function getDuplicateReferences(object, state) {
    var objects = [], duplicatesIndexes = [], index, length;
    inspectNode(object, objects, duplicatesIndexes);
    for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
      state.duplicates.push(objects[duplicatesIndexes[index]]);
    }
    state.usedDuplicates = new Array(length);
  }
  function inspectNode(object, objects, duplicatesIndexes) {
    var objectKeyList, index, length;
    if (object !== null && typeof object === "object") {
      index = objects.indexOf(object);
      if (index !== -1) {
        if (duplicatesIndexes.indexOf(index) === -1) {
          duplicatesIndexes.push(index);
        }
      } else {
        objects.push(object);
        if (Array.isArray(object)) {
          for (index = 0, length = object.length; index < length; index += 1) {
            inspectNode(object[index], objects, duplicatesIndexes);
          }
        } else {
          objectKeyList = Object.keys(object);
          for (index = 0, length = objectKeyList.length; index < length; index += 1) {
            inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
          }
        }
      }
    }
  }
  function dump$1(input, options) {
    options = options || {};
    var state = new State(options);
    if (!state.noRefs) getDuplicateReferences(input, state);
    var value = input;
    if (state.replacer) {
      value = state.replacer.call({ "": value }, "", value);
    }
    if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
    return "";
  }
  function renamed(from, to) {
    return function() {
      throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
    };
  }
  var isNothing_1, isObject_1, toArray_1, repeat_1, isNegativeZero_1, extend_1, common, exception, snippet, TYPE_CONSTRUCTOR_OPTIONS, YAML_NODE_KINDS, type, schema, str, seq, map, failsafe, _null, bool, int, YAML_FLOAT_PATTERN, SCIENTIFIC_WITHOUT_DOT, float, json, core, YAML_DATE_REGEXP, YAML_TIMESTAMP_REGEXP, timestamp, merge, BASE64_MAP, binary, _hasOwnProperty$3, _toString$2, omap, _toString$1, pairs, _hasOwnProperty$2, set, _default, _hasOwnProperty$1, CONTEXT_FLOW_IN, CONTEXT_FLOW_OUT, CONTEXT_BLOCK_IN, CONTEXT_BLOCK_OUT, CHOMPING_CLIP, CHOMPING_STRIP, CHOMPING_KEEP, PATTERN_NON_PRINTABLE, PATTERN_NON_ASCII_LINE_BREAKS, PATTERN_FLOW_INDICATORS, PATTERN_TAG_HANDLE, PATTERN_TAG_URI, simpleEscapeCheck, simpleEscapeMap, i3, directiveHandlers, loadAll_1, load_1, loader, _toString, _hasOwnProperty, CHAR_BOM, CHAR_TAB, CHAR_LINE_FEED, CHAR_CARRIAGE_RETURN, CHAR_SPACE, CHAR_EXCLAMATION, CHAR_DOUBLE_QUOTE, CHAR_SHARP, CHAR_PERCENT, CHAR_AMPERSAND, CHAR_SINGLE_QUOTE, CHAR_ASTERISK, CHAR_COMMA, CHAR_MINUS, CHAR_COLON, CHAR_EQUALS, CHAR_GREATER_THAN, CHAR_QUESTION, CHAR_COMMERCIAL_AT, CHAR_LEFT_SQUARE_BRACKET, CHAR_RIGHT_SQUARE_BRACKET, CHAR_GRAVE_ACCENT, CHAR_LEFT_CURLY_BRACKET, CHAR_VERTICAL_LINE, CHAR_RIGHT_CURLY_BRACKET, ESCAPE_SEQUENCES, DEPRECATED_BOOLEANS_SYNTAX, DEPRECATED_BASE60_SYNTAX, QUOTING_TYPE_SINGLE, QUOTING_TYPE_DOUBLE, STYLE_PLAIN, STYLE_SINGLE, STYLE_LITERAL, STYLE_FOLDED, STYLE_DOUBLE, dump_1, dumper, load, loadAll, dump, safeLoad, safeLoadAll, safeDump;
  var init_js_yaml = __esm({
    "node_modules/js-yaml/dist/js-yaml.mjs"() {
      isNothing_1 = isNothing;
      isObject_1 = isObject;
      toArray_1 = toArray;
      repeat_1 = repeat;
      isNegativeZero_1 = isNegativeZero;
      extend_1 = extend;
      common = {
        isNothing: isNothing_1,
        isObject: isObject_1,
        toArray: toArray_1,
        repeat: repeat_1,
        isNegativeZero: isNegativeZero_1,
        extend: extend_1
      };
      YAMLException$1.prototype = Object.create(Error.prototype);
      YAMLException$1.prototype.constructor = YAMLException$1;
      YAMLException$1.prototype.toString = function toString(compact) {
        return this.name + ": " + formatError(this, compact);
      };
      exception = YAMLException$1;
      snippet = makeSnippet;
      TYPE_CONSTRUCTOR_OPTIONS = [
        "kind",
        "multi",
        "resolve",
        "construct",
        "instanceOf",
        "predicate",
        "represent",
        "representName",
        "defaultStyle",
        "styleAliases"
      ];
      YAML_NODE_KINDS = [
        "scalar",
        "sequence",
        "mapping"
      ];
      type = Type$1;
      Schema$1.prototype.extend = function extend2(definition) {
        var implicit = [];
        var explicit = [];
        if (definition instanceof type) {
          explicit.push(definition);
        } else if (Array.isArray(definition)) {
          explicit = explicit.concat(definition);
        } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
          if (definition.implicit) implicit = implicit.concat(definition.implicit);
          if (definition.explicit) explicit = explicit.concat(definition.explicit);
        } else {
          throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
        }
        implicit.forEach(function(type$1) {
          if (!(type$1 instanceof type)) {
            throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
          }
          if (type$1.loadKind && type$1.loadKind !== "scalar") {
            throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
          }
          if (type$1.multi) {
            throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
          }
        });
        explicit.forEach(function(type$1) {
          if (!(type$1 instanceof type)) {
            throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
          }
        });
        var result = Object.create(Schema$1.prototype);
        result.implicit = (this.implicit || []).concat(implicit);
        result.explicit = (this.explicit || []).concat(explicit);
        result.compiledImplicit = compileList(result, "implicit");
        result.compiledExplicit = compileList(result, "explicit");
        result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
        return result;
      };
      schema = Schema$1;
      str = new type("tag:yaml.org,2002:str", {
        kind: "scalar",
        construct: function(data) {
          return data !== null ? data : "";
        }
      });
      seq = new type("tag:yaml.org,2002:seq", {
        kind: "sequence",
        construct: function(data) {
          return data !== null ? data : [];
        }
      });
      map = new type("tag:yaml.org,2002:map", {
        kind: "mapping",
        construct: function(data) {
          return data !== null ? data : {};
        }
      });
      failsafe = new schema({
        explicit: [
          str,
          seq,
          map
        ]
      });
      _null = new type("tag:yaml.org,2002:null", {
        kind: "scalar",
        resolve: resolveYamlNull,
        construct: constructYamlNull,
        predicate: isNull,
        represent: {
          canonical: function() {
            return "~";
          },
          lowercase: function() {
            return "null";
          },
          uppercase: function() {
            return "NULL";
          },
          camelcase: function() {
            return "Null";
          },
          empty: function() {
            return "";
          }
        },
        defaultStyle: "lowercase"
      });
      bool = new type("tag:yaml.org,2002:bool", {
        kind: "scalar",
        resolve: resolveYamlBoolean,
        construct: constructYamlBoolean,
        predicate: isBoolean,
        represent: {
          lowercase: function(object) {
            return object ? "true" : "false";
          },
          uppercase: function(object) {
            return object ? "TRUE" : "FALSE";
          },
          camelcase: function(object) {
            return object ? "True" : "False";
          }
        },
        defaultStyle: "lowercase"
      });
      int = new type("tag:yaml.org,2002:int", {
        kind: "scalar",
        resolve: resolveYamlInteger,
        construct: constructYamlInteger,
        predicate: isInteger,
        represent: {
          binary: function(obj) {
            return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
          },
          octal: function(obj) {
            return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
          },
          decimal: function(obj) {
            return obj.toString(10);
          },
          /* eslint-disable max-len */
          hexadecimal: function(obj) {
            return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
          }
        },
        defaultStyle: "decimal",
        styleAliases: {
          binary: [2, "bin"],
          octal: [8, "oct"],
          decimal: [10, "dec"],
          hexadecimal: [16, "hex"]
        }
      });
      YAML_FLOAT_PATTERN = new RegExp(
        // 2.5e4, 2.5 and integers
        "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
      );
      SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
      float = new type("tag:yaml.org,2002:float", {
        kind: "scalar",
        resolve: resolveYamlFloat,
        construct: constructYamlFloat,
        predicate: isFloat,
        represent: representYamlFloat,
        defaultStyle: "lowercase"
      });
      json = failsafe.extend({
        implicit: [
          _null,
          bool,
          int,
          float
        ]
      });
      core = json;
      YAML_DATE_REGEXP = new RegExp(
        "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
      );
      YAML_TIMESTAMP_REGEXP = new RegExp(
        "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
      );
      timestamp = new type("tag:yaml.org,2002:timestamp", {
        kind: "scalar",
        resolve: resolveYamlTimestamp,
        construct: constructYamlTimestamp,
        instanceOf: Date,
        represent: representYamlTimestamp
      });
      merge = new type("tag:yaml.org,2002:merge", {
        kind: "scalar",
        resolve: resolveYamlMerge
      });
      BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
      binary = new type("tag:yaml.org,2002:binary", {
        kind: "scalar",
        resolve: resolveYamlBinary,
        construct: constructYamlBinary,
        predicate: isBinary,
        represent: representYamlBinary
      });
      _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
      _toString$2 = Object.prototype.toString;
      omap = new type("tag:yaml.org,2002:omap", {
        kind: "sequence",
        resolve: resolveYamlOmap,
        construct: constructYamlOmap
      });
      _toString$1 = Object.prototype.toString;
      pairs = new type("tag:yaml.org,2002:pairs", {
        kind: "sequence",
        resolve: resolveYamlPairs,
        construct: constructYamlPairs
      });
      _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
      set = new type("tag:yaml.org,2002:set", {
        kind: "mapping",
        resolve: resolveYamlSet,
        construct: constructYamlSet
      });
      _default = core.extend({
        implicit: [
          timestamp,
          merge
        ],
        explicit: [
          binary,
          omap,
          pairs,
          set
        ]
      });
      _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
      CONTEXT_FLOW_IN = 1;
      CONTEXT_FLOW_OUT = 2;
      CONTEXT_BLOCK_IN = 3;
      CONTEXT_BLOCK_OUT = 4;
      CHOMPING_CLIP = 1;
      CHOMPING_STRIP = 2;
      CHOMPING_KEEP = 3;
      PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
      PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
      PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
      PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
      simpleEscapeCheck = new Array(256);
      simpleEscapeMap = new Array(256);
      for (i3 = 0; i3 < 256; i3++) {
        simpleEscapeCheck[i3] = simpleEscapeSequence(i3) ? 1 : 0;
        simpleEscapeMap[i3] = simpleEscapeSequence(i3);
      }
      directiveHandlers = {
        YAML: function handleYamlDirective(state, name, args) {
          var match, major, minor;
          if (state.version !== null) {
            throwError(state, "duplication of %YAML directive");
          }
          if (args.length !== 1) {
            throwError(state, "YAML directive accepts exactly one argument");
          }
          match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
          if (match === null) {
            throwError(state, "ill-formed argument of the YAML directive");
          }
          major = parseInt(match[1], 10);
          minor = parseInt(match[2], 10);
          if (major !== 1) {
            throwError(state, "unacceptable YAML version of the document");
          }
          state.version = args[0];
          state.checkLineBreaks = minor < 2;
          if (minor !== 1 && minor !== 2) {
            throwWarning(state, "unsupported YAML version of the document");
          }
        },
        TAG: function handleTagDirective(state, name, args) {
          var handle, prefix;
          if (args.length !== 2) {
            throwError(state, "TAG directive accepts exactly two arguments");
          }
          handle = args[0];
          prefix = args[1];
          if (!PATTERN_TAG_HANDLE.test(handle)) {
            throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
          }
          if (_hasOwnProperty$1.call(state.tagMap, handle)) {
            throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
          }
          if (!PATTERN_TAG_URI.test(prefix)) {
            throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
          }
          try {
            prefix = decodeURIComponent(prefix);
          } catch (err) {
            throwError(state, "tag prefix is malformed: " + prefix);
          }
          state.tagMap[handle] = prefix;
        }
      };
      loadAll_1 = loadAll$1;
      load_1 = load$1;
      loader = {
        loadAll: loadAll_1,
        load: load_1
      };
      _toString = Object.prototype.toString;
      _hasOwnProperty = Object.prototype.hasOwnProperty;
      CHAR_BOM = 65279;
      CHAR_TAB = 9;
      CHAR_LINE_FEED = 10;
      CHAR_CARRIAGE_RETURN = 13;
      CHAR_SPACE = 32;
      CHAR_EXCLAMATION = 33;
      CHAR_DOUBLE_QUOTE = 34;
      CHAR_SHARP = 35;
      CHAR_PERCENT = 37;
      CHAR_AMPERSAND = 38;
      CHAR_SINGLE_QUOTE = 39;
      CHAR_ASTERISK = 42;
      CHAR_COMMA = 44;
      CHAR_MINUS = 45;
      CHAR_COLON = 58;
      CHAR_EQUALS = 61;
      CHAR_GREATER_THAN = 62;
      CHAR_QUESTION = 63;
      CHAR_COMMERCIAL_AT = 64;
      CHAR_LEFT_SQUARE_BRACKET = 91;
      CHAR_RIGHT_SQUARE_BRACKET = 93;
      CHAR_GRAVE_ACCENT = 96;
      CHAR_LEFT_CURLY_BRACKET = 123;
      CHAR_VERTICAL_LINE = 124;
      CHAR_RIGHT_CURLY_BRACKET = 125;
      ESCAPE_SEQUENCES = {};
      ESCAPE_SEQUENCES[0] = "\\0";
      ESCAPE_SEQUENCES[7] = "\\a";
      ESCAPE_SEQUENCES[8] = "\\b";
      ESCAPE_SEQUENCES[9] = "\\t";
      ESCAPE_SEQUENCES[10] = "\\n";
      ESCAPE_SEQUENCES[11] = "\\v";
      ESCAPE_SEQUENCES[12] = "\\f";
      ESCAPE_SEQUENCES[13] = "\\r";
      ESCAPE_SEQUENCES[27] = "\\e";
      ESCAPE_SEQUENCES[34] = '\\"';
      ESCAPE_SEQUENCES[92] = "\\\\";
      ESCAPE_SEQUENCES[133] = "\\N";
      ESCAPE_SEQUENCES[160] = "\\_";
      ESCAPE_SEQUENCES[8232] = "\\L";
      ESCAPE_SEQUENCES[8233] = "\\P";
      DEPRECATED_BOOLEANS_SYNTAX = [
        "y",
        "Y",
        "yes",
        "Yes",
        "YES",
        "on",
        "On",
        "ON",
        "n",
        "N",
        "no",
        "No",
        "NO",
        "off",
        "Off",
        "OFF"
      ];
      DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
      QUOTING_TYPE_SINGLE = 1;
      QUOTING_TYPE_DOUBLE = 2;
      STYLE_PLAIN = 1;
      STYLE_SINGLE = 2;
      STYLE_LITERAL = 3;
      STYLE_FOLDED = 4;
      STYLE_DOUBLE = 5;
      dump_1 = dump$1;
      dumper = {
        dump: dump_1
      };
      load = loader.load;
      loadAll = loader.loadAll;
      dump = dumper.dump;
      safeLoad = renamed("safeLoad", "load");
      safeLoadAll = renamed("safeLoadAll", "loadAll");
      safeDump = renamed("safeDump", "dump");
    }
  });

  // src/types/anova.ts
  function filterValidVariants(spec) {
    const validVariants = [];
    const defaultConfig = {};
    if (spec.default.name) {
      const parts = spec.default.name.split(/,\s*/);
      for (const part of parts) {
        const [key, value] = part.split("=");
        if (key && value) {
          defaultConfig[key.trim()] = value.trim();
        }
      }
    }
    validVariants.push({
      name: spec.default.name || "default",
      configuration: defaultConfig,
      isValid: true
    });
    for (const variant of spec.variants) {
      if (variant.invalid === true) {
        continue;
      }
      const isInvalid = spec.invalidConfigurations.some((invalidConfig) => {
        return Object.keys(invalidConfig).every((key) => {
          return variant.configuration && variant.configuration[key] === invalidConfig[key];
        });
      });
      if (!isInvalid && variant.configuration) {
        validVariants.push({
          name: variant.name,
          configuration: variant.configuration,
          isValid: true
        });
      }
    }
    return validVariants;
  }
  var init_anova = __esm({
    "src/types/anova.ts"() {
      "use strict";
    }
  });

  // src/ui.tsx
  var ui_exports = {};
  __export(ui_exports, {
    default: () => ui_default
  });
  function Plugin() {
    var _a;
    const [dataSource, setDataSource] = d2("figma-direct");
    const [showComponentDataTab, setShowComponentDataTab] = d2(false);
    const [componentSets, setComponentSets] = d2([]);
    const [expandedProperties, setExpandedProperties] = d2({});
    const [anovaInput, setAnovaInput] = d2("");
    const [anovaSpec, setAnovaSpec] = d2(null);
    const [anovaError, setAnovaError] = d2("");
    const [waitingForAutoSelect, setWaitingForAutoSelect] = d2(false);
    const [previews, setPreviews] = d2({});
    const [previewsLoading, setPreviewsLoading] = d2(false);
    const [previewsError, setPreviewsError] = d2(null);
    const [previewCombinations, setPreviewCombinations] = d2([]);
    const [selectedCombinations, setSelectedCombinations] = d2({});
    const [sortColumn, setSortColumn] = d2(null);
    const [sortDirection, setSortDirection] = d2("asc");
    const [isPropertiesCollapsed, setIsPropertiesCollapsed] = d2(true);
    const [hoveredRow, setHoveredRow] = d2(null);
    const [collapsedGroups, setCollapsedGroups] = d2({});
    const [activeFilters, setActiveFilters] = d2({});
    const [lastClickedIndex, setLastClickedIndex] = d2(null);
    const [componentDataInput, setComponentDataInput] = d2("");
    const [componentDataSpec, setComponentDataSpec] = d2(null);
    const [componentDataError, setComponentDataError] = d2("");
    const [isComponentDataModalOpen, setIsComponentDataModalOpen] = d2(false);
    const [selectedGroupingProperty, setSelectedGroupingProperty] = d2(null);
    const [isLayoutModalOpen, setIsLayoutModalOpen] = d2(false);
    const [layoutRowProperty, setLayoutRowProperty] = d2(null);
    const [layoutColumnProperties, setLayoutColumnProperties] = d2([]);
    on("INIT_DATA", (data) => {
      setComponentSets(data);
      const expanded = {};
      data.forEach((compSet) => {
        for (const propName in compSet.properties) {
          const prop = compSet.properties[propName];
          if (prop.type === "VARIANT" || prop.type === "BOOLEAN") {
            expanded[propName] = true;
          }
        }
      });
      setExpandedProperties(expanded);
    });
    on("PREVIEWS_READY", (data) => {
      setPreviews(data);
      setPreviewsLoading(false);
      setPreviewsError(null);
    });
    on("PREVIEWS_ERROR", (data) => {
      setPreviewsError(data.error);
      setPreviewsLoading(false);
    });
    y2(() => {
      if (waitingForAutoSelect && componentSets.length > 0 && anovaSpec && previewCombinations.length > 0) {
        setWaitingForAutoSelect(false);
        setTimeout(() => {
          setPreviewsLoading(true);
          setPreviewsError(null);
          emit("GENERATE_PREVIEWS", { combinations: previewCombinations });
        }, 100);
      }
    }, [componentSets, waitingForAutoSelect, anovaSpec, previewCombinations]);
    y2(() => {
      if (dataSource === "anova") return;
      if (componentSets.length === 0) return;
      const combinations = [];
      const selected = {};
      componentSets.forEach((compSet) => {
        const propsToExpand = Object.keys(expandedProperties).filter(
          (key) => expandedProperties[key] && compSet.properties[key]
        );
        const combos = generateCombinations(compSet.properties, propsToExpand);
        combos.forEach((combo) => {
          const key = `${compSet.id}:${JSON.stringify(combo)}`;
          const variantName = Object.entries(combo).sort(([a3], [b2]) => a3.localeCompare(b2)).map(([k3, v3]) => `${k3}=${v3}`).join(", ");
          combinations.push({
            componentSetId: compSet.id,
            componentSetName: compSet.name,
            properties: combo,
            variantName
          });
          selected[key] = false;
        });
      });
      setPreviewCombinations(combinations);
      setSelectedCombinations(selected);
      if (combinations.length > 0) {
        setPreviewsLoading(true);
        setPreviewsError(null);
        emit("GENERATE_PREVIEWS", { combinations });
      }
    }, [componentSets, expandedProperties, dataSource]);
    y2(() => {
      const handleKeyDown = (e3) => {
        if ((e3.ctrlKey || e3.metaKey) && e3.key === "d") {
          e3.preventDefault();
          setShowComponentDataTab((prev) => !prev);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    function generateCombinations(properties, propsToExpand) {
      if (propsToExpand.length === 0) return [{}];
      const result = [];
      function recurse(index, current) {
        if (index === propsToExpand.length) {
          result.push(__spreadValues({}, current));
          return;
        }
        const propName = propsToExpand[index];
        const values = properties[propName].values;
        for (const value of values) {
          current[propName] = value;
          recurse(index + 1, current);
        }
      }
      recurse(0, {});
      return result;
    }
    function handleComponentDataParse() {
      if (!componentDataInput.trim()) {
        setComponentDataSpec(null);
        setComponentDataError("");
        return;
      }
      try {
        const parsed = load(componentDataInput);
        if (!parsed.title || !parsed.props || !parsed.variants) {
          throw new Error("Invalid component data structure. Expected title, props, and variants.");
        }
        setComponentDataSpec(parsed);
        setComponentDataError("");
      } catch (err) {
        setComponentDataError(err instanceof Error ? err.message : "Failed to parse YAML");
        setComponentDataSpec(null);
      }
    }
    function handlePropertyToggle(propName) {
      setExpandedProperties((prev) => __spreadProps(__spreadValues({}, prev), {
        [propName]: !prev[propName]
      }));
    }
    function handleCombinationToggle(key, index, isShiftClick = false) {
      if (isShiftClick && lastClickedIndex !== null) {
        const start = Math.min(lastClickedIndex, index);
        const end = Math.max(lastClickedIndex, index);
        const visibleCombinations = sortedCombinations.slice(start, end + 1);
        const newState = __spreadValues({}, selectedCombinations);
        visibleCombinations.forEach((combo) => {
          const comboKey = getCombinationKey(combo);
          newState[comboKey] = true;
        });
        setSelectedCombinations(newState);
      } else {
        setSelectedCombinations((prev) => __spreadProps(__spreadValues({}, prev), {
          [key]: !prev[key]
        }));
      }
      setLastClickedIndex(index);
    }
    function getCombinationKey(combo) {
      if (dataSource === "anova") {
        return `anova:${combo.variantName}`;
      }
      return `${combo.componentSetId}:${JSON.stringify(combo.properties)}`;
    }
    function handleSelectAll() {
      const validCombinationKeys = sortedCombinations.filter((c3) => c3.isValidCombination !== false).map((combo) => getCombinationKey(combo));
      const allValidChecked = validCombinationKeys.every((key) => selectedCombinations[key]);
      const newState = __spreadValues({}, selectedCombinations);
      validCombinationKeys.forEach((key) => {
        newState[key] = !allValidChecked;
      });
      setSelectedCombinations(newState);
    }
    function handleGroupToggle(groupKey) {
      setCollapsedGroups((prev) => __spreadProps(__spreadValues({}, prev), {
        [groupKey]: !prev[groupKey]
      }));
    }
    function handleGroupSelectAll(groupCombos) {
      const groupKeys = groupCombos.map((combo) => getCombinationKey(combo));
      const allSelected = groupKeys.every((key) => selectedCombinations[key]);
      const newState = __spreadValues({}, selectedCombinations);
      groupKeys.forEach((key) => {
        newState[key] = !allSelected;
      });
      setSelectedCombinations(newState);
    }
    function handleSelectAcrossGroups(combo, currentGroupingProperty) {
      const matchingCombos = sortedCombinations.filter((c3) => {
        if (c3.isValidCombination === false) return false;
        for (const propName in combo.properties) {
          if (propName === currentGroupingProperty) continue;
          if (c3.properties[propName] !== combo.properties[propName]) {
            return false;
          }
        }
        return true;
      });
      const currentKey = getCombinationKey(combo);
      const shouldSelect = !selectedCombinations[currentKey];
      const newState = __spreadValues({}, selectedCombinations);
      matchingCombos.forEach((matchingCombo) => {
        const key = getCombinationKey(matchingCombo);
        if (shouldSelect) {
          newState[key] = true;
        } else {
          delete newState[key];
        }
      });
      setSelectedCombinations(newState);
    }
    function handleFilterChange(propName, value) {
      setActiveFilters((prev) => __spreadProps(__spreadValues({}, prev), {
        [propName]: value
      }));
    }
    function handleClearFilters() {
      setActiveFilters({});
    }
    function getUniquePropertyValues(propName) {
      const uniqueValues = /* @__PURE__ */ new Set();
      previewCombinations.forEach((combo) => {
        if (combo.properties[propName] !== void 0) {
          uniqueValues.add(String(combo.properties[propName]));
        }
      });
      return Array.from(uniqueValues).sort();
    }
    function handleGenerate(explicitCombinations) {
      const selected = explicitCombinations || previewCombinations.filter((combo) => {
        const key = getCombinationKey(combo);
        return selectedCombinations[key];
      });
      emit("GENERATE_STICKER_SHEET", {
        dataSource,
        selectedCombinations: selected,
        includeLightDark: true,
        anovaComponentName: anovaSpec == null ? void 0 : anovaSpec.title,
        layoutConfig: {
          rowProperty: layoutRowProperty,
          columnProperties: layoutColumnProperties
        }
      });
    }
    function formatPropertyValue(value) {
      const strValue = String(value).toLowerCase();
      if (strValue === "true") return "\u2705 True";
      if (strValue === "false") return "\u274C False";
      return String(value);
    }
    function handleSort(columnName) {
      if (sortColumn === columnName) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(columnName);
        setSortDirection("asc");
      }
    }
    function handleModeChange(newMode) {
      setDataSource(newMode);
    }
    function generateAnovaCombinations(spec, requestPreviews = true) {
      var _a2, _b, _c, _d;
      try {
        const validVariants = filterValidVariants(spec);
        const variantConfiguredProps = /* @__PURE__ */ new Set();
        if (spec.default.configuration) {
          Object.keys(spec.default.configuration).forEach((key) => variantConfiguredProps.add(key));
        }
        for (const variant of spec.variants) {
          if (variant.configuration) {
            Object.keys(variant.configuration).forEach((key) => variantConfiguredProps.add(key));
          }
        }
        const booleanProps = [];
        for (const [propName, prop] of Object.entries(spec.props)) {
          if (prop.type === "boolean" && !variantConfiguredProps.has(propName)) {
            booleanProps.push(propName);
          }
        }
        const generateBooleanCombinations = (props) => {
          if (props.length === 0) return [{}];
          const result = [];
          const totalCombos = Math.pow(2, props.length);
          for (let i3 = 0; i3 < totalCombos; i3++) {
            const combo = {};
            for (let j4 = 0; j4 < props.length; j4++) {
              combo[props[j4]] = Boolean(i3 >> j4 & 1);
            }
            result.push(combo);
          }
          return result;
        };
        const booleanCombos = generateBooleanCombinations(booleanProps);
        const combinations = [];
        const selected = {};
        for (const variant of validVariants) {
          const variantSpec = variant.name === (spec.default.name || "default") ? spec.default : spec.variants.find((v3) => v3.name === variant.name);
          for (const boolCombo of booleanCombos) {
            let isValidCombo = true;
            if (variantSpec) {
              for (const [boolProp, boolValue] of Object.entries(boolCombo)) {
                const controlledElements = Object.entries(spec.default.elements || {}).filter(([elemName, elem]) => {
                  var _a3, _b2;
                  return ((_b2 = (_a3 = elem.propReferences) == null ? void 0 : _a3.visible) == null ? void 0 : _b2.$ref) === `#/props/${boolProp}`;
                });
                if (boolValue === true && controlledElements.length > 0) {
                  for (const [elemName] of controlledElements) {
                    const variantElem = (_a2 = variantSpec.elements) == null ? void 0 : _a2[elemName];
                    if (((_b = variantElem == null ? void 0 : variantElem.propReferences) == null ? void 0 : _b.visible) === null) {
                      isValidCombo = false;
                      break;
                    }
                    const defaultElem = (_c = spec.default.elements) == null ? void 0 : _c[elemName];
                    const parentName = defaultElem == null ? void 0 : defaultElem.parent;
                    if (parentName) {
                      const variantParent = (_d = variantSpec.elements) == null ? void 0 : _d[parentName];
                      if (variantParent == null ? void 0 : variantParent.children) {
                        if (!variantParent.children.includes(elemName)) {
                          isValidCombo = false;
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
            if (isValidCombo) {
              const fullConfig = __spreadValues(__spreadValues({}, variant.configuration), boolCombo);
              const matchesInvalidConfig = spec.invalidConfigurations.some((invalidConfig) => {
                return Object.keys(invalidConfig).every((key2) => {
                  return fullConfig[key2] === invalidConfig[key2];
                });
              });
              if (matchesInvalidConfig) {
                continue;
              }
              const configStr = Object.entries(fullConfig).sort(([a3], [b2]) => a3.localeCompare(b2)).map(([k3, v3]) => `${k3}=${v3}`).join(", ");
              const key = `anova:${configStr}`;
              combinations.push({
                componentSetId: "anova",
                componentSetName: spec.title,
                variantName: configStr,
                properties: fullConfig,
                isValid: true
              });
              selected[key] = false;
            }
          }
        }
        setPreviewCombinations(combinations);
        setSelectedCombinations(selected);
        if (requestPreviews) {
          setPreviewsLoading(true);
          setPreviewsError(null);
          emit("GENERATE_PREVIEWS", { combinations });
        }
      } catch (error) {
        setAnovaError(error.message || "Failed to generate combinations");
      }
    }
    function handleAnovaImport() {
      try {
        setAnovaError("");
        let parsed;
        try {
          parsed = load(anovaInput);
        } catch (yamlError) {
          try {
            parsed = JSON.parse(anovaInput);
          } catch (jsonError) {
            throw new Error("Invalid YAML or JSON format");
          }
        }
        if (!parsed.title || !parsed.props || !parsed.variants) {
          throw new Error("Invalid Anova format: missing required fields (title, props, variants)");
        }
        const spec = parsed;
        setAnovaSpec(spec);
        const shouldRequestPreviews = componentSets.length > 0;
        generateAnovaCombinations(spec, shouldRequestPreviews);
        if (componentSets.length === 0) {
          emit("SELECT_COMPONENT_BY_NAME", spec.title);
          setWaitingForAutoSelect(true);
          setPreviewsLoading(false);
          setAnovaError("");
          return;
        }
      } catch (error) {
        setAnovaError(error.message || "Failed to parse Anova data");
        setAnovaSpec(null);
        setPreviewCombinations([]);
        setSelectedCombinations({});
      }
    }
    const hasSelection = Object.values(selectedCombinations).some((v3) => v3);
    const allProperties = {};
    const propertyOrder = [];
    componentSets.forEach((compSet) => {
      if (compSet.propertyOrder) {
        compSet.propertyOrder.forEach((propName) => {
          if (!allProperties[propName]) {
            const prop = compSet.properties[propName];
            if (prop.type !== "INSTANCE_SWAP") {
              allProperties[propName] = prop;
              propertyOrder.push(propName);
            }
          }
        });
      }
    });
    let componentDataFilteredCombinations = previewCombinations;
    if (dataSource === "figma-direct" && componentDataSpec) {
      const validVariants = filterValidVariants(componentDataSpec);
      const variantProps = /* @__PURE__ */ new Set();
      const booleanProps = /* @__PURE__ */ new Set();
      for (const [propName, prop] of Object.entries(componentDataSpec.props)) {
        if (prop.enum && prop.enum.length > 0) {
          variantProps.add(propName);
        } else if (prop.type === "boolean") {
          booleanProps.add(propName);
        }
      }
      componentDataFilteredCombinations = previewCombinations.map((combo) => {
        const variantConfig = {};
        const booleanConfig = {};
        for (const [propName, propValue] of Object.entries(combo.properties)) {
          if (variantProps.has(propName)) {
            variantConfig[propName] = propValue;
          } else if (booleanProps.has(propName)) {
            booleanConfig[propName] = propValue;
          }
        }
        const matchingVariants = validVariants.filter((validVariant) => {
          return Object.keys(variantConfig).every((key) => {
            const variantValue = String(validVariant.configuration[key] || "").toLowerCase();
            const comboValue = String(variantConfig[key]).toLowerCase();
            return variantValue === comboValue;
          });
        });
        let isValid = false;
        if (matchingVariants.length > 0) {
          isValid = matchingVariants.some((matchingVariant) => {
            var _a2, _b, _c, _d;
            const variantSpec = matchingVariant.name === (componentDataSpec.default.name || "default") ? componentDataSpec.default : componentDataSpec.variants.find((v3) => v3.name === matchingVariant.name);
            if (!variantSpec) return false;
            for (const [propName, propValue] of Object.entries(booleanConfig)) {
              const boolValue = String(propValue).toLowerCase() === "true";
              const controlledElements = Object.entries(componentDataSpec.default.elements || {}).filter(([elemName, elem]) => {
                var _a3, _b2;
                return ((_b2 = (_a3 = elem.propReferences) == null ? void 0 : _a3.visible) == null ? void 0 : _b2.$ref) === `#/props/${propName}`;
              });
              if (boolValue === true && controlledElements.length > 0) {
                for (const [elemName] of controlledElements) {
                  const variantElem = (_a2 = variantSpec.elements) == null ? void 0 : _a2[elemName];
                  if (((_b = variantElem == null ? void 0 : variantElem.propReferences) == null ? void 0 : _b.visible) === null) {
                    return false;
                  }
                  const defaultElem = (_c = componentDataSpec.default.elements) == null ? void 0 : _c[elemName];
                  const parentName = defaultElem == null ? void 0 : defaultElem.parent;
                  if (parentName) {
                    const variantParent = (_d = variantSpec.elements) == null ? void 0 : _d[parentName];
                    if (variantParent == null ? void 0 : variantParent.children) {
                      if (!variantParent.children.includes(elemName)) {
                        return false;
                      }
                    }
                  }
                }
              }
            }
            return true;
          });
        }
        if (isValid) {
          const fullConfig = __spreadValues(__spreadValues({}, variantConfig), booleanConfig);
          const matchesInvalidConfig = componentDataSpec.invalidConfigurations.some((invalidConfig) => {
            return Object.keys(invalidConfig).every((key) => {
              const invalidValue = String(invalidConfig[key]).toLowerCase();
              const comboValue = String(fullConfig[key]).toLowerCase();
              return invalidValue === comboValue;
            });
          });
          if (matchesInvalidConfig) {
            isValid = false;
          }
        }
        return __spreadProps(__spreadValues({}, combo), { isValidCombination: isValid });
      });
    } else {
      componentDataFilteredCombinations = previewCombinations.map((combo) => __spreadProps(__spreadValues({}, combo), { isValidCombination: true }));
    }
    const filteredCombinations = componentDataFilteredCombinations.filter((combo) => {
      for (const [propName, filterValue] of Object.entries(activeFilters)) {
        if (filterValue === null || filterValue === "") continue;
        const comboValue = combo.properties[propName];
        if (String(comboValue) !== filterValue) {
          return false;
        }
      }
      return true;
    });
    const sortedCombinations = sortColumn ? [...filteredCombinations].sort((a3, b2) => {
      const aVal = a3.properties[sortColumn];
      const bVal = b2.properties[sortColumn];
      if (aVal === void 0 && bVal === void 0) return 0;
      if (aVal === void 0) return 1;
      if (bVal === void 0) return -1;
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      const comparison = aStr.localeCompare(bStr);
      return sortDirection === "asc" ? comparison : -comparison;
    }) : filteredCombinations;
    const groupedCombinations = {};
    let groupingProperty = "";
    if (selectedGroupingProperty) {
      groupingProperty = selectedGroupingProperty;
    } else if (dataSource === "anova" && anovaSpec) {
      for (const [propName, prop] of Object.entries(anovaSpec.props)) {
        if (prop.enum && prop.enum.length > 0) {
          groupingProperty = propName;
          break;
        }
      }
    } else if (dataSource === "figma-direct" && propertyOrder.length > 0) {
      console.log("\u{1F50D} Determining grouping property from propertyOrder:", propertyOrder);
      for (const propName of propertyOrder) {
        const prop = allProperties[propName];
        const valueCount = ((_a = prop == null ? void 0 : prop.values) == null ? void 0 : _a.length) || 0;
        console.log(`  - Checking "${propName}": type=${prop == null ? void 0 : prop.type}, values=${valueCount}`);
        if (prop && prop.type === "VARIANT" && valueCount > 1) {
          const combosWithProperty = sortedCombinations.filter(
            (combo) => combo.properties && combo.properties[propName]
          ).length;
          const coveragePercent = combosWithProperty / sortedCombinations.length * 100;
          console.log(`    Coverage: ${combosWithProperty}/${sortedCombinations.length} (${coveragePercent.toFixed(0)}%)`);
          if (coveragePercent >= 100) {
            groupingProperty = propName;
            console.log(`  \u2713 Using "${propName}" for grouping`);
            break;
          } else {
            console.log(`  \u2717 Skipping "${propName}" - not present on all combinations`);
          }
        }
      }
    }
    if (groupingProperty) {
      const validCombos = sortedCombinations.filter((combo) => combo.isValidCombination !== false);
      const invalidCombos = sortedCombinations.filter((combo) => combo.isValidCombination === false);
      validCombos.forEach((combo) => {
        const groupValue = combo.properties[groupingProperty];
        const groupKey = groupValue ? String(groupValue) : "Other";
        if (!groupedCombinations[groupKey]) {
          groupedCombinations[groupKey] = [];
        }
        groupedCombinations[groupKey].push(combo);
      });
      if (invalidCombos.length > 0) {
        groupedCombinations["__INVALID__"] = invalidCombos;
      }
    }
    return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("style", null, `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .tooltip-wrapper .tooltip {
            position: absolute;
            left: calc(100% + 8px);
            top: 50%;
            transform: translateY(-50%);
            background: var(--figma-color-bg-inverse);
            color: var(--figma-color-text-onbrand);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.1s ease;
            z-index: 1000;
          }
          
          .tooltip-wrapper:hover .tooltip {
            opacity: 1;
            transition-delay: 0.1s;
          }
        `), /* @__PURE__ */ _("div", { style: { height: "100vh", display: "flex", flexDirection: "column" } }, showComponentDataTab && /* @__PURE__ */ _("div", { style: { display: "flex", borderBottom: "1px solid var(--figma-color-border)", flexShrink: 0 } }, /* @__PURE__ */ _(
      "div",
      {
        onClick: () => handleModeChange("figma-direct"),
        style: {
          flex: 1,
          padding: "12px",
          textAlign: "center",
          cursor: "pointer",
          borderBottom: dataSource === "figma-direct" ? "2px solid var(--figma-color-text-brand)" : "2px solid transparent",
          color: dataSource === "figma-direct" ? "var(--figma-color-text)" : "var(--figma-color-text-secondary)",
          fontWeight: dataSource === "figma-direct" ? 600 : 400,
          fontSize: "11px",
          transition: "all 0.2s ease"
        }
      },
      "FIGMA CANVAS"
    ), showComponentDataTab && /* @__PURE__ */ _(
      "div",
      {
        onClick: () => handleModeChange("anova"),
        style: {
          flex: 1,
          padding: "12px",
          textAlign: "center",
          cursor: "pointer",
          borderBottom: dataSource === "anova" ? "2px solid var(--figma-color-text-brand)" : "2px solid transparent",
          color: dataSource === "anova" ? "var(--figma-color-text)" : "var(--figma-color-text-secondary)",
          fontWeight: dataSource === "anova" ? 600 : 400,
          fontSize: "11px",
          transition: "all 0.2s ease"
        }
      },
      "COMPONENT DATA"
    )), dataSource === "anova" && /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", flexShrink: 0, borderBottom: "1px solid var(--figma-color-border)" } }, /* @__PURE__ */ _("div", { style: { padding: "12px", display: "flex", alignItems: "center", gap: "8px" } }, anovaSpec && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: {
      fontFamily: "var(--text-body-large-strong-font-family)",
      fontSize: "var(--text-body-large-strong-font-size)",
      fontWeight: 600,
      letterSpacing: "var(--text-body-large-strong-letter-spacing)",
      lineHeight: "var(--text-body-large-strong-line-height)",
      color: "var(--figma-color-text)"
    } }, anovaSpec.title), /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--figma-color-text-tertiary)" } }, "\xB7")), /* @__PURE__ */ _(
      "textarea",
      {
        value: anovaInput,
        onChange: (e3) => setAnovaInput(e3.target.value),
        placeholder: "Paste YAML/JSON...",
        style: {
          flex: 1,
          height: "30px",
          padding: "6px 8px",
          fontFamily: "var(--font-stack)",
          fontSize: "11px",
          border: "1px solid var(--figma-color-border)",
          borderRadius: "2px",
          background: "var(--figma-color-bg)",
          color: "var(--figma-color-text)",
          resize: "none",
          lineHeight: "16px",
          overflow: "hidden"
        }
      }
    ), /* @__PURE__ */ _(Button, { onClick: handleAnovaImport, disabled: !anovaInput.trim() }, "Import")), anovaError && /* @__PURE__ */ _("div", { style: { padding: "0 12px 12px 12px", color: "var(--figma-color-text-danger)", fontSize: "11px" } }, anovaError)), dataSource === "figma-direct" && componentSets.length === 0 ? /* @__PURE__ */ _("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ _(Muted, null, "Select a component or component set on the canvas")) : dataSource === "anova" && !anovaSpec ? /* @__PURE__ */ _("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ _(Muted, null, "Paste Anova data above to get started")) : /* @__PURE__ */ _(k, null, dataSource === "figma-direct" && /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", flexShrink: 0 } }, /* @__PURE__ */ _(
      "div",
      {
        style: { padding: "12px 12px 4px 12px", minHeight: "40px", cursor: "pointer", position: "sticky", top: 0, background: "var(--figma-color-bg)", zIndex: 1 },
        onClick: () => setIsPropertiesCollapsed(!isPropertiesCollapsed)
      },
      /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" } }, /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ _("div", { style: {
        fontFamily: "var(--text-body-large-strong-font-family)",
        fontSize: "var(--text-body-large-strong-font-size)",
        fontWeight: 600,
        letterSpacing: "var(--text-body-large-strong-letter-spacing)",
        lineHeight: "var(--text-body-large-strong-line-height)",
        color: "var(--figma-color-text)"
      } }, "Properties"), componentSets.length > 0 && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--figma-color-text-tertiary)" } }, "\xB7"), /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--figma-color-text)" } }, componentSets[0].name))), /* @__PURE__ */ _("div", { style: {
        display: "flex",
        alignItems: "center",
        transform: isPropertiesCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
        color: "var(--figma-color-text-secondary)"
      } }, /* @__PURE__ */ _(IconChevronDown16, null)))
    ), !isPropertiesCollapsed && /* @__PURE__ */ _("div", { style: { maxHeight: "30vh", overflowY: "auto" } }, propertyOrder.length === 0 ? /* @__PURE__ */ _("div", { style: { marginBottom: "16px", textAlign: "center", paddingTop: "40px" } }, /* @__PURE__ */ _(Muted, null, "No properties found")) : /* @__PURE__ */ _("div", { style: { marginBottom: "16px" } }, propertyOrder.map((propName) => {
      const prop = allProperties[propName];
      const isVariant = prop.type === "VARIANT" && prop.values && prop.values.length > 2;
      const isChecked = expandedProperties[propName] || isVariant;
      let icon;
      if (prop.type === "BOOLEAN" || prop.type === "VARIANT" && prop.values && prop.values.length === 2) {
        icon = /* @__PURE__ */ _(IconBoolean16, null);
      } else if (prop.type === "VARIANT") {
        icon = /* @__PURE__ */ _(IconInstance16, null);
      } else if (prop.type === "INSTANCE_SWAP") {
        icon = /* @__PURE__ */ _(IconComponentProperty16, null);
      } else {
        icon = /* @__PURE__ */ _(IconBoolean16, null);
      }
      return /* @__PURE__ */ _(
        SelectableItem,
        {
          key: propName,
          disabled: isVariant,
          value: isChecked,
          onValueChange: (value) => !isVariant && handlePropertyToggle(propName),
          style: { cursor: isVariant ? "not-allowed" : "pointer" }
        },
        /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", width: "100%" } }, /* @__PURE__ */ _("div", { style: { marginRight: "8px", display: "flex", alignItems: "center", opacity: 0.6 } }, icon), /* @__PURE__ */ _("div", { style: { flex: 1 } }, /* @__PURE__ */ _("span", null, propName), prop.values && prop.values.length > 0 && /* @__PURE__ */ _("span", { style: { color: "var(--figma-color-text-tertiary)", marginLeft: "4px" } }, "\xB7 ", prop.values.join(", "))))
      );
    })))), /* @__PURE__ */ _("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 } }, /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(
      "div",
      {
        style: { display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0, padding: "12px 12px 4px 12px", minHeight: "40px", position: "sticky", top: 0, background: "var(--figma-color-bg)", zIndex: 1 }
      },
      /* @__PURE__ */ _("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ _("div", { style: {
        fontFamily: "var(--text-body-large-strong-font-family)",
        fontSize: "var(--text-body-large-strong-font-size)",
        fontWeight: 600,
        letterSpacing: "var(--text-body-large-strong-letter-spacing)",
        lineHeight: "var(--text-body-large-strong-line-height)",
        color: "var(--figma-color-text)"
      } }, "Preview"), /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--figma-color-text-tertiary)" } }, "\xB7"), /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--figma-color-text)" } }, Object.values(selectedCombinations).filter((v3) => v3).length, " / ", sortedCombinations.filter((c3) => c3.isValidCombination !== false).length, " selected"), dataSource === "figma-direct" && componentDataSpec && sortedCombinations.some((c3) => c3.isValidCombination === false) && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--figma-color-text-tertiary)" } }, "\xB7"), /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--figma-color-text-secondary)" } }, sortedCombinations.length, " total (", /* @__PURE__ */ _(
        "span",
        {
          onClick: () => {
            const invalidSection = document.getElementById("invalid-combinations-group");
            if (invalidSection) {
              invalidSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          },
          style: {
            color: "var(--figma-color-text-brand)",
            cursor: "pointer",
            textDecoration: "underline"
          },
          onMouseEnter: (e3) => e3.currentTarget.style.opacity = "0.7",
          onMouseLeave: (e3) => e3.currentTarget.style.opacity = "1"
        },
        sortedCombinations.filter((c3) => c3.isValidCombination === false).length,
        " invalid"
      ), ")")), dataSource === "figma-direct" && componentSets.length > 0 && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--figma-color-text-tertiary)" } }, "\xB7"), /* @__PURE__ */ _("div", { style: { position: "relative" }, className: "tooltip-wrapper" }, /* @__PURE__ */ _(
        IconButton,
        {
          onClick: () => {
            if (componentDataSpec) {
              setComponentDataInput("");
              setComponentDataSpec(null);
              setComponentDataError("");
            } else {
              setIsComponentDataModalOpen(true);
            }
          }
        },
        componentDataSpec ? /* @__PURE__ */ _("div", { style: {
          color: "var(--figma-color-text-danger)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        } }, /* @__PURE__ */ _(IconClose16, null)) : /* @__PURE__ */ _(IconPlus16, null)
      ), /* @__PURE__ */ _("div", { className: "tooltip" }, componentDataSpec ? "Remove Component Data" : "Add Component Data"))), (waitingForAutoSelect || previewsLoading || previewsError) && dataSource === "anova" && /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--figma-color-text-tertiary)" } }, "\xB7"), /* @__PURE__ */ _("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 8px",
        borderRadius: "3px",
        background: previewsError ? "var(--figma-color-bg-danger-tertiary)" : "var(--figma-color-bg-secondary)"
      } }, !previewsError && /* @__PURE__ */ _("div", { style: {
        width: "12px",
        height: "12px",
        border: "2px solid var(--figma-color-text-brand)",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      } }), /* @__PURE__ */ _("div", { style: {
        fontSize: "11px",
        fontWeight: 500,
        color: previewsError ? "var(--figma-color-text-danger)" : "var(--figma-color-text)"
      } }, previewsError ? "Preview error" : waitingForAutoSelect ? "Searching for component" : "Generating previews")))), /* @__PURE__ */ _(
        Checkbox,
        {
          value: (() => {
            const validCombinationKeys = sortedCombinations.filter((c3) => c3.isValidCombination !== false).map((combo) => getCombinationKey(combo));
            return validCombinationKeys.every((key) => selectedCombinations[key]);
          })(),
          onValueChange: handleSelectAll
        },
        /* @__PURE__ */ _(Text, null, "Select All")
      )),
      previewCombinations.length > 0 && /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, (() => {
        let groupableProps = [];
        if (dataSource === "anova" && anovaSpec) {
          groupableProps = Object.entries(anovaSpec.props).filter(([propName, prop]) => prop.enum && prop.enum.length > 0).map(([propName]) => propName);
        } else if (dataSource === "figma-direct" && propertyOrder.length > 0) {
          groupableProps = propertyOrder.filter((propName) => {
            const prop = allProperties[propName];
            if (!prop || prop.type !== "VARIANT" || !prop.values || prop.values.length <= 1) {
              return false;
            }
            const combosWithProperty = sortedCombinations.filter(
              (combo) => combo.properties && combo.properties[propName]
            ).length;
            const coveragePercent = combosWithProperty / sortedCombinations.length * 100;
            return coveragePercent >= 100;
          });
        }
        if (groupableProps.length < 2) return null;
        const groupOptions = groupableProps.map((propName) => ({
          value: propName,
          text: propName
        }));
        let currentGrouping = selectedGroupingProperty;
        if (!currentGrouping && groupableProps.length > 0) {
          currentGrouping = groupableProps[0];
        }
        return /* @__PURE__ */ _("div", { style: { minWidth: "140px" } }, /* @__PURE__ */ _(Muted, { style: { fontSize: "10px", fontWeight: 600, marginBottom: "4px", display: "block" } }, "Group by"), /* @__PURE__ */ _(
          Dropdown,
          {
            value: currentGrouping || "",
            options: groupOptions,
            onChange: (e3) => setSelectedGroupingProperty(e3.currentTarget.value),
            style: {
              fontSize: "11px",
              fontWeight: 500
            }
          }
        ));
      })(), (() => {
        let filterableProps = [];
        if (dataSource === "anova" && anovaSpec) {
          filterableProps = Object.entries(anovaSpec.props).filter(([propName, prop]) => {
            return prop.enum && prop.enum.length > 0;
          });
        } else if (dataSource === "figma-direct" && propertyOrder.length > 0) {
          filterableProps = propertyOrder.filter((propName) => {
            const prop = allProperties[propName];
            return prop && prop.type === "VARIANT" && prop.values && prop.values.length > 2;
          }).map((propName) => [propName, allProperties[propName]]);
        }
        if (filterableProps.length === 0) return null;
        return /* @__PURE__ */ _(k, null, filterableProps.map(([propName, prop]) => {
          const uniqueValues = getUniquePropertyValues(propName);
          const currentFilter = activeFilters[propName];
          const options = [
            { value: "", text: `All ${propName}` },
            ...uniqueValues.map((value) => ({ value, text: value }))
          ];
          return /* @__PURE__ */ _("div", { key: propName, style: { minWidth: "100px" } }, /* @__PURE__ */ _(
            Dropdown,
            {
              value: currentFilter || "",
              options,
              onChange: (newValue) => handleFilterChange(propName, newValue.currentTarget.value || null),
              style: {
                fontSize: "11px",
                borderColor: currentFilter ? "var(--figma-color-text-brand)" : void 0,
                fontWeight: currentFilter ? 600 : 400
              }
            }
          ));
        }));
      })())
    ), /* @__PURE__ */ _("div", { style: { flex: 1, overflowY: "auto", overflowX: "auto", padding: "0 12px" } }, previewCombinations.length === 0 ? /* @__PURE__ */ _("div", { style: { textAlign: "center", paddingTop: "40px" } }, /* @__PURE__ */ _(Muted, null, "No combinations to show")) : (
      /* Unified Grouped list view with thumbnails (both modes) */
      /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column" } }, Object.keys(groupedCombinations).length > 0 ? Object.entries(groupedCombinations).map(([groupKey, groupCombos]) => {
        const isCollapsed = groupKey === "__INVALID__" ? collapsedGroups[groupKey] !== void 0 ? collapsedGroups[groupKey] : true : collapsedGroups[groupKey] || false;
        const groupSelectedCount = groupCombos.filter(
          (combo) => selectedCombinations[getCombinationKey(combo)]
        ).length;
        return /* @__PURE__ */ _(
          "div",
          {
            key: groupKey,
            id: groupKey === "__INVALID__" ? "invalid-combinations-group" : void 0,
            style: { marginBottom: isCollapsed ? "8px" : "16px" }
          },
          /* @__PURE__ */ _(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 0",
                cursor: "pointer",
                userSelect: "none",
                marginLeft: "-2px"
              },
              onClick: () => handleGroupToggle(groupKey)
            },
            /* @__PURE__ */ _("div", { style: {
              transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease",
              display: "flex",
              alignItems: "center",
              color: "var(--figma-color-text-secondary)",
              marginRight: "2px",
              pointerEvents: "none"
            } }, /* @__PURE__ */ _(IconChevronDown16, null)),
            /* @__PURE__ */ _(Text, { style: { fontWeight: 500, color: groupKey === "__INVALID__" ? "var(--figma-color-text-secondary)" : void 0, pointerEvents: "none" } }, groupKey === "__INVALID__" ? "Invalid Combinations" : `${groupingProperty}: ${groupKey}`),
            /* @__PURE__ */ _(Muted, { style: { fontSize: "11px", marginLeft: "2px", pointerEvents: "none" } }, "(", groupSelectedCount, " / ", groupCombos.length, ")"),
            groupKey !== "__INVALID__" && /* @__PURE__ */ _("div", { style: { marginLeft: "auto" } }, /* @__PURE__ */ _(
              Checkbox,
              {
                value: groupSelectedCount === groupCombos.length,
                onValueChange: (e3) => {
                  handleGroupSelectAll(groupCombos);
                },
                onClick: (e3) => e3.stopPropagation()
              },
              /* @__PURE__ */ _(Text, null, "Select ", groupKey)
            ))
          ),
          groupKey === "__INVALID__" && groupCombos.length > 0 && /* @__PURE__ */ _("div", { style: {
            padding: "12px",
            background: "var(--figma-color-bg-secondary)",
            borderRadius: "6px",
            border: "1px solid var(--figma-color-border)",
            marginBottom: "4px"
          } }, /* @__PURE__ */ _("div", { style: {
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--figma-color-text)",
            marginBottom: "8px"
          } }, "Why these combinations are invalid:"), /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } }, (() => {
            const invalidPatterns = /* @__PURE__ */ new Map();
            groupCombos.forEach((combo) => {
              const propParts = [];
              Object.entries(combo.properties).forEach(([key, value]) => {
                const strValue = String(value).toLowerCase();
                if (strValue === "true") {
                  propParts.push(key);
                } else if (strValue !== "false") {
                  propParts.push(`${key}=${value}`);
                }
              });
              const sortedParts = propParts.sort();
              const signature = sortedParts.join(" + ");
              if (signature) {
                const existing = invalidPatterns.get(signature);
                if (existing) {
                  existing.count++;
                } else {
                  invalidPatterns.set(signature, { parts: sortedParts, count: 1 });
                }
              }
            });
            return Array.from(invalidPatterns.entries()).map(([pattern, { parts, count }]) => /* @__PURE__ */ _("div", { key: pattern, style: {
              fontSize: "11px",
              color: "var(--figma-color-text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            } }, /* @__PURE__ */ _("span", { style: {
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "var(--figma-color-text-tertiary)",
              flexShrink: 0
            } }), /* @__PURE__ */ _("div", { style: { display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" } }, parts.map((part, idx) => /* @__PURE__ */ _("span", { key: idx }, /* @__PURE__ */ _("span", { style: {
              padding: "2px 6px",
              borderRadius: "3px",
              background: "var(--figma-color-bg-tertiary)",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "var(--figma-color-text)",
              whiteSpace: "nowrap"
            } }, part), idx < parts.length - 1 && /* @__PURE__ */ _("span", { style: {
              margin: "0 2px",
              color: "var(--figma-color-text-tertiary)",
              fontSize: "10px"
            } }, "+"))), /* @__PURE__ */ _("span", { style: { color: "var(--figma-color-text-tertiary)", whiteSpace: "nowrap", marginLeft: "2px" } }, "(", count, " variant", count > 1 ? "s" : "", ")"))));
          })())),
          !isCollapsed && /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px", width: "100%" } }, groupCombos.map((combo, localIndex) => {
            const key = getCombinationKey(combo);
            const isSelected = selectedCombinations[key] || false;
            const isHovered = hoveredRow === key;
            const previewImage = previews[combo.variantName];
            const isInvalid = combo.isValidCombination === false;
            const globalIndex = sortedCombinations.findIndex((c3) => getCombinationKey(c3) === key);
            let bgColor = "transparent";
            if (isInvalid) {
              bgColor = "var(--figma-color-bg-disabled)";
            } else if (isSelected) {
              bgColor = "var(--figma-color-bg-selected)";
            } else if (isHovered) {
              bgColor = "var(--figma-color-bg-hover)";
            }
            return /* @__PURE__ */ _(
              "div",
              {
                key: localIndex,
                style: {
                  cursor: isInvalid ? "not-allowed" : "pointer",
                  background: bgColor,
                  borderRadius: "6px",
                  padding: "12px",
                  border: isInvalid ? "1px dashed var(--figma-color-border)" : isSelected ? "1px solid var(--figma-color-text-brand)" : "1px solid transparent",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  opacity: isInvalid ? 0.5 : 1,
                  position: "relative"
                },
                onMouseEnter: () => !isInvalid && setHoveredRow(key),
                onMouseLeave: () => setHoveredRow(null),
                onClick: (e3) => !isInvalid && handleCombinationToggle(key, globalIndex, e3.shiftKey)
              },
              /* @__PURE__ */ _("div", { style: {
                width: "96px",
                height: "96px",
                flexShrink: 0,
                borderRadius: "6px",
                overflow: "hidden",
                background: "var(--figma-color-bg-tertiary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--figma-color-border)"
              } }, previewsLoading ? /* @__PURE__ */ _(LoadingIndicator, null) : previewImage ? /* @__PURE__ */ _(
                "img",
                {
                  src: `data:image/png;base64,${previewImage}`,
                  alt: combo.variantName,
                  style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }
                }
              ) : /* @__PURE__ */ _(Muted, { style: { fontSize: "24px" } }, "?")),
              /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px" } }, isInvalid && /* @__PURE__ */ _("div", { style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "2px 6px",
                borderRadius: "3px",
                background: "var(--figma-color-bg-tertiary)",
                alignSelf: "flex-start"
              } }, /* @__PURE__ */ _("span", { style: {
                fontSize: "10px",
                fontWeight: 500,
                color: "var(--figma-color-text-tertiary)"
              } }, "Invalid")), /* @__PURE__ */ _("div", { style: { display: "flex", gap: "12px", alignItems: "flex-start" } }, combo.properties && Object.keys(combo.properties).length > 0 && (() => {
                const boolProps = [];
                const variantProps = [];
                Object.entries(combo.properties).forEach(([key2, value]) => {
                  if (key2 === groupingProperty) {
                    return;
                  }
                  const strValue = String(value).toLowerCase();
                  const isBool = strValue === "true" || strValue === "false";
                  if (isBool) {
                    boolProps.push([key2, value]);
                  } else {
                    variantProps.push([key2, value]);
                  }
                });
                return /* @__PURE__ */ _(k, null, variantProps.length > 0 && /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", gap: "4px", flex: "0 0 auto" } }, variantProps.map(([key2, value]) => /* @__PURE__ */ _(
                  "div",
                  {
                    key: key2,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      fontSize: "11px"
                    }
                  },
                  /* @__PURE__ */ _("span", { style: {
                    color: "var(--figma-color-text)",
                    fontWeight: 500,
                    padding: "2px 8px",
                    borderRadius: "3px",
                    background: "var(--figma-color-bg-brand-tertiary)"
                  } }, String(value))
                ))), boolProps.length > 0 && /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", gap: "4px", marginLeft: "auto", alignItems: "flex-end" } }, boolProps.map(([key2, value]) => {
                  const strValue = String(value).toLowerCase();
                  const boolValue = strValue === "true";
                  return /* @__PURE__ */ _(
                    "div",
                    {
                      key: key2,
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px"
                      }
                    },
                    /* @__PURE__ */ _("span", { style: {
                      color: "var(--figma-color-text-secondary)"
                    } }, key2),
                    /* @__PURE__ */ _("span", { style: {
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "2px",
                      borderRadius: "3px",
                      background: boolValue ? "var(--figma-color-bg-success)" : "var(--figma-color-bg-secondary)",
                      fontSize: "10px",
                      color: boolValue ? "var(--figma-color-text-onbrand)" : "var(--figma-color-text-tertiary)",
                      fontWeight: 600,
                      lineHeight: 1
                    } }, boolValue ? "\u2713" : "\u2717")
                  );
                })));
              })())),
              !isInvalid && isHovered && groupingProperty && Object.keys(groupedCombinations).length > 1 && /* @__PURE__ */ _("div", { style: {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none"
              } }, /* @__PURE__ */ _(
                Button,
                {
                  secondary: true,
                  onClick: (e3) => {
                    e3.stopPropagation();
                    handleSelectAcrossGroups(combo, groupingProperty);
                  },
                  onMouseEnter: (e3) => {
                    e3.currentTarget.style.background = "var(--figma-color-bg-hover)";
                    e3.currentTarget.style.borderColor = "var(--figma-color-text-brand)";
                  },
                  onMouseLeave: (e3) => {
                    e3.currentTarget.style.background = "";
                    e3.currentTarget.style.borderColor = "";
                  },
                  style: {
                    fontSize: "11px",
                    padding: "4px 8px",
                    pointerEvents: "auto",
                    cursor: "pointer"
                  }
                },
                "Select in All Groups"
              ))
            );
          }))
        );
      }) : (
        /* Fallback for no grouping - render ungrouped items */
        /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", gap: "8px", width: "100%" } }, sortedCombinations.map((combo, index) => {
          const key = getCombinationKey(combo);
          const isSelected = selectedCombinations[key] || false;
          const isHovered = hoveredRow === key;
          const previewImage = previews[combo.variantName];
          const isInvalid = combo.isValidCombination === false;
          let bgColor = "transparent";
          if (isInvalid) {
            bgColor = "var(--figma-color-bg-disabled)";
          } else if (isSelected) {
            bgColor = "var(--figma-color-bg-selected)";
          } else if (isHovered) {
            bgColor = "var(--figma-color-bg-hover)";
          }
          return /* @__PURE__ */ _(
            "div",
            {
              key: index,
              style: {
                cursor: isInvalid ? "not-allowed" : "pointer",
                background: bgColor,
                borderRadius: "6px",
                padding: "12px",
                border: isInvalid ? "1px dashed var(--figma-color-border)" : isSelected ? "1px solid var(--figma-color-text-brand)" : "1px solid transparent",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                opacity: isInvalid ? 0.5 : 1,
                position: "relative"
              },
              onMouseEnter: () => !isInvalid && setHoveredRow(key),
              onMouseLeave: () => setHoveredRow(null),
              onClick: (e3) => !isInvalid && handleCombinationToggle(key, index, e3.shiftKey)
            },
            /* @__PURE__ */ _("div", { style: {
              width: "96px",
              height: "96px",
              flexShrink: 0,
              borderRadius: "6px",
              overflow: "hidden",
              background: "var(--figma-color-bg-tertiary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--figma-color-border)"
            } }, previewsLoading ? /* @__PURE__ */ _(LoadingIndicator, null) : previewImage ? /* @__PURE__ */ _(
              "img",
              {
                src: `data:image/png;base64,${previewImage}`,
                alt: combo.variantName,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }
              }
            ) : /* @__PURE__ */ _(Muted, { style: { fontSize: "24px" } }, "?")),
            /* @__PURE__ */ _("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px" } }, isInvalid && /* @__PURE__ */ _("div", { style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 6px",
              borderRadius: "3px",
              background: "var(--figma-color-bg-tertiary)",
              alignSelf: "flex-start"
            } }, /* @__PURE__ */ _("span", { style: {
              fontSize: "10px",
              fontWeight: 500,
              color: "var(--figma-color-text-tertiary)"
            } }, "Invalid")), /* @__PURE__ */ _("div", { style: { display: "flex", gap: "12px", alignItems: "flex-start" } }, combo.properties && Object.keys(combo.properties).length > 0 && (() => {
              const boolProps = [];
              const variantProps = [];
              Object.entries(combo.properties).forEach(([key2, value]) => {
                const strValue = String(value).toLowerCase();
                const isBool = strValue === "true" || strValue === "false";
                if (isBool) {
                  boolProps.push([key2, value]);
                } else {
                  variantProps.push([key2, value]);
                }
              });
              return /* @__PURE__ */ _(k, null, variantProps.length > 0 && /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", gap: "4px", flex: "0 0 auto" } }, variantProps.map(([key2, value]) => /* @__PURE__ */ _(
                "div",
                {
                  key: key2,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    fontSize: "11px"
                  }
                },
                /* @__PURE__ */ _("span", { style: {
                  color: "var(--figma-color-text)",
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: "3px",
                  background: "var(--figma-color-bg-brand-tertiary)"
                } }, String(value))
              ))), boolProps.length > 0 && /* @__PURE__ */ _("div", { style: { display: "flex", flexDirection: "column", gap: "4px", marginLeft: "auto", alignItems: "flex-end" } }, boolProps.map(([key2, value]) => {
                const strValue = String(value).toLowerCase();
                const boolValue = strValue === "true";
                return /* @__PURE__ */ _(
                  "div",
                  {
                    key: key2,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "11px"
                    }
                  },
                  /* @__PURE__ */ _("span", { style: {
                    color: "var(--figma-color-text-secondary)"
                  } }, key2),
                  /* @__PURE__ */ _("span", { style: {
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "2px",
                    borderRadius: "3px",
                    background: boolValue ? "var(--figma-color-bg-success)" : "var(--figma-color-bg-secondary)",
                    fontSize: "10px",
                    color: boolValue ? "var(--figma-color-text-onbrand)" : "var(--figma-color-text-tertiary)",
                    fontWeight: 600,
                    lineHeight: 1
                  } }, boolValue ? "\u2713" : "\u2717")
                );
              })));
            })()))
          );
        }))
      ))
    ))))), /* @__PURE__ */ _("div", { style: {
      padding: "12px",
      background: "var(--figma-color-bg)",
      borderTop: "1px solid var(--figma-color-border)",
      flexShrink: 0
    } }, /* @__PURE__ */ _("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ _(Button, { fullWidth: true, onClick: () => setIsLayoutModalOpen(true), disabled: !hasSelection }, "Preview Layout"), /* @__PURE__ */ _(Button, { fullWidth: true, secondary: true, onClick: () => handleGenerate(), disabled: !hasSelection }, "Generate")))), isComponentDataModalOpen && /* @__PURE__ */ _(
      Modal,
      {
        open: isComponentDataModalOpen,
        title: "Add Component Data",
        onCloseButtonClick: () => setIsComponentDataModalOpen(false)
      },
      /* @__PURE__ */ _("div", { style: { padding: "12px" } }, /* @__PURE__ */ _("div", { style: { marginBottom: "12px" } }, /* @__PURE__ */ _(Muted, null, "Paste component data (YAML) to filter variants to only valid combinations")), /* @__PURE__ */ _(
        TextboxMultiline,
        {
          value: componentDataInput,
          onValueInput: setComponentDataInput,
          placeholder: "Paste Anova YAML data here...",
          rows: 12
        }
      ), componentDataError && /* @__PURE__ */ _("div", { style: { marginTop: "8px", color: "var(--figma-color-text-danger)", fontSize: "11px" } }, componentDataError), componentDataSpec && /* @__PURE__ */ _("div", { style: { marginTop: "8px", color: "var(--figma-color-text-success)", fontSize: "11px" } }, "\u2713 Loaded: ", componentDataSpec.title), /* @__PURE__ */ _(VerticalSpace, { space: "medium" }), /* @__PURE__ */ _("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end" } }, /* @__PURE__ */ _(Button, { secondary: true, onClick: () => setIsComponentDataModalOpen(false) }, "Cancel"), /* @__PURE__ */ _(Button, { onClick: () => {
        handleComponentDataParse();
        setIsComponentDataModalOpen(false);
      } }, "Apply Filter")))
    ), isLayoutModalOpen && (() => {
      var _a2, _b, _c;
      const varyingProps = /* @__PURE__ */ new Set();
      const selectedCombos = previewCombinations.filter((combo) => {
        const key = getCombinationKey(combo);
        return selectedCombinations[key] && combo.isValidCombination !== false;
      });
      selectedCombos.forEach((combo) => {
        Object.keys(combo.properties).forEach((prop) => varyingProps.add(prop));
      });
      const propArray = Array.from(varyingProps);
      const propValues = {};
      propArray.forEach((prop) => {
        const values = [];
        const seen = /* @__PURE__ */ new Set();
        selectedCombos.forEach((combo) => {
          if (combo.properties[prop]) {
            const val = String(combo.properties[prop]);
            if (!seen.has(val)) {
              seen.add(val);
              values.push(val);
            }
          }
        });
        propValues[prop] = values;
      });
      const currentRowProp = layoutRowProperty || (propArray.length > 0 ? propArray[0] : null);
      const currentColProps = layoutColumnProperties.length > 0 ? layoutColumnProperties : propArray.filter((p3) => p3 !== currentRowProp);
      const rowOptions = propArray.map((prop) => ({ value: prop, text: prop }));
      const availableColProps = propArray.filter((p3) => p3 !== currentRowProp);
      const handleColumnToggle = (prop) => {
        if (currentColProps.includes(prop)) {
          setLayoutColumnProperties(currentColProps.filter((p3) => p3 !== prop));
        } else {
          setLayoutColumnProperties([...currentColProps, prop]);
        }
      };
      const [excludedCells, setExcludedCells] = d2(/* @__PURE__ */ new Set());
      const getCellKey = (rowValue, colCombo) => {
        return `${currentRowProp}:${rowValue}|${currentColProps.map((prop, idx) => `${prop}:${colCombo[idx]}`).join("|")}`;
      };
      const toggleCellExclusion = (rowValue, colCombo) => {
        const key = getCellKey(rowValue, colCombo);
        const newExcluded = new Set(excludedCells);
        if (newExcluded.has(key)) {
          newExcluded.delete(key);
        } else {
          newExcluded.add(key);
        }
        setExcludedCells(newExcluded);
      };
      return /* @__PURE__ */ _(
        Modal,
        {
          open: isLayoutModalOpen,
          title: "Configure Layout",
          onCloseButtonClick: () => setIsLayoutModalOpen(false)
        },
        /* @__PURE__ */ _("div", { style: {
          padding: "16px",
          maxWidth: "568px",
          width: "100%",
          boxSizing: "border-box"
        } }, propArray.length < 2 ? /* @__PURE__ */ _("div", null, /* @__PURE__ */ _(Muted, null, "Need at least 2 varying properties to customize layout")) : /* @__PURE__ */ _(k, null, /* @__PURE__ */ _(Muted, { style: { fontSize: "11px", marginBottom: "12px", display: "block" } }, "Assign each property to Row or Column"), /* @__PURE__ */ _("div", { style: { marginBottom: "16px" } }, propArray.map((prop) => {
          const isRowProp = currentRowProp === prop;
          const isColProp = currentColProps.includes(prop);
          return /* @__PURE__ */ _(
            "div",
            {
              key: prop,
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid var(--figma-color-border)"
              }
            },
            /* @__PURE__ */ _("div", { style: { flex: 1 } }, /* @__PURE__ */ _(Text, { style: { fontSize: "11px", display: "block", marginBottom: "2px" } }, prop), propValues[prop] && /* @__PURE__ */ _(Muted, { style: { fontSize: "10px" } }, propValues[prop].length, " values: ", propValues[prop].slice(0, 3).join(", "), propValues[prop].length > 3 ? "..." : "")),
            /* @__PURE__ */ _("div", { style: { display: "flex", gap: "4px", marginLeft: "12px" } }, /* @__PURE__ */ _(
              Button,
              {
                secondary: !isRowProp,
                onClick: () => {
                  setLayoutRowProperty(prop);
                  if (isColProp) {
                    setLayoutColumnProperties(currentColProps.filter((p3) => p3 !== prop));
                  }
                },
                style: {
                  minWidth: "50px",
                  padding: "4px 8px",
                  fontSize: "10px"
                }
              },
              "Row"
            ), /* @__PURE__ */ _(
              Button,
              {
                secondary: !isColProp,
                disabled: isRowProp,
                onClick: () => handleColumnToggle(prop),
                style: {
                  minWidth: "50px",
                  padding: "4px 8px",
                  fontSize: "10px"
                }
              },
              "Column"
            ))
          );
        })), currentRowProp && currentColProps.length > 0 && /* @__PURE__ */ _("div", { style: {
          padding: "16px",
          background: "var(--figma-color-bg-secondary)",
          borderRadius: "6px",
          border: "1px solid var(--figma-color-border)"
        } }, /* @__PURE__ */ _("div", { style: { marginBottom: "12px" } }, /* @__PURE__ */ _(Text, { style: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" } }, "Layout Preview"), /* @__PURE__ */ _(Muted, { style: { fontSize: "10px" } }, ((_a2 = propValues[currentRowProp]) == null ? void 0 : _a2.length) || 0, " rows \xD7 ", currentColProps.reduce((sum, prop) => {
          var _a3;
          return sum * (((_a3 = propValues[prop]) == null ? void 0 : _a3.length) || 1);
        }, 1), " columns = ", (((_b = propValues[currentRowProp]) == null ? void 0 : _b.length) || 0) * currentColProps.reduce((sum, prop) => {
          var _a3;
          return sum * (((_a3 = propValues[prop]) == null ? void 0 : _a3.length) || 1);
        }, 1), " total cells", excludedCells.size > 0 && /* @__PURE__ */ _("span", { style: { color: "var(--figma-color-text-danger)" } }, " ", "(", excludedCells.size, " excluded)"))), /* @__PURE__ */ _("div", { style: { marginBottom: "8px" } }, /* @__PURE__ */ _(Muted, { style: { fontSize: "10px" } }, "\u{1F4A1} Click any cell to exclude it from generation")), /* @__PURE__ */ _("div", { style: {
          position: "relative",
          borderRadius: "4px",
          border: "1px solid var(--figma-color-border)",
          background: "var(--figma-color-bg)",
          width: "100%",
          maxWidth: "536px"
        } }, /* @__PURE__ */ _("div", { style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: "30px",
          width: "40px",
          background: "linear-gradient(to left, var(--figma-color-bg-secondary) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 3,
          borderRadius: "0 4px 0 0"
        } }), /* @__PURE__ */ _("div", { style: {
          fontSize: "10px",
          overflowX: "scroll",
          overflowY: "scroll",
          maxHeight: "350px",
          width: "100%",
          WebkitOverflowScrolling: "touch",
          position: "relative"
        } }, /* @__PURE__ */ _("table", { style: {
          width: "auto",
          borderCollapse: "separate",
          borderSpacing: 0,
          tableLayout: "auto"
        } }, /* @__PURE__ */ _("thead", null, /* @__PURE__ */ _("tr", null, /* @__PURE__ */ _("th", { style: {
          padding: "8px 12px",
          textAlign: "left",
          fontWeight: 600,
          fontSize: "11px",
          color: "var(--figma-color-text)",
          background: "var(--figma-color-bg-secondary)",
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 3,
          borderBottom: "2px solid var(--figma-color-border)",
          borderRight: "2px solid var(--figma-color-border)",
          minWidth: "100px"
        } }, "\u2193 ", currentRowProp), (() => {
          const getColumnCombinations = (props, index, current) => {
            if (index >= props.length) return [current];
            const results = [];
            const values = propValues[props[index]] || [];
            for (const val of values) {
              results.push(...getColumnCombinations(props, index + 1, [...current, val]));
            }
            return results;
          };
          const colCombos = getColumnCombinations(currentColProps, 0, []);
          colCombos.sort((a3, b2) => {
            for (let i3 = 0; i3 < currentColProps.length; i3++) {
              const aVal = String(a3[i3]);
              const bVal = String(b2[i3]);
              if (aVal !== bVal) return aVal.localeCompare(bVal);
            }
            return 0;
          });
          return colCombos.map((combo, idx) => /* @__PURE__ */ _("th", { key: idx, style: {
            padding: "8px 12px",
            textAlign: "left",
            fontWeight: 600,
            fontSize: "10px",
            color: "var(--figma-color-text)",
            background: "var(--figma-color-bg)",
            position: "sticky",
            top: 0,
            zIndex: 1,
            borderBottom: "2px solid var(--figma-color-border)",
            borderLeft: idx === 0 ? "none" : "1px solid var(--figma-color-border)",
            minWidth: "100px",
            maxWidth: "200px",
            whiteSpace: "normal",
            verticalAlign: "top"
          } }, currentColProps.map((prop, propIdx) => /* @__PURE__ */ _("div", { key: propIdx, style: {
            marginBottom: propIdx < currentColProps.length - 1 ? "4px" : 0,
            fontSize: "9px",
            color: "var(--figma-color-text-secondary)",
            lineHeight: "1.3"
          } }, /* @__PURE__ */ _("span", { style: { fontWeight: 600, color: "var(--figma-color-text)" } }, prop, ":"), " ", combo[propIdx]))));
        })())), /* @__PURE__ */ _("tbody", null, (_c = propValues[currentRowProp]) == null ? void 0 : _c.map((rowValue, rowIdx) => /* @__PURE__ */ _("tr", { key: rowIdx }, /* @__PURE__ */ _("td", { style: {
          padding: "8px 12px",
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--figma-color-text)",
          background: "var(--figma-color-bg-secondary)",
          position: "sticky",
          left: 0,
          zIndex: 1,
          borderRight: "2px solid var(--figma-color-border)",
          borderBottom: "1px solid var(--figma-color-border)",
          minWidth: "100px"
        } }, rowValue), (() => {
          const getColumnCombinations = (props, index, current) => {
            if (index >= props.length) return [current];
            const results = [];
            const values = propValues[props[index]] || [];
            for (const val of values) {
              results.push(...getColumnCombinations(props, index + 1, [...current, val]));
            }
            return results;
          };
          const colCombos = getColumnCombinations(currentColProps, 0, []);
          colCombos.sort((a3, b2) => {
            for (let i3 = 0; i3 < currentColProps.length; i3++) {
              const aVal = String(a3[i3]);
              const bVal = String(b2[i3]);
              if (aVal !== bVal) return aVal.localeCompare(bVal);
            }
            return 0;
          });
          return colCombos.map((combo, colIdx) => {
            const comboExists = selectedCombos.some((c3) => {
              if (String(c3.properties[currentRowProp]) !== rowValue) return false;
              for (let i3 = 0; i3 < currentColProps.length; i3++) {
                if (String(c3.properties[currentColProps[i3]]) !== String(combo[i3])) return false;
              }
              return true;
            });
            if (!comboExists) {
              return /* @__PURE__ */ _("td", { key: colIdx, style: {
                padding: "4px",
                fontSize: "10px",
                textAlign: "center",
                background: "var(--figma-color-bg-secondary)",
                borderBottom: "1px solid var(--figma-color-border)",
                borderLeft: colIdx === 0 ? "none" : "1px solid var(--figma-color-border)",
                opacity: 0.3
              } }, /* @__PURE__ */ _("div", { style: {
                padding: "8px 12px",
                fontSize: "10px",
                color: "var(--figma-color-text-disabled)"
              } }, "\u2014"));
            }
            const cellKey = getCellKey(rowValue, combo);
            const isExcluded = excludedCells.has(cellKey);
            return /* @__PURE__ */ _(
              "td",
              {
                key: colIdx,
                style: {
                  padding: "4px",
                  fontSize: "10px",
                  textAlign: "center",
                  background: "var(--figma-color-bg)",
                  borderBottom: "1px solid var(--figma-color-border)",
                  borderLeft: colIdx === 0 ? "none" : "1px solid var(--figma-color-border)",
                  cursor: "pointer"
                },
                onClick: () => toggleCellExclusion(rowValue, combo)
              },
              /* @__PURE__ */ _(
                "div",
                {
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 12px",
                    background: isExcluded ? "var(--figma-color-bg-secondary)" : "var(--figma-color-bg-brand-tertiary)",
                    borderRadius: "3px",
                    fontSize: "10px",
                    fontWeight: 500,
                    color: isExcluded ? "var(--figma-color-text-disabled)" : "var(--figma-color-text-brand)",
                    opacity: isExcluded ? 0.5 : 1,
                    transition: "all 0.15s ease",
                    minWidth: "40px",
                    textDecoration: isExcluded ? "line-through" : "none"
                  },
                  onMouseEnter: (e3) => {
                    e3.currentTarget.style.transform = "scale(1.05)";
                  },
                  onMouseLeave: (e3) => {
                    e3.currentTarget.style.transform = "scale(1)";
                  }
                },
                isExcluded ? "\u2717" : "\u2713"
              )
            );
          });
        })()))))), /* @__PURE__ */ _("div", { style: {
          marginTop: "8px",
          textAlign: "center"
        } }, /* @__PURE__ */ _(Muted, { style: { fontSize: "9px" } }, "\u2190 Scroll to see all columns \u2192")))), /* @__PURE__ */ _("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end" } }, /* @__PURE__ */ _(Button, { secondary: true, onClick: () => setIsLayoutModalOpen(false) }, "Cancel"), /* @__PURE__ */ _(Button, { onClick: () => {
          if (!currentRowProp) return;
          const combinationsToGenerate = selectedCombos.filter((combo) => {
            const rowValue = String(combo.properties[currentRowProp]);
            const colCombo = currentColProps.map((prop) => String(combo.properties[prop]));
            const cellKey = getCellKey(rowValue, colCombo);
            return !excludedCells.has(cellKey);
          });
          console.log("\u{1F3A8} Generating with exclusions:", {
            total: selectedCombos.length,
            excluded: excludedCells.size,
            toGenerate: combinationsToGenerate.length
          });
          handleGenerate(combinationsToGenerate);
          setIsLayoutModalOpen(false);
        }, disabled: !currentRowProp || currentColProps.length === 0 }, "Generate Sticker Sheet"))))
      );
    })());
  }
  var ui_default;
  var init_ui = __esm({
    "src/ui.tsx"() {
      "use strict";
      init_lib();
      init_lib2();
      init_preact_module();
      init_hooks_module();
      init_js_yaml();
      init_anova();
      ui_default = render(Plugin);
    }
  });

  // <stdin>
  var rootNode = document.getElementById("create-figma-plugin");
  var modules = { "src/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"] };
  var commandId = __FIGMA_COMMAND__ === "" ? "src/main.ts--default" : __FIGMA_COMMAND__;
  if (typeof modules[commandId] === "undefined") {
    throw new Error(
      "No UI defined for command `" + commandId + "`"
    );
  }
  modules[commandId](rootNode, __SHOW_UI_DATA__);
})();
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT *)
*/
