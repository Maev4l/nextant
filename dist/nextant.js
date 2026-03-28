import * as x from "react";
import Mt, { useContext as Ke, createContext as kn, useEffect as xe, useState as we, useRef as J, useCallback as le, forwardRef as ke, useMemo as kt, useImperativeHandle as An, createElement as At } from "react";
import { jsx as S, jsxs as ue, Fragment as jt } from "react/jsx-runtime";
function Tr() {
  return {
    type: "GO_BACK"
  };
}
function Bt(...e) {
  if (typeof e[0] == "string") {
    const [r, n, t] = e;
    return typeof t == "boolean" && console.warn("Passing a boolean as the third argument to 'navigate' is deprecated. Pass '{ merge: true }' instead."), {
      type: "NAVIGATE",
      payload: {
        name: r,
        params: n,
        merge: typeof t == "boolean" ? t : t == null ? void 0 : t.merge,
        pop: t == null ? void 0 : t.pop
      }
    };
  } else {
    const r = e[0] || {};
    if (!("name" in r))
      throw new Error("You need to specify a name when calling navigate with an object as the argument. See https://reactnavigation.org/docs/navigation-actions#navigate for usage.");
    return {
      type: "NAVIGATE",
      payload: r
    };
  }
}
function On(...e) {
  if (typeof e[0] == "string")
    return {
      type: "NAVIGATE_DEPRECATED",
      payload: {
        name: e[0],
        params: e[1]
      }
    };
  {
    const r = e[0] || {};
    if (!("name" in r))
      throw new Error("You need to specify a name when calling navigateDeprecated with an object as the argument. See https://reactnavigation.org/docs/navigation-actions#navigatelegacy for usage.");
    return {
      type: "NAVIGATE_DEPRECATED",
      payload: r
    };
  }
}
function nt(e) {
  return {
    type: "RESET",
    payload: e
  };
}
function Tn(e) {
  return {
    type: "SET_PARAMS",
    payload: {
      params: e
    }
  };
}
function Nn(e) {
  return {
    type: "REPLACE_PARAMS",
    payload: {
      params: e
    }
  };
}
function Pn(e, r) {
  return {
    type: "PRELOAD",
    payload: {
      name: e,
      params: r
    }
  };
}
const Le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  goBack: Tr,
  navigate: Bt,
  navigateDeprecated: On,
  preload: Pn,
  replaceParams: Nn,
  reset: nt,
  setParams: Tn
}, Symbol.toStringTag, { value: "Module" }));
let In = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", oe = (e = 21) => {
  let r = "", n = e | 0;
  for (; n--; )
    r += In[Math.random() * 64 | 0];
  return r;
};
const Ve = {
  getStateForAction(e, r) {
    switch (r.type) {
      case "SET_PARAMS":
      case "REPLACE_PARAMS": {
        const n = r.source ? e.routes.findIndex((t) => t.key === r.source) : e.index;
        return n === -1 ? null : {
          ...e,
          routes: e.routes.map((t, s) => s === n ? {
            ...t,
            params: r.type === "REPLACE_PARAMS" ? r.payload.params : {
              ...t.params,
              ...r.payload.params
            }
          } : t)
        };
      }
      case "RESET": {
        const n = r.payload;
        return n.routes.length === 0 || n.routes.some((t) => !e.routeNames.includes(t.name)) ? null : n.stale === !1 ? e.routeNames.length !== n.routeNames.length || n.routeNames.some((t) => !e.routeNames.includes(t)) ? null : {
          ...n,
          routes: n.routes.map((t) => t.key ? t : {
            ...t,
            key: `${t.name}-${oe()}`
          })
        } : n;
      }
      default:
        return null;
    }
  },
  shouldActionChangeFocus(e) {
    return e.type === "NAVIGATE" || e.type === "NAVIGATE_DEPRECATED";
  }
};
function Ie({
  action: e,
  routeParamList: r
}) {
  const {
    name: n,
    params: t
  } = e.payload;
  return r[n] !== void 0 ? {
    ...r[n],
    ...t
  } : t;
}
const ze = "route", Nr = {
  jumpTo(e, r) {
    return {
      type: "JUMP_TO",
      payload: {
        name: e,
        params: r
      }
    };
  }
}, Ot = (e, r, n, t) => {
  const s = [{
    type: ze,
    key: e[r].key
  }];
  let i;
  switch (n) {
    case "order":
      for (let o = r; o > 0; o--)
        s.unshift({
          type: ze,
          key: e[o - 1].key
        });
      break;
    case "firstRoute":
      r !== 0 && s.unshift({
        type: ze,
        key: e[0].key
      });
      break;
    case "initialRoute":
      i = e.findIndex((o) => o.name === t), i = i === -1 ? 0 : i, r !== i && s.unshift({
        type: ze,
        key: e[i].key
      });
      break;
  }
  return s;
}, dt = (e, r, n, t) => {
  var i;
  let s = e.history;
  if (n === "history" || n === "fullHistory") {
    const o = e.routes[r];
    if (n === "history")
      s = s.filter((a) => a.type === "route" ? a.key !== o.key : !1);
    else if (n === "fullHistory") {
      const a = s.findLastIndex((c) => c.type === "route");
      o.key === ((i = s[a]) == null ? void 0 : i.key) && (s = [...s.slice(0, a), ...s.slice(a + 1)]);
    }
    s = s.concat({
      type: ze,
      key: o.key,
      params: n === "fullHistory" ? o.params : void 0
    });
  } else
    s = Ot(e.routes, r, n, t);
  return {
    ...e,
    index: r,
    history: s
  };
};
function Pr({
  initialRouteName: e,
  backBehavior: r = "firstRoute"
}) {
  return {
    ...Ve,
    type: "tab",
    getInitialState({
      routeNames: t,
      routeParamList: s
    }) {
      const i = e !== void 0 && t.includes(e) ? t.indexOf(e) : 0, o = t.map((c) => ({
        name: c,
        key: `${c}-${oe()}`,
        params: s[c]
      })), a = Ot(o, i, r, e);
      return {
        stale: !1,
        type: "tab",
        key: `tab-${oe()}`,
        index: i,
        routeNames: t,
        history: a,
        routes: o,
        preloadedRouteKeys: []
      };
    },
    getRehydratedState(t, {
      routeNames: s,
      routeParamList: i
    }) {
      var f, p, b;
      const o = t;
      if (o.stale === !1)
        return o;
      const a = s.map((y) => {
        const d = o.routes.find((v) => v.name === y);
        return {
          ...d,
          name: y,
          key: d && d.name === y && d.key ? d.key : `${y}-${oe()}`,
          params: i[y] !== void 0 ? {
            ...i[y],
            ...d ? d.params : void 0
          } : d ? d.params : void 0
        };
      }), c = Math.min(Math.max(s.indexOf((f = o.routes[(o == null ? void 0 : o.index) ?? 0]) == null ? void 0 : f.name), 0), a.length - 1), u = a.map((y) => y.key), l = ((p = o.history) == null ? void 0 : p.filter((y) => u.includes(y.key))) ?? [];
      return dt({
        stale: !1,
        type: "tab",
        key: `tab-${oe()}`,
        index: c,
        routeNames: s,
        history: l,
        routes: a,
        preloadedRouteKeys: ((b = o.preloadedRouteKeys) == null ? void 0 : b.filter((y) => u.includes(y))) ?? []
      }, c, r, e);
    },
    getStateForRouteNamesChange(t, {
      routeNames: s,
      routeParamList: i,
      routeKeyChanges: o
    }) {
      const a = s.map((l) => t.routes.find((f) => f.name === l && !o.includes(f.name)) || {
        name: l,
        key: `${l}-${oe()}`,
        params: i[l]
      }), c = Math.max(0, s.indexOf(t.routes[t.index].name));
      let u = t.history.filter(
        // Type will always be 'route' for tabs, but could be different in a router extending this (e.g. drawer)
        (l) => l.type !== "route" || a.find((f) => f.key === l.key)
      );
      return u.length || (u = Ot(a, c, r, e)), {
        ...t,
        history: u,
        routeNames: s,
        routes: a,
        index: c
      };
    },
    getStateForRouteFocus(t, s) {
      const i = t.routes.findIndex((o) => o.key === s);
      return i === -1 || i === t.index ? t : dt(t, i, r, e);
    },
    getStateForAction(t, s, {
      routeParamList: i,
      routeGetIdList: o
    }) {
      switch (s.type) {
        case "JUMP_TO":
        case "NAVIGATE":
        case "NAVIGATE_DEPRECATED": {
          const a = t.routes.findIndex((u) => u.name === s.payload.name);
          if (a === -1)
            return null;
          const c = dt({
            ...t,
            routes: t.routes.map((u) => {
              if (u.name !== s.payload.name)
                return u;
              const l = o[u.name], f = l == null ? void 0 : l({
                params: u.params
              }), p = l == null ? void 0 : l({
                params: s.payload.params
              }), b = f === p ? u.key : `${u.name}-${oe()}`;
              let y;
              (s.type === "NAVIGATE" || s.type === "NAVIGATE_DEPRECATED") && s.payload.merge && f === p ? y = s.payload.params !== void 0 || i[u.name] !== void 0 ? {
                ...i[u.name],
                ...u.params,
                ...s.payload.params
              } : u.params : y = Ie({
                action: s,
                routeParamList: i
              });
              const d = s.type === "NAVIGATE" && s.payload.path != null ? s.payload.path : u.path;
              return y !== u.params || d !== u.path ? {
                ...u,
                key: b,
                path: d,
                params: y
              } : u;
            })
          }, a, r, e);
          return {
            ...c,
            preloadedRouteKeys: c.preloadedRouteKeys.filter((u) => u !== t.routes[c.index].key)
          };
        }
        case "SET_PARAMS":
        case "REPLACE_PARAMS": {
          const a = Ve.getStateForAction(t, s);
          if (a !== null) {
            const c = a.index;
            if (c != null) {
              const u = a.routes[c], l = t.history.findLastIndex((p) => p.key === u.key);
              let f = t.history;
              return l !== -1 && (f = [...t.history], f[l] = {
                ...f[l],
                params: u.params
              }), {
                ...a,
                history: f
              };
            }
          }
          return a;
        }
        case "GO_BACK": {
          if (t.history.length === 1)
            return null;
          const a = t.history[t.history.length - 2], c = a == null ? void 0 : a.key, u = t.routes.findLastIndex((f) => f.key === c);
          if (u === -1)
            return null;
          let l = t.routes;
          return r === "fullHistory" && l[u].params !== a.params && (l = [...t.routes], l[u] = {
            ...l[u],
            params: a.params
          }), {
            ...t,
            routes: l,
            preloadedRouteKeys: t.preloadedRouteKeys.filter((f) => f !== t.routes[u].key),
            history: t.history.slice(0, -1),
            index: u
          };
        }
        case "PRELOAD": {
          const a = t.routes.findIndex((d) => d.name === s.payload.name);
          if (a === -1)
            return null;
          const c = t.routes[a], u = o[c.name], l = u == null ? void 0 : u({
            params: c.params
          }), f = u == null ? void 0 : u({
            params: s.payload.params
          }), p = l === f ? c.key : `${c.name}-${oe()}`, b = Ie({
            action: s,
            routeParamList: i
          }), y = b !== c.params ? {
            ...c,
            key: p,
            params: b
          } : c;
          return {
            ...t,
            preloadedRouteKeys: t.preloadedRouteKeys.filter((d) => d !== c.key).concat(y.key),
            routes: t.routes.map((d, v) => v === a ? y : d),
            history: p === c.key ? t.history : t.history.filter((d) => d.key !== c.key)
          };
        }
        default:
          return Ve.getStateForAction(t, s);
      }
    },
    actionCreators: Nr
  };
}
const _n = {
  ...Nr,
  openDrawer() {
    return {
      type: "OPEN_DRAWER"
    };
  },
  closeDrawer() {
    return {
      type: "CLOSE_DRAWER"
    };
  },
  toggleDrawer() {
    return {
      type: "TOGGLE_DRAWER"
    };
  }
};
function Fn({
  defaultStatus: e = "closed",
  ...r
}) {
  const n = Pr(r), t = (c) => {
    var u;
    return !!((u = c.history) != null && u.some((l) => l.type === "drawer"));
  }, s = (c) => t(c) ? c : {
    ...c,
    history: [...c.history, {
      type: "drawer",
      status: e === "open" ? "closed" : "open"
    }]
  }, i = (c) => t(c) ? {
    ...c,
    history: c.history.filter((u) => u.type !== "drawer")
  } : c, o = (c) => e === "open" ? i(c) : s(c), a = (c) => e === "open" ? s(c) : i(c);
  return {
    ...n,
    type: "drawer",
    getInitialState({
      routeNames: c,
      routeParamList: u,
      routeGetIdList: l
    }) {
      return {
        ...n.getInitialState({
          routeNames: c,
          routeParamList: u,
          routeGetIdList: l
        }),
        default: e,
        stale: !1,
        type: "drawer",
        key: `drawer-${oe()}`
      };
    },
    getRehydratedState(c, {
      routeNames: u,
      routeParamList: l,
      routeGetIdList: f
    }) {
      if (c.stale === !1)
        return c;
      let p = n.getRehydratedState(c, {
        routeNames: u,
        routeParamList: l,
        routeGetIdList: f
      });
      return t(c) && (p = i(p), p = s(p)), {
        ...p,
        default: e,
        type: "drawer",
        key: `drawer-${oe()}`
      };
    },
    getStateForRouteFocus(c, u) {
      const l = n.getStateForRouteFocus(c, u);
      return a(l);
    },
    getStateForAction(c, u, l) {
      switch (u.type) {
        case "OPEN_DRAWER":
          return o(c);
        case "CLOSE_DRAWER":
          return a(c);
        case "TOGGLE_DRAWER":
          return t(c) ? i(c) : s(c);
        case "JUMP_TO":
        case "NAVIGATE":
        case "NAVIGATE_DEPRECATED": {
          const f = n.getStateForAction(c, u, l);
          return f != null && f.index !== c.index ? a(f) : f;
        }
        case "GO_BACK":
          return t(c) ? i(c) : n.getStateForAction(c, u, l);
        default:
          return n.getStateForAction(c, u, l);
      }
    },
    actionCreators: _n
  };
}
function qe({
  action: e,
  routeParamList: r
}) {
  const {
    name: n
  } = e.payload;
  return {
    key: `${n}-${oe()}`,
    name: n,
    params: Ie({
      action: e,
      routeParamList: r
    })
  };
}
const Ln = {
  replace(e, r) {
    return {
      type: "REPLACE",
      payload: {
        name: e,
        params: r
      }
    };
  },
  push(e, r) {
    return {
      type: "PUSH",
      payload: {
        name: e,
        params: r
      }
    };
  },
  pop(e = 1) {
    return {
      type: "POP",
      payload: {
        count: e
      }
    };
  },
  popToTop() {
    return {
      type: "POP_TO_TOP"
    };
  },
  popTo(e, r, n) {
    return typeof n == "boolean" && console.warn("Passing a boolean as the third argument to 'popTo' is deprecated. Pass '{ merge: true }' instead."), {
      type: "POP_TO",
      payload: {
        name: e,
        params: r,
        merge: typeof n == "boolean" ? n : n == null ? void 0 : n.merge
      }
    };
  }
};
function $n(e) {
  const r = {
    ...Ve,
    type: "stack",
    getInitialState({
      routeNames: n,
      routeParamList: t
    }) {
      const s = e.initialRouteName !== void 0 && n.includes(e.initialRouteName) ? e.initialRouteName : n[0];
      return {
        stale: !1,
        type: "stack",
        key: `stack-${oe()}`,
        index: 0,
        routeNames: n,
        preloadedRoutes: [],
        routes: [{
          key: `${s}-${oe()}`,
          name: s,
          params: t[s]
        }]
      };
    },
    getRehydratedState(n, {
      routeNames: t,
      routeParamList: s
    }) {
      var c;
      const i = n;
      if (i.stale === !1)
        return i;
      const o = i.routes.filter((u) => t.includes(u.name)).map((u) => ({
        ...u,
        key: u.key || `${u.name}-${oe()}`,
        params: s[u.name] !== void 0 ? {
          ...s[u.name],
          ...u.params
        } : u.params
      })), a = ((c = i.preloadedRoutes) == null ? void 0 : c.filter((u) => t.includes(u.name)).map((u) => ({
        ...u,
        key: u.key || `${u.name}-${oe()}`,
        params: s[u.name] !== void 0 ? {
          ...s[u.name],
          ...u.params
        } : u.params
      }))) ?? [];
      if (o.length === 0) {
        const u = e.initialRouteName !== void 0 ? e.initialRouteName : t[0];
        o.push({
          key: `${u}-${oe()}`,
          name: u,
          params: s[u]
        });
      }
      return {
        stale: !1,
        type: "stack",
        key: `stack-${oe()}`,
        index: o.length - 1,
        routeNames: t,
        routes: o,
        preloadedRoutes: a
      };
    },
    getStateForRouteNamesChange(n, {
      routeNames: t,
      routeParamList: s,
      routeKeyChanges: i
    }) {
      const o = n.routes.filter((a) => t.includes(a.name) && !i.includes(a.name));
      if (o.length === 0) {
        const a = e.initialRouteName !== void 0 && t.includes(e.initialRouteName) ? e.initialRouteName : t[0];
        o.push({
          key: `${a}-${oe()}`,
          name: a,
          params: s[a]
        });
      }
      return {
        ...n,
        routeNames: t,
        routes: o,
        index: Math.min(n.index, o.length - 1)
      };
    },
    getStateForRouteFocus(n, t) {
      const s = n.routes.findIndex((i) => i.key === t);
      return s === -1 || s === n.index ? n : {
        ...n,
        index: s,
        routes: n.routes.slice(0, s + 1)
      };
    },
    getStateForAction(n, t, s) {
      const {
        routeParamList: i
      } = s;
      switch (t.type) {
        case "REPLACE": {
          const o = t.target === n.key && t.source ? n.routes.findIndex((l) => l.key === t.source) : n.index;
          if (o === -1 || !n.routeNames.includes(t.payload.name))
            return null;
          const a = s.routeGetIdList[t.payload.name], c = a == null ? void 0 : a({
            params: t.payload.params
          });
          let u = n.preloadedRoutes.find((l) => l.name === t.payload.name && c === (a == null ? void 0 : a({
            params: l.params
          })));
          return u || (u = qe({
            action: t,
            routeParamList: i
          })), {
            ...n,
            routes: n.routes.map((l, f) => f === o ? u : l),
            preloadedRoutes: n.preloadedRoutes.filter((l) => l.key !== u.key)
          };
        }
        case "PUSH":
        case "NAVIGATE": {
          if (!n.routeNames.includes(t.payload.name))
            return null;
          const o = s.routeGetIdList[t.payload.name], a = o == null ? void 0 : o({
            params: t.payload.params
          });
          let c;
          if (a !== void 0)
            c = n.routes.findLast((f) => f.name === t.payload.name && a === (o == null ? void 0 : o({
              params: f.params
            })));
          else if (t.type === "NAVIGATE") {
            const f = n.routes[n.index];
            t.payload.name === f.name ? c = f : t.payload.pop && (c = n.routes.findLast((p) => p.name === t.payload.name));
          }
          c || (c = n.preloadedRoutes.find((f) => f.name === t.payload.name && a === (o == null ? void 0 : o({
            params: f.params
          }))));
          let u;
          t.type === "NAVIGATE" && t.payload.merge && c ? u = t.payload.params !== void 0 || i[t.payload.name] !== void 0 ? {
            ...i[t.payload.name],
            ...c.params,
            ...t.payload.params
          } : c.params : u = Ie({
            action: t,
            routeParamList: i
          });
          let l;
          if (c)
            if (t.type === "NAVIGATE" && t.payload.pop) {
              l = [];
              for (const f of n.routes) {
                if (f.key === c.key) {
                  l.push({
                    ...c,
                    path: t.payload.path !== void 0 ? t.payload.path : c.path,
                    params: u
                  });
                  break;
                }
                l.push(f);
              }
            } else
              l = n.routes.filter((f) => f.key !== c.key), l.push({
                ...c,
                path: t.type === "NAVIGATE" && t.payload.path !== void 0 ? t.payload.path : c.path,
                params: u
              });
          else
            l = [...n.routes, {
              key: `${t.payload.name}-${oe()}`,
              name: t.payload.name,
              path: t.type === "NAVIGATE" ? t.payload.path : void 0,
              params: u
            }];
          return {
            ...n,
            index: l.length - 1,
            preloadedRoutes: n.preloadedRoutes.filter((f) => l[l.length - 1].key !== f.key),
            routes: l
          };
        }
        case "NAVIGATE_DEPRECATED": {
          if (!n.routeNames.includes(t.payload.name) || n.preloadedRoutes.find((f) => f.name === t.payload.name && c === (a == null ? void 0 : a({
            params: f.params
          }))))
            return null;
          let o = -1;
          const a = s.routeGetIdList[t.payload.name], c = a == null ? void 0 : a({
            params: t.payload.params
          });
          if (c !== void 0 ? o = n.routes.findIndex((f) => f.name === t.payload.name && c === (a == null ? void 0 : a({
            params: f.params
          }))) : n.routes[n.index].name === t.payload.name ? o = n.index : o = n.routes.findLastIndex((f) => f.name === t.payload.name), o === -1) {
            const f = [...n.routes, qe({
              action: t,
              routeParamList: i
            })];
            return {
              ...n,
              routes: f,
              index: f.length - 1
            };
          }
          const u = n.routes[o];
          let l;
          return t.payload.merge ? l = t.payload.params !== void 0 || i[u.name] !== void 0 ? {
            ...i[u.name],
            ...u.params,
            ...t.payload.params
          } : u.params : l = Ie({
            action: t,
            routeParamList: i
          }), {
            ...n,
            index: o,
            routes: [...n.routes.slice(0, o), l !== u.params ? {
              ...u,
              params: l
            } : n.routes[o]]
          };
        }
        case "POP": {
          const o = t.target === n.key && t.source ? n.routes.findIndex((a) => a.key === t.source) : n.index;
          if (o > 0) {
            const a = Math.max(o - t.payload.count + 1, 1), c = n.routes.slice(0, a).concat(n.routes.slice(o + 1));
            return {
              ...n,
              index: c.length - 1,
              routes: c
            };
          }
          return null;
        }
        case "POP_TO_TOP":
          return r.getStateForAction(n, {
            type: "POP",
            payload: {
              count: n.routes.length - 1
            }
          }, s);
        case "POP_TO": {
          const o = t.target === n.key && t.source ? n.routes.findLastIndex((p) => p.key === t.source) : n.index;
          if (o === -1 || !n.routeNames.includes(t.payload.name))
            return null;
          let a = -1;
          const c = s.routeGetIdList[t.payload.name], u = c == null ? void 0 : c({
            params: t.payload.params
          });
          if (u !== void 0)
            a = n.routes.findIndex((p) => p.name === t.payload.name && u === (c == null ? void 0 : c({
              params: p.params
            })));
          else if (n.routes[o].name === t.payload.name)
            a = o;
          else
            for (let p = o; p >= 0; p--)
              if (n.routes[p].name === t.payload.name) {
                a = p;
                break;
              }
          if (a === -1) {
            let p = n.preloadedRoutes.find((y) => y.name === t.payload.name && u === (c == null ? void 0 : c({
              params: y.params
            })));
            p || (p = qe({
              action: t,
              routeParamList: i
            }));
            const b = n.routes.slice(0, o).concat(p);
            return {
              ...n,
              index: b.length - 1,
              routes: b,
              preloadedRoutes: n.preloadedRoutes.filter((y) => y.key !== p.key)
            };
          }
          const l = n.routes[a];
          let f;
          return t.payload.merge ? f = t.payload.params !== void 0 || i[l.name] !== void 0 ? {
            ...i[l.name],
            ...l.params,
            ...t.payload.params
          } : l.params : f = Ie({
            action: t,
            routeParamList: i
          }), {
            ...n,
            index: a,
            routes: [...n.routes.slice(0, a), f !== l.params ? {
              ...l,
              params: f
            } : n.routes[a]]
          };
        }
        case "GO_BACK":
          return n.index > 0 ? r.getStateForAction(n, {
            type: "POP",
            payload: {
              count: 1
            },
            target: t.target,
            source: t.source
          }, s) : null;
        case "PRELOAD": {
          const o = s.routeGetIdList[t.payload.name], a = o == null ? void 0 : o({
            params: t.payload.params
          });
          let c;
          return a !== void 0 && (c = n.routes.find((u) => u.name === t.payload.name && a === (o == null ? void 0 : o({
            params: u.params
          })))), c ? {
            ...n,
            routes: n.routes.map((u) => u.key !== (c == null ? void 0 : c.key) ? u : {
              ...u,
              params: Ie({
                action: t,
                routeParamList: i
              })
            })
          } : {
            ...n,
            preloadedRoutes: n.preloadedRoutes.filter((u) => u.name !== t.payload.name || a !== (o == null ? void 0 : o({
              params: u.params
            }))).concat(qe({
              action: t,
              routeParamList: i
            }))
          };
        }
        default:
          return Ve.getStateForAction(n, t);
      }
    },
    actionCreators: Ln
  };
  return r;
}
function Dt(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ft, Xt;
function Mn() {
  if (Xt) return ft;
  Xt = 1;
  var e = Mt, r = typeof document < "u" || typeof navigator < "u" && navigator.product === "ReactNative" ? e.useLayoutEffect : e.useEffect;
  function n(t) {
    var s = e.useRef(t), i = e.useRef(function() {
      for (var a = [], c = 0; c < arguments.length; c++)
        a[c] = arguments[c];
      return s.current.apply(this, a);
    }).current;
    return r(function() {
      s.current = t;
    }), i;
  }
  return ft = n, ft;
}
var jn = Mn();
const ae = /* @__PURE__ */ Dt(jn);
function Bn(e) {
  const r = [], n = (t, s) => {
    s.routes.forEach((i) => {
      var a, c;
      const o = t ? `${t} > ${i.name}` : i.name;
      (c = (a = i.state) == null ? void 0 : a.routeNames) == null || c.forEach((u) => {
        u === i.name && r.push([o, `${o} > ${i.name}`]);
      }), i.state && n(o, i.state);
    });
  };
  return n("", e), r;
}
const Tt = (e, r, n) => {
  if (e == null || typeof e == "boolean" || typeof e == "number" || typeof e == "string")
    return {
      serializable: !0
    };
  if (Object.prototype.toString.call(e) !== "[object Object]" && !Array.isArray(e))
    return {
      serializable: !1,
      location: n,
      reason: typeof e == "function" ? "Function" : String(e)
    };
  if (r.has(e))
    return {
      serializable: !1,
      reason: "Circular reference",
      location: n
    };
  if (r.add(e), Array.isArray(e))
    for (let t = 0; t < e.length; t++) {
      const s = Tt(e[t], new Set(r), [...n, t]);
      if (!s.serializable)
        return s;
    }
  else
    for (const t in e) {
      const s = Tt(e[t], new Set(r), [...n, t]);
      if (!s.serializable)
        return s;
    }
  return {
    serializable: !0
  };
};
function Dn(e) {
  return Tt(e, /* @__PURE__ */ new Set(), []);
}
const Nt = "The 'navigation' object hasn't been initialized yet. This might happen if you don't have a navigator mounted, or if the navigator hasn't finished mounting. See https://reactnavigation.org/docs/navigating-without-navigation-prop#handling-initialization for more details.";
function Gn() {
  const e = [...Object.keys(Le), "addListener", "removeListener", "resetRoot", "dispatch", "isFocused", "canGoBack", "getRootState", "getState", "getParent", "getCurrentRoute", "getCurrentOptions"], r = {}, n = (i, o) => {
    r[i] && (r[i] = r[i].filter((a) => a !== o));
  };
  let t = null;
  return {
    get current() {
      return t;
    },
    set current(i) {
      t = i, i != null && Object.entries(r).forEach(([o, a]) => {
        a.forEach((c) => {
          i.addListener(o, c);
        });
      });
    },
    isReady: () => t == null ? !1 : t.isReady(),
    ...e.reduce((i, o) => (i[o] = (...a) => {
      if (t == null)
        switch (o) {
          case "addListener": {
            const [c, u] = a;
            return r[c] = r[c] || [], r[c].push(u), () => n(c, u);
          }
          case "removeListener": {
            const [c, u] = a;
            n(c, u);
            break;
          }
          default:
            console.error(Nt);
        }
      else
        return t[o](...a);
    }, i), {})
  };
}
const Ir = /* @__PURE__ */ x.createContext(!1), zn = 'Another navigator is already registered for this container. You likely have multiple navigators under a single "NavigationContainer" or "Screen". Make sure each navigator is under a separate "Screen" container. See https://reactnavigation.org/docs/nesting-navigators for a guide on nesting.', _r = /* @__PURE__ */ x.createContext(void 0);
function Fr({
  children: e
}) {
  const r = x.useRef(void 0), n = x.useMemo(() => ({
    register(t) {
      const s = r.current;
      if (s !== void 0 && t !== s)
        throw new Error(zn);
      r.current = t;
    },
    unregister(t) {
      const s = r.current;
      t === s && (r.current = void 0);
    }
  }), []);
  return /* @__PURE__ */ S(_r.Provider, {
    value: n,
    children: e
  });
}
function _e(e) {
  let r = e;
  for (; (r == null ? void 0 : r.routes[r.index ?? 0].state) != null; )
    r = r.routes[r.index ?? 0].state;
  return r == null ? void 0 : r.routes[(r == null ? void 0 : r.index) ?? 0];
}
const ve = /* @__PURE__ */ x.createContext({
  onDispatchAction: () => {
  },
  onOptionsChange: () => {
  },
  scheduleUpdate: () => {
    throw new Error("Couldn't find a context for scheduling updates.");
  },
  flushUpdates: () => {
    throw new Error("Couldn't find a context for flushing updates.");
  }
}), ot = /* @__PURE__ */ x.createContext(void 0), Lr = /* @__PURE__ */ x.createContext(!1), Be = "Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'? See https://reactnavigation.org/docs/getting-started for setup instructions.", Ue = /* @__PURE__ */ x.createContext({
  isDefault: !0,
  get getKey() {
    throw new Error(Be);
  },
  get setKey() {
    throw new Error(Be);
  },
  get getState() {
    throw new Error(Be);
  },
  get setState() {
    throw new Error(Be);
  },
  get getIsInitial() {
    throw new Error(Be);
  }
}), st = /* @__PURE__ */ x.createContext(void 0);
st.displayName = "ThemeContext";
function $r({
  value: e,
  children: r
}) {
  return /* @__PURE__ */ S(st.Provider, {
    value: e,
    children: r
  });
}
const Mr = /* @__PURE__ */ x.createContext(void 0);
function jr() {
  const {
    current: e
  } = x.useRef({
    action: [],
    focus: []
  }), r = x.useCallback((n, t) => {
    e[n].push(t);
    let s = !1;
    return () => {
      const i = e[n].indexOf(t);
      !s && i > -1 && (s = !0, e[n].splice(i, 1));
    };
  }, [e]);
  return {
    listeners: e,
    addListener: r
  };
}
function Br(e) {
  const r = x.useRef(e);
  x.useEffect(() => {
    r.current = e;
  });
  const n = x.useRef(/* @__PURE__ */ Object.create(null)), t = x.useCallback((i) => {
    const o = (c, u) => {
      const l = n.current[c] ? n.current[c][i] : void 0;
      if (!l)
        return;
      const f = l.indexOf(u);
      f > -1 && l.splice(f, 1);
    };
    return {
      addListener: (c, u) => {
        n.current[c] = n.current[c] || {}, n.current[c][i] = n.current[c][i] || [], n.current[c][i].push(u);
        let l = !1;
        return () => {
          l || (l = !0, o(c, u));
        };
      },
      removeListener: o
    };
  }, []), s = x.useCallback(({
    type: i,
    data: o,
    target: a,
    canPreventDefault: c
  }) => {
    var p, b;
    const u = n.current[i] || {}, l = a !== void 0 ? (p = u[a]) == null ? void 0 : p.slice() : [].concat(...Object.keys(u).map((y) => u[y])).filter((y, d, v) => v.lastIndexOf(y) === d), f = {
      get type() {
        return i;
      }
    };
    if (a !== void 0 && Object.defineProperty(f, "target", {
      enumerable: !0,
      get() {
        return a;
      }
    }), o !== void 0 && Object.defineProperty(f, "data", {
      enumerable: !0,
      get() {
        return o;
      }
    }), c) {
      let y = !1;
      Object.defineProperties(f, {
        defaultPrevented: {
          enumerable: !0,
          get() {
            return y;
          }
        },
        preventDefault: {
          enumerable: !0,
          value() {
            y = !0;
          }
        }
      });
    }
    return (b = r.current) == null || b.call(r, f), l == null || l.forEach((y) => y(f)), f;
  }, []);
  return x.useMemo(() => ({
    create: t,
    emit: s
  }), [t, s]);
}
function Dr() {
  const {
    current: e
  } = x.useRef(Object.assign(/* @__PURE__ */ Object.create(null), {
    getState: {},
    beforeRemove: {}
  })), r = x.useCallback((n, t, s) => (e[n][t] = s, () => {
    e[n][t] = void 0;
  }), [e]);
  return {
    keyedListeners: e,
    addKeyedListener: r
  };
}
function Vn() {
  return x.useContext(Lr);
}
function Gr({
  key: e,
  options: r,
  navigation: n
}) {
  const t = x.useRef(r), s = x.useRef({}), {
    onOptionsChange: i
  } = x.useContext(ve), {
    addOptionsGetter: o
  } = x.useContext(Ue), a = x.useCallback(() => {
    const f = (n == null ? void 0 : n.isFocused()) ?? !0, p = Object.keys(s.current).length;
    f && !p && i(t.current ?? {});
  }, [n, i]);
  x.useEffect(() => (t.current = r, a(), n == null ? void 0 : n.addListener("focus", a)), [n, r, a]);
  const c = x.useCallback(() => {
    var f, p;
    for (const b in s.current)
      if (b in s.current) {
        const y = (p = (f = s.current)[b]) == null ? void 0 : p.call(f);
        if (y !== null)
          return y;
      }
    return null;
  }, []), u = x.useCallback(() => {
    if (!((n == null ? void 0 : n.isFocused()) ?? !0))
      return null;
    const p = c();
    return p !== null ? p : t.current;
  }, [n, c]);
  return x.useEffect(() => o == null ? void 0 : o(e, u), [u, o, e]), {
    addOptionsGetter: x.useCallback((f, p) => (s.current[f] = p, a(), () => {
      delete s.current[f], a();
    }), [a]),
    getCurrentOptions: u
  };
}
const Un = (e) => typeof e == "object" && e !== null ? Object.getPrototypeOf(e) === Object.prototype : !1, Qe = (e) => {
  var r;
  if (process.env.NODE_ENV === "production" || Object.isFrozen(e) || !Un(e) && !Array.isArray(e))
    return e;
  for (const n in e)
    if (n !== "params" && (r = Object.getOwnPropertyDescriptor(e, n)) != null && r.configurable) {
      const t = e[n];
      Qe(t);
    }
  return Object.freeze(e);
}, Kn = (e) => {
  const r = [];
  let n = !1, t;
  const s = () => (n || (n = !0, t = Qe(e())), t);
  let i = !1, o = !1;
  return {
    getState: s,
    setState: (l) => {
      t = Qe(l), o = !0, i || r.forEach((f) => f());
    },
    batchUpdates: (l) => {
      i = !0, l(), i = !1, o && (o = !1, r.forEach((f) => f()));
    },
    subscribe: (l) => (r.push(l), () => {
      const f = r.indexOf(l);
      f > -1 && r.splice(f, 1);
    })
  };
};
function Wn(e) {
  const r = x.useRef(Kn(e)).current, n = x.useSyncExternalStore(r.subscribe, r.getState, r.getState);
  x.useDebugValue(n);
  const t = x.useRef([]), s = ae((o) => {
    t.current.push(o);
  }), i = ae(() => {
    const o = t.current;
    t.current = [], o.length !== 0 && r.batchUpdates(() => {
      for (const a of o)
        a();
    });
  });
  return {
    state: n,
    getState: r.getState,
    setState: r.setState,
    scheduleUpdate: s,
    flushUpdates: i
  };
}
const Jt = [], Zt = [], zr = (e) => {
  if (e === void 0)
    return;
  const {
    key: r,
    routeNames: n,
    ...t
  } = e;
  return {
    ...t,
    stale: !0,
    routes: e.routes.map((s) => s.state === void 0 ? s : {
      ...s,
      state: zr(s.state)
    })
  };
}, Yn = /* @__PURE__ */ x.forwardRef(function({
  initialState: r,
  onStateChange: n,
  onReady: t,
  onUnhandledAction: s,
  navigationInChildEnabled: i = !1,
  theme: o,
  children: a
}, c) {
  const u = x.useContext(Ue), l = Vn();
  if (!u.isDefault && !l)
    throw new Error("Looks like you have nested a 'NavigationContainer' inside another. Normally you need only one container at the root of the app, so this was probably an error. If this was intentional, wrap the container in 'NavigationIndependentTree' explicitly. Note that this will make the child navigators disconnected from the parent and you won't be able to navigate between them.");
  const {
    state: f,
    getState: p,
    setState: b,
    scheduleUpdate: y,
    flushUpdates: d
  } = Wn(() => zr(r ?? void 0)), v = x.useRef(!0), E = x.useRef(void 0), m = x.useCallback(() => E.current, []), g = x.useCallback((F) => {
    E.current = F;
  }, []), {
    listeners: h,
    addListener: w
  } = jr(), {
    keyedListeners: C,
    addKeyedListener: R
  } = Dr(), k = ae((F) => {
    h.focus[0] == null ? console.error(Nt) : h.focus[0]((G) => G.dispatch(F));
  }), I = ae(() => {
    if (h.focus[0] == null)
      return !1;
    const {
      result: F,
      handled: G
    } = h.focus[0]((ee) => ee.canGoBack());
    return G ? F : !1;
  }), P = ae((F) => {
    var ee, fe;
    const G = (F == null ? void 0 : F.key) ?? ((fe = (ee = C.getState).root) == null ? void 0 : fe.call(ee).key);
    G == null ? console.error(Nt) : h.focus[0]((ye) => ye.dispatch({
      ...nt(F),
      target: G
    }));
  }), U = ae(() => {
    var F, G;
    return (G = (F = C.getState).root) == null ? void 0 : G.call(F);
  }), O = ae(() => {
    const F = U();
    return F == null ? void 0 : _e(F);
  }), N = ae(() => h.focus[0] != null), T = Br(), {
    addOptionsGetter: _,
    getCurrentOptions: $
  } = Gr({}), L = x.useMemo(() => ({
    ...Object.keys(Le).reduce((F, G) => (F[G] = (...ee) => (
      // @ts-expect-error: this is ok
      k(Le[G](...ee))
    ), F), {}),
    ...T.create("root"),
    dispatch: k,
    resetRoot: P,
    isFocused: () => !0,
    canGoBack: I,
    getParent: () => {
    },
    getState: p,
    getRootState: U,
    getCurrentRoute: O,
    getCurrentOptions: $,
    isReady: N,
    setOptions: () => {
      throw new Error("Cannot call setOptions outside a screen");
    }
  }), [I, k, T, $, O, U, p, N, P]);
  x.useImperativeHandle(c, () => L, [L]);
  const H = ae((F, G) => {
    T.emit({
      type: "__unsafe_action__",
      data: {
        action: F,
        noop: G,
        stack: K.current
      }
    });
  }), q = x.useRef(void 0), Q = ae((F) => {
    q.current !== F && (q.current = F, T.emit({
      type: "options",
      data: {
        options: F
      }
    }));
  }), K = x.useRef(void 0), ie = x.useMemo(() => ({
    addListener: w,
    addKeyedListener: R,
    onDispatchAction: H,
    onOptionsChange: Q,
    scheduleUpdate: y,
    flushUpdates: d,
    stackRef: K
  }), [w, R, H, Q, y, d]), B = x.useRef(!0), ce = x.useCallback(() => B.current, []), Ce = x.useMemo(() => ({
    state: f,
    getState: p,
    setState: b,
    getKey: m,
    setKey: g,
    getIsInitial: ce,
    addOptionsGetter: _
  }), [f, p, b, m, g, ce, _]), de = x.useRef(t), D = x.useRef(n);
  x.useEffect(() => {
    B.current = !1, D.current = n, de.current = t;
  });
  const Ae = x.useRef(!1);
  x.useEffect(() => {
    var F;
    !Ae.current && N() && (Ae.current = !0, (F = de.current) == null || F.call(de), T.emit({
      type: "ready"
    }));
  }, [f, N, T]), x.useEffect(() => {
    const F = U();
    if (process.env.NODE_ENV !== "production" && F !== void 0) {
      const G = Dn(F);
      if (!G.serializable) {
        const {
          location: fe,
          reason: ye
        } = G;
        let pe = "", M = F, z = !1;
        for (let he = 0; he < fe.length; he++) {
          const ne = fe[he], lt = fe[he - 1];
          M = M[ne], !(!z && ne === "state") && (!z && ne === "routes" ? pe && (pe += " > ") : !z && typeof ne == "number" && lt === "routes" ? pe += M == null ? void 0 : M.name : z ? typeof ne == "number" || /^[0-9]+$/.test(ne) ? pe += `[${ne}]` : /^[a-z$_]+$/i.test(ne) ? pe += `.${ne}` : pe += `[${JSON.stringify(ne)}]` : (pe += ` > ${ne}`, z = !0));
        }
        const me = `Non-serializable values were found in the navigation state. Check:

${pe} (${ye})

This can break usage such as persisting and restoring state. This might happen if you passed non-serializable values such as function, class instances etc. in params. If you need to use components with callbacks in your options, you can use 'navigation.setOptions' instead. See https://reactnavigation.org/docs/troubleshooting#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state for more details.`;
        Jt.includes(me) || (Jt.push(me), console.warn(me));
      }
      const ee = Bn(F);
      if (ee.length) {
        const fe = `Found screens with the same name nested inside one another. Check:
${ee.map((ye) => `
${ye.join(", ")}`)}

This can cause confusing behavior during navigation. Consider using unique names for each screen instead.`;
        Zt.includes(fe) || (Zt.push(fe), console.warn(fe));
      }
    }
    T.emit({
      type: "state",
      data: {
        state: f
      }
    }), !v.current && D.current && D.current(F), v.current = !1;
  }, [U, T, f]);
  const Oe = ae((F) => {
    if (process.env.NODE_ENV === "production")
      return;
    const G = F.payload;
    let ee = `The action '${F.type}'${G ? ` with payload ${JSON.stringify(F.payload)}` : ""} was not handled by any navigator.`;
    switch (F.type) {
      case "PRELOAD":
      case "NAVIGATE":
      case "PUSH":
      case "REPLACE":
      case "POP_TO":
      case "JUMP_TO":
        G != null && G.name ? ee += `

Do you have a screen named '${G.name}'?

If you're trying to navigate to a screen in a nested navigator, see https://reactnavigation.org/docs/nesting-navigators#navigating-to-a-screen-in-a-nested-navigator.

If you're using conditional rendering, navigation will happen automatically and you shouldn't navigate manually, see.` : ee += `

You need to pass the name of the screen to navigate to.

See https://reactnavigation.org/docs/navigation-actions for usage.`;
        break;
      case "GO_BACK":
      case "POP":
      case "POP_TO_TOP":
        ee += `

Is there any screen to go back to?`;
        break;
      case "OPEN_DRAWER":
      case "CLOSE_DRAWER":
      case "TOGGLE_DRAWER":
        ee += `

Is your screen inside a Drawer navigator?`;
        break;
    }
    ee += `

This is a development-only warning and won't be shown in production.`, console.error(ee);
  });
  return /* @__PURE__ */ S(Lr.Provider, {
    value: !1,
    children: /* @__PURE__ */ S(ot.Provider, {
      value: L,
      children: /* @__PURE__ */ S(ve.Provider, {
        value: ie,
        children: /* @__PURE__ */ S(Ue.Provider, {
          value: Ce,
          children: /* @__PURE__ */ S(Mr.Provider, {
            value: s ?? Oe,
            children: /* @__PURE__ */ S(Ir.Provider, {
              value: i,
              children: /* @__PURE__ */ S(Fr, {
                children: /* @__PURE__ */ S($r, {
                  value: o,
                  children: a
                })
              })
            })
          })
        })
      })
    })
  });
});
function et(e) {
  return null;
}
function Pt(e) {
  return null;
}
function Gt(e) {
  function r(n) {
    return n != null ? {
      Navigator: e,
      Screen: Pt,
      Group: et,
      config: n
    } : {
      Navigator: e,
      Screen: Pt,
      Group: et
    };
  }
  return r;
}
const qn = /* @__PURE__ */ x.createContext(void 0);
function Vr(e, r) {
  var u, l;
  const n = r ? Ur(r) : {}, t = e.index != null ? e.routes.slice(0, e.index + 1) : e.routes;
  if (t.length === 0)
    return;
  if (!(t.length === 1 && t[0].key === void 0 || t.length === 2 && t[0].key === void 0 && t[0].name === (n == null ? void 0 : n.initialRouteName) && t[1].key === void 0))
    return {
      type: "RESET",
      payload: e
    };
  const s = e.routes[e.index ?? e.routes.length - 1];
  let i = s == null ? void 0 : s.state, o = (u = n == null ? void 0 : n.screens) == null ? void 0 : u[s == null ? void 0 : s.name], a = {
    ...s.params
  };
  const c = s ? {
    name: s.name,
    path: s.path,
    params: a
  } : void 0;
  for (c && (o != null && o.screens) && Object.keys(o.screens).length && (c.pop = !0); i; ) {
    if (i.routes.length === 0)
      return;
    const f = i.index != null ? i.routes.slice(0, i.index + 1) : i.routes, p = f[f.length - 1];
    if (Object.assign(a, {
      initial: void 0,
      screen: void 0,
      params: void 0,
      state: void 0
    }), f.length === 1 && f[0].key === void 0)
      a.initial = !0, a.screen = p.name;
    else if (f.length === 2 && f[0].key === void 0 && f[0].name === (o == null ? void 0 : o.initialRouteName) && f[1].key === void 0)
      a.initial = !1, a.screen = p.name;
    else {
      a.state = i;
      break;
    }
    p.state ? (a.params = {
      ...p.params
    }, a.pop = !0, a = a.params) : (a.path = p.path, a.params = p.params), i = p.state, o = (l = o == null ? void 0 : o.screens) == null ? void 0 : l[p.name], o != null && o.screens && Object.keys(o.screens).length && (a.pop = !0);
  }
  if ((c != null && c.params.screen || c != null && c.params.state) && (c.pop = !0), !!c)
    return {
      type: "NAVIGATE",
      payload: c
    };
}
const Ur = (e) => typeof e == "object" && e != null ? {
  initialRouteName: e.initialRouteName,
  screens: e.screens != null ? Hn(e.screens) : void 0
} : {}, Hn = (e) => Object.entries(e).reduce((r, [n, t]) => (r[n] = Ur(t), r), {});
function Kr(e, r) {
  if (e === r)
    return !0;
  const n = Object.keys(e), t = Object.keys(r);
  return n.length !== t.length ? !1 : n.every((s) => Object.is(e[s], r[s]));
}
const Wr = Symbol("CHILD_STATE");
function Xn(e) {
  const r = x.useMemo(() => ({
    current: /* @__PURE__ */ new Map()
  }), []);
  return r.current = e.reduce((n, t) => {
    const s = r.current.get(t.key), {
      state: i,
      ...o
    } = t;
    let a;
    if (s && Kr(s, o) ? a = s : a = o, process.env.NODE_ENV !== "production")
      for (const c in a) {
        const u = a[c];
        Object.defineProperty(a, c, {
          enumerable: !0,
          configurable: !0,
          writable: !1,
          value: u
        });
      }
    return Object.defineProperty(a, Wr, {
      enumerable: !1,
      configurable: !0,
      value: i
    }), n.set(t.key, a), n;
  }, /* @__PURE__ */ new Map()), Array.from(r.current.values());
}
function aa(e) {
  const r = e[Wr] ?? e.state, n = e.params;
  return r ? (
    // Get the currently active route name in the nested navigator
    r.routes[
      // If we have a partial state without index, for tab/drawer, first screen will be focused one, and last for stack
      // The type property will only exist for rehydrated state and not for state from deep link
      r.index ?? (typeof r.type == "string" && r.type !== "stack" ? 0 : r.routes.length - 1)
    ].name
  ) : (
    // If state doesn't exist, we need to default to `screen` param if available
    typeof (n == null ? void 0 : n.screen) == "string" ? n.screen : void 0
  );
}
var pt = {}, mt, Qt;
function Jn() {
  return Qt || (Qt = 1, mt = (e) => encodeURIComponent(e).replace(/[!'()*]/g, (r) => `%${r.charCodeAt(0).toString(16).toUpperCase()}`)), mt;
}
var ht, er;
function Zn() {
  if (er) return ht;
  er = 1;
  var e = "%[a-f0-9]{2}", r = new RegExp("(" + e + ")|([^%]+?)", "gi"), n = new RegExp("(" + e + ")+", "gi");
  function t(o, a) {
    try {
      return [decodeURIComponent(o.join(""))];
    } catch {
    }
    if (o.length === 1)
      return o;
    a = a || 1;
    var c = o.slice(0, a), u = o.slice(a);
    return Array.prototype.concat.call([], t(c), t(u));
  }
  function s(o) {
    try {
      return decodeURIComponent(o);
    } catch {
      for (var a = o.match(r) || [], c = 1; c < a.length; c++)
        o = t(a, c).join(""), a = o.match(r) || [];
      return o;
    }
  }
  function i(o) {
    for (var a = {
      "%FE%FF": "��",
      "%FF%FE": "��"
    }, c = n.exec(o); c; ) {
      try {
        a[c[0]] = decodeURIComponent(c[0]);
      } catch {
        var u = s(c[0]);
        u !== c[0] && (a[c[0]] = u);
      }
      c = n.exec(o);
    }
    a["%C2"] = "�";
    for (var l = Object.keys(a), f = 0; f < l.length; f++) {
      var p = l[f];
      o = o.replace(new RegExp(p, "g"), a[p]);
    }
    return o;
  }
  return ht = function(o) {
    if (typeof o != "string")
      throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof o + "`");
    try {
      return o = o.replace(/\+/g, " "), decodeURIComponent(o);
    } catch {
      return i(o);
    }
  }, ht;
}
var yt, tr;
function Qn() {
  return tr || (tr = 1, yt = (e, r) => {
    if (!(typeof e == "string" && typeof r == "string"))
      throw new TypeError("Expected the arguments to be of type `string`");
    if (r === "")
      return [e];
    const n = e.indexOf(r);
    return n === -1 ? [e] : [
      e.slice(0, n),
      e.slice(n + r.length)
    ];
  }), yt;
}
var gt, rr;
function eo() {
  return rr || (rr = 1, gt = function(e, r) {
    for (var n = {}, t = Object.keys(e), s = Array.isArray(r), i = 0; i < t.length; i++) {
      var o = t[i], a = e[o];
      (s ? r.indexOf(o) !== -1 : r(o, a, e)) && (n[o] = a);
    }
    return n;
  }), gt;
}
var nr;
function to() {
  return nr || (nr = 1, function(e) {
    const r = Jn(), n = Zn(), t = Qn(), s = eo(), i = (m) => m == null, o = Symbol("encodeFragmentIdentifier");
    function a(m) {
      switch (m.arrayFormat) {
        case "index":
          return (g) => (h, w) => {
            const C = h.length;
            return w === void 0 || m.skipNull && w === null || m.skipEmptyString && w === "" ? h : w === null ? [...h, [l(g, m), "[", C, "]"].join("")] : [
              ...h,
              [l(g, m), "[", l(C, m), "]=", l(w, m)].join("")
            ];
          };
        case "bracket":
          return (g) => (h, w) => w === void 0 || m.skipNull && w === null || m.skipEmptyString && w === "" ? h : w === null ? [...h, [l(g, m), "[]"].join("")] : [...h, [l(g, m), "[]=", l(w, m)].join("")];
        case "colon-list-separator":
          return (g) => (h, w) => w === void 0 || m.skipNull && w === null || m.skipEmptyString && w === "" ? h : w === null ? [...h, [l(g, m), ":list="].join("")] : [...h, [l(g, m), ":list=", l(w, m)].join("")];
        case "comma":
        case "separator":
        case "bracket-separator": {
          const g = m.arrayFormat === "bracket-separator" ? "[]=" : "=";
          return (h) => (w, C) => C === void 0 || m.skipNull && C === null || m.skipEmptyString && C === "" ? w : (C = C === null ? "" : C, w.length === 0 ? [[l(h, m), g, l(C, m)].join("")] : [[w, l(C, m)].join(m.arrayFormatSeparator)]);
        }
        default:
          return (g) => (h, w) => w === void 0 || m.skipNull && w === null || m.skipEmptyString && w === "" ? h : w === null ? [...h, l(g, m)] : [...h, [l(g, m), "=", l(w, m)].join("")];
      }
    }
    function c(m) {
      let g;
      switch (m.arrayFormat) {
        case "index":
          return (h, w, C) => {
            if (g = /\[(\d*)\]$/.exec(h), h = h.replace(/\[\d*\]$/, ""), !g) {
              C[h] = w;
              return;
            }
            C[h] === void 0 && (C[h] = {}), C[h][g[1]] = w;
          };
        case "bracket":
          return (h, w, C) => {
            if (g = /(\[\])$/.exec(h), h = h.replace(/\[\]$/, ""), !g) {
              C[h] = w;
              return;
            }
            if (C[h] === void 0) {
              C[h] = [w];
              return;
            }
            C[h] = [].concat(C[h], w);
          };
        case "colon-list-separator":
          return (h, w, C) => {
            if (g = /(:list)$/.exec(h), h = h.replace(/:list$/, ""), !g) {
              C[h] = w;
              return;
            }
            if (C[h] === void 0) {
              C[h] = [w];
              return;
            }
            C[h] = [].concat(C[h], w);
          };
        case "comma":
        case "separator":
          return (h, w, C) => {
            const R = typeof w == "string" && w.includes(m.arrayFormatSeparator), k = typeof w == "string" && !R && f(w, m).includes(m.arrayFormatSeparator);
            w = k ? f(w, m) : w;
            const I = R || k ? w.split(m.arrayFormatSeparator).map((P) => f(P, m)) : w === null ? w : f(w, m);
            C[h] = I;
          };
        case "bracket-separator":
          return (h, w, C) => {
            const R = /(\[\])$/.test(h);
            if (h = h.replace(/\[\]$/, ""), !R) {
              C[h] = w && f(w, m);
              return;
            }
            const k = w === null ? [] : w.split(m.arrayFormatSeparator).map((I) => f(I, m));
            if (C[h] === void 0) {
              C[h] = k;
              return;
            }
            C[h] = [].concat(C[h], k);
          };
        default:
          return (h, w, C) => {
            if (C[h] === void 0) {
              C[h] = w;
              return;
            }
            C[h] = [].concat(C[h], w);
          };
      }
    }
    function u(m) {
      if (typeof m != "string" || m.length !== 1)
        throw new TypeError("arrayFormatSeparator must be single character string");
    }
    function l(m, g) {
      return g.encode ? g.strict ? r(m) : encodeURIComponent(m) : m;
    }
    function f(m, g) {
      return g.decode ? n(m) : m;
    }
    function p(m) {
      return Array.isArray(m) ? m.sort() : typeof m == "object" ? p(Object.keys(m)).sort((g, h) => Number(g) - Number(h)).map((g) => m[g]) : m;
    }
    function b(m) {
      const g = m.indexOf("#");
      return g !== -1 && (m = m.slice(0, g)), m;
    }
    function y(m) {
      let g = "";
      const h = m.indexOf("#");
      return h !== -1 && (g = m.slice(h)), g;
    }
    function d(m) {
      m = b(m);
      const g = m.indexOf("?");
      return g === -1 ? "" : m.slice(g + 1);
    }
    function v(m, g) {
      return g.parseNumbers && !Number.isNaN(Number(m)) && typeof m == "string" && m.trim() !== "" ? m = Number(m) : g.parseBooleans && m !== null && (m.toLowerCase() === "true" || m.toLowerCase() === "false") && (m = m.toLowerCase() === "true"), m;
    }
    function E(m, g) {
      g = Object.assign({
        decode: !0,
        sort: !0,
        arrayFormat: "none",
        arrayFormatSeparator: ",",
        parseNumbers: !1,
        parseBooleans: !1
      }, g), u(g.arrayFormatSeparator);
      const h = c(g), w = /* @__PURE__ */ Object.create(null);
      if (typeof m != "string" || (m = m.trim().replace(/^[?#&]/, ""), !m))
        return w;
      for (const C of m.split("&")) {
        if (C === "")
          continue;
        let [R, k] = t(g.decode ? C.replace(/\+/g, " ") : C, "=");
        k = k === void 0 ? null : ["comma", "separator", "bracket-separator"].includes(g.arrayFormat) ? k : f(k, g), h(f(R, g), k, w);
      }
      for (const C of Object.keys(w)) {
        const R = w[C];
        if (typeof R == "object" && R !== null)
          for (const k of Object.keys(R))
            R[k] = v(R[k], g);
        else
          w[C] = v(R, g);
      }
      return g.sort === !1 ? w : (g.sort === !0 ? Object.keys(w).sort() : Object.keys(w).sort(g.sort)).reduce((C, R) => {
        const k = w[R];
        return k && typeof k == "object" && !Array.isArray(k) ? C[R] = p(k) : C[R] = k, C;
      }, /* @__PURE__ */ Object.create(null));
    }
    e.extract = d, e.parse = E, e.stringify = (m, g) => {
      if (!m)
        return "";
      g = Object.assign({
        encode: !0,
        strict: !0,
        arrayFormat: "none",
        arrayFormatSeparator: ","
      }, g), u(g.arrayFormatSeparator);
      const h = (k) => g.skipNull && i(m[k]) || g.skipEmptyString && m[k] === "", w = a(g), C = {};
      for (const k of Object.keys(m))
        h(k) || (C[k] = m[k]);
      const R = Object.keys(C);
      return g.sort !== !1 && R.sort(g.sort), R.map((k) => {
        const I = m[k];
        return I === void 0 ? "" : I === null ? l(k, g) : Array.isArray(I) ? I.length === 0 && g.arrayFormat === "bracket-separator" ? l(k, g) + "[]" : I.reduce(w(k), []).join("&") : l(k, g) + "=" + l(I, g);
      }).filter((k) => k.length > 0).join("&");
    }, e.parseUrl = (m, g) => {
      g = Object.assign({
        decode: !0
      }, g);
      const [h, w] = t(m, "#");
      return Object.assign(
        {
          url: h.split("?")[0] || "",
          query: E(d(m), g)
        },
        g && g.parseFragmentIdentifier && w ? { fragmentIdentifier: f(w, g) } : {}
      );
    }, e.stringifyUrl = (m, g) => {
      g = Object.assign({
        encode: !0,
        strict: !0,
        [o]: !0
      }, g);
      const h = b(m.url).split("?")[0] || "", w = e.extract(m.url), C = e.parse(w, { sort: !1 }), R = Object.assign(C, m.query);
      let k = e.stringify(R, g);
      k && (k = `?${k}`);
      let I = y(m.url);
      return m.fragmentIdentifier && (I = `#${g[o] ? l(m.fragmentIdentifier, g) : m.fragmentIdentifier}`), `${h}${k}${I}`;
    }, e.pick = (m, g, h) => {
      h = Object.assign({
        parseFragmentIdentifier: !0,
        [o]: !1
      }, h);
      const { url: w, query: C, fragmentIdentifier: R } = e.parseUrl(m, h);
      return e.stringifyUrl({
        url: w,
        query: s(C, g),
        fragmentIdentifier: R
      }, h);
    }, e.exclude = (m, g, h) => {
      const w = Array.isArray(g) ? (C) => !g.includes(C) : (C, R) => !g(C, R);
      return e.pick(m, w, h);
    };
  }(pt)), pt;
}
var Yr = to();
function Ze(e) {
  const r = [];
  let n = {
    segment: ""
  }, t = !1, s = !1, i = 0;
  for (let a = 0; a <= e.length; a++) {
    const c = e[a];
    if (c != null && (n.segment += c), c === ":") {
      if (n.segment === ":")
        s = !0;
      else if (!t)
        throw new Error(`Encountered ':' in the middle of a segment in path: ${e}`);
    } else if (c === "(")
      if (s)
        t ? i++ : t = !0;
      else
        throw new Error(`Encountered '(' without preceding ':' in path: ${e}`);
    else if (c === ")")
      if (s && t)
        i ? (i--, n.regex += c) : (t = !1, s = !1);
      else
        throw new Error(`Encountered ')' without preceding '(' in path: ${e}`);
    else if (c === "?")
      if (n.param)
        s = !1, n.optional = !0;
      else
        throw new Error(`Encountered '?' without preceding ':' in path: ${e}`);
    else if (c == null || c === "/" && !t) {
      if (s = !1, n.segment = n.segment.replace(/\/$/, ""), n.segment === "")
        continue;
      if (n.param && (n.param = n.param.replace(/^:/, "")), n.regex && (n.regex = n.regex.replace(/^\(/, "").replace(/\)$/, "")), r.push(n), c == null)
        break;
      n = {
        segment: ""
      };
    }
    t && (n.regex = n.regex || "", n.regex += c), s && !t && (n.param = n.param || "", n.param += c);
  }
  if (t)
    throw new Error(`Could not find closing ')' in path: ${e}`);
  const o = r.map((a) => a.param).filter(Boolean);
  for (const [a, c] of o.entries())
    if (o.indexOf(c) !== a)
      throw new Error(`Duplicate param name '${c}' found in path: ${e}`);
  return r;
}
const or = (e) => Object.entries(e).map(([r, n]) => `- ${r} (${n})`).join(`
`);
function at(e, r = !0) {
  const n = {
    path: "string",
    initialRouteName: "string",
    screens: "object",
    ...r ? null : {
      alias: "array",
      exact: "boolean",
      stringify: "object",
      parse: "object"
    }
  };
  if (typeof e != "object" || e === null)
    throw new Error(`Expected the configuration to be an object, but got ${JSON.stringify(e)}.`);
  const t = Object.fromEntries(Object.keys(e).map((s) => {
    if (s in n) {
      const i = n[s], o = e[s];
      if (o !== void 0) {
        if (i === "array") {
          if (!Array.isArray(o))
            return [s, `expected 'Array', got '${typeof o}'`];
        } else if (typeof o !== i)
          return [s, `expected '${i}', got '${typeof o}'`];
      }
    } else
      return [s, "extraneous"];
    return null;
  }).filter(Boolean));
  if (Object.keys(t).length)
    throw new Error(`Found invalid properties in the configuration:
${or(t)}

You can only specify the following properties:
${or(n)}

If you want to specify configuration for screens, you need to specify them under a 'screens' property.

See https://reactnavigation.org/docs/configuring-links for more details on how to specify a linking configuration.`);
  if (r && "path" in e && typeof e.path == "string" && e.path.includes(":"))
    throw new Error(`Found invalid path '${e.path}'. The 'path' in the top-level configuration cannot contain patterns for params.`);
  "screens" in e && e.screens && Object.entries(e.screens).forEach(([s, i]) => {
    typeof i != "string" && at(i, !1);
  });
}
const qr = (e) => {
  const r = typeof e.index == "number" ? e.routes[e.index] : e.routes[e.routes.length - 1];
  return r.state ? qr(r.state) : r;
}, sr = /* @__PURE__ */ new WeakMap(), ro = (e) => {
  if (!(e != null && e.screens)) return {};
  const r = sr.get(e == null ? void 0 : e.screens);
  if (r) return r;
  const n = Hr(e.screens);
  return sr.set(e.screens, n), n;
};
function zt(e, r) {
  if (e == null)
    throw Error(`Got '${String(e)}' for the navigation state. You must pass a valid state object.`);
  r && at(r);
  const n = ro(r);
  let t = "/", s = e;
  const i = {};
  for (; s; ) {
    let o = typeof s.index == "number" ? s.index : 0, a = s.routes[o], c, u, l = n;
    const f = qr(e), p = [];
    let b = !0;
    for (; a.name in l && b; ) {
      if (c = l[a.name].parts, p.push(a.name), a.params) {
        const y = l[a.name], d = Object.fromEntries(Object.entries(a.params).map(([v, E]) => {
          var g, h, w;
          if (E === void 0)
            if (y) {
              if ((h = (g = y.parts) == null ? void 0 : g.find((R) => R.param === v)) == null ? void 0 : h.optional)
                return null;
            } else
              return null;
          const m = ((w = y == null ? void 0 : y.stringify) == null ? void 0 : w[v]) ?? String;
          return [v, m(E)];
        }).filter((v) => v != null));
        c != null && c.length && Object.assign(i, d), f === a && (u = {
          ...d
        }, c == null || c.forEach(({
          param: v
        }) => {
          v && u && delete u[v];
        }));
      }
      if (!l[a.name].screens || a.state === void 0)
        b = !1;
      else {
        o = typeof a.state.index == "number" ? a.state.index : a.state.routes.length - 1;
        const y = a.state.routes[o], d = l[a.name].screens;
        d && y.name in d ? (a = y, l = d) : b = !1;
      }
    }
    if (l[a.name] !== void 0 ? t += c == null ? void 0 : c.map(({
      segment: y,
      param: d,
      optional: v
    }) => {
      if (y === "*")
        return a.name;
      if (d) {
        const E = i[d];
        return E === void 0 && v ? "" : Array.from(String(E)).map((m) => /[^A-Za-z0-9\-._~!$&'()*+,;=:@]/g.test(m) ? encodeURIComponent(m) : m).join("");
      }
      return encodeURIComponent(y);
    }).join("/") : t += encodeURIComponent(a.name), !u && f.params && (u = Object.fromEntries(Object.entries(f.params).map(([y, d]) => [y, String(d)]))), a.state)
      t += "/";
    else if (u) {
      for (const d in u)
        u[d] === "undefined" && delete u[d];
      const y = Yr.stringify(u, {
        sort: !1
      });
      y && (t += `?${y}`);
    }
    s = a.state;
  }
  return r != null && r.path && (t = `${r.path}/${t}`), t = t.replace(/\/+/g, "/"), t = t.length > 1 ? t.replace(/\/$/, "") : t, t.startsWith("/") || (t = `/${t}`), t;
}
const no = (e, r) => {
  if (typeof e == "string") {
    const s = Ze(e);
    return r ? {
      parts: [...r, ...s]
    } : {
      parts: s
    };
  }
  if (e.exact && e.path === void 0)
    throw new Error("A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. `path: ''`.");
  const n = e.exact !== !0 ? [...r || [], ...e.path ? Ze(e.path) : []] : e.path ? Ze(e.path) : void 0, t = e.screens ? Hr(e.screens, n) : void 0;
  return {
    parts: n,
    stringify: e.stringify,
    screens: t
  };
}, Hr = (e, r) => Object.fromEntries(Object.entries(e).map(([n, t]) => {
  const s = no(t, r);
  return [n, s];
}));
var bt, ar;
function oo() {
  return ar || (ar = 1, bt = (e) => {
    if (typeof e != "string")
      throw new TypeError("Expected a string");
    return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
  }), bt;
}
var so = oo();
const ao = /* @__PURE__ */ Dt(so);
function It(e, r) {
  return r.length > e.length ? !1 : r.every((n, t) => n === e[t]);
}
function it(e, r) {
  return e === r ? !0 : e.length !== r.length ? !1 : e.every((n, t) => Object.is(n, r[t]));
}
function Xr(e, r) {
  var f;
  const {
    initialRoutes: n,
    configs: t
  } = io(r), s = r == null ? void 0 : r.screens;
  let i = e.replace(/\/+/g, "/").replace(/^\//, "").replace(/\?.*$/, "");
  i = i.endsWith("/") ? i : `${i}/`;
  const o = (f = r == null ? void 0 : r.path) == null ? void 0 : f.replace(/^\//, "");
  if (o) {
    const p = o.endsWith("/") ? o : `${o}/`;
    if (!i.startsWith(p))
      return;
    i = i.replace(p, "");
  }
  if (s === void 0) {
    const p = i.split("/").filter(Boolean).map((b) => ({
      name: decodeURIComponent(b)
    }));
    return p.length ? vt(e, p, n) : void 0;
  }
  if (i === "/") {
    const p = t.find((b) => b.segments.join("/") === "");
    return p ? vt(e, p.routeNames.map((b) => ({
      name: b
    })), n, t) : void 0;
  }
  let a, c;
  const {
    routes: u,
    remainingPath: l
  } = po(i, t);
  if (u !== void 0 && (c = vt(e, u, n, t), i = l, a = c), !(c == null || a == null))
    return a;
}
const ir = /* @__PURE__ */ new WeakMap();
function io(e) {
  if (!e) return cr();
  const r = ir.get(e);
  if (r) return r;
  const n = cr(e);
  return ir.set(e, n), n;
}
function cr(e) {
  e && at(e);
  const r = co(e), n = uo(r, e == null ? void 0 : e.screens);
  lo(n);
  const t = fo(n);
  return {
    initialRoutes: r,
    configs: n,
    configWithRegexes: t
  };
}
function co(e) {
  const r = [];
  return e != null && e.initialRouteName && r.push({
    initialRouteName: e.initialRouteName,
    parentScreens: []
  }), r;
}
function uo(e, r = {}) {
  return [].concat(...Object.keys(r).map((n) => Jr(n, r, e, [], [], []))).sort((n, t) => {
    if (it(n.segments, t.segments))
      return t.routeNames.join(">").localeCompare(n.routeNames.join(">"));
    if (It(n.segments, t.segments))
      return -1;
    if (It(t.segments, n.segments))
      return 1;
    for (let s = 0; s < Math.max(n.segments.length, t.segments.length); s++) {
      if (n.segments[s] == null)
        return 1;
      if (t.segments[s] == null)
        return -1;
      const i = n.segments[s] === "*", o = t.segments[s] === "*", a = n.segments[s].startsWith(":"), c = t.segments[s].startsWith(":"), u = a && n.segments[s].includes("("), l = c && t.segments[s].includes("(");
      if (!(i && o || u && l)) {
        if (i && !o)
          return 1;
        if (o && !i)
          return -1;
        if (a && !c)
          return 1;
        if (c && !a || u && !l)
          return -1;
        if (l && !u)
          return 1;
      }
    }
    return n.segments.length - t.segments.length;
  });
}
function lo(e) {
  e.reduce((r, n) => {
    const t = n.segments.join("/");
    if (r[t]) {
      const s = r[t].routeNames, i = n.routeNames;
      if (!(s.length > i.length ? i.every((a, c) => s[c] === a) : s.every((a, c) => i[c] === a)))
        throw new Error(`Found conflicting screens with the same pattern. The pattern '${t}' resolves to both '${s.join(" > ")}' and '${i.join(" > ")}'. Patterns must be unique and cannot resolve to more than one screen.`);
    }
    return Object.assign(r, {
      [t]: n
    });
  }, {});
}
function fo(e) {
  return e.map((r) => ({
    ...r,
    // Add `$` to the regex to make sure it matches till end of the path and not just beginning
    regex: r.regex ? new RegExp(r.regex.source + "$") : void 0
  }));
}
const po = (e, r) => {
  let n, t = e;
  for (const s of r) {
    if (!s.regex)
      continue;
    const i = t.match(s.regex);
    if (i) {
      n = s.routeNames.map((o) => {
        const a = r.find((u) => u.screen === o && It(s.segments, u.segments)), c = a && i.groups ? Object.fromEntries(Object.entries(i.groups).map(([u, l]) => {
          const f = Number(u.replace("param_", "")), p = a.params.find((b) => b.index === f);
          return (p == null ? void 0 : p.screen) === o && (p != null && p.name) ? [p.name, l] : null;
        }).filter((u) => u != null).map(([u, l]) => {
          var b;
          if (l == null)
            return [u, void 0];
          const f = decodeURIComponent(l), p = (b = a.parse) != null && b[u] ? a.parse[u](f) : f;
          return [u, p];
        })) : void 0;
        return c && Object.keys(c).length ? {
          name: o,
          params: c
        } : {
          name: o
        };
      }), t = t.replace(i[0], "");
      break;
    }
  }
  return {
    routes: n,
    remainingPath: t
  };
}, Jr = (e, r, n, t, s, i) => {
  var c;
  const o = [];
  i.push(e), s.push(e);
  const a = r[e];
  if (typeof a == "string")
    t.push({
      screen: e,
      path: a
    }), o.push(He(e, [...i], [...t]));
  else if (typeof a == "object") {
    if (typeof a.path == "string") {
      if (a.exact && a.path == null)
        throw new Error(`Screen '${e}' doesn't specify a 'path'. A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. \`path: ''\`.`);
      const u = [];
      if (a.alias)
        for (const l of a.alias)
          typeof l == "string" ? u.push(He(e, [...i], [...t, {
            screen: e,
            path: l
          }], a.parse)) : typeof l == "object" && u.push(He(e, [...i], l.exact ? [{
            screen: e,
            path: l.path
          }] : [...t, {
            screen: e,
            path: l.path
          }], l.parse));
      a.exact && (t.length = 0), t.push({
        screen: e,
        path: a.path
      }), o.push(He(e, [...i], [...t], a.parse)), o.push(...u);
    }
    if (typeof a != "string" && typeof a.path != "string" && ((c = a.alias) != null && c.length))
      throw new Error(`Screen '${e}' doesn't specify a 'path'. A 'path' needs to be specified in order to use 'alias'.`);
    a.screens && (a.initialRouteName && n.push({
      initialRouteName: a.initialRouteName,
      parentScreens: s
    }), Object.keys(a.screens).forEach((u) => {
      const l = Jr(u, a.screens, n, [...t], [...s], i);
      o.push(...l);
    }));
  }
  return i.pop(), o;
}, He = (e, r, n, t) => {
  const s = [];
  for (const {
    screen: c,
    path: u
  } of n)
    s.push(...Ze(u).map((l) => ({
      ...l,
      screen: c
    })));
  const i = s.length ? new RegExp(`^(${s.map((c, u) => {
    if (c.param) {
      const l = c.regex || "[^/]+";
      return `(((?<param_${u}>${l})\\/)${c.optional ? "?" : ""})`;
    }
    return `${c.segment === "*" ? ".*" : ao(c.segment)}\\/`;
  }).join("")})$`) : void 0, o = s.map((c) => c.segment), a = s.map((c, u) => c.param ? {
    index: u,
    screen: c.screen,
    name: c.param
  } : null).filter((c) => c != null);
  return {
    screen: e,
    regex: i,
    segments: o,
    params: a,
    routeNames: r,
    parse: t
  };
}, mo = (e, r) => {
  for (const n of r)
    if (e === n.routeNames[n.routeNames.length - 1])
      return n.parse;
}, ur = (e, r, n) => {
  for (const t of n)
    if (r.length === t.parentScreens.length) {
      let s = !0;
      for (let i = 0; i < r.length; i++)
        if (r[i].localeCompare(t.parentScreens[i]) !== 0) {
          s = !1;
          break;
        }
      if (s)
        return e !== t.initialRouteName ? t.initialRouteName : void 0;
    }
}, lr = (e, r, n) => n ? e ? {
  index: 1,
  routes: [{
    name: e
  }, r]
} : {
  routes: [r]
} : e ? {
  index: 1,
  routes: [{
    name: e
  }, {
    ...r,
    state: {
      routes: []
    }
  }]
} : {
  routes: [{
    ...r,
    state: {
      routes: []
    }
  }]
}, vt = (e, r, n, t) => {
  let s = r.shift();
  const i = [];
  let o = ur(s.name, i, n);
  i.push(s.name);
  const a = lr(o, s, r.length === 0);
  if (r.length > 0) {
    let u = a;
    for (; s = r.shift(); ) {
      o = ur(s.name, i, n);
      const l = u.index || u.routes.length - 1;
      u.routes[l].state = lr(o, s, r.length === 0), r.length > 0 && (u = u.routes[l].state), i.push(s.name);
    }
  }
  s = _e(a), s.path = e.replace(/\/$/, "");
  const c = ho(e, t ? mo(s.name, t) : void 0);
  return c && (s.params = {
    ...s.params,
    ...c
  }), a;
}, ho = (e, r) => {
  const n = e.split("?")[1], t = Yr.parse(n);
  return r && Object.keys(t).forEach((s) => {
    Object.hasOwnProperty.call(r, s) && typeof t[s] == "string" && (t[s] = r[s](t[s]));
  }), Object.keys(t).length ? t : void 0;
}, $e = /* @__PURE__ */ x.createContext(void 0), Zr = /* @__PURE__ */ x.createContext(void 0);
function ct() {
  const e = x.useContext(ot), r = x.useContext($e);
  if (r === void 0 && e === void 0)
    throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
  return r ?? e;
}
const Qr = /* @__PURE__ */ x.createContext(void 0), _t = /* @__PURE__ */ x.createContext(void 0);
function ia() {
  const e = x.useContext(_t), r = ct(), n = e !== void 0, t = x.useCallback((i) => {
    if (n)
      return () => {
      };
    const o = r.addListener("focus", i), a = r.addListener("blur", i);
    return () => {
      o(), a();
    };
  }, [n, r]), s = x.useSyncExternalStore(t, r.isFocused, r.isFocused);
  return e ?? s;
}
const Me = /* @__PURE__ */ x.createContext(void 0);
function yo({
  route: e,
  navigation: r,
  children: n
}) {
  const t = x.useContext(_t), s = x.useContext(Qr), i = t == null || t ? s === e.key : !1;
  return /* @__PURE__ */ S(Me.Provider, {
    value: e,
    children: /* @__PURE__ */ S($e.Provider, {
      value: r,
      children: /* @__PURE__ */ S(_t.Provider, {
        value: i,
        children: n
      })
    })
  });
}
const go = /* @__PURE__ */ x.createContext(void 0), Ft = /* @__PURE__ */ x.createContext(void 0);
let bo = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", Vt = (e = 21) => {
  let r = "", n = e | 0;
  for (; n--; )
    r += bo[Math.random() * 64 | 0];
  return r;
};
const vo = (e) => [...e.values()].reduce((t, {
  routeKey: s,
  preventRemove: i
}) => {
  var o;
  return t[s] = {
    preventRemove: ((o = t[s]) == null ? void 0 : o.preventRemove) || i
  }, t;
}, {});
function xo({
  children: e
}) {
  const [r] = x.useState(() => Vt()), [n, t] = x.useState(() => /* @__PURE__ */ new Map()), s = x.useContext(Zr), i = x.useContext(Me), o = x.useContext(Ft), a = o == null ? void 0 : o.setPreventRemove, c = ae((f, p, b) => {
    if (b && (s == null || s != null && s.getState().routes.every((y) => y.key !== p)))
      throw new Error(`Couldn't find a route with the key ${p}. Is your component inside NavigationContent?`);
    t((y) => {
      var v, E;
      if (p === ((v = y.get(f)) == null ? void 0 : v.routeKey) && b === ((E = y.get(f)) == null ? void 0 : E.preventRemove))
        return y;
      const d = new Map(y);
      return b ? d.set(f, {
        routeKey: p,
        preventRemove: b
      }) : d.delete(f), d;
    });
  }), u = [...n.values()].some(({
    preventRemove: f
  }) => f);
  x.useEffect(() => {
    if ((i == null ? void 0 : i.key) !== void 0 && a !== void 0)
      return a(r, i.key, u), () => {
        a(r, i.key, !1);
      };
  }, [r, u, i == null ? void 0 : i.key, a]);
  const l = x.useMemo(() => ({
    setPreventRemove: c,
    preventedRoutes: vo(n)
  }), [c, n]);
  return /* @__PURE__ */ S(Ft.Provider, {
    value: l,
    children: e
  });
}
var Xe = { exports: {} }, W = {};
/**
 * @license React
 * react-is.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dr;
function wo() {
  if (dr) return W;
  dr = 1;
  var e = Symbol.for("react.transitional.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), t = Symbol.for("react.strict_mode"), s = Symbol.for("react.profiler"), i = Symbol.for("react.consumer"), o = Symbol.for("react.context"), a = Symbol.for("react.forward_ref"), c = Symbol.for("react.suspense"), u = Symbol.for("react.suspense_list"), l = Symbol.for("react.memo"), f = Symbol.for("react.lazy"), p = Symbol.for("react.view_transition"), b = Symbol.for("react.client.reference");
  function y(d) {
    if (typeof d == "object" && d !== null) {
      var v = d.$$typeof;
      switch (v) {
        case e:
          switch (d = d.type, d) {
            case n:
            case s:
            case t:
            case c:
            case u:
            case p:
              return d;
            default:
              switch (d = d && d.$$typeof, d) {
                case o:
                case a:
                case f:
                case l:
                  return d;
                case i:
                  return d;
                default:
                  return v;
              }
          }
        case r:
          return v;
      }
    }
  }
  return W.ContextConsumer = i, W.ContextProvider = o, W.Element = e, W.ForwardRef = a, W.Fragment = n, W.Lazy = f, W.Memo = l, W.Portal = r, W.Profiler = s, W.StrictMode = t, W.Suspense = c, W.SuspenseList = u, W.isContextConsumer = function(d) {
    return y(d) === i;
  }, W.isContextProvider = function(d) {
    return y(d) === o;
  }, W.isElement = function(d) {
    return typeof d == "object" && d !== null && d.$$typeof === e;
  }, W.isForwardRef = function(d) {
    return y(d) === a;
  }, W.isFragment = function(d) {
    return y(d) === n;
  }, W.isLazy = function(d) {
    return y(d) === f;
  }, W.isMemo = function(d) {
    return y(d) === l;
  }, W.isPortal = function(d) {
    return y(d) === r;
  }, W.isProfiler = function(d) {
    return y(d) === s;
  }, W.isStrictMode = function(d) {
    return y(d) === t;
  }, W.isSuspense = function(d) {
    return y(d) === c;
  }, W.isSuspenseList = function(d) {
    return y(d) === u;
  }, W.isValidElementType = function(d) {
    return typeof d == "string" || typeof d == "function" || d === n || d === s || d === t || d === c || d === u || typeof d == "object" && d !== null && (d.$$typeof === f || d.$$typeof === l || d.$$typeof === o || d.$$typeof === i || d.$$typeof === a || d.$$typeof === b || d.getModuleId !== void 0);
  }, W.typeOf = y, W;
}
var Y = {};
/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fr;
function Co() {
  return fr || (fr = 1, process.env.NODE_ENV !== "production" && function() {
    function e(d) {
      if (typeof d == "object" && d !== null) {
        var v = d.$$typeof;
        switch (v) {
          case r:
            switch (d = d.type, d) {
              case t:
              case i:
              case s:
              case u:
              case l:
              case b:
                return d;
              default:
                switch (d = d && d.$$typeof, d) {
                  case a:
                  case c:
                  case p:
                  case f:
                    return d;
                  case o:
                    return d;
                  default:
                    return v;
                }
            }
          case n:
            return v;
        }
      }
    }
    var r = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), t = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), a = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), l = Symbol.for("react.suspense_list"), f = Symbol.for("react.memo"), p = Symbol.for("react.lazy"), b = Symbol.for("react.view_transition"), y = Symbol.for("react.client.reference");
    Y.ContextConsumer = o, Y.ContextProvider = a, Y.Element = r, Y.ForwardRef = c, Y.Fragment = t, Y.Lazy = p, Y.Memo = f, Y.Portal = n, Y.Profiler = i, Y.StrictMode = s, Y.Suspense = u, Y.SuspenseList = l, Y.isContextConsumer = function(d) {
      return e(d) === o;
    }, Y.isContextProvider = function(d) {
      return e(d) === a;
    }, Y.isElement = function(d) {
      return typeof d == "object" && d !== null && d.$$typeof === r;
    }, Y.isForwardRef = function(d) {
      return e(d) === c;
    }, Y.isFragment = function(d) {
      return e(d) === t;
    }, Y.isLazy = function(d) {
      return e(d) === p;
    }, Y.isMemo = function(d) {
      return e(d) === f;
    }, Y.isPortal = function(d) {
      return e(d) === n;
    }, Y.isProfiler = function(d) {
      return e(d) === i;
    }, Y.isStrictMode = function(d) {
      return e(d) === s;
    }, Y.isSuspense = function(d) {
      return e(d) === u;
    }, Y.isSuspenseList = function(d) {
      return e(d) === l;
    }, Y.isValidElementType = function(d) {
      return typeof d == "string" || typeof d == "function" || d === t || d === i || d === s || d === u || d === l || typeof d == "object" && d !== null && (d.$$typeof === p || d.$$typeof === f || d.$$typeof === a || d.$$typeof === o || d.$$typeof === c || d.$$typeof === y || d.getModuleId !== void 0);
    }, Y.typeOf = e;
  }()), Y;
}
var pr;
function Eo() {
  return pr || (pr = 1, process.env.NODE_ENV === "production" ? Xe.exports = /* @__PURE__ */ wo() : Xe.exports = /* @__PURE__ */ Co()), Xe.exports;
}
var Lt = /* @__PURE__ */ Eo();
function en() {
  const e = x.useContext(Me);
  if (e === void 0)
    throw new Error("Couldn't find a route object. Is your component inside a screen in a navigator?");
  return e;
}
const tn = /* @__PURE__ */ x.memo(({
  component: e
}) => {
  const r = en();
  return /* @__PURE__ */ x.createElement(e, {
    route: r
  });
});
tn.displayName = "Memo(Screen)";
const mr = (e, r) => Object.entries(r).map(([n, t]) => {
  let s, i = {}, o, a = !1;
  if ("screen" in t) {
    const {
      screen: u,
      if: l,
      ...f
    } = t;
    o = l, i = f, Lt.isValidElementType(u) ? s = u : "config" in u && (a = !0, s = hr(u, `${n}Navigator`));
  } else Lt.isValidElementType(t) ? s = t : "config" in t && (a = !0, s = hr(t, `${n}Navigator`));
  if (s == null)
    throw new Error(`Couldn't find a 'screen' property for the screen '${n}'. This can happen if you passed 'undefined'. You likely forgot to export your component from the file it's defined in, or mixed up default import and named import when importing.`);
  const c = a ? /* @__PURE__ */ x.createElement(s, {}) : /* @__PURE__ */ S(tn, {
    component: s
  });
  return () => o == null || o() ? /* @__PURE__ */ S(e, {
    name: n,
    ...i,
    children: () => c
  }, n) : null;
});
function hr(e, r) {
  const {
    Navigator: n,
    Group: t,
    Screen: s,
    config: i
  } = e, {
    screens: o,
    groups: a,
    ...c
  } = i;
  if (o == null && a == null)
    throw new Error("Couldn't find a 'screens' or 'groups' property. Make sure to define your screens under a 'screens' property in the configuration.");
  const u = [];
  for (const f in i)
    f === "screens" && o && u.push(...mr(s, o)), f === "groups" && a && u.push(...Object.entries(a).map(([p, {
      if: b,
      ...y
    }]) => {
      const d = mr(s, y.screens);
      return () => {
        const v = d.map((m) => m());
        return b == null || b() ? /* @__PURE__ */ S(t, {
          navigationKey: p,
          ...y,
          children: v
        }, p) : null;
      };
    }));
  const l = () => {
    const f = u.map((p) => p());
    return /* @__PURE__ */ S(n, {
      ...c,
      children: f
    });
  };
  return l.displayName = r, l;
}
function ca(e, r, n) {
  let t = !1, s;
  const i = (a, c, u) => {
    const l = (p, b) => Object.fromEntries(Object.entries(p).sort(([y], [d]) => y === b ? -1 : d === b ? 1 : 0).map(([y, d]) => {
      const v = {};
      "linking" in d && (typeof d.linking == "string" ? v.path = d.linking : Object.assign(v, d.linking), typeof v.path == "string" && (v.path = v.path.replace(/^\//, "").replace(/\/$/, "")));
      let E;
      const m = u || v.path != null && v.path !== "";
      return "config" in d ? E = i(d, void 0, m) : "screen" in d && "config" in d.screen && (d.screen.config.screens || d.screen.config.groups) && (E = i(d.screen, void 0, m)), E && (v.screens = E), n && !v.screens && // Skip generating path for screens that specify linking config as `undefined` or `null` explicitly
      !("linking" in d && d.linking == null) && (v.path != null ? u || (y === b && v.path != null ? t = !0 : v.path === "" && (s = void 0)) : (!u && s == null && (s = v), v.path = y.replace(/([A-Z]+)/g, "-$1").replace(/^-/, "").toLowerCase())), [y, v];
    }).filter(([, y]) => Object.keys(y).length > 0)), f = {};
    for (const p in a.config)
      p === "screens" && a.config.screens && Object.assign(f, l(a.config.screens, (c == null ? void 0 : c.initialRouteName) ?? a.config.initialRouteName)), p === "groups" && a.config.groups && Object.entries(a.config.groups).forEach(([, b]) => {
        Object.assign(f, l(b.screens, (c == null ? void 0 : c.initialRouteName) ?? a.config.initialRouteName));
      });
    if (Object.keys(f).length !== 0)
      return f;
  }, o = i(e, r, !1);
  return n && s && !t && (s.path = ""), o;
}
function Pe() {
  const e = x.useContext(st);
  if (e == null)
    throw new Error("Couldn't find a theme. Is your component inside NavigationContainer or does it have a theme?");
  return e;
}
function ua(e) {
  const r = ct();
  arguments[1] !== void 0 && console.error(`You passed a second argument to 'useFocusEffect', but it only accepts one argument. If you want to pass a dependency array, you can use 'React.useCallback':

useFocusEffect(
  React.useCallback(() => {
    // Your code here
  }, [depA, depB])
);

See usage guide: https://reactnavigation.org/docs/use-focus-effect`), x.useEffect(() => {
    let n = !1, t;
    const s = () => {
      const a = e();
      if (a === void 0 || typeof a == "function")
        return a;
      if (process.env.NODE_ENV !== "production") {
        let c = "An effect function must not return anything besides a function, which is used for clean-up.";
        a === null ? c += " You returned 'null'. If your effect does not require clean-up, return 'undefined' (or nothing)." : typeof a.then == "function" ? c += `

It looks like you wrote 'useFocusEffect(async () => ...)' or returned a Promise. Instead, write the async function inside your effect and call it immediately:

useFocusEffect(
  React.useCallback(() => {
    async function fetchData() {
      // You can await here
      const response = await MyAPI.getData(someId);
      // ...
    }

    fetchData();
  }, [someId])
);

See usage guide: https://reactnavigation.org/docs/use-focus-effect` : c += ` You returned '${JSON.stringify(a)}'.`, console.error(c);
      }
    };
    r.isFocused() && (t = s(), n = !0);
    const i = r.addListener("focus", () => {
      n || (t !== void 0 && t(), t = s(), n = !0);
    }), o = r.addListener("blur", () => {
      t !== void 0 && t(), t = void 0, n = !1;
    });
    return () => {
      t !== void 0 && t(), i(), o();
    };
  }, [e, r]);
}
var xt, yr;
function Ro() {
  return yr || (yr = 1, xt = function e(r, n) {
    if (r === n) return !0;
    if (r && n && typeof r == "object" && typeof n == "object") {
      if (r.constructor !== n.constructor) return !1;
      var t, s, i;
      if (Array.isArray(r)) {
        if (t = r.length, t != n.length) return !1;
        for (s = t; s-- !== 0; )
          if (!e(r[s], n[s])) return !1;
        return !0;
      }
      if (r.constructor === RegExp) return r.source === n.source && r.flags === n.flags;
      if (r.valueOf !== Object.prototype.valueOf) return r.valueOf() === n.valueOf();
      if (r.toString !== Object.prototype.toString) return r.toString() === n.toString();
      if (i = Object.keys(r), t = i.length, t !== Object.keys(n).length) return !1;
      for (s = t; s-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(n, i[s])) return !1;
      for (s = t; s-- !== 0; ) {
        var o = i[s];
        if (!e(r[o], n[o])) return !1;
      }
      return !0;
    }
    return r !== r && n !== n;
  }), xt;
}
var So = Ro();
const rn = /* @__PURE__ */ Dt(So), nn = typeof document < "u" || typeof navigator < "u" && navigator.product === "ReactNative" ? x.useLayoutEffect : x.useEffect, ko = ({
  render: e,
  children: r
}) => e(r);
function Ao(e) {
  const r = x.useRef(e);
  return r.current = e, x.useEffect(() => {
    r.current = null;
  }), x.useRef(({
    children: n
  }) => {
    const t = r.current;
    if (t === null)
      throw new Error("The returned component must be rendered in the same render phase as the hook.");
    return /* @__PURE__ */ S(ko, {
      render: t,
      children: n
    });
  }).current;
}
function Oo({
  state: e,
  navigation: r,
  descriptors: n
}) {
  const t = x.useContext(qn);
  t && r.isFocused() && (t.options = n[e.routes[e.index].key].options);
}
const gr = /* @__PURE__ */ x.createContext(void 0), To = /* @__PURE__ */ x.memo(function(r) {
  return r.children;
}, (e, r) => {
  const n = Object.keys(e), t = Object.keys(r);
  if (n.length !== t.length)
    return !1;
  for (const s of n)
    if (s !== "children" && e[s] !== r[s])
      return !1;
  return !0;
});
function No({
  screen: e,
  route: r,
  navigation: n,
  routeState: t,
  getState: s,
  setState: i,
  options: o,
  clearOptions: a
}) {
  const c = x.useRef(void 0), u = x.useCallback(() => c.current, []), {
    addOptionsGetter: l
  } = Gr({
    key: r.key,
    options: o,
    navigation: n
  }), f = x.useCallback((h) => {
    c.current = h;
  }, []), p = x.useCallback(() => {
    const w = s().routes.find((C) => C.key === r.key);
    return w ? w.state : void 0;
  }, [s, r.key]), b = x.useCallback((h) => {
    const w = s(), C = w.routes.map((R) => R.key === r.key && R.state !== h ? {
      ...R,
      state: h
    } : R);
    it(w.routes, C) || i({
      ...w,
      routes: C
    });
  }, [s, r.key, i]), y = x.useRef(!0);
  x.useEffect(() => {
    y.current = !1;
  }), x.useEffect(() => a, []);
  const d = x.useCallback(() => y.current, []), v = x.useContext(gr), E = x.useMemo(() => {
    const h = {
      routes: [{
        key: r.key,
        name: r.name,
        params: r.params,
        path: r.path
      }]
    }, w = (C) => {
      const R = C == null ? void 0 : C.routes[0];
      return R ? {
        routes: [{
          ...R,
          state: w(R.state)
        }]
      } : h;
    };
    return w(v);
  }, [v, r.key, r.name, r.params, r.path]), m = x.useMemo(() => ({
    state: t,
    getState: p,
    setState: b,
    getKey: u,
    setKey: f,
    getIsInitial: d,
    addOptionsGetter: l
  }), [t, p, b, u, f, d, l]), g = e.getComponent ? e.getComponent() : e.component;
  return /* @__PURE__ */ S(Ue.Provider, {
    value: m,
    children: /* @__PURE__ */ S(gr.Provider, {
      value: E,
      children: /* @__PURE__ */ S(Fr, {
        children: /* @__PURE__ */ S(To, {
          name: e.name,
          render: g || e.children,
          navigation: n,
          route: r,
          children: g !== void 0 ? /* @__PURE__ */ S(g, {
            navigation: n,
            route: r
          }) : e.children !== void 0 ? e.children({
            navigation: n,
            route: r
          }) : null
        })
      })
    })
  });
}
function Po({
  state: e,
  getState: r,
  navigation: n,
  setOptions: t,
  router: s,
  emitter: i
}) {
  const {
    stackRef: o
  } = x.useContext(ve), a = x.useMemo(() => {
    const {
      emit: u,
      ...l
    } = n, f = {
      ...s.actionCreators,
      ...Le
    }, p = () => {
      throw new Error("Actions cannot be dispatched from a placeholder screen.");
    }, b = Object.keys(f).reduce((y, d) => (y[d] = p, y), {});
    return {
      ...l,
      ...b,
      addListener: () => () => {
      },
      removeListener: () => {
      },
      dispatch: p,
      getParent: (y) => y !== void 0 && y === l.getId() ? a : l.getParent(y),
      setOptions: () => {
        throw new Error("Options cannot be set from a placeholder screen.");
      },
      isFocused: () => !1
    };
  }, [n, s.actionCreators]), c = x.useMemo(
    () => ({
      current: {}
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [a, r, n, t, i]
  );
  return c.current = e.routes.reduce((u, l) => {
    const f = c.current[l.key];
    if (f)
      u[l.key] = f;
    else {
      const p = (v) => {
        const E = typeof v == "function" ? v(r()) : v;
        E != null && n.dispatch({
          source: l.key,
          ...E
        });
      }, b = (v) => {
        let E = !1;
        try {
          process.env.NODE_ENV !== "production" && o && !o.current && (o.current = new Error().stack, E = !0), v();
        } finally {
          E && o && (o.current = void 0);
        }
      }, y = {
        ...s.actionCreators,
        ...Le
      }, d = Object.keys(y).reduce((v, E) => (v[E] = (...m) => b(() => (
        // @ts-expect-error: name is a valid key, but TypeScript is dumb
        p(y[E](...m))
      )), v), {});
      u[l.key] = {
        ...a,
        ...d,
        // FIXME: too much work to fix the types for now
        ...i.create(l.key),
        dispatch: (v) => b(() => p(v)),
        getParent: (v) => v !== void 0 && v === a.getId() ? u[l.key] : a.getParent(v),
        setOptions: (v) => {
          t((E) => ({
            ...E,
            [l.key]: {
              ...E[l.key],
              ...v
            }
          }));
        },
        isFocused: () => {
          const v = a.getState();
          return v.routes[v.index].key !== l.key ? !1 : n ? n.isFocused() : !0;
        }
      };
    }
    return u;
  }, {}), {
    base: a,
    navigations: c.current
  };
}
function Io({
  state: e,
  screens: r,
  navigation: n,
  screenOptions: t,
  screenLayout: s,
  onAction: i,
  getState: o,
  setState: a,
  addListener: c,
  addKeyedListener: u,
  onRouteFocus: l,
  router: f,
  emitter: p
}) {
  const b = x.useContext(st), [y, d] = x.useState({}), {
    onDispatchAction: v,
    onOptionsChange: E,
    scheduleUpdate: m,
    flushUpdates: g,
    stackRef: h
  } = x.useContext(ve), w = x.useMemo(() => ({
    navigation: n,
    onAction: i,
    addListener: c,
    addKeyedListener: u,
    onRouteFocus: l,
    onDispatchAction: v,
    onOptionsChange: E,
    scheduleUpdate: m,
    flushUpdates: g,
    stackRef: h
  }), [n, i, c, u, l, v, E, m, g, h]), {
    base: C,
    navigations: R
  } = Po({
    state: e,
    getState: o,
    navigation: n,
    setOptions: d,
    router: f,
    emitter: p
  }), k = Xn(e.routes), I = (N, T, _) => {
    const $ = r[N.name], L = $.props;
    return [
      // The default `screenOptions` passed to the navigator
      t,
      // The `screenOptions` props passed to `Group` elements
      ...$.options ? $.options.filter(Boolean) : [],
      // The `options` prop passed to `Screen` elements,
      L.options,
      // The options set via `navigation.setOptions`
      _
    ].reduce((q, Q) => Object.assign(
      q,
      // @ts-expect-error: we check for function but TS still complains
      typeof Q != "function" ? Q : Q({
        route: N,
        navigation: T,
        theme: b
      })
    ), {});
  }, P = (N, T, _, $) => {
    const L = r[N.name], H = L.props, q = () => d((ie) => {
      if (N.key in ie) {
        const {
          [N.key]: B,
          ...ce
        } = ie;
        return ce;
      }
      return ie;
    }), Q = (
      // The `layout` prop passed to `Screen` elements,
      H.layout ?? // The `screenLayout` props passed to `Group` elements
      L.layout ?? // The default `screenLayout` passed to the navigator
      s
    );
    let K = /* @__PURE__ */ S(No, {
      navigation: T,
      route: N,
      screen: H,
      routeState: $,
      getState: o,
      setState: a,
      options: _,
      clearOptions: q
    });
    return Q != null && (K = Q({
      route: N,
      navigation: T,
      options: _,
      // @ts-expect-error: in practice `theme` will be defined
      theme: b,
      children: K
    })), /* @__PURE__ */ S(ve.Provider, {
      value: w,
      children: /* @__PURE__ */ S(yo, {
        route: N,
        navigation: T,
        children: K
      })
    }, N.key);
  }, U = k.reduce((N, T, _) => {
    const $ = R[T.key], L = I(T, $, y[T.key]), H = P(T, $, L, e.routes[_].state);
    return N[T.key] = {
      route: T,
      // @ts-expect-error: it's missing action helpers, fix later
      navigation: $,
      render() {
        return H;
      },
      options: L
    }, N;
  }, {});
  return {
    describe: (N, T) => {
      if (!T) {
        if (!(N.key in U))
          throw new Error(`Couldn't find a route with the key ${N.key}.`);
        return U[N.key];
      }
      const _ = C, $ = I(N, _, {}), L = P(N, _, $, void 0);
      return {
        route: N,
        navigation: _,
        render() {
          return L;
        },
        options: $
      };
    },
    descriptors: U
  };
}
function _o({
  navigation: e,
  focusedListeners: r
}) {
  const {
    addListener: n
  } = x.useContext(ve), t = x.useCallback((s) => {
    if (e.isFocused()) {
      for (const i of r) {
        const {
          handled: o,
          result: a
        } = i(s);
        if (o)
          return {
            handled: o,
            result: a
          };
      }
      return {
        handled: !0,
        result: s(e)
      };
    } else
      return {
        handled: !1,
        result: null
      };
  }, [r, e]);
  x.useEffect(() => n == null ? void 0 : n("focus", t), [n, t]);
}
function Fo({
  state: e,
  emitter: r
}) {
  const n = x.useContext($e), t = x.useRef(void 0), s = e.routes[e.index].key;
  x.useEffect(() => n == null ? void 0 : n.addListener("focus", () => {
    t.current = s, r.emit({
      type: "focus",
      target: s
    });
  }), [s, r, n]), x.useEffect(() => n == null ? void 0 : n.addListener("blur", () => {
    t.current = void 0, r.emit({
      type: "blur",
      target: s
    });
  }), [s, r, n]), x.useEffect(() => {
    const i = t.current;
    t.current = s, i === void 0 && !n && r.emit({
      type: "focus",
      target: s
    }), !(i === s || !(!n || n.isFocused())) && i !== void 0 && (r.emit({
      type: "blur",
      target: i
    }), r.emit({
      type: "focus",
      target: s
    }));
  }, [s, r, n]);
}
function Lo(e) {
  const r = x.useRef(void 0);
  return r.current === void 0 && (r.current = e()), r.current;
}
function $o({
  id: e,
  onAction: r,
  onUnhandledAction: n,
  getState: t,
  emitter: s,
  router: i,
  stateRef: o
}) {
  const a = x.useContext($e);
  return x.useMemo(() => {
    const c = (p) => {
      const b = typeof p == "function" ? p(t()) : p;
      r(b) || n == null || n(b);
    }, u = {
      ...i.actionCreators,
      ...Le
    }, l = Object.keys(u).reduce((p, b) => (p[b] = (...y) => c(u[b](...y)), p), {}), f = {
      ...a,
      ...l,
      dispatch: c,
      emit: s.emit,
      isFocused: a ? a.isFocused : () => !0,
      canGoBack: () => {
        const p = t();
        return i.getStateForAction(p, Tr(), {
          routeNames: p.routeNames,
          routeParamList: {},
          routeGetIdList: {}
        }) !== null || (a == null ? void 0 : a.canGoBack()) || !1;
      },
      getId: () => e,
      getParent: (p) => {
        if (p !== void 0) {
          let b = f;
          for (; b && p !== b.getId(); )
            b = b.getParent();
          return b;
        }
        return a;
      },
      getState: () => o.current != null ? o.current : t()
    };
    return f;
  }, [i, a, s.emit, t, r, n, e, o]);
}
var Je = { exports: {} }, wt = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var br;
function Mo() {
  if (br) return wt;
  br = 1;
  var e = Mt;
  function r(c, u) {
    return c === u && (c !== 0 || 1 / c === 1 / u) || c !== c && u !== u;
  }
  var n = typeof Object.is == "function" ? Object.is : r, t = e.useSyncExternalStore, s = e.useRef, i = e.useEffect, o = e.useMemo, a = e.useDebugValue;
  return wt.useSyncExternalStoreWithSelector = function(c, u, l, f, p) {
    var b = s(null);
    if (b.current === null) {
      var y = { hasValue: !1, value: null };
      b.current = y;
    } else y = b.current;
    b = o(
      function() {
        function v(w) {
          if (!E) {
            if (E = !0, m = w, w = f(w), p !== void 0 && y.hasValue) {
              var C = y.value;
              if (p(C, w))
                return g = C;
            }
            return g = w;
          }
          if (C = g, n(m, w)) return C;
          var R = f(w);
          return p !== void 0 && p(C, R) ? (m = w, C) : (m = w, g = R);
        }
        var E = !1, m, g, h = l === void 0 ? null : l;
        return [
          function() {
            return v(u());
          },
          h === null ? void 0 : function() {
            return v(h());
          }
        ];
      },
      [u, l, f, p]
    );
    var d = t(c, b[0], b[1]);
    return i(
      function() {
        y.hasValue = !0, y.value = d;
      },
      [d]
    ), a(d), d;
  }, wt;
}
var Ct = {};
/**
 * @license React
 * use-sync-external-store-with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vr;
function jo() {
  return vr || (vr = 1, process.env.NODE_ENV !== "production" && function() {
    function e(c, u) {
      return c === u && (c !== 0 || 1 / c === 1 / u) || c !== c && u !== u;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var r = Mt, n = typeof Object.is == "function" ? Object.is : e, t = r.useSyncExternalStore, s = r.useRef, i = r.useEffect, o = r.useMemo, a = r.useDebugValue;
    Ct.useSyncExternalStoreWithSelector = function(c, u, l, f, p) {
      var b = s(null);
      if (b.current === null) {
        var y = { hasValue: !1, value: null };
        b.current = y;
      } else y = b.current;
      b = o(
        function() {
          function v(w) {
            if (!E) {
              if (E = !0, m = w, w = f(w), p !== void 0 && y.hasValue) {
                var C = y.value;
                if (p(C, w))
                  return g = C;
              }
              return g = w;
            }
            if (C = g, n(m, w))
              return C;
            var R = f(w);
            return p !== void 0 && p(C, R) ? (m = w, C) : (m = w, g = R);
          }
          var E = !1, m, g, h = l === void 0 ? null : l;
          return [
            function() {
              return v(u());
            },
            h === null ? void 0 : function() {
              return v(h());
            }
          ];
        },
        [u, l, f, p]
      );
      var d = t(c, b[0], b[1]);
      return i(
        function() {
          y.hasValue = !0, y.value = d;
        },
        [d]
      ), a(d), d;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), Ct;
}
var xr;
function Bo() {
  return xr || (xr = 1, process.env.NODE_ENV === "production" ? Je.exports = Mo() : Je.exports = jo()), Je.exports;
}
var Do = Bo();
function la(e) {
  const r = x.useContext(on);
  if (r == null)
    throw new Error("Couldn't get the navigation state. Is your component inside a navigator?");
  return Do.useSyncExternalStoreWithSelector(
    r.subscribe,
    // @ts-expect-error: this is unsafe, but needed to make the generic work
    r.getState,
    r.getState,
    e
  );
}
function Go({
  state: e,
  children: r
}) {
  const n = x.useRef([]), t = x.useRef(e), s = ae(() => t.current), i = ae((a) => (n.current.push(a), () => {
    n.current = n.current.filter((c) => c !== a);
  }));
  x.useLayoutEffect(() => {
    t.current = e, n.current.forEach((a) => a());
  }, [e]);
  const o = x.useMemo(() => ({
    getState: s,
    subscribe: i
  }), [s, i]);
  return /* @__PURE__ */ S(on.Provider, {
    value: o,
    children: r
  });
}
const on = /* @__PURE__ */ x.createContext(void 0), wr = Symbol("VISITED_ROUTE_KEYS"), sn = (e, r, n, t, s) => {
  var u;
  const i = t.map((l) => l.key), o = n.filter((l) => !i.includes(l.key)).reverse(), a = (
    // @ts-expect-error: add this property to mark that we've already emitted this action
    s[wr] ?? /* @__PURE__ */ new Set()
  ), c = {
    ...s,
    [wr]: a
  };
  for (const l of o) {
    if (a.has(l.key))
      continue;
    if (((u = r[l.key]) == null ? void 0 : u.call(r, c)) || (a.add(l.key), e.emit({
      type: "beforeRemove",
      target: l.key,
      data: {
        action: c
      },
      canPreventDefault: !0
    }).defaultPrevented))
      return !0;
  }
  return !1;
};
function zo({
  getState: e,
  emitter: r,
  beforeRemoveListeners: n
}) {
  const {
    addKeyedListener: t
  } = x.useContext(ve), s = x.useContext(Me), i = s == null ? void 0 : s.key;
  x.useEffect(() => {
    if (i)
      return t == null ? void 0 : t("beforeRemove", i, (o) => {
        const a = e();
        return sn(r, n, a.routes, [], o);
      });
  }, [t, n, r, e, i]);
}
function Vo({
  router: e,
  getState: r,
  setState: n,
  key: t,
  actionListeners: s,
  beforeRemoveListeners: i,
  routerConfigOptions: o,
  emitter: a
}) {
  const {
    onAction: c,
    onRouteFocus: u,
    addListener: l,
    onDispatchAction: f
  } = x.useContext(ve), p = x.useContext(Ir), b = x.useRef(o);
  x.useEffect(() => {
    b.current = o;
  });
  const y = x.useCallback((d, v = /* @__PURE__ */ new Set()) => {
    const E = r();
    if (v.has(E.key))
      return !1;
    if (v.add(E.key), typeof d.target != "string" || d.target === E.key) {
      let m = e.getStateForAction(E, d, b.current);
      if (m = m === null && d.target === E.key ? E : m, m !== null) {
        if (f(d, E === m), E !== m) {
          if (sn(a, i, E.routes, m.routes, d))
            return !0;
          n(m);
        }
        return u !== void 0 && e.shouldActionChangeFocus(d) && t !== void 0 && u(t), !0;
      }
    }
    if (c !== void 0 && c(d, v))
      return !0;
    if (typeof d.target == "string" || // For backward compatibility
    d.type === "NAVIGATE_DEPRECATED" || p)
      for (let m = s.length - 1; m >= 0; m--) {
        const g = s[m];
        if (g(d, v))
          return !0;
      }
    return !1;
  }, [s, i, a, r, p, t, c, f, u, e, n]);
  return zo({
    getState: r,
    emitter: a,
    beforeRemoveListeners: i
  }), x.useEffect(() => l == null ? void 0 : l("action", y), [l, y]), y;
}
function Uo({
  getState: e,
  getStateListeners: r
}) {
  const {
    addKeyedListener: n
  } = x.useContext(ve), t = x.useContext(Me), s = t ? t.key : "root", i = x.useCallback(() => {
    const o = e(), a = o.routes.map((c) => {
      var l;
      const u = (l = r[c.key]) == null ? void 0 : l.call(r);
      return c.state === u ? c : {
        ...c,
        state: u
      };
    });
    return it(o.routes, a) ? o : {
      ...o,
      routes: a
    };
  }, [e, r]);
  x.useEffect(() => n == null ? void 0 : n("getState", s, i), [n, i, s]);
}
function Ko({
  router: e,
  getState: r,
  key: n,
  setState: t
}) {
  const {
    onRouteFocus: s
  } = x.useContext(ve);
  return x.useCallback((i) => {
    const o = r(), a = e.getStateForRouteFocus(o, i);
    a !== o && t(a), s !== void 0 && n !== void 0 && s(n);
  }, [r, s, e, t, n]);
}
function Wo() {
  const [e] = x.useState(() => Vt()), r = x.useContext(_r);
  if (r === void 0)
    throw new Error(`Couldn't register the navigator. Have you wrapped your app with 'NavigationContainer'?

This can also happen if there are multiple copies of '@react-navigation' packages installed.`);
  return x.useEffect(() => {
    const {
      register: n,
      unregister: t
    } = r;
    return n(e), () => t(e);
  }, [r, e]), e;
}
function Yo(e) {
  const {
    scheduleUpdate: r,
    flushUpdates: n
  } = x.useContext(ve);
  r(e), nn(n);
}
const Et = Symbol("CONSUMED_PARAMS"), qo = (e) => e.type === Pt, Ho = (e) => e.type === x.Fragment || e.type === et, Xo = (e) => e === void 0 || typeof e == "string" && e !== "", an = (e, r, n, t) => {
  const s = x.Children.toArray(e).reduce((i, o) => {
    var a, c;
    if (/* @__PURE__ */ x.isValidElement(o)) {
      if (qo(o)) {
        if (typeof o.props != "object" || o.props === null)
          throw new Error("Got an invalid element for screen.");
        if (typeof o.props.name != "string" || o.props.name === "")
          throw new Error(`Got an invalid name (${JSON.stringify(o.props.name)}) for the screen. It must be a non-empty string.`);
        if (o.props.navigationKey !== void 0 && (typeof o.props.navigationKey != "string" || o.props.navigationKey === ""))
          throw new Error(`Got an invalid 'navigationKey' prop (${JSON.stringify(o.props.navigationKey)}) for the screen '${o.props.name}'. It must be a non-empty string or 'undefined'.`);
        return i.push({
          keys: [r, o.props.navigationKey],
          options: n,
          layout: t,
          props: o.props
        }), i;
      }
      if (Ho(o)) {
        if (!Xo(o.props.navigationKey))
          throw new Error(`Got an invalid 'navigationKey' prop (${JSON.stringify(o.props.navigationKey)}) for the group. It must be a non-empty string or 'undefined'.`);
        return i.push(...an(
          o.props.children,
          o.props.navigationKey,
          // FIXME
          // @ts-expect-error: add validation
          o.type !== et ? n : n != null ? [...n, o.props.screenOptions] : [o.props.screenOptions],
          typeof o.props.screenLayout == "function" ? o.props.screenLayout : t
        )), i;
      }
    }
    throw new Error(`A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children (found ${/* @__PURE__ */ x.isValidElement(o) ? `'${typeof o.type == "string" ? o.type : (a = o.type) == null ? void 0 : a.name}'${o.props != null && typeof o.props == "object" && "name" in o.props && ((c = o.props) != null && c.name) ? ` for the screen '${o.props.name}'` : ""}` : typeof o == "object" ? JSON.stringify(o) : `'${String(o)}'`}). To render this component in the navigator, pass it in the 'component' prop to 'Screen'.`);
  }, []);
  return process.env.NODE_ENV !== "production" && s.forEach((i) => {
    const {
      name: o,
      children: a,
      component: c,
      getComponent: u
    } = i.props;
    if (a != null || c !== void 0 || u !== void 0) {
      if (a != null && c !== void 0)
        throw new Error(`Got both 'component' and 'children' props for the screen '${o}'. You must pass only one of them.`);
      if (a != null && u !== void 0)
        throw new Error(`Got both 'getComponent' and 'children' props for the screen '${o}'. You must pass only one of them.`);
      if (c !== void 0 && u !== void 0)
        throw new Error(`Got both 'component' and 'getComponent' props for the screen '${o}'. You must pass only one of them.`);
      if (a != null && typeof a != "function")
        throw new Error(`Got an invalid value for 'children' prop for the screen '${o}'. It must be a function returning a React Element.`);
      if (c !== void 0 && !Lt.isValidElementType(c))
        throw new Error(`Got an invalid value for 'component' prop for the screen '${o}'. It must be a valid React Component.`);
      if (u !== void 0 && typeof u != "function")
        throw new Error(`Got an invalid value for 'getComponent' prop for the screen '${o}'. It must be a function returning a React Component.`);
      typeof c == "function" && (c.name === "component" ? console.warn(`Looks like you're passing an inline function for 'component' prop for the screen '${o}' (e.g. component={() => <SomeComponent />}). Passing an inline function will cause the component state to be lost on re-render and cause perf issues since it's re-created every render. You can pass the function as children to 'Screen' instead to achieve the desired behaviour.`) : /^[a-z]/.test(c.name) && console.warn(`Got a component with the name '${c.name}' for the screen '${o}'. React Components must start with an uppercase letter. If you're passing a regular function and not a component, pass it as children to 'Screen' instead. Otherwise capitalize your component's name.`));
    } else
      throw new Error(`Couldn't find a 'component', 'getComponent' or 'children' prop for the screen '${o}'. This can happen if you passed 'undefined'. You likely forgot to export your component from the file it's defined in, or mixed up default import and named import when importing.`);
  }), s;
}, Cr = (e) => {
  if ((e == null ? void 0 : e.state) != null)
    return e.state;
  if (typeof (e == null ? void 0 : e.screen) == "string" && (e == null ? void 0 : e.initial) !== !1)
    return {
      routes: [{
        name: e.screen,
        params: e.params,
        path: e.path
      }]
    };
};
function Ut(e, r) {
  const n = Wo(), t = x.useContext(Me), s = typeof (t == null ? void 0 : t.params) == "object" && t.params != null ? Et in t.params && t.params[Et] === t.params : !1, {
    children: i,
    layout: o,
    screenOptions: a,
    screenLayout: c,
    screenListeners: u,
    UNSTABLE_router: l,
    ...f
  } = r, p = an(i), b = Lo(() => {
    if (f.initialRouteName != null && p.every((V) => V.props.name !== f.initialRouteName))
      throw new Error(`Couldn't find a screen named '${f.initialRouteName}' to use as 'initialRouteName'.`);
    const A = e(f);
    if (l != null) {
      const V = l(A);
      return {
        ...A,
        ...V
      };
    }
    return A;
  }), y = p.reduce((A, V) => {
    if (V.props.name in A)
      throw new Error(`A navigator cannot contain multiple 'Screen' components with the same name (found duplicate screen named '${V.props.name}')`);
    return A[V.props.name] = V, A;
  }, {}), d = p.map((A) => A.props.name), v = d.reduce((A, V) => (A[V] = y[V].keys.map((Z) => Z ?? "").join(":"), A), {}), E = d.reduce((A, V) => {
    const {
      initialParams: Z
    } = y[V].props;
    return A[V] = Z, A;
  }, {}), m = d.reduce((A, V) => Object.assign(A, {
    [V]: y[V].props.getId
  }), {});
  if (!d.length)
    throw new Error("Couldn't find any screens for the navigator. Have you defined any screens as its children?");
  const g = x.useCallback((A) => A.type === void 0 || A.type === b.type, [b.type]), h = x.useCallback((A) => A !== void 0 && A.stale === !1 && g(A), [g]), w = x.useCallback((A) => A.routes.every((V) => !d.includes(V.name)), [d]), {
    state: C,
    getState: R,
    setState: k,
    setKey: I,
    getKey: P,
    getIsInitial: U
  } = x.useContext(Ue), O = x.useRef(!1), N = x.useRef(void 0), T = ae((A) => {
    if (O.current) {
      N.current = A;
      return;
    }
    k(A);
  }), [_, $, L, H] = x.useMemo(() => {
    var V, Z, Ye;
    if (O.current && N.current && g(N.current))
      return [void 0, h(N.current) ? N.current : b.getRehydratedState(N.current, {
        routeNames: d,
        routeParamList: E,
        routeGetIdList: m
      }), !1, void 0];
    const A = d.reduce((Ee, te) => {
      var Yt, qt, Ht;
      const {
        initialParams: se
      } = y[te].props, be = ((Yt = t == null ? void 0 : t.params) == null ? void 0 : Yt.state) == null && ((qt = t == null ? void 0 : t.params) == null ? void 0 : qt.initial) !== !1 && ((Ht = t == null ? void 0 : t.params) == null ? void 0 : Ht.screen) === te ? t.params.params : void 0;
      return Ee[te] = se !== void 0 || be !== void 0 ? {
        ...se,
        ...be
      } : void 0, Ee;
    }, {});
    if ((C === void 0 || !g(C)) && ((V = t == null ? void 0 : t.params) == null ? void 0 : V.state) == null && !(typeof ((Z = t == null ? void 0 : t.params) == null ? void 0 : Z.screen) == "string" && ((Ye = t == null ? void 0 : t.params) == null ? void 0 : Ye.initial) !== !1) && !s)
      return [void 0, b.getInitialState({
        routeNames: d,
        routeParamList: A,
        routeGetIdList: m
      }), !0, void 0];
    {
      const Ee = s || t == null ? void 0 : t.params, se = (Ee ? Cr(Ee) : void 0) ?? C, be = se == null ? b.getInitialState({
        routeNames: d,
        routeParamList: A,
        routeGetIdList: m
      }) : b.getRehydratedState(se, {
        routeNames: d,
        routeParamList: A,
        routeGetIdList: m
      });
      return se != null && r.UNSTABLE_routeNamesChangeBehavior === "lastUnhandled" && w(se) ? [se, be, !0, Ee] : [void 0, be, !1, Ee];
    }
  }, [C, b, g]), q = x.useRef(v);
  x.useEffect(() => {
    q.current = v;
  });
  const Q = q.current, [K, ie] = x.useState(_);
  r.UNSTABLE_routeNamesChangeBehavior === "lastUnhandled" && _ && K !== _ && ie(_);
  let B = (
    // If the state isn't initialized, or stale, use the state we initialized instead
    // The state won't update until there's a change needed in the state we have initialized locally
    // So it'll be `undefined` or stale until the first navigation event happens
    h(C) ? C : $
  ), ce = B, Ce = !1;
  K != null && K.routes.every((A) => d.includes(A.name)) && (B != null && B.routes.every((A) => !d.includes(A.name))) ? (Ce = !0, ce = b.getRehydratedState(K, {
    routeNames: d,
    routeParamList: E,
    routeGetIdList: m
  })) : (!it(B.routeNames, d) || !Kr(v, Q)) && (ce = b.getStateForRouteNamesChange(B, {
    routeNames: d,
    routeParamList: E,
    routeGetIdList: m,
    routeKeyChanges: Object.keys(v).filter((A) => A in Q && v[A] !== Q[A])
  }));
  let de = (t == null ? void 0 : t.params) === H;
  if (t != null && t.params && !de) {
    let A;
    if (typeof t.params.state == "object" && t.params.state != null && !s)
      de = !0, r.UNSTABLE_routeNamesChangeBehavior === "lastUnhandled" && w(t.params.state) ? t.params.state !== K && ie(t.params.state) : A = nt(t.params.state);
    else if (typeof t.params.screen == "string" && (t.params.initial === !1 && L || !s))
      if (de = !0, r.UNSTABLE_routeNamesChangeBehavior === "lastUnhandled" && !d.includes(t.params.screen)) {
        const Z = Cr(t.params);
        Z != null && !rn(Z, K) && ie(Z);
      } else
        A = Bt({
          name: t.params.screen,
          params: t.params.params,
          path: t.params.path,
          merge: t.params.merge,
          pop: t.params.pop
        });
    const V = A ? b.getStateForAction(ce, A, {
      routeNames: d,
      routeParamList: E,
      routeGetIdList: m
    }) : null;
    ce = V !== null ? b.getRehydratedState(V, {
      routeNames: d,
      routeParamList: E,
      routeGetIdList: m
    }) : ce;
  }
  x.useEffect(() => {
    de && typeof (t == null ? void 0 : t.params) == "object" && t.params != null && Object.defineProperty(t.params, Et, {
      value: t.params,
      enumerable: !1
    });
  }, [de, t == null ? void 0 : t.params]);
  const D = B !== ce;
  Yo(() => {
    D && (T(ce), Ce && ie(void 0));
  }), B = ce, x.useEffect(() => {
    N.current = B;
  });
  const Ae = x.useRef(null);
  x.useEffect(() => (O.current = !1, I(n), !U() && Ae.current !== B && (T(B), Ae.current = B), () => {
    R() !== void 0 && P() === n && (k(void 0), O.current = !0);
  }), []);
  const Oe = x.useRef(B);
  Oe.current = B, nn(() => {
    Oe.current = null;
  });
  const F = ae(() => {
    const A = R();
    return Qe(h(A) ? A : $);
  }), G = Br((A) => {
    const V = [];
    let Z;
    if (A.target ? (Z = B.routes.find((te) => te.key === A.target), Z != null && Z.name && V.push(Z.name)) : (Z = B.routes[B.index], V.push(...Object.keys(y).filter((te) => (Z == null ? void 0 : Z.name) === te))), Z == null)
      return;
    const Ye = We[Z.key].navigation;
    [].concat(
      ...[u, ...V.map((te) => {
        const {
          listeners: se
        } = y[te].props;
        return se;
      })].map((te) => {
        const se = typeof te == "function" ? te({
          route: Z,
          navigation: Ye
        }) : te;
        return se ? Object.keys(se).filter((be) => be === A.type).map((be) => se == null ? void 0 : se[be]) : void 0;
      })
    ).filter((te, se, be) => te && be.lastIndexOf(te) === se).forEach((te) => te == null ? void 0 : te(A));
  });
  Fo({
    state: B,
    emitter: G
  }), x.useEffect(() => {
    G.emit({
      type: "state",
      data: {
        state: B
      }
    });
  }, [G, B]);
  const {
    listeners: ee,
    addListener: fe
  } = jr(), {
    keyedListeners: ye,
    addKeyedListener: pe
  } = Dr(), M = Vo({
    router: b,
    getState: F,
    setState: T,
    key: t == null ? void 0 : t.key,
    actionListeners: ee.action,
    beforeRemoveListeners: ye.beforeRemove,
    routerConfigOptions: {
      routeNames: d,
      routeParamList: E,
      routeGetIdList: m
    },
    emitter: G
  }), z = Ko({
    router: b,
    key: t == null ? void 0 : t.key,
    getState: F,
    setState: T
  }), me = x.useContext(Mr), he = ae((A) => {
    if (r.UNSTABLE_routeNamesChangeBehavior === "lastUnhandled" && A.type === "NAVIGATE" && A.payload != null && "name" in A.payload && typeof A.payload.name == "string" && !d.includes(A.payload.name)) {
      const V = {
        routes: [{
          name: A.payload.name,
          params: "params" in A.payload && typeof A.payload.params == "object" && A.payload.params !== null ? A.payload.params : void 0,
          path: "path" in A.payload && typeof A.payload.path == "string" ? A.payload.path : void 0
        }]
      };
      ie(V);
    }
    me == null || me(A);
  }), ne = $o({
    id: r.id,
    onAction: M,
    onUnhandledAction: he,
    getState: F,
    emitter: G,
    router: b,
    stateRef: Oe
  });
  _o({
    navigation: ne,
    focusedListeners: ee.focus
  }), Uo({
    getState: F,
    getStateListeners: ye.getState
  });
  const {
    describe: lt,
    descriptors: We
  } = Io({
    state: B,
    screens: y,
    navigation: ne,
    screenOptions: a,
    screenLayout: c,
    onAction: M,
    getState: F,
    setState: T,
    onRouteFocus: z,
    addListener: fe,
    addKeyedListener: pe,
    router: b,
    // @ts-expect-error: this should have both core and custom events, but too much work right now
    emitter: G
  });
  Oo({
    state: B,
    navigation: ne,
    descriptors: We
  });
  const Sn = Ao((A) => {
    const V = o != null ? o({
      state: B,
      descriptors: We,
      navigation: ne,
      children: A
    }) : A;
    return /* @__PURE__ */ S(go.Provider, {
      value: void 0,
      children: /* @__PURE__ */ S(Zr.Provider, {
        value: ne,
        children: /* @__PURE__ */ S(Go, {
          state: B,
          children: /* @__PURE__ */ S(Qr.Provider, {
            value: B.routes[B.index].key,
            children: /* @__PURE__ */ S(xo, {
              children: V
            })
          })
        })
      })
    });
  });
  return {
    state: B,
    navigation: ne,
    describe: lt,
    descriptors: We,
    NavigationContent: Sn
  };
}
function da() {
  const e = x.useRef(null);
  return e.current == null && (e.current = Gn()), e.current;
}
function Jo() {
  const e = x.useContext(Ft);
  if (e == null)
    throw new Error("Couldn't find the prevent remove context. Is your component inside NavigationContent?");
  return e;
}
function fa(e, r) {
  const [n] = x.useState(() => Vt()), t = ct(), {
    key: s
  } = en(), {
    setPreventRemove: i
  } = Jo();
  x.useEffect(() => (i(n, s, e), () => {
    i(n, s, !1);
  }), [i, n, s, e]);
  const o = ae((a) => {
    e && (a.preventDefault(), r({
      data: a.data
    }));
  });
  x.useEffect(() => t == null ? void 0 : t.addListener("beforeRemove", o), [t, o]);
}
const pa = () => {
  if (Ke($e) !== void 0)
    return ct();
  throw new Error(
    "Couldn't find a navigation object. Is your component inside a navigator?"
  );
}, cn = kn({
  options: {
    enabled: !1
  }
}), Kt = () => Ke(cn), Zo = {
  dark: !1,
  colors: {
    primary: "rgb(0, 122, 255)",
    background: "rgb(255, 255, 255)",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(216, 216, 216)",
    notification: "rgb(255, 59, 48)"
  }
}, Qo = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let Er = (e = 21) => {
  let r = "", n = crypto.getRandomValues(new Uint8Array(e |= 0));
  for (; e--; )
    r += Qo[n[e] & 63];
  return r;
};
const es = () => {
  let e = 0, r = [];
  const n = [], t = () => {
    n.forEach((i) => {
      const o = i.cb;
      i.cb = () => o(!0);
    });
  }, s = {
    get index() {
      var o;
      const i = (o = window.history.state) == null ? void 0 : o.id;
      if (i) {
        const a = r.findIndex((c) => c.id === i);
        return a > -1 ? a : 0;
      }
      return 0;
    },
    get(i) {
      return r[i];
    },
    backIndex({ path: i }) {
      for (let o = e - 1; o >= 0; o--)
        if (r[o].path === i)
          return o;
      return -1;
    },
    push({ path: i, state: o }) {
      t();
      const a = Er();
      r = r.slice(0, e + 1), r.push({ path: i, state: o, id: a }), e = r.length - 1, window.history.pushState({ id: a }, "", i);
    },
    replace({ path: i, state: o }) {
      var l;
      t();
      const a = ((l = window.history.state) == null ? void 0 : l.id) ?? Er();
      let c = i;
      const u = c.includes("#") ? "" : location.hash;
      !r.length || r.findIndex((f) => f.id === a) < 0 ? (c = c + u, r = [{ path: c, state: o, id: a }], e = 0) : (r[e].path === i && (c = c + u), r[e] = { path: i, state: o, id: a }), window.history.replaceState({ id: a }, "", c);
    },
    go(i) {
      t();
      const o = e + i, a = r.length - 1;
      if (i < 0 && !r[o] ? (i = -e, e = 0) : i > 0 && o > a ? (i = a - e, e = a) : e = o, i !== 0)
        return new Promise((c, u) => {
          const l = (b) => {
            if (clearTimeout(f), b) {
              u(new Error("History was changed during navigation."));
              return;
            }
            const { title: y } = window.document;
            window.document.title = "", window.document.title = y, c();
          };
          n.push({ ref: l, cb: l });
          const f = setTimeout(() => {
            const b = n.findIndex((y) => y.ref === l);
            b > -1 && (n[b].cb(), n.splice(b, 1)), e = s.index;
          }, 100), p = () => {
            e = s.index;
            const b = n.pop();
            window.removeEventListener("popstate", p), b == null || b.cb();
          };
          window.addEventListener("popstate", p), window.history.go(i);
        });
    },
    listen(i) {
      const o = () => {
        e = s.index, !n.length && i();
      };
      return window.addEventListener("popstate", o), () => window.removeEventListener("popstate", o);
    }
  };
  return s;
}, tt = (e) => {
  const r = e.history ? e.history.length : e.routes.length, n = e.routes.reduce((t, s) => {
    var i;
    return t + (((i = s.history) == null ? void 0 : i.length) || 0);
  }, 0);
  return r + n;
}, un = (e, r) => {
  var c, u;
  if (e === void 0 || r === void 0 || e.key !== r.key)
    return [void 0, void 0];
  const n = tt(e), t = tt(r), s = e.routes[e.index], i = r.routes[r.index], o = s.state, a = i.state;
  return n !== t || s.key !== i.key || (((c = s.history) == null ? void 0 : c.length) || 0) !== (((u = i.history) == null ? void 0 : u.length) || 0) || o === void 0 || a === void 0 || o.key !== a.key ? [e, r] : un(o, a);
}, ts = (e) => {
  let r = Promise.resolve();
  return () => {
    r = r.then(e);
  };
}, Rt = /* @__PURE__ */ new Set(), rs = (e, {
  enabled: r = !0,
  config: n,
  getStateFromPath: t = Xr,
  getPathFromState: s = zt,
  getActionFromState: i = Vr
}) => {
  xe(() => {
    if (process.env.NODE_ENV === "production")
      return;
    r !== !1 && Rt.size && console.error(
      "Multiple NavigationContainers with linking enabled detected. Deep links should only be handled in one place."
    );
    const E = Symbol();
    return r !== !1 && Rt.add(E), () => {
      Rt.delete(E);
    };
  }, [r]);
  const [o] = we(es), a = J(r), c = J(n), u = J(t), l = J(s), f = J(i);
  xe(() => {
    a.current = r, c.current = n, u.current = t, l.current = s, f.current = i;
  });
  const p = le(
    (E) => {
      const m = e.current, g = m == null ? void 0 : m.getRootState();
      return E == null ? void 0 : E.routes.some((h) => !(g != null && g.routeNames.includes(h.name)));
    },
    [e]
  ), b = le(() => {
    let E;
    if (a.current) {
      const m = typeof window < "u" ? window.location : void 0, g = m ? m.pathname + m.search : void 0;
      g && (E = u.current(g, c.current));
    }
    return {
      then(m) {
        return Promise.resolve(m ? m(E) : E);
      }
    };
  }, []), y = J(void 0), d = J(void 0), v = J(void 0);
  return xe(() => (y.current = o.index, o.listen(() => {
    const E = e.current;
    if (!E || !r)
      return;
    const { location: m } = window, g = m.pathname + m.search, h = o.index, w = y.current ?? 0;
    y.current = h, v.current = g;
    const C = o.get(h);
    if ((C == null ? void 0 : C.path) === g && (C != null && C.state)) {
      E.resetRoot(C.state);
      return;
    }
    const R = u.current(g, c.current);
    if (R) {
      if (p(R))
        return;
      if (h > w) {
        const k = f.current(R, c.current);
        if (k !== void 0)
          try {
            E.dispatch(k);
          } catch (I) {
            console.warn(`Error handling link '${g}': ${I.message}`);
          }
        else
          E.resetRoot(R);
      } else
        E.resetRoot(R);
    } else
      E.resetRoot(R);
  })), [r, o, e, p]), xe(() => {
    var g;
    if (!r)
      return;
    const E = (h, w) => {
      let C;
      if (h != null && h.path) {
        const k = u.current(h.path, c.current);
        if (k) {
          const I = _e(k);
          I && I.name === h.name && rn(I.params, h.params) && (C = h.path);
        }
      }
      C == null && (C = l.current(w, c.current));
      const R = d.current ? _e(d.current) : void 0;
      return R && h && "key" in R && "key" in h && R.key === h.key && (C = C + location.hash), C;
    };
    if (e.current) {
      const h = e.current.getRootState();
      if (h) {
        const w = _e(h), C = E(w, h);
        d.current === void 0 && (d.current = h), o.replace({ path: C, state: h });
      }
    }
    const m = async () => {
      const h = e.current;
      if (!h || !r)
        return;
      const w = d.current, C = h.getRootState();
      if (!C)
        return;
      const R = v.current, k = _e(C), I = E(k, C);
      d.current = C, v.current = void 0;
      const [P, U] = un(w, C);
      if (P && U && I !== R) {
        const O = tt(U) - tt(P);
        if (O > 0)
          o.push({ path: I, state: C });
        else if (O < 0) {
          const N = o.backIndex({ path: I }), T = o.index;
          try {
            N !== -1 && N < T && o.get(N) ? await o.go(N - T) : await o.go(O), o.replace({ path: I, state: C });
          } catch {
          }
        } else
          o.replace({ path: I, state: C });
      } else
        o.replace({ path: I, state: C });
    };
    return (g = e.current) == null ? void 0 : g.addListener("state", ts(m));
  }, [r, o, e]), {
    getInitialState: b
  };
}, ns = (e, r = {}) => {
  const { enabled: n = !0, formatter: t = (i, o) => (i == null ? void 0 : i.title) ?? (o == null ? void 0 : o.name) } = r, s = J({});
  xe(() => {
    if (!n)
      return;
    const i = e.current;
    if (!i)
      return;
    const o = () => {
      const u = i.getRootState();
      if (!u)
        return;
      const l = _e(u), f = l != null && l.key ? s.current[l.key] : void 0, p = t(f, l);
      p && (document.title = p);
    };
    o();
    const a = i.addListener("state", o), c = i.addListener("options", (u) => {
      var l;
      (l = u.data) != null && l.options && u.target && (s.current[u.target] = u.data.options, o());
    });
    return () => {
      a(), c == null || c();
    };
  }, [n, t, e]);
}, os = (e) => {
  const r = J();
  if (!r.current) {
    r.current = { promise: null, resolved: !1, value: void 0 };
    const n = e();
    n ? r.current.promise = n.then((t) => (r.current.resolved = !0, r.current.value = t, t)) : r.current.resolved = !0;
  }
  if (!r.current.resolved && r.current.promise)
    throw r.current.promise;
  return [r.current.resolved, r.current.value];
}, ss = ({
  direction: e = "ltr",
  theme: r = Zo,
  linking: n,
  fallback: t = null,
  documentTitle: s,
  onStateChange: i,
  initialState: o,
  children: a,
  ...c
}, u) => {
  n != null && n.config && at(n.config);
  const l = J(null);
  ns(l, s);
  const f = kt(() => n == null ? {
    options: {
      enabled: !1
    }
  } : {
    options: {
      ...n,
      enabled: n.enabled !== !1,
      prefixes: n.prefixes ?? ["*"],
      getStateFromPath: (n == null ? void 0 : n.getStateFromPath) ?? Xr,
      getPathFromState: (n == null ? void 0 : n.getPathFromState) ?? zt,
      getActionFromState: (n == null ? void 0 : n.getActionFromState) ?? Vr
    }
  }, [n]), { getInitialState: p } = rs(l, f.options);
  An(u, () => l.current);
  const [b, y] = os(() => {
    if (!(o != null || !f.options.enabled))
      return p();
  });
  return o != null || b ? /* @__PURE__ */ S("div", { dir: e, style: { height: "100%" }, children: /* @__PURE__ */ S(cn.Provider, { value: f, children: /* @__PURE__ */ S(
    Yn,
    {
      ...c,
      theme: r,
      initialState: o ?? y,
      onStateChange: (v) => {
        i == null || i(v);
      },
      ref: l,
      children: a
    }
  ) }) }) : /* @__PURE__ */ S("div", { dir: e, children: /* @__PURE__ */ S($r, { value: r, children: t }) });
}, as = ke(ss);
as.displayName = "NavigationContainer";
const is = () => {
  const e = Ke(ot), r = Kt(), n = le(
    (s, i) => {
      var l, f;
      if (!(e != null && e.isReady()))
        return;
      const o = e.getRootState();
      if (!o)
        return;
      const c = {
        ...o,
        routes: [{
          name: s,
          params: i
        }],
        index: 0
      }, u = ((l = r == null ? void 0 : r.options) == null ? void 0 : l.getPathFromState) ?? zt;
      try {
        return u(c, (f = r == null ? void 0 : r.options) == null ? void 0 : f.config);
      } catch {
        return;
      }
    },
    [e, r]
  ), t = le(
    (s) => {
      var o, a;
      if (!((o = r == null ? void 0 : r.options) != null && o.getActionFromState) || !((a = r == null ? void 0 : r.options) != null && a.getStateFromPath))
        return;
      const i = r.options.getStateFromPath(s, r.options.config);
      if (i)
        return r.options.getActionFromState(i, r.options.config);
    },
    [r]
  );
  return {
    buildHref: n,
    buildAction: t
  };
}, cs = ({ screen: e, params: r, action: n, href: t }) => {
  const s = Ke($e), { buildHref: i, buildAction: o } = is(), a = Kt(), c = kt(() => {
    if (t)
      return t;
    if (e)
      return i(e, r);
  }, [t, e, r, i]), u = kt(() => (l) => {
    var f, p;
    if (!(l != null && l.metaKey || l != null && l.altKey || l != null && l.ctrlKey || l != null && l.shiftKey)) {
      if ((f = l == null ? void 0 : l.preventDefault) == null || f.call(l), !s) {
        console.warn("Navigation not ready for Link press");
        return;
      }
      if (n)
        s.dispatch(n);
      else if (t && ((p = a == null ? void 0 : a.options) != null && p.enabled)) {
        const b = o(t);
        b && s.dispatch(b);
      } else e && s.dispatch(Bt(e, r));
    }
  }, [n, t, e, r, s, a, o]);
  return {
    href: c,
    onPress: u,
    accessibilityRole: "link"
  };
}, us = ke(({
  screen: e,
  params: r,
  action: n,
  href: t,
  style: s,
  className: i,
  children: o,
  target: a,
  ...c
}, u) => {
  const { colors: l } = Pe(), f = cs({ screen: e, params: r, action: n, href: t }), p = (b) => {
    var y;
    a || ((y = c.onClick) == null || y.call(c, b), b.defaultPrevented || f.onPress(b));
  };
  return /* @__PURE__ */ S(
    "a",
    {
      ref: u,
      href: f.href,
      onClick: p,
      target: a,
      className: i,
      style: {
        color: l.primary,
        textDecoration: "none",
        cursor: "pointer",
        ...s
      },
      ...c,
      children: o
    }
  );
});
us.displayName = "Link";
const ma = () => {
  const e = Ke(ot), r = Kt();
  return le(
    (t, s) => {
      var l;
      if (!(e != null && e.isReady()))
        throw new Error(
          "useLinkTo: Navigation is not ready yet"
        );
      if (!((l = r == null ? void 0 : r.options) != null && l.enabled))
        throw new Error(
          "useLinkTo requires linking to be enabled in NavigationContainer"
        );
      const { getStateFromPath: i, getActionFromState: o, config: a } = r.options, c = i(t, a);
      if (!c)
        throw new Error(`Failed to parse path: ${t}`);
      const u = o(c, a);
      u ? s != null && s.reset ? e.dispatch(nt(c)) : e.dispatch(u) : e.reset(c);
    },
    [e, r]
  );
}, ha = {
  dark: !0,
  colors: {
    primary: "rgb(10, 132, 255)",
    background: "rgb(0, 0, 0)",
    card: "rgb(28, 28, 30)",
    text: "rgb(255, 255, 255)",
    border: "rgb(39, 39, 41)",
    notification: "rgb(255, 69, 58)"
  }
};
function ln(e) {
  var r, n, t = "";
  if (typeof e == "string" || typeof e == "number") t += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (r = 0; r < s; r++) e[r] && (n = ln(e[r])) && (t && (t += " "), t += n);
  } else for (n in e) e[n] && (t && (t += " "), t += n);
  return t;
}
function dn() {
  for (var e, r, n = 0, t = "", s = arguments.length; n < s; n++) (e = arguments[n]) && (r = ln(e)) && (t && (t += " "), t += r);
  return t;
}
const Rr = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Sr = dn, fn = (e, r) => (n) => {
  var t;
  if ((r == null ? void 0 : r.variants) == null) return Sr(e, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
  const { variants: s, defaultVariants: i } = r, o = Object.keys(s).map((u) => {
    const l = n == null ? void 0 : n[u], f = i == null ? void 0 : i[u];
    if (l === null) return null;
    const p = Rr(l) || Rr(f);
    return s[u][p];
  }), a = n && Object.entries(n).reduce((u, l) => {
    let [f, p] = l;
    return p === void 0 || (u[f] = p), u;
  }, {}), c = r == null || (t = r.compoundVariants) === null || t === void 0 ? void 0 : t.reduce((u, l) => {
    let { class: f, className: p, ...b } = l;
    return Object.entries(b).every((y) => {
      let [d, v] = y;
      return Array.isArray(v) ? v.includes({
        ...i,
        ...a
      }[d]) : {
        ...i,
        ...a
      }[d] === v;
    }) ? [
      ...u,
      f,
      p
    ] : u;
  }, []);
  return Sr(e, o, c, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
}, Wt = "-", ls = (e) => {
  const r = fs(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: t
  } = e;
  return {
    getClassGroupId: (o) => {
      const a = o.split(Wt);
      return a[0] === "" && a.length !== 1 && a.shift(), pn(a, r) || ds(o);
    },
    getConflictingClassGroupIds: (o, a) => {
      const c = n[o] || [];
      return a && t[o] ? [...c, ...t[o]] : c;
    }
  };
}, pn = (e, r) => {
  var o;
  if (e.length === 0)
    return r.classGroupId;
  const n = e[0], t = r.nextPart.get(n), s = t ? pn(e.slice(1), t) : void 0;
  if (s)
    return s;
  if (r.validators.length === 0)
    return;
  const i = e.join(Wt);
  return (o = r.validators.find(({
    validator: a
  }) => a(i))) == null ? void 0 : o.classGroupId;
}, kr = /^\[(.+)\]$/, ds = (e) => {
  if (kr.test(e)) {
    const r = kr.exec(e)[1], n = r == null ? void 0 : r.substring(0, r.indexOf(":"));
    if (n)
      return "arbitrary.." + n;
  }
}, fs = (e) => {
  const {
    theme: r,
    prefix: n
  } = e, t = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return ms(Object.entries(e.classGroups), n).forEach(([i, o]) => {
    $t(o, t, i, r);
  }), t;
}, $t = (e, r, n, t) => {
  e.forEach((s) => {
    if (typeof s == "string") {
      const i = s === "" ? r : Ar(r, s);
      i.classGroupId = n;
      return;
    }
    if (typeof s == "function") {
      if (ps(s)) {
        $t(s(t), r, n, t);
        return;
      }
      r.validators.push({
        validator: s,
        classGroupId: n
      });
      return;
    }
    Object.entries(s).forEach(([i, o]) => {
      $t(o, Ar(r, i), n, t);
    });
  });
}, Ar = (e, r) => {
  let n = e;
  return r.split(Wt).forEach((t) => {
    n.nextPart.has(t) || n.nextPart.set(t, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), n = n.nextPart.get(t);
  }), n;
}, ps = (e) => e.isThemeGetter, ms = (e, r) => r ? e.map(([n, t]) => {
  const s = t.map((i) => typeof i == "string" ? r + i : typeof i == "object" ? Object.fromEntries(Object.entries(i).map(([o, a]) => [r + o, a])) : i);
  return [n, s];
}) : e, hs = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, n = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  const s = (i, o) => {
    n.set(i, o), r++, r > e && (r = 0, t = n, n = /* @__PURE__ */ new Map());
  };
  return {
    get(i) {
      let o = n.get(i);
      if (o !== void 0)
        return o;
      if ((o = t.get(i)) !== void 0)
        return s(i, o), o;
    },
    set(i, o) {
      n.has(i) ? n.set(i, o) : s(i, o);
    }
  };
}, mn = "!", ys = (e) => {
  const {
    separator: r,
    experimentalParseClassName: n
  } = e, t = r.length === 1, s = r[0], i = r.length, o = (a) => {
    const c = [];
    let u = 0, l = 0, f;
    for (let v = 0; v < a.length; v++) {
      let E = a[v];
      if (u === 0) {
        if (E === s && (t || a.slice(v, v + i) === r)) {
          c.push(a.slice(l, v)), l = v + i;
          continue;
        }
        if (E === "/") {
          f = v;
          continue;
        }
      }
      E === "[" ? u++ : E === "]" && u--;
    }
    const p = c.length === 0 ? a : a.substring(l), b = p.startsWith(mn), y = b ? p.substring(1) : p, d = f && f > l ? f - l : void 0;
    return {
      modifiers: c,
      hasImportantModifier: b,
      baseClassName: y,
      maybePostfixModifierPosition: d
    };
  };
  return n ? (a) => n({
    className: a,
    parseClassName: o
  }) : o;
}, gs = (e) => {
  if (e.length <= 1)
    return e;
  const r = [];
  let n = [];
  return e.forEach((t) => {
    t[0] === "[" ? (r.push(...n.sort(), t), n = []) : n.push(t);
  }), r.push(...n.sort()), r;
}, bs = (e) => ({
  cache: hs(e.cacheSize),
  parseClassName: ys(e),
  ...ls(e)
}), vs = /\s+/, xs = (e, r) => {
  const {
    parseClassName: n,
    getClassGroupId: t,
    getConflictingClassGroupIds: s
  } = r, i = [], o = e.trim().split(vs);
  let a = "";
  for (let c = o.length - 1; c >= 0; c -= 1) {
    const u = o[c], {
      modifiers: l,
      hasImportantModifier: f,
      baseClassName: p,
      maybePostfixModifierPosition: b
    } = n(u);
    let y = !!b, d = t(y ? p.substring(0, b) : p);
    if (!d) {
      if (!y) {
        a = u + (a.length > 0 ? " " + a : a);
        continue;
      }
      if (d = t(p), !d) {
        a = u + (a.length > 0 ? " " + a : a);
        continue;
      }
      y = !1;
    }
    const v = gs(l).join(":"), E = f ? v + mn : v, m = E + d;
    if (i.includes(m))
      continue;
    i.push(m);
    const g = s(d, y);
    for (let h = 0; h < g.length; ++h) {
      const w = g[h];
      i.push(E + w);
    }
    a = u + (a.length > 0 ? " " + a : a);
  }
  return a;
};
function ws() {
  let e = 0, r, n, t = "";
  for (; e < arguments.length; )
    (r = arguments[e++]) && (n = hn(r)) && (t && (t += " "), t += n);
  return t;
}
const hn = (e) => {
  if (typeof e == "string")
    return e;
  let r, n = "";
  for (let t = 0; t < e.length; t++)
    e[t] && (r = hn(e[t])) && (n && (n += " "), n += r);
  return n;
};
function Cs(e, ...r) {
  let n, t, s, i = o;
  function o(c) {
    const u = r.reduce((l, f) => f(l), e());
    return n = bs(u), t = n.cache.get, s = n.cache.set, i = a, a(c);
  }
  function a(c) {
    const u = t(c);
    if (u)
      return u;
    const l = xs(c, n);
    return s(c, l), l;
  }
  return function() {
    return i(ws.apply(null, arguments));
  };
}
const X = (e) => {
  const r = (n) => n[e] || [];
  return r.isThemeGetter = !0, r;
}, yn = /^\[(?:([a-z-]+):)?(.+)\]$/i, Es = /^\d+\/\d+$/, Rs = /* @__PURE__ */ new Set(["px", "full", "screen"]), Ss = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, ks = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, As = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, Os = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Ts = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Re = (e) => Fe(e) || Rs.has(e) || Es.test(e), Te = (e) => je(e, "length", Ms), Fe = (e) => !!e && !Number.isNaN(Number(e)), St = (e) => je(e, "number", Fe), De = (e) => !!e && Number.isInteger(Number(e)), Ns = (e) => e.endsWith("%") && Fe(e.slice(0, -1)), j = (e) => yn.test(e), Ne = (e) => Ss.test(e), Ps = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Is = (e) => je(e, Ps, gn), _s = (e) => je(e, "position", gn), Fs = /* @__PURE__ */ new Set(["image", "url"]), Ls = (e) => je(e, Fs, Bs), $s = (e) => je(e, "", js), Ge = () => !0, je = (e, r, n) => {
  const t = yn.exec(e);
  return t ? t[1] ? typeof r == "string" ? t[1] === r : r.has(t[1]) : n(t[2]) : !1;
}, Ms = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  ks.test(e) && !As.test(e)
), gn = () => !1, js = (e) => Os.test(e), Bs = (e) => Ts.test(e), Ds = () => {
  const e = X("colors"), r = X("spacing"), n = X("blur"), t = X("brightness"), s = X("borderColor"), i = X("borderRadius"), o = X("borderSpacing"), a = X("borderWidth"), c = X("contrast"), u = X("grayscale"), l = X("hueRotate"), f = X("invert"), p = X("gap"), b = X("gradientColorStops"), y = X("gradientColorStopPositions"), d = X("inset"), v = X("margin"), E = X("opacity"), m = X("padding"), g = X("saturate"), h = X("scale"), w = X("sepia"), C = X("skew"), R = X("space"), k = X("translate"), I = () => ["auto", "contain", "none"], P = () => ["auto", "hidden", "clip", "visible", "scroll"], U = () => ["auto", j, r], O = () => [j, r], N = () => ["", Re, Te], T = () => ["auto", Fe, j], _ = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], $ = () => ["solid", "dashed", "dotted", "double", "none"], L = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], H = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], q = () => ["", "0", j], Q = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], K = () => [Fe, j];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Ge],
      spacing: [Re, Te],
      blur: ["none", "", Ne, j],
      brightness: K(),
      borderColor: [e],
      borderRadius: ["none", "", "full", Ne, j],
      borderSpacing: O(),
      borderWidth: N(),
      contrast: K(),
      grayscale: q(),
      hueRotate: K(),
      invert: q(),
      gap: O(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Ns, Te],
      inset: U(),
      margin: U(),
      opacity: K(),
      padding: O(),
      saturate: K(),
      scale: K(),
      sepia: q(),
      skew: K(),
      space: O(),
      translate: O()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", j]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [Ne]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": Q()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": Q()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [..._(), j]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: P()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": P()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": P()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: I()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": I()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": I()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [d]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [d]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [d]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [d]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [d]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [d]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [d]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [d]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [d]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", De, j]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: U()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", j]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: q()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: q()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", De, j]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Ge]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", De, j]
        }, j]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": T()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": T()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [Ge]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [De, j]
        }, j]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": T()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": T()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", j]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", j]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [p]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [p]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [p]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...H()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...H(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...H(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [m]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [m]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [m]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [m]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [m]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [m]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [m]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [m]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [m]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [v]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [v]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [v]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [v]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [v]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [v]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [v]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [v]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [v]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [R]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [R]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", j, r]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [j, r, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [j, r, "none", "full", "min", "max", "fit", "prose", {
          screen: [Ne]
        }, Ne]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [j, r, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [j, r, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [j, r, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [j, r, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", Ne, Te]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", St]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Ge]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", j]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", Fe, St]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Re, j]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", j]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", j]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [e]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [E]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [e]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [E]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...$(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Re, Te]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Re, j]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [e]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: O()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", j]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", j]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [E]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [..._(), _s]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", Is]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Ls]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [e]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [y]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [y]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [y]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [b]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [b]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [b]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [i]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [i]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [i]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [i]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [i]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [i]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [i]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [i]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [i]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [i]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [i]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [i]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [i]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [i]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [i]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [a]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [a]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [a]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [a]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [a]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [a]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [a]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [a]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [a]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [E]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...$(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [a]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [a]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [E]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: $()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [s]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [s]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [s]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [s]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [s]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [s]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [s]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [s]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [s]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [s]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...$()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Re, j]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Re, Te]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [e]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: N()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [e]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [E]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Re, Te]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [e]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", Ne, $s]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Ge]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [E]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...L(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": L()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [n]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [t]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [c]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", Ne, j]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [u]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [l]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [f]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [g]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [w]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [n]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [t]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [c]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [u]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [l]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [f]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [E]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [g]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [w]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [o]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [o]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [o]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", j]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: K()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", j]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: K()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", j]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [h]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [h]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [h]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [De, j]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [k]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [k]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [C]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [C]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", j]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", e]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", j]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [e]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": O()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": O()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": O()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": O()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": O()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": O()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": O()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": O()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": O()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": O()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": O()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": O()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": O()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": O()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": O()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": O()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": O()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": O()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", j]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [e, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [Re, Te, St]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [e, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}, Gs = /* @__PURE__ */ Cs(Ds), re = (...e) => Gs(dn(e)), zs = fn(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), ut = ke(({ className: e, variant: r, size: n, ...t }, s) => /* @__PURE__ */ S(
  "button",
  {
    className: re(zs({ variant: r, size: n, className: e })),
    ref: s,
    ...t
  }
));
ut.displayName = "Button";
const Vs = fn(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
), Us = ({ className: e, variant: r, ...n }) => /* @__PURE__ */ S("div", { className: re(Vs({ variant: r }), e), ...n }), Ks = ({
  label: e,
  icon: r,
  badge: n,
  isFocused: t,
  onPress: s,
  onLongPress: i,
  options: o = {}
}) => {
  const { colors: a } = Pe(), {
    tabBarActiveTintColor: c,
    tabBarInactiveTintColor: u,
    tabBarActiveBackgroundColor: l,
    tabBarInactiveBackgroundColor: f,
    tabBarLabelStyle: p,
    tabBarIconStyle: b,
    tabBarItemStyle: y,
    tabBarBadgeStyle: d,
    tabBarShowLabel: v = !0,
    tabBarLabelPosition: E = "below-icon",
    tabBarAccessibilityLabel: m,
    tabBarButton: g
  } = o, h = c || a.primary, w = u || a.text, C = t ? h : w, I = t ? l || "transparent" : f || "transparent", P = () => {
    if (!r) return null;
    const _ = {
      focused: t,
      color: C,
      size: 24
    };
    if (typeof r == "function") {
      const $ = r(_);
      if ($ != null && $.type)
        return /* @__PURE__ */ S("span", { style: b, children: $ });
    }
    return /* @__PURE__ */ S(
      r,
      {
        className: "h-6 w-6",
        style: { color: C, ...b }
      }
    );
  }, U = () => v ? /* @__PURE__ */ S(
    "span",
    {
      className: re(
        "truncate",
        E === "below-icon" ? "text-xs w-full text-center" : "text-sm ml-2"
      ),
      style: {
        color: C,
        ...p
      },
      children: e
    }
  ) : null, O = () => n == null ? null : /* @__PURE__ */ S(
    Us,
    {
      className: re(
        "absolute top-1 left-1/2 ml-2 h-4 min-w-4 px-1 text-[10px]",
        "flex items-center justify-center"
      ),
      style: {
        backgroundColor: (d == null ? void 0 : d.backgroundColor) || a.notification,
        color: (d == null ? void 0 : d.color) || "#fff"
      },
      children: n
    }
  ), N = /* @__PURE__ */ ue(jt, { children: [
    P(),
    U(),
    O()
  ] }), T = {
    className: re(
      "flex-1 h-auto py-2 rounded-none relative min-w-0",
      "hover:bg-transparent focus:bg-transparent",
      E === "below-icon" ? "flex-col gap-1" : "flex-row items-center justify-center",
      t ? "text-primary" : "text-muted-foreground"
    ),
    style: {
      color: C,
      backgroundColor: I,
      ...y
    },
    onClick: s,
    onContextMenu: (_) => {
      _.preventDefault(), i == null || i();
    },
    "aria-label": m,
    "aria-selected": t,
    role: "tab"
  };
  return g ? g({
    ...T,
    children: N,
    accessibilityState: { selected: t }
  }) : /* @__PURE__ */ S(ut, { variant: "ghost", ...T, children: N });
}, Ws = ({
  state: e,
  navigation: r,
  descriptors: n,
  onTabPress: t,
  // Navigator-level options (from screenOptions)
  tabBarStyle: s,
  tabBarBackground: i,
  tabBarActiveTintColor: o,
  tabBarInactiveTintColor: a,
  tabBarActiveBackgroundColor: c,
  tabBarInactiveBackgroundColor: u,
  tabBarLabelStyle: l,
  tabBarIconStyle: f,
  tabBarItemStyle: p,
  tabBarShowLabel: b,
  tabBarLabelPosition: y,
  style: d,
  className: v
}) => {
  const { colors: E } = Pe();
  return (s == null ? void 0 : s.display) === "none" ? null : /* @__PURE__ */ ue(
    "nav",
    {
      className: re(
        "nextant-tab-bar flex border-t relative",
        "pb-[env(safe-area-inset-bottom)]",
        v
      ),
      style: {
        backgroundColor: (s == null ? void 0 : s.backgroundColor) || E.card,
        borderColor: E.border,
        ...d
      },
      role: "tablist",
      children: [
        i && /* @__PURE__ */ S("div", { className: "absolute inset-0 -z-10", children: typeof i == "function" ? i() : i }),
        e.routes.map((m, g) => {
          const { options: h } = n[m.key], w = e.index === g, C = h.tabBarLabel ?? h.title ?? m.name, R = h.tabBarIcon, k = h.tabBarBadge, I = () => {
            const O = r.emit({
              type: "tabPress",
              target: m.key,
              canPreventDefault: !0
            });
            !w && !O.defaultPrevented && (t == null || t(g));
          }, P = () => {
            r.emit({
              type: "tabLongPress",
              target: m.key
            });
          }, U = {
            tabBarActiveTintColor: h.tabBarActiveTintColor ?? o,
            tabBarInactiveTintColor: h.tabBarInactiveTintColor ?? a,
            tabBarActiveBackgroundColor: h.tabBarActiveBackgroundColor ?? c,
            tabBarInactiveBackgroundColor: h.tabBarInactiveBackgroundColor ?? u,
            tabBarLabelStyle: { ...l, ...h.tabBarLabelStyle },
            tabBarIconStyle: { ...f, ...h.tabBarIconStyle },
            tabBarItemStyle: { ...p, ...h.tabBarItemStyle },
            tabBarBadgeStyle: h.tabBarBadgeStyle,
            tabBarShowLabel: h.tabBarShowLabel ?? b,
            tabBarLabelPosition: h.tabBarLabelPosition ?? y,
            tabBarAccessibilityLabel: h.tabBarAccessibilityLabel,
            tabBarButton: h.tabBarButton
          };
          return /* @__PURE__ */ S(
            Ks,
            {
              label: C,
              icon: R,
              badge: k,
              isFocused: w,
              onPress: I,
              onLongPress: P,
              options: U
            },
            m.key
          );
        })
      ]
    }
  );
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ys = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), bn = (...e) => e.filter((r, n, t) => !!r && r.trim() !== "" && t.indexOf(r) === n).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var qs = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hs = ke(
  ({
    color: e = "currentColor",
    size: r = 24,
    strokeWidth: n = 2,
    absoluteStrokeWidth: t,
    className: s = "",
    children: i,
    iconNode: o,
    ...a
  }, c) => At(
    "svg",
    {
      ref: c,
      ...qs,
      width: r,
      height: r,
      stroke: e,
      strokeWidth: t ? Number(n) * 24 / Number(r) : n,
      className: bn("lucide", s),
      ...a
    },
    [
      ...o.map(([u, l]) => At(u, l)),
      ...Array.isArray(i) ? i : [i]
    ]
  )
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xs = (e, r) => {
  const n = ke(
    ({ className: t, ...s }, i) => At(Hs, {
      ref: i,
      iconNode: r,
      className: bn(`lucide-${Ys(e)}`, t),
      ...s
    })
  );
  return n.displayName = `${e}`, n;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Js = Xs("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]
]), rt = ({
  title: e,
  canGoBack: r,
  onBackPress: n,
  headerLeft: t,
  headerRight: s,
  headerTitle: i,
  headerTitleAlign: o = "center",
  headerBackIcon: a,
  headerBackTitle: c,
  headerBackTitleStyle: u,
  headerBackVisible: l,
  headerTintColor: f,
  headerStyle: p,
  headerTitleStyle: b,
  headerShadowVisible: y = !0,
  headerTransparent: d = !1,
  headerBackground: v,
  className: E
}) => {
  const { colors: m } = Pe(), g = f || m.primary, h = () => {
    const k = a || Js;
    return /* @__PURE__ */ ue(
      ut,
      {
        variant: "ghost",
        size: "icon",
        onClick: n,
        className: re("text-primary", c && "pr-1"),
        style: { color: g },
        "aria-label": "Go back",
        children: [
          /* @__PURE__ */ S(k, { className: "h-6 w-6" }),
          c && /* @__PURE__ */ S(
            "span",
            {
              className: "text-sm ml-1",
              style: {
                color: g,
                ...u
              },
              children: c
            }
          )
        ]
      }
    );
  }, w = () => {
    const k = {
      canGoBack: r,
      onPress: n,
      tintColor: g,
      label: c,
      href: void 0
    };
    if (t) {
      const I = typeof t == "function" ? t(k) : t;
      return l && r ? /* @__PURE__ */ ue(jt, { children: [
        h(),
        I
      ] }) : I;
    }
    return r ? h() : /* @__PURE__ */ S("div", { className: "w-10" });
  }, C = () => s ? typeof s == "function" ? s({
    canGoBack: r,
    tintColor: g
  }) : s : /* @__PURE__ */ S("div", { className: "w-10" }), R = () => {
    if (typeof i == "function")
      return i({
        children: e,
        tintColor: g
      });
    const k = typeof i == "string" ? i : e;
    return /* @__PURE__ */ S(
      "h1",
      {
        className: re(
          "font-semibold text-base truncate px-2",
          o === "center" ? "flex-1 text-center" : "text-left"
        ),
        style: {
          color: m.text,
          ...b
        },
        children: k
      }
    );
  };
  return /* @__PURE__ */ ue(
    "header",
    {
      className: re(
        "nextant-header flex items-center h-14 px-2 shrink-0",
        "pt-[max(0.5rem,env(safe-area-inset-top))]",
        y && "border-b",
        d && "absolute inset-x-0 top-0 z-10",
        E
      ),
      style: {
        backgroundColor: d ? "transparent" : m.card,
        borderColor: y ? m.border : "transparent",
        ...p
      },
      children: [
        v && /* @__PURE__ */ S("div", { className: "absolute inset-0 -z-10", children: typeof v == "function" ? v() : v }),
        /* @__PURE__ */ S("div", { className: "flex items-center shrink-0", children: w() }),
        o === "center" ? R() : /* @__PURE__ */ S("div", { className: "flex-1 flex items-center", children: R() }),
        /* @__PURE__ */ S("div", { className: "flex items-center shrink-0", children: C() })
      ]
    }
  );
}, Se = "cubic-bezier(0.25, 0.46, 0.45, 0.94)", ge = 300, vn = (e, r, n = {}) => {
  if (!e) return null;
  if (typeof e.animate != "function") {
    const s = r[r.length - 1];
    return s && (e.style.transition = `all ${ge}ms ${Se}`, Object.entries(s).forEach(([i, o]) => {
      e.style[i] = o;
    })), {
      addEventListener: (i, o) => {
        i === "finish" && setTimeout(o, n.duration || ge);
      },
      cancel: () => {
      }
    };
  }
  return e.animate(r, {
    duration: ge,
    easing: Se,
    fill: "forwards",
    ...n
  });
}, xn = ({
  onDragStart: e,
  onDragMove: r,
  onDragEnd: n,
  _axis: t = "x",
  enabled: s = !0
}) => {
  const i = J(null), o = J(!1), a = J({ x: 0, y: 0 }), c = J({ x: 0, y: 0 }), u = J({ x: 0, y: 0 }), l = J(0), f = J({ x: 0, y: 0 }), p = le((g, h) => {
    s && (o.current = !0, a.current = { x: g, y: h }, c.current = { x: 0, y: 0 }, f.current = { x: g, y: h }, l.current = Date.now(), u.current = { x: 0, y: 0 }, e == null || e({ offset: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } }));
  }, [s, e]), b = le((g, h) => {
    if (!o.current) return;
    const w = Date.now(), C = Math.max(w - l.current, 1), R = {
      x: g - a.current.x,
      y: h - a.current.y
    };
    u.current = {
      x: (g - f.current.x) / C * 1e3,
      y: (h - f.current.y) / C * 1e3
    }, f.current = { x: g, y: h }, l.current = w, c.current = R, r == null || r({ offset: R, velocity: u.current });
  }, [r]), y = le(() => {
    o.current && (o.current = !1, n == null || n({
      offset: c.current,
      velocity: u.current
    }));
  }, [n]), d = le((g) => {
    const h = g.touches[0];
    p(h.clientX, h.clientY);
  }, [p]), v = le((g) => {
    const h = g.touches[0];
    b(h.clientX, h.clientY);
  }, [b]), E = le(() => {
    y();
  }, [y]), m = le((g) => {
    p(g.clientX, g.clientY);
    const h = (C) => b(C.clientX, C.clientY), w = () => {
      y(), window.removeEventListener("mousemove", h), window.removeEventListener("mouseup", w);
    };
    window.addEventListener("mousemove", h), window.addEventListener("mouseup", w);
  }, [p, b, y]);
  return {
    ref: i,
    handlers: s ? {
      onTouchStart: d,
      onTouchMove: v,
      onTouchEnd: E,
      onMouseDown: m
    } : {}
  };
}, Or = (e, r, n) => {
  const [t, s] = r, [i, o] = n, c = (Math.max(t, Math.min(s, e)) - t) / (s - t);
  return i + c * (o - i);
}, Zs = ({
  state: e,
  navigation: r,
  descriptors: n,
  tabBar: t,
  tabBarPosition: s = "bottom",
  lazy: i = !0,
  animation: o = "none",
  sceneContainerStyle: a,
  // Navigator-level tab bar options (from screenOptions)
  tabBarStyle: c,
  tabBarBackground: u,
  tabBarActiveTintColor: l,
  tabBarInactiveTintColor: f,
  tabBarActiveBackgroundColor: p,
  tabBarInactiveBackgroundColor: b,
  tabBarLabelStyle: y,
  tabBarIconStyle: d,
  tabBarItemStyle: v,
  tabBarShowLabel: E,
  tabBarLabelPosition: m
}) => {
  var N;
  const g = (N = e.routes[e.index]) == null ? void 0 : N.key, [h, w] = we([g]);
  g && !h.includes(g) && w([...h, g]);
  const [C, R] = we(e.index);
  xe(() => {
    if (o !== "none" && e.index !== C) {
      const T = setTimeout(() => {
        R(e.index);
      }, ge);
      return () => clearTimeout(T);
    } else
      R(e.index);
  }, [e.index, o, C]);
  const k = le((T) => {
    var $;
    const _ = ($ = e.routes[T]) == null ? void 0 : $.key;
    _ && !h.includes(_) && w((L) => [...L, _]);
  }, [e.routes, h]), I = t || Ws, P = () => {
    var _, $, L;
    return ((L = ((($ = n[(_ = e.routes[e.index]) == null ? void 0 : _.key]) == null ? void 0 : $.options) || {}).tabBarStyle) == null ? void 0 : L.display) === "none" ? null : /* @__PURE__ */ S(
      I,
      {
        state: e,
        navigation: r,
        descriptors: n,
        onTabPress: (H) => {
          k(H);
          const q = e.routes[H];
          r.navigate(q.name);
        },
        tabBarStyle: c,
        tabBarBackground: u,
        tabBarActiveTintColor: l,
        tabBarInactiveTintColor: f,
        tabBarActiveBackgroundColor: p,
        tabBarInactiveBackgroundColor: b,
        tabBarLabelStyle: y,
        tabBarIconStyle: d,
        tabBarItemStyle: v,
        tabBarShowLabel: E,
        tabBarLabelPosition: m
      }
    );
  }, U = (T, _) => {
    if (o === "none")
      return {};
    const $ = `opacity ${ge}ms ${Se}, transform ${ge}ms ${Se}`;
    return o === "fade" ? {
      opacity: _ ? 1 : 0,
      transition: $
    } : o === "shift" ? _ ? {
      opacity: 1,
      transform: "translateX(0)",
      transition: $
    } : {
      opacity: 0,
      transform: `translateX(${(T < e.index ? -1 : 1) * 20}px)`,
      transition: $
    } : {};
  }, O = (T, _) => {
    const $ = n[T.key];
    if (!$)
      return null;
    const { options: L, render: H } = $, q = e.index === _;
    if (i && !h.includes(T.key) && !q)
      return null;
    const Q = L.headerShown === !0, K = L.title ?? L.headerTitle ?? T.name, ie = U(_, q);
    return /* @__PURE__ */ ue(
      "div",
      {
        "data-tab-screen": T.name,
        "data-focused": q,
        className: re(
          "nextant-tab-screen absolute inset-0 flex flex-col",
          q ? "z-10" : "z-0 pointer-events-none"
        ),
        style: {
          // Ensure screen has dimensions - use absolute positioning values
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // Always show focused screen, hide others (unless animating)
          display: q || o !== "none" ? "flex" : "none",
          flexDirection: "column",
          ...ie
        },
        children: [
          Q && (L.header ? L.header({
            navigation: r,
            route: T,
            options: L
          }) : /* @__PURE__ */ S(
            rt,
            {
              title: K,
              canGoBack: !1,
              onBackPress: () => {
              },
              headerLeft: L.headerLeft,
              headerRight: L.headerRight,
              headerTitle: L.headerTitle,
              headerTitleAlign: L.headerTitleAlign,
              headerTintColor: L.headerTintColor,
              headerStyle: L.headerStyle,
              headerTitleStyle: L.headerTitleStyle,
              headerShadowVisible: L.headerShadowVisible,
              headerTransparent: L.headerTransparent,
              headerBackground: L.headerBackground
            }
          )),
          /* @__PURE__ */ S("div", { className: "flex-1 relative min-h-0", children: H() })
        ]
      },
      T.key
    );
  };
  return /* @__PURE__ */ ue("div", { className: re(
    "nextant-tab-view flex h-full",
    s === "top" ? "flex-col-reverse" : "flex-col"
  ), children: [
    /* @__PURE__ */ S(
      "div",
      {
        className: "nextant-tab-content flex-1 relative overflow-hidden",
        style: a,
        children: e.routes.map((T, _) => O(T, _))
      }
    ),
    P()
  ] });
}, wn = ke(({
  initialRouteName: e,
  backBehavior: r = "firstRoute",
  children: n,
  screenOptions: t,
  screenListeners: s,
  tabBar: i,
  tabBarPosition: o = "bottom",
  lazy: a = !0,
  animation: c = "none",
  sceneContainerStyle: u,
  ...l
}, f) => {
  const { state: p, navigation: b, descriptors: y, NavigationContent: d } = Ut(
    Pr,
    {
      initialRouteName: e,
      backBehavior: r,
      children: n,
      screenOptions: t,
      screenListeners: s
    }
  ), v = typeof t == "function" ? {} : t || {};
  return /* @__PURE__ */ S(d, { children: /* @__PURE__ */ S(
    Zs,
    {
      ...l,
      state: p,
      navigation: b,
      descriptors: y,
      tabBar: i,
      tabBarPosition: o,
      lazy: a,
      animation: c,
      sceneContainerStyle: u,
      tabBarStyle: v.tabBarStyle,
      tabBarBackground: v.tabBarBackground,
      tabBarActiveTintColor: v.tabBarActiveTintColor,
      tabBarInactiveTintColor: v.tabBarInactiveTintColor,
      tabBarActiveBackgroundColor: v.tabBarActiveBackgroundColor,
      tabBarInactiveBackgroundColor: v.tabBarInactiveBackgroundColor,
      tabBarLabelStyle: v.tabBarLabelStyle,
      tabBarIconStyle: v.tabBarIconStyle,
      tabBarItemStyle: v.tabBarItemStyle,
      tabBarShowLabel: v.tabBarShowLabel,
      tabBarLabelPosition: v.tabBarLabelPosition
    }
  ) });
});
wn.displayName = "TabNavigator";
const ya = Gt(wn), Cn = ke(({
  children: e,
  isFocused: r,
  animation: n = "slide",
  gestureEnabled: t = !0,
  onSwipeBack: s,
  style: i,
  // Animation state from parent (reserved for future use)
  _isEntering: o,
  _isExiting: a,
  _onAnimationComplete: c
}, u) => {
  const { colors: l } = Pe(), f = J(null), p = J(null), [b, y] = we(0), [d, v] = we(!1), [E, m] = we(!1);
  xe(() => {
    const R = requestAnimationFrame(() => {
      m(!0);
    });
    return () => cancelAnimationFrame(R);
  }, []);
  const { handlers: g } = xn({
    enabled: t && r,
    onDragStart: () => {
      v(!0);
    },
    onDragMove: ({ offset: R }) => {
      const k = Math.max(0, R.x);
      y(k);
    },
    onDragEnd: ({ offset: R, velocity: k }) => {
      if ((R.x > 100 || k.x > 500) && R.x > 0) {
        const P = f.current;
        if (P) {
          const U = vn(P, [
            { transform: `translateX(${R.x}px)` },
            { transform: "translateX(100%)" }
          ]);
          U == null || U.addEventListener("finish", () => {
            s == null || s();
          });
        }
      } else
        y(0);
      v(!1);
    }
  }), h = t ? Math.max(0, 0.5 - b / 600) : 0.5, C = (() => {
    if (d)
      return {
        transform: `translateX(${b}px)`,
        transition: "none"
      };
    const R = E ? `transform ${ge}ms ${Se}, opacity ${ge}ms ${Se}` : "none";
    return n === "none" ? { transition: "none" } : n === "fade" ? {
      opacity: r ? 1 : 0,
      transition: R
    } : {
      transform: r ? "translateX(0)" : "translateX(100%)",
      transition: R
    };
  })();
  return /* @__PURE__ */ ue(jt, { children: [
    t && r && /* @__PURE__ */ S(
      "div",
      {
        ref: p,
        className: "nextant-stack-overlay absolute inset-0 bg-black pointer-events-none",
        style: {
          opacity: h,
          transition: d ? "none" : `opacity ${ge}ms ${Se}`
        }
      }
    ),
    /* @__PURE__ */ S(
      "div",
      {
        ref: f,
        className: re(
          "nextant-stack-item absolute inset-0 flex flex-col",
          !r && "pointer-events-none"
        ),
        style: {
          backgroundColor: l.background,
          ...C,
          ...i
        },
        ...g,
        children: e
      }
    )
  ] });
});
Cn.displayName = "StackItem";
const Qs = ({
  state: e,
  navigation: r,
  descriptors: n,
  screenContainerStyle: t
}) => {
  const [s, i] = we(/* @__PURE__ */ new Map()), o = J(e.routes);
  xe(() => {
    const c = o.current, u = new Set(e.routes.map((f) => f.key)), l = c.filter((f) => !u.has(f.key));
    l.length > 0 && (i((f) => {
      const p = new Map(f);
      return l.forEach((b) => {
        var y;
        p.set(b.key, {
          route: b,
          descriptor: n[b.key] || ((y = o.currentDescriptors) == null ? void 0 : y[b.key])
        });
      }), p;
    }), setTimeout(() => {
      i((f) => {
        const p = new Map(f);
        return l.forEach((b) => p.delete(b.key)), p;
      });
    }, ge)), o.current = e.routes, o.currentDescriptors = n;
  }, [e.routes, n]);
  const a = (c, u, l = !1) => {
    var k, I;
    const f = l ? (k = s.get(c.key)) == null ? void 0 : k.descriptor : n[c.key];
    if (!f)
      return null;
    const { options: p, render: b } = f, y = !l && e.index === u;
    if (!l && u < e.index - 1)
      return null;
    const d = u > 0, v = p.headerShown !== !1, E = p.gestureEnabled !== !1 && d, m = p.animation ?? "slide", g = p.title ?? (typeof p.headerTitle == "string" ? p.headerTitle : null) ?? c.name, h = u > 0 ? e.routes[u - 1] : null, w = h ? (I = n[h.key]) == null ? void 0 : I.options : null, C = (w == null ? void 0 : w.title) ?? (h == null ? void 0 : h.name);
    return /* @__PURE__ */ ue(
      Cn,
      {
        isFocused: y,
        animation: m,
        gestureEnabled: E,
        onSwipeBack: () => r.goBack(),
        style: t,
        isExiting: l,
        children: [
          v && (p.header ? p.header({
            navigation: r,
            route: c,
            options: p,
            back: d ? {
              title: C,
              href: void 0
            } : void 0
          }) : /* @__PURE__ */ S(
            rt,
            {
              title: g,
              canGoBack: d,
              onBackPress: () => r.goBack(),
              headerLeft: p.headerLeft,
              headerRight: p.headerRight,
              headerTitle: p.headerTitle,
              headerTitleAlign: p.headerTitleAlign,
              headerBackIcon: p.headerBackIcon,
              headerBackTitle: p.headerBackTitle ?? (p.headerBackTitleVisible !== !1 ? void 0 : ""),
              headerBackTitleStyle: p.headerBackTitleStyle,
              headerBackVisible: p.headerBackVisible,
              headerTintColor: p.headerTintColor,
              headerStyle: p.headerStyle,
              headerTitleStyle: p.headerTitleStyle,
              headerShadowVisible: p.headerShadowVisible,
              headerTransparent: p.headerTransparent,
              headerBackground: p.headerBackground
            }
          )),
          /* @__PURE__ */ S("div", { className: re(
            "nextant-stack-screen-content flex-1 overflow-auto",
            p.headerTransparent && v && "pt-14"
          ), children: b() })
        ]
      },
      c.key
    );
  };
  return /* @__PURE__ */ ue("div", { className: re("nextant-stack absolute inset-0 overflow-hidden"), children: [
    e.routes.map((c, u) => a(c, u, !1)),
    Array.from(s.entries()).map(
      ([c, { route: u }]) => a(u, -1, !0)
    )
  ] });
}, En = ke(({
  initialRouteName: e,
  children: r,
  screenOptions: n,
  screenListeners: t,
  ...s
}, i) => {
  const { state: o, navigation: a, descriptors: c, NavigationContent: u } = Ut(
    $n,
    {
      initialRouteName: e,
      children: r,
      screenOptions: n,
      screenListeners: t
    }
  );
  return /* @__PURE__ */ S(u, { children: /* @__PURE__ */ S(
    Qs,
    {
      ...s,
      state: o,
      navigation: a,
      descriptors: c
    }
  ) });
});
En.displayName = "StackNavigator";
const ga = Gt(En), ea = ({
  label: e,
  icon: r,
  isFocused: n,
  onPress: t,
  onLongPress: s,
  options: i = {},
  className: o
}) => {
  const { colors: a } = Pe(), {
    drawerActiveTintColor: c,
    drawerInactiveTintColor: u,
    drawerActiveBackgroundColor: l,
    drawerInactiveBackgroundColor: f,
    drawerItemStyle: p,
    drawerLabelStyle: b,
    drawerItemTestID: y
  } = i, d = c || a.primary, v = u || a.text, E = n ? d : v, h = n ? l || "rgba(0, 0, 0, 0.05)" : f || "transparent", w = () => {
    if (!r) return null;
    const R = {
      focused: n,
      color: E,
      size: 24
    };
    if (typeof r == "function") {
      const k = r(R);
      if (k != null && k.type) return k;
    }
    return /* @__PURE__ */ S(r, { className: "h-5 w-5", style: { color: E } });
  }, C = () => typeof e == "function" ? e({ focused: n, color: E }) : /* @__PURE__ */ S(
    "span",
    {
      className: "text-sm",
      style: { color: E, ...b },
      children: e
    }
  );
  return /* @__PURE__ */ ue(
    ut,
    {
      variant: "ghost",
      className: re(
        "w-full justify-start gap-3 px-4 py-3 h-auto rounded-none",
        "hover:bg-accent/50",
        o
      ),
      style: {
        color: E,
        backgroundColor: h,
        ...p
      },
      onClick: t,
      onContextMenu: (R) => {
        R.preventDefault(), s == null || s();
      },
      "data-testid": y,
      children: [
        w(),
        C()
      ]
    }
  );
}, ta = ({
  state: e,
  navigation: r,
  descriptors: n,
  // Navigator-level options
  drawerContentStyle: t,
  drawerContentContainerStyle: s,
  drawerActiveTintColor: i,
  drawerInactiveTintColor: o,
  drawerActiveBackgroundColor: a,
  drawerInactiveBackgroundColor: c,
  drawerLabelStyle: u,
  drawerItemStyle: l,
  className: f,
  style: p
}) => {
  const { colors: b } = Pe();
  return /* @__PURE__ */ ue(
    "nav",
    {
      className: re(
        "nextant-drawer-content flex flex-col h-full",
        "pt-[env(safe-area-inset-top)]",
        "pb-[env(safe-area-inset-bottom)]",
        f
      ),
      style: {
        backgroundColor: b.card,
        ...p,
        ...t
      },
      children: [
        /* @__PURE__ */ S(
          "div",
          {
            className: "px-4 py-6 border-b",
            style: { borderColor: b.border },
            children: /* @__PURE__ */ S(
              "h2",
              {
                className: "text-lg font-semibold",
                style: { color: b.text },
                children: "Menu"
              }
            )
          }
        ),
        /* @__PURE__ */ S(
          "div",
          {
            className: "flex-1 py-2 overflow-auto",
            style: s,
            children: e.routes.map((y, d) => {
              const { options: v } = n[y.key], E = e.index === d, m = v.drawerLabel ?? v.title ?? y.name, g = v.drawerIcon, h = () => {
                r.emit({
                  type: "drawerItemPress",
                  target: y.key,
                  canPreventDefault: !0
                }).defaultPrevented || (r.navigate(y.name), r.closeDrawer());
              }, w = {
                drawerActiveTintColor: v.drawerActiveTintColor ?? i,
                drawerInactiveTintColor: v.drawerInactiveTintColor ?? o,
                drawerActiveBackgroundColor: v.drawerActiveBackgroundColor ?? a,
                drawerInactiveBackgroundColor: v.drawerInactiveBackgroundColor ?? c,
                drawerLabelStyle: { ...u, ...v.drawerLabelStyle },
                drawerItemStyle: { ...l, ...v.drawerItemStyle },
                drawerItemTestID: v.drawerItemTestID
              };
              return /* @__PURE__ */ S(
                ea,
                {
                  label: m,
                  icon: g,
                  isFocused: E,
                  onPress: h,
                  options: w
                },
                y.key
              );
            })
          }
        )
      ]
    }
  );
}, ra = 280, na = ({
  state: e,
  navigation: r,
  descriptors: n,
  drawerContent: t,
  drawerPosition: s = "left",
  drawerType: i = "front",
  drawerStyle: o,
  overlayStyle: a,
  overlayAccessibilityLabel: c = "Close drawer",
  sceneStyle: u,
  gestureEnabled: l = !0,
  lazy: f = !0,
  // Navigator-level drawer item options
  drawerContentStyle: p,
  drawerContentContainerStyle: b,
  drawerActiveTintColor: y,
  drawerInactiveTintColor: d,
  drawerActiveBackgroundColor: v,
  drawerInactiveBackgroundColor: E,
  drawerLabelStyle: m,
  drawerItemStyle: g
}) => {
  var pe;
  const { colors: h } = Pe(), w = J(null), C = J(null), R = J(null), [k, I] = we(() => /* @__PURE__ */ new Set([e.index])), P = ((pe = e.history) == null ? void 0 : pe.some((M) => M.type === "drawer")) ?? !1, U = J(P), O = (o == null ? void 0 : o.width) || ra, [N, T] = we(0), [_, $] = we(!1), L = s === "left" ? -O : O, H = 0, q = le((M) => {
    r.emit({
      type: "transitionStart",
      data: { closing: M }
    });
  }, [r]), Q = le((M) => {
    r.emit({
      type: "transitionEnd",
      data: { closing: M }
    });
  }, [r]);
  xe(() => {
    I((M) => {
      if (M.has(e.index)) return M;
      const z = new Set(M);
      return z.add(e.index), z;
    });
  }, [e.index]), xe(() => {
    const M = U.current;
    if (M !== P && !_) {
      if (q(!P), w.current) {
        const z = vn(w.current, [
          { transform: `translateX(${M ? H : L}px)` },
          { transform: `translateX(${P ? H : L}px)` }
        ]);
        z == null || z.addEventListener("finish", () => {
          Q(!P);
        });
      }
      U.current = P;
    }
  }, [P, _, L, H, q, Q]);
  const K = () => {
    r.closeDrawer();
  }, ie = () => {
    r.openDrawer();
  }, { handlers: B } = xn({
    enabled: l && i !== "permanent",
    onDragStart: () => {
      $(!0);
    },
    onDragMove: ({ offset: M }) => {
      let z;
      s === "left" ? P ? z = Math.min(0, Math.max(-O, M.x)) : z = Math.max(0, Math.min(O, M.x)) : P ? z = Math.max(0, Math.min(O, M.x)) : z = Math.min(0, Math.max(-O, M.x)), T(z);
    },
    onDragEnd: ({ offset: M, velocity: z }) => {
      if ($(!1), T(0), s === "left") {
        const me = M.x < -50 || z.x < -500, he = M.x > 50 || z.x > 500;
        P && me ? K() : !P && he && ie();
      } else {
        const me = M.x > 50 || z.x > 500, he = M.x < -50 || z.x < -500;
        P && me ? K() : !P && he && ie();
      }
    }
  }), ce = t || ta, Ce = e.routes[e.index], de = n[Ce.key], D = (de == null ? void 0 : de.options) || {}, Ae = D.headerShown !== !1, Oe = D.title ?? D.headerTitle ?? Ce.name, F = (M, z) => {
    const { render: me } = n[M.key], he = e.index === z;
    return !f || k.has(z) ? /* @__PURE__ */ S(
      "div",
      {
        className: re(
          "absolute inset-0",
          he ? "z-10" : "z-0 pointer-events-none"
        ),
        style: {
          visibility: he ? "visible" : "hidden"
        },
        children: me()
      },
      M.key
    ) : null;
  }, G = () => _ ? `translateX(${(P ? H : L) + N}px)` : `translateX(${P ? H : L}px)`, ee = () => {
    if (_) {
      const M = s === "left" ? Or(
        N,
        P ? [-O, 0] : [0, O],
        P ? [0, 0.5] : [0, 0.5]
      ) : Or(
        N,
        P ? [0, O] : [-O, 0],
        P ? [0.5, 0] : [0.5, 0]
      );
      return P ? 0.5 + M : M;
    }
    return P ? 0.5 : 0;
  }, fe = () => i !== "slide" && i !== "back" ? "translateX(0)" : _ ? `translateX(${s === "left" ? P ? O + N : N : P ? -O + N : N}px)` : `translateX(${P ? s === "left" ? O : -O : 0}px)`, ye = _ ? "none" : `transform ${ge}ms ${Se}, opacity ${ge}ms ${Se}`;
  return i === "permanent" ? /* @__PURE__ */ ue("div", { className: re(
    "nextant-drawer flex h-full w-full",
    s === "right" ? "flex-row-reverse" : "flex-row"
  ), children: [
    /* @__PURE__ */ S(
      "aside",
      {
        className: "nextant-drawer-panel flex flex-col shrink-0 border-r",
        style: {
          width: O,
          backgroundColor: (o == null ? void 0 : o.backgroundColor) || h.card,
          borderColor: h.border
        },
        children: /* @__PURE__ */ S(
          ce,
          {
            state: e,
            navigation: r,
            descriptors: n,
            drawerContentStyle: p,
            drawerContentContainerStyle: b,
            drawerActiveTintColor: y,
            drawerInactiveTintColor: d,
            drawerActiveBackgroundColor: v,
            drawerInactiveBackgroundColor: E,
            drawerLabelStyle: m,
            drawerItemStyle: g
          }
        )
      }
    ),
    /* @__PURE__ */ ue("div", { className: "flex-1 flex flex-col", style: u, children: [
      Ae && (D.header ? D.header({
        navigation: r,
        route: Ce,
        options: D
      }) : /* @__PURE__ */ S(
        rt,
        {
          title: Oe,
          canGoBack: !1,
          onBackPress: () => {
          },
          headerLeft: D.headerLeft,
          headerRight: D.headerRight,
          headerTitle: D.headerTitle,
          headerTitleAlign: D.headerTitleAlign,
          headerTintColor: D.headerTintColor,
          headerStyle: D.headerStyle,
          headerTitleStyle: D.headerTitleStyle,
          headerShadowVisible: D.headerShadowVisible,
          headerTransparent: D.headerTransparent,
          headerBackground: D.headerBackground
        }
      )),
      /* @__PURE__ */ S("div", { className: "flex-1 relative overflow-hidden", children: e.routes.map((M, z) => F(M, z)) })
    ] })
  ] }) : /* @__PURE__ */ ue("div", { className: re("nextant-drawer relative h-full w-full overflow-hidden"), children: [
    /* @__PURE__ */ ue(
      "div",
      {
        ref: R,
        className: "nextant-drawer-scene h-full w-full flex flex-col",
        style: {
          transform: fe(),
          transition: ye,
          ...u
        },
        children: [
          Ae && (D.header ? D.header({
            navigation: r,
            route: Ce,
            options: D
          }) : /* @__PURE__ */ S(
            rt,
            {
              title: Oe,
              canGoBack: !1,
              onBackPress: () => {
              },
              headerLeft: D.headerLeft ?? (() => /* @__PURE__ */ S(
                "button",
                {
                  className: "p-2 -ml-2",
                  onClick: () => r.toggleDrawer(),
                  "aria-label": "Toggle drawer",
                  children: /* @__PURE__ */ S("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ S("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
                }
              )),
              headerRight: D.headerRight,
              headerTitle: D.headerTitle,
              headerTitleAlign: D.headerTitleAlign,
              headerTintColor: D.headerTintColor,
              headerStyle: D.headerStyle,
              headerTitleStyle: D.headerTitleStyle,
              headerShadowVisible: D.headerShadowVisible,
              headerTransparent: D.headerTransparent,
              headerBackground: D.headerBackground
            }
          )),
          /* @__PURE__ */ S("div", { className: "flex-1 relative overflow-hidden", children: e.routes.map((M, z) => F(M, z)) })
        ]
      }
    ),
    i !== "back" && /* @__PURE__ */ S(
      "div",
      {
        ref: C,
        className: "nextant-drawer-overlay absolute inset-0",
        style: {
          opacity: ee(),
          backgroundColor: (a == null ? void 0 : a.backgroundColor) || "black",
          pointerEvents: P ? "auto" : "none",
          transition: ye
        },
        onClick: K,
        "aria-label": c,
        role: "button",
        tabIndex: P ? 0 : -1
      }
    ),
    /* @__PURE__ */ S(
      "aside",
      {
        ref: w,
        className: re(
          "nextant-drawer-panel absolute top-0 bottom-0 flex flex-col",
          s === "left" ? "left-0" : "right-0",
          i === "back" ? "-z-10" : "z-20"
        ),
        style: {
          width: O,
          backgroundColor: (o == null ? void 0 : o.backgroundColor) || h.card,
          transform: G(),
          transition: ye,
          boxShadow: P && i !== "back" ? "4px 0 12px rgba(0, 0, 0, 0.15)" : "none"
        },
        ...B,
        children: /* @__PURE__ */ S(
          ce,
          {
            state: e,
            navigation: r,
            descriptors: n,
            drawerContentStyle: p,
            drawerContentContainerStyle: b,
            drawerActiveTintColor: y,
            drawerInactiveTintColor: d,
            drawerActiveBackgroundColor: v,
            drawerInactiveBackgroundColor: E,
            drawerLabelStyle: m,
            drawerItemStyle: g
          }
        )
      }
    ),
    l && !P && i !== "permanent" && /* @__PURE__ */ S(
      "div",
      {
        className: re(
          "absolute top-0 bottom-0 w-5 z-30",
          s === "left" ? "left-0" : "right-0"
        ),
        ...B
      }
    )
  ] });
}, Rn = ke(({
  initialRouteName: e,
  backBehavior: r = "firstRoute",
  children: n,
  screenOptions: t,
  screenListeners: s,
  drawerContent: i,
  drawerPosition: o = "left",
  drawerType: a = "front",
  drawerStyle: c,
  overlayStyle: u,
  overlayAccessibilityLabel: l,
  sceneStyle: f,
  lazy: p = !0,
  gestureEnabled: b = !0,
  ...y
}, d) => {
  const { state: v, navigation: E, descriptors: m, NavigationContent: g } = Ut(
    Fn,
    {
      initialRouteName: e,
      backBehavior: r,
      children: n,
      screenOptions: t,
      screenListeners: s
    }
  ), h = typeof t == "function" ? {} : t || {};
  return /* @__PURE__ */ S(g, { children: /* @__PURE__ */ S(
    na,
    {
      ...y,
      state: v,
      navigation: E,
      descriptors: m,
      drawerContent: i,
      drawerPosition: o,
      drawerType: a,
      drawerStyle: c,
      overlayStyle: u,
      overlayAccessibilityLabel: l,
      sceneStyle: f,
      lazy: p,
      gestureEnabled: b,
      drawerContentStyle: h.drawerContentStyle,
      drawerContentContainerStyle: h.drawerContentContainerStyle,
      drawerActiveTintColor: h.drawerActiveTintColor,
      drawerInactiveTintColor: h.drawerInactiveTintColor,
      drawerActiveBackgroundColor: h.drawerActiveBackgroundColor,
      drawerInactiveBackgroundColor: h.drawerInactiveBackgroundColor,
      drawerLabelStyle: h.drawerLabelStyle,
      drawerItemStyle: h.drawerItemStyle
    }
  ) });
});
Rn.displayName = "DrawerNavigator";
const ba = Gt(Rn);
export {
  Us as Badge,
  Yn as BaseNavigationContainer,
  ut as Button,
  Le as CommonActions,
  ha as DarkTheme,
  Zo as DefaultTheme,
  _n as DrawerActions,
  ta as DrawerContent,
  ea as DrawerItem,
  Fn as DrawerRouter,
  na as DrawerView,
  rt as Header,
  Zo as LightTheme,
  us as Link,
  cn as LinkingContext,
  as as NavigationContainer,
  ot as NavigationContainerRefContext,
  $e as NavigationContext,
  Zr as NavigationHelpersContext,
  Ln as StackActions,
  Cn as StackItem,
  $n as StackRouter,
  Qs as StackView,
  Nr as TabActions,
  Ws as TabBar,
  Ks as TabBarItem,
  Pr as TabRouter,
  Zs as TabView,
  st as ThemeContext,
  $r as ThemeProvider,
  Vs as badgeVariants,
  zs as buttonVariants,
  re as cn,
  hr as createComponentForStaticNavigation,
  ba as createDrawerNavigator,
  es as createMemoryHistory,
  Gt as createNavigatorFactory,
  ca as createPathConfigForStaticNavigation,
  ga as createStackNavigator,
  ya as createTabNavigator,
  _e as findFocusedRoute,
  Vr as getActionFromState,
  aa as getFocusedRouteNameFromRoute,
  zt as getPathFromState,
  Xr as getStateFromPath,
  ns as useDocumentTitle,
  ua as useFocusEffect,
  ia as useIsFocused,
  is as useLinkBuilder,
  cs as useLinkProps,
  ma as useLinkTo,
  rs as useLinking,
  Kt as useLinkingContext,
  pa as useNavigation,
  Ut as useNavigationBuilder,
  da as useNavigationContainerRef,
  la as useNavigationState,
  fa as usePreventRemove,
  en as useRoute,
  Pe as useTheme,
  at as validatePathConfig
};
