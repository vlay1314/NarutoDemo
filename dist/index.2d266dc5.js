/*! nan出品，必出精品 */ !function(e) {
    var t = {};
    function n(o) {
        if (t[o]) return t[o].exports;
        var r = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports;
    }
    n.m = e, n.c = t, n.d = function(e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            configurable: !1,
            enumerable: !0,
            get: o
        });
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return n.d(t, "a", t), t;
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }, n.p = "", n(n.s = 0);
}([
    function(e, t, n) {
        (function(e) {
            function t(e) {
                return function(e) {
                    if (Array.isArray(e)) {
                        for(var t = 0, n = new Array(e.length); t < e.length; t++)n[t] = e[t];
                        return n;
                    }
                }(e) || function(e) {
                    if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e);
                }(e) || function() {
                    throw new TypeError("Invalid attempt to spread non-iterable instance");
                }();
            }
            function n(e, t) {
                return !t || "object" !== i(t) && "function" != typeof t ? function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e;
                }(e) : t;
            }
            function o(e) {
                return (o = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                    return e.__proto__ || Object.getPrototypeOf(e);
                })(e);
            }
            function r(e, t) {
                return (r = Object.setPrototypeOf || function(e, t) {
                    return e.__proto__ = t, e;
                })(e, t);
            }
            function i(e) {
                return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e;
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                })(e);
            }
            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }
            function s(e, t) {
                for(var n = 0; n < t.length; n++){
                    var o = t[n];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
                }
            }
            function u(e, t, n) {
                return t && s(e.prototype, t), n && s(e, n), e;
            }
            var c = function() {
                function e() {
                    a(this, e);
                }
                return u(e, [
                    {
                        key: "$",
                        value: function(e) {
                            return new l(e);
                        }
                    },
                    {
                        key: "error",
                        value: function(e) {
                            throw new Error(e);
                        }
                    },
                    {
                        key: "noop",
                        value: function() {}
                    },
                    {
                        key: "isFunction",
                        value: function(e) {
                            return "function" == typeof e;
                        }
                    },
                    {
                        key: "isArraylike",
                        value: function(e) {
                            var t = e.length, n = this.type(e);
                            return "function" !== n && !this.isWindow(e) && (!(1 !== e.nodeType || !t) || "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e);
                        }
                    },
                    {
                        key: "isWindow",
                        value: function(e) {
                            return null != e && e === e.window;
                        }
                    },
                    {
                        key: "isNumeric",
                        value: function(e) {
                            return e - parseFloat(e) >= 0;
                        }
                    },
                    {
                        key: "isPlainObject",
                        value: function(e) {
                            if ("object" !== this.type(e) || e.nodeType || this.isWindow(e)) return !1;
                            try {
                                if (e.constructor && !this.hasOwn.call(e.constructor.prototype, "isPrototypeOf")) return !1;
                            } catch (e) {
                                return !1;
                            }
                            return !0;
                        }
                    },
                    {
                        key: "isEmptyObject",
                        value: function(e) {
                            for(var t in e)return !1;
                            return !0;
                        }
                    },
                    {
                        key: "type",
                        value: function(e) {
                            return null == e ? e + "" : "object" === i(e) || "function" == typeof e ? ({})[toString.call(e)] || "object" : i(e);
                        }
                    },
                    {
                        key: "globalEval",
                        value: function(e) {
                            var t, n = eval;
                            (e = this.trim(e)) && (1 === e.indexOf("use strict") ? ((t = document.createElement("script")).text = e, document.head.appendChild(t).parentNode.removeChild(t)) : n(e));
                        }
                    },
                    {
                        key: "nodeName",
                        value: function(e, t) {
                            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
                        }
                    },
                    {
                        key: "each",
                        value: function(e, t, n) {
                            var o = 0, r = e.length, i = this.isArraylike(e);
                            if (n) {
                                if (i) for(; o < r && !1 !== t.apply(e[o], n); o++);
                                else for(o in e)if (!1 === t.apply(e[o], n)) break;
                            } else if (i) for(; o < r && !1 !== t.call(e[o], o, e[o]); o++);
                            else for(o in e)if (!1 === t.call(e[o], o, e[o])) break;
                            return e;
                        }
                    },
                    {
                        key: "trim",
                        value: function(e) {
                            return null == e ? "" : "".trim.call(e);
                        }
                    },
                    {
                        key: "makeArray",
                        value: function(e, t) {
                            var n = t || [];
                            return null != e && (this.isArraylike(Object(e)) ? this.merge(n, "string" == typeof e ? [
                                e
                            ] : e) : this.push.call(n, e)), n;
                        }
                    },
                    {
                        key: "inArray",
                        value: function(e, t, n) {
                            return null == t ? -1 : this.indexOf.call(t, e, n);
                        }
                    },
                    {
                        key: "merge",
                        value: function(e, t) {
                            for(var n = +t.length, o = 0, r = e.length; o < n; o++)e[r++] = t[o];
                            return e.length = r, e;
                        }
                    },
                    {
                        key: "grep",
                        value: function(e, t, n) {
                            for(var o = [], r = 0, i = e.length, a = !n; r < i; r++)!t(e[r], r) !== a && o.push(e[r]);
                            return o;
                        }
                    },
                    {
                        key: "map",
                        value: function(e, t, n) {
                            var o, r = 0, i = e.length, a = [];
                            if (this.isArraylike(e)) for(; r < i; r++)null != (o = t(e[r], r, n)) && a.push(o);
                            else for(r in e)null != (o = t(e[r], r, n)) && a.push(o);
                            return this.concat.apply([], a);
                        }
                    },
                    {
                        key: "proxy",
                        value: function(e, t) {
                            var n, o, r;
                            if ("string" == typeof t && (n = e[t], t = e, e = n), this.isFunction(e)) return o = this.slice.call(arguments, 2), r = function() {
                                return e.apply(t || this, o.concat(this.slice.call(arguments)));
                            }, r.guid = e.guid = e.guid || this.guid++, r;
                        }
                    },
                    {
                        key: "extend",
                        value: function() {
                            var e, t, n, o, r, a, s = arguments[0] || {}, u = 1, c = arguments.length, l = !1;
                            for("boolean" == typeof s && (l = s, s = arguments[u] || {}, u++), "object" === i(s) || this.isFunction(s) || (s = {}), u === c && (s = this, u--); u < c; u++)if (null != (e = arguments[u])) for(t in e)n = s[t], s !== (o = e[t]) && (l && o && (this.isPlainObject(o) || (r = this.isArray(o))) ? (r ? (r = !1, a = n && this.isArray(n) ? n : []) : a = n && this.isPlainObject(n) ? n : {}, s[t] = this.extend(l, a, o)) : void 0 !== o && (s[t] = o));
                            return s;
                        }
                    },
                    {
                        key: "browserRedirect",
                        value: function() {
                            var e = navigator.userAgent.toLowerCase(), t = "ipad" == e.match(/ipad/i), n = "iphone os" == e.match(/iphone os/i), o = "midp" == e.match(/midp/i), r = "rv:1.2.3.4" == e.match(/rv:1.2.3.4/i), i = "ucweb" == e.match(/ucweb/i), a = "android" == e.match(/android/i), s = "windows ce" == e.match(/windows ce/i), u = "windows mobile" == e.match(/windows mobile/i);
                            return t || n || o || r || i || a || s || u ? t ? "pad" : document.body.clientWidth > 767 && document.body.clientHeight > 767 ? "pad" : (document.body.clientWidth < 400 || document.body.clientHeight, "phone") : "pc";
                        }
                    },
                    {
                        key: "getQueryString",
                        value: function(e) {
                            var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"), n = window.location.search.substr(1).match(t);
                            return null != n ? decodeURI(n[2]) : null;
                        }
                    },
                    {
                        key: "cloneObj",
                        value: function(e, t, n) {
                            var o = n || !1;
                            if ("object" == i(t)) {
                                if (o) for(var r in t)"object" != i(t[r]) || t[r] instanceof HTMLElement ? e[r] = t[r] : (t[r] instanceof Array ? e[r] = [] : e[r] = {}, this.cloneObj(e[r], t[r], !0));
                                else for(var r in t)e[r] = t[r];
                            }
                        }
                    },
                    {
                        key: "inDom",
                        value: function(e, t) {
                            return !(!t || !t.parentNode) && (t.parentNode === e || t.parentNode !== document.body && this.inDom(e, t.parentNode));
                        }
                    },
                    {
                        key: "positionInDom",
                        value: function(e, t, n) {
                            var o = n.getBoundingClientRect();
                            return e >= o.left && e <= o.right && t >= o.top && t <= o.bottom;
                        }
                    },
                    {
                        key: "getPrefix",
                        value: function() {
                            var e = document.body, t = [
                                "webkit",
                                "Moz",
                                "o",
                                "ms"
                            ];
                            for(var n in t){
                                var o = t[n] + "Transition";
                                if (void 0 !== e.style[o]) return "-" + t[n].toLowerCase() + "-";
                            }
                            return !1;
                        }
                    },
                    {
                        key: "isDom",
                        value: function(e) {
                            return ("object" === ("undefined" == typeof HTMLElement ? "undefined" : i(HTMLElement)) ? function(e) {
                                return e instanceof HTMLElement;
                            } : function(e) {
                                return e && "object" === i(e) && 1 === e.nodeType && "string" == typeof e.nodeName;
                            })(e);
                        }
                    },
                    {
                        key: "wheel",
                        value: function(e, t, n) {
                            var o = this, r = arguments.length, i = function(e) {
                                e.wheelDelta ? a(-e.wheelDelta / 120, e) : e.detail && (-3 === e.detail ? a(-1, e) : 3 === e.detail ? a(1, e) : console.log("鼠标滚轮事件改了？", e.wheelDelta));
                            }, a = function(i, a) {
                                i >= 0 ? r >= 2 && o.isFunction(t) && t.call(e, a) : i < 0 && r >= 3 && o.isFunction(n) && n.call(e, a);
                            };
                            e.addEventListener("mousewheel", i, !1), e.addEventListener("DOMMouseScroll", i, !1);
                        }
                    },
                    {
                        key: "addImageHover",
                        value: function(e, t, n) {
                            var o = new Image, r = new Image;
                            o.src = t, r.src = n, e.addEventListener("mouseenter", function() {
                                e.src = r.src;
                            }), e.addEventListener("mouseleave", function() {
                                e.src = o.src;
                            });
                        }
                    },
                    {
                        key: "listenArray",
                        value: function(e, t) {
                            var n = Array.prototype, o = Object.create(n), r = [];
                            [
                                "push",
                                "pop",
                                "shift",
                                "unshift",
                                "splice",
                                "sort",
                                "reverse"
                            ].forEach(function(n) {
                                var i = o[n];
                                r[n] = function() {
                                    return t.call(e), i.apply(this, arguments);
                                };
                            }), e.__proto__ = r;
                        }
                    },
                    {
                        key: "listenObj",
                        value: function(e, t, n) {
                            var o = e[t];
                            Object.defineProperty(e, t, {
                                set: function(t) {
                                    var r = o;
                                    o = t, n.call(e, t, r, this);
                                },
                                get: function() {
                                    return o;
                                }
                            });
                        }
                    },
                    {
                        key: "watch",
                        value: function(e, t) {
                            var n, o = this, r = function e(t, n) {
                                if ("object" === o.type(t) && !o.isDom(t)) {
                                    if (o.isArray(t)) {
                                        for(var r = 0, i = t.length; r < i; r++)o.listenObj(t, r, n), "object" === o.type(t) && e(t[r], n);
                                        o.listenArray(t, n);
                                    } else for(var a in t)"object" === o.type(t) && e(t[a], n), o.listenObj(t, a, n);
                                }
                            };
                            r(e, function o() {
                                clearTimeout(n), n = setTimeout(function() {
                                    r(e, o), t.call(e);
                                }, 10);
                            });
                        }
                    },
                    {
                        key: "getAngle",
                        value: function(e, t, n, o) {
                            var r = n - e, i = o - t, a = r / Math.sqrt(Math.pow(r, 2) + Math.pow(i, 2)), s = Math.acos(a), u = 180 / (Math.PI / s);
                            return i < 0 ? u = -u : 0 == i && r < 0 && (u = 180), u;
                        }
                    },
                    {
                        key: "getRange",
                        value: function(e, t, n, o) {
                            return Math.sqrt(Math.pow(Math.abs(e - n), 2) + Math.pow(Math.abs(t - o), 2));
                        }
                    },
                    {
                        key: "getTransformStyle",
                        value: function(e) {
                            var t = e.style.cssText, n = t.match(/translate\((\S*)px,\s(\S*)px\)/), o = t.match(/scale\((\S*),\s(\S*)\)/), r = t.match(/rotate\((\S*)deg\)/), i = t.match(/skew\((\S*)deg,\s(\S*)deg\)/), a = {};
                            return n && (a.translate = {
                                translateX: n[1],
                                translateY: n[2]
                            }), o && (a.scale = {
                                scaleX: o[1],
                                scaleY: o[2]
                            }), r && (a.rotate = r[1]), i && (a.skew = {
                                skewX: i[1],
                                skewY: i[2]
                            }), a;
                        }
                    },
                    {
                        key: "setTransformStyle",
                        value: function(e, t) {
                            switch(this.getPrefix()){
                                case "-webkit-":
                                    e.style.webkitTransform = t;
                                    break;
                                case "-Moz-":
                                    e.style.MozTransform = t;
                                    break;
                                case "-o-":
                                    e.style.OTransform = t;
                                    break;
                                case "-ms-":
                                    e.style.msTransform = t;
                                    break;
                                default:
                                    e.style.transform = t;
                            }
                        }
                    },
                    {
                        key: "getFinalStyle",
                        value: function(e, t) {
                            return window.getComputedStyle(e, null)[t];
                        }
                    },
                    {
                        key: "msg",
                        value: function(e, t) {
                            var n = document.createElement("div"), o = this.getPrefix();
                            switch(n.style.cssText = "position:fixed; height:40px; line-height:40px; color:#fff; padding:0 20px; background:rgba(0,0,0,.5);border-radius:5px; " + o + "transition: all .5s ease-in-out; pointer-events:none; opacity:0; left:50%; margin:auto; z-index:9999999999999999;", t){
                                case "top":
                                    n.style.top = "200px";
                                    break;
                                case "center":
                                    n.style.top = 0, n.style.bottom = 0;
                                    break;
                                case "bottom":
                                default:
                                    n.style.bottom = "200px";
                            }
                            n.innerText = e, document.body.appendChild(n);
                            var r = n.offsetWidth;
                            n.style.marginLeft = -r / 2 + "px", setTimeout(function() {
                                n.style.opacity = 1;
                            }), setTimeout(function() {
                                n.style.opacity = 0, setTimeout(function() {
                                    n.parentNode.removeChild(n);
                                }, 500);
                            }, 3e3);
                        }
                    },
                    {
                        key: "get",
                        value: function(e, t, n) {
                            var o = +new Date, r = new XMLHttpRequest;
                            -1 != e.indexOf("?") ? r.open("GET", e + "&time=" + o, !0) : r.open("GET", e + "?time=" + o, !0), r.onreadystatechange = function() {
                                4 == r.readyState && 200 == r.status && t(r.responseText);
                            }, r.ontimeout = n, r.onerror = n, r.upload.onprogress = function(e) {}, r.send();
                        }
                    },
                    {
                        key: "post",
                        value: function(e, t, n, o) {
                            var r = +new Date, i = new XMLHttpRequest;
                            i.open("POST", e + "?time=" + r, !0), i.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), i.onreadystatechange = function() {
                                4 == i.readyState && 200 == i.status && n(i.responseText);
                            }, i.ontimeout = o, i.onerror = o, i.upload.onprogress = function(e) {}, i.send(this.objToUrl(t).substr(1));
                        }
                    },
                    {
                        key: "objToUrl",
                        value: function(e, t, n) {
                            if (null == e) return "";
                            var o = "", r = i(e);
                            if ("string" == r || "number" == r || "boolean" == r) o += "&" + t + "=" + (null == n || n ? encodeURIComponent(e) : e);
                            else for(var a in e){
                                var s = null == t ? a : t + (e instanceof Array ? "[" + a + "]" : "." + a);
                                o += this.objToUrl(e[a], s, n);
                            }
                            return o;
                        }
                    },
                    {
                        key: "setCookie",
                        value: function(e, t, n) {
                            var o = new Date;
                            o.setTime(Number(o) + n), document.cookie = e + "=" + escape(t) + (null == n ? "" : ";expires=" + o.toGMTString());
                        }
                    },
                    {
                        key: "getCookie",
                        value: function(e) {
                            if (document.cookie.length > 0) {
                                var t = document.cookie.indexOf(e + "=");
                                if (-1 != t) {
                                    t = t + e.length + 1;
                                    var n = document.cookie.indexOf(";", t);
                                    return -1 == n && (n = document.cookie.length), decodeURI(document.cookie.substring(t, n));
                                }
                            }
                            return "";
                        }
                    },
                    {
                        key: "getLanguage",
                        value: function() {
                            var e = navigator.language;
                            return "zh-CN" === e || "zh-cn" === e ? "cn" : "ja" === e ? "jp" : "en";
                        }
                    },
                    {
                        key: "generateUUID",
                        value: function() {
                            for(var e = [], t = 0; t < 256; t++)e[t] = (t < 16 ? "0" : "") + t.toString(16);
                            var n = 4294967295 * Math.random() | 0, o = 4294967295 * Math.random() | 0, r = 4294967295 * Math.random() | 0, i = 4294967295 * Math.random() | 0;
                            return (e[255 & n] + e[n >> 8 & 255] + e[n >> 16 & 255] + e[n >> 24 & 255] + "-" + e[255 & o] + e[o >> 8 & 255] + "-" + e[o >> 16 & 15 | 64] + e[o >> 24 & 255] + "-" + e[63 & r | 128] + e[r >> 8 & 255] + "-" + e[r >> 16 & 255] + e[r >> 24 & 255] + e[255 & i] + e[i >> 8 & 255] + e[i >> 16 & 255] + e[i >> 24 & 255]).toUpperCase();
                        }
                    },
                    {
                        key: "createElement",
                        value: function(e) {
                            var t = document.createElement(e.tagName || "div");
                            for(var n in e)switch(n){
                                case "tagName":
                                    break;
                                case "parentNode":
                                    e[n].appendChild(t);
                                    break;
                                case "style":
                                    for(var o in e.style)t.style[o] = e.style[o];
                                    break;
                                case "on":
                                    for(var r in e[n])this.$(t).on(r, e[n][r]);
                                    break;
                                default:
                                    t[n] = e[n];
                            }
                            return t;
                        }
                    }
                ]), e;
            }();
            c.prototype.isReady = !0, c.prototype.slice = [].slice, c.prototype.concat = [].concat, c.prototype.push = [].push, c.prototype.indexOf = [].indexOf, c.prototype.toString = ({}).toString, c.prototype.hasOwn = ({}).hasOwnProperty, c.prototype.isArray = Array.isArray, c.prototype.guid = 1, c.prototype.now = Date.now;
            var l = function(e) {
                function i(e) {
                    var r;
                    a(this, i);
                    var s = [];
                    if ((r = n(this, o(i).call(this))).isDom(e)) s.push(e);
                    else if ("string" == typeof e) {
                        var u = document.querySelectorAll(e);
                        s.push.apply(s, t(u));
                    } else if (r.isArray(e)) s.push.apply(s, t(e));
                    else if (r.isArraylike(e)) for(var c = 0; c < e.length; c++)s.push(e[c]);
                    else s.push(e);
                    return r.domArr = s, r.touches = {
                        tap: {},
                        singleTap: {},
                        doubleTap: {},
                        longTap: {},
                        swipe: {},
                        swipeLeft: {},
                        swipeRight: {},
                        swipeUp: {},
                        swipeDown: {},
                        wheel: {},
                        down: {},
                        move: {},
                        up: {}
                    }, console.log(r.domArr), r.settings = {
                        tapDurationThreshold: 250,
                        scrollSupressionThreshold: 20,
                        swipeDurationThreshold: 750,
                        horizontalDistanceThreshold: 40,
                        verticalDistanceThreshold: 75,
                        tapHoldDurationThreshold: 750,
                        doubleTapInterval: 250
                    }, r;
                }
                return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && r(e, t);
                }(i, c), u(i, [
                    {
                        key: "on",
                        value: function(e, t, n, o) {
                            this[e](t, n, o);
                        }
                    },
                    {
                        key: "remove",
                        value: function(e, t) {
                            var n = this, o = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
                            this.domArr.forEach(function(r, i) {
                                switch(e){
                                    case "tap":
                                    case "singleTap":
                                    case "doubleTap":
                                    case "longTap":
                                    case "swipe":
                                    case "swipeLeft":
                                    case "swipeRight":
                                    case "swipeUp":
                                    case "swipeDown":
                                        if (t) r.removeEventListener(n.getDownKey(), n.touches[e][t], o);
                                        else for(var a in n.touches[e])r.removeEventListener(n.getDownKey(), n.touches[e][a], o);
                                        break;
                                    case "wheel":
                                        if (t) r.removeEventListener("mousewheel", n.touches[e][t], o), r.removeEventListener("DOMMouseScroll", n.touches[e][t], o);
                                        else for(var s in n.touches[e])r.removeEventListener("mousewheel", n.touches[e][s], o), r.removeEventListener("DOMMouseScroll", n.touches[e][s], o);
                                        break;
                                    case "down":
                                        if (t) r.removeEventListener(n.getDownKey(), n.touches[e][t], o);
                                        else for(var u in n.touches[e])n.touches[e][u].removeAll && r.removeEventListener(n.getDownKey(), n.touches[e][u], o);
                                        break;
                                    case "move":
                                        if (t) r.removeEventListener(n.getMoveKey(), n.touches[e][t], o);
                                        else for(var c in n.touches[e])n.touches[e][c].removeAll && r.removeEventListener(n.getMoveKey(), n.touches[e][c], o);
                                        break;
                                    case "up":
                                        if (t) r.removeEventListener(n.getUpKey(), n.touches[e][t], o);
                                        else for(var l in n.touches[e])n.touches[e][l].removeAll && r.removeEventListener(n.getUpKey(), n.touches[e][l], o);
                                        break;
                                    default:
                                        console.warn("取消没有绑定的事件");
                                }
                            });
                        }
                    },
                    {
                        key: "tap",
                        value: function(e) {
                            var t, n = this, o = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], r = {}, i = {}, a = "pc" === this.browserRedirect(), s = function s(u) {
                                u.preventDefault(), i.end = a ? u : u.changedTouches, r.end = +new Date, document.removeEventListener(n.getUpKey(), s, o), !a && (i.start.length > 1 || i.end.length > 1) || r.end - r.start <= n.settings.tapDurationThreshold && n.getEventRange(i.start, i.end) < n.settings.scrollSupressionThreshold && e.call(t.target, t);
                            }, u = function(e) {
                                e.preventDefault(), 0 !== e.button && a || (r.start = +new Date, i.start = a ? e : e.touches, t = e, document.addEventListener(n.getUpKey(), s, o));
                            };
                            this.down(u, o, !1), this.touches.tap[e] = u;
                        }
                    },
                    {
                        key: "singleTap",
                        value: function(e) {
                            var t, n, o = this, r = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], i = {}, a = {}, s = "pc" === this.browserRedirect(), u = !1, c = function c(l) {
                                if (l.preventDefault(), a.end = s ? l : l.changedTouches, i.endTime = +new Date, document.removeEventListener(o.getUpKey(), c, r), (s || !(a.start.length > 1 || a.end.length > 1)) && i.endTime - i.startTime <= o.settings.tapDurationThreshold && o.getEventRange(a.start, a.end) < o.settings.scrollSupressionThreshold) {
                                    if (u) return;
                                    n = setTimeout(function() {
                                        e.call(t.target, t);
                                    }, o.settings.doubleTapInterval);
                                }
                            }, l = function(e) {
                                e.preventDefault(), 0 !== e.button && s || (i.startTime = +new Date, a.start = s ? e : e.touches, t = e, i.startTime - i.endTime < o.settings.doubleTapInterval ? (clearTimeout(n), u = !0) : u = !1, document.addEventListener(o.getUpKey(), c, r));
                            };
                            this.down(l, r, !1), this.touches.singleTap[e] = l;
                        }
                    },
                    {
                        key: "doubleTap",
                        value: function(e) {
                            var t, n = this, o = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], r = {}, i = {}, a = "pc" === this.browserRedirect();
                            r.prevTime = 0;
                            var s = function s(u) {
                                u.preventDefault(), i.end = a ? u : u.changedTouches, r.endTime = +new Date, document.removeEventListener(n.getUpKey(), s, o), (a || !(i.start.length > 1 || i.end.length > 1)) && r.endTime - r.startTime <= n.settings.tapDurationThreshold && n.getEventRange(i.start, i.end) < n.settings.scrollSupressionThreshold ? 0 !== r.prevTime && r.endTime - r.prevTime < n.settings.doubleTapInterval ? e.call(t.target, t) : r.prevTime = r.endTime : r.prevTime = 0;
                            }, u = function(e) {
                                e.preventDefault(), 0 !== e.button && a || (r.startTime = +new Date, i.start = a ? e : e.touches, t = e, document.addEventListener(n.getUpKey(), s, o));
                            };
                            this.down(u, o, !1), this.touches.doubleTap[e] = u;
                        }
                    },
                    {
                        key: "longTap",
                        value: function(e) {
                            var t, n, o = this, r = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], i = {}, a = {}, s = "pc" === this.browserRedirect(), u = function(e) {
                                a.move = s ? e : e.changedTouches;
                            }, c = function e(t) {
                                clearTimeout(n), document.removeEventListener(o.getMoveKey(), u, r), document.removeEventListener(o.getUpKey(), e, r);
                            }, l = function(l) {
                                l.preventDefault(), 0 !== l.button && s || (i.startTime = +new Date, a.start = s ? l : l.touches, t = l, n = setTimeout(function() {
                                    c(), !s && (a.start.length > 1 || a.move && a.move.length > 1) || (!a.move || o.getEventRange(a.start, a.move) < o.settings.scrollSupressionThreshold) && e.call(t.target, t);
                                }, o.settings.tapHoldDurationThreshold), document.addEventListener(o.getMoveKey(), u, r), document.addEventListener(o.getUpKey(), c, r));
                            };
                            this.down(l, r, !1), this.touches.longTap[e] = l;
                        }
                    },
                    {
                        key: "swipe",
                        value: function(e) {
                            var t, n = this, o = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], r = {}, i = {}, a = "pc" === this.browserRedirect(), s = function s(u) {
                                u.preventDefault(), i.end = a ? u : u.changedTouches, r.end = +new Date, document.removeEventListener(n.getUpKey(), s, o), !a && (i.start.length > 1 || i.end.length > 1) || r.end - r.start <= n.settings.swipeDurationThreshold && n.getEventRange(i.start, i.end) > n.settings.horizontalDistanceThreshold && e.call(t.target, t);
                            }, u = function(e) {
                                e.preventDefault(), 0 !== e.button && a || (r.start = +new Date, i.start = a ? e : e.touches, t = e, document.addEventListener(n.getUpKey(), s, o));
                            };
                            this.down(u, o, !1), this.touches.swipe[e] = u;
                        }
                    },
                    {
                        key: "swipeLeft",
                        value: function(e) {
                            var t, n = this, o = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], r = {}, i = {}, a = "pc" === this.browserRedirect(), s = function s(u) {
                                u.preventDefault(), i.end = a ? u : u.changedTouches, r.end = +new Date, document.removeEventListener(n.getUpKey(), s, o), !a && (i.start.length > 1 || i.end.length > 1) || r.end - r.start <= n.settings.swipeDurationThreshold && n.getEventRange(i.start, i.end) > n.settings.verticalDistanceThreshold && (n.getEventAngle(i.start, i.end) >= 135 || n.getEventAngle(i.start, i.end) <= -135) && e.call(t.target, t);
                            }, u = function(e) {
                                e.preventDefault(), 0 !== e.button && a || (r.start = +new Date, i.start = a ? e : e.touches, t = e, document.addEventListener(n.getUpKey(), s, o));
                            };
                            this.down(u, o, !1), this.touches.swipeLeft[e] = u;
                        }
                    },
                    {
                        key: "swipeRight",
                        value: function(e) {
                            var t, n = this, o = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], r = {}, i = {}, a = "pc" === this.browserRedirect(), s = function s(u) {
                                u.preventDefault(), i.end = a ? u : u.changedTouches, r.end = +new Date, document.removeEventListener(n.getUpKey(), s, o), !a && (i.start.length > 1 || i.end.length > 1) || r.end - r.start <= n.settings.swipeDurationThreshold && n.getEventRange(i.start, i.end) > n.settings.verticalDistanceThreshold && n.getEventAngle(i.start, i.end) >= -45 && n.getEventAngle(i.start, i.end) <= 45 && e.call(t.target, t);
                            }, u = function(e) {
                                e.preventDefault(), 0 !== e.button && a || (r.start = +new Date, i.start = a ? e : e.touches, t = e, document.addEventListener(n.getUpKey(), s, o));
                            };
                            this.down(u, o, !1), this.touches.swipeRight[e] = u;
                        }
                    },
                    {
                        key: "swipeUp",
                        value: function(e) {
                            var t, n = this, o = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], r = {}, i = {}, a = "pc" === this.browserRedirect(), s = function s(u) {
                                u.preventDefault(), i.end = a ? u : u.changedTouches, r.end = +new Date, document.removeEventListener(n.getUpKey(), s, o), !a && (i.start.length > 1 || i.end.length > 1) || r.end - r.start <= n.settings.swipeDurationThreshold && n.getEventRange(i.start, i.end) > n.settings.verticalDistanceThreshold && n.getEventAngle(i.start, i.end) > -135 && n.getEventAngle(i.start, i.end) < -45 && e.call(t.target, t);
                            }, u = function(e) {
                                e.preventDefault(), 0 !== e.button && a || (r.start = +new Date, i.start = a ? e : e.touches, t = e, document.addEventListener(n.getUpKey(), s, o));
                            };
                            this.down(u, o, !1), this.touches.swipeUp[e] = u;
                        }
                    },
                    {
                        key: "swipeDown",
                        value: function(e) {
                            var t, n = this, o = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], r = {}, i = {}, a = "pc" === this.browserRedirect(), s = function s(u) {
                                u.preventDefault(), i.end = a ? u : u.changedTouches, r.end = +new Date, document.removeEventListener(n.getUpKey(), s, o), !a && (i.start.length > 1 || i.end.length > 1) || r.end - r.start <= n.settings.swipeDurationThreshold && n.getEventRange(i.start, i.end) > n.settings.verticalDistanceThreshold && n.getEventAngle(i.start, i.end) > 45 && n.getEventAngle(i.start, i.end) < 135 && e.call(t.target, t);
                            }, u = function(e) {
                                e.preventDefault(), 0 !== e.button && a || (r.start = +new Date, i.start = a ? e : e.touches, t = e, document.addEventListener(n.getUpKey(), s, o));
                            };
                            this.down(u, o, !1), this.touches.swipeDown[e] = u;
                        }
                    },
                    {
                        key: "wheel",
                        value: function(e, t) {
                            var n = this, o = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2], r = function(o, r) {
                                o >= 0 ? n.isFunction(e) && e.call(r.target, r) : o < 0 && n.isFunction(t) && t.call(r.target, r);
                            }, i = function(e) {
                                e.preventDefault(), e.wheelDelta ? r(-e.wheelDelta / 120, e) : e.detail && (-3 === e.detail ? r(-1, e) : 3 === e.detail ? r(1, e) : console.log("鼠标滚轮事件改了？", e.wheelDelta));
                            };
                            this.domArr.forEach(function(e, t) {
                                e.addEventListener("mousewheel", i, o), e.addEventListener("DOMMouseScroll", i, o);
                            }), this.touches.wheel[e] = i;
                        }
                    },
                    {
                        key: "down",
                        value: function(e) {
                            var t = this, n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], o = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
                            console.log(this.domArr, e), this.domArr.forEach(function(o, r) {
                                o.addEventListener(t.getDownKey(), e, n);
                            }), e.removeAll = o, this.touches.down[e] = e;
                        }
                    },
                    {
                        key: "move",
                        value: function(e) {
                            var t = this, n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], o = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
                            this.domArr.forEach(function(o, r) {
                                o.addEventListener(t.getMoveKey(), e, n);
                            }), e.removeAll = o, this.touches.move[e] = e;
                        }
                    },
                    {
                        key: "up",
                        value: function(e) {
                            var t = this, n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], o = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
                            this.domArr.forEach(function(o, r) {
                                o.addEventListener(t.getUpKey(), e, n);
                            }), e.removeAll = o, this.touches.up[e] = e;
                        }
                    },
                    {
                        key: "getDownKey",
                        value: function() {
                            return "pc" === this.browserRedirect() ? "mousedown" : "touchstart";
                        }
                    },
                    {
                        key: "getMoveKey",
                        value: function() {
                            return "pc" === this.browserRedirect() ? "mousemove" : "touchmove";
                        }
                    },
                    {
                        key: "getUpKey",
                        value: function() {
                            return "pc" === this.browserRedirect() ? "mouseup" : "touchend";
                        }
                    },
                    {
                        key: "getEventRange",
                        value: function(e, t) {
                            return "pc" === this.browserRedirect() ? this.getRange(e.clientX, e.clientY, t.clientX, t.clientY) : this.getRange(e[0].clientX, e[0].clientY, t[0].clientX, t[0].clientY);
                        }
                    },
                    {
                        key: "getEventAngle",
                        value: function(e, t) {
                            return "pc" === this.browserRedirect() ? this.getAngle(e.clientX, e.clientY, t.clientX, t.clientY) : this.getAngle(e[0].clientX, e[0].clientY, t[0].clientX, t[0].clientY);
                        }
                    }
                ]), i;
            }();
            window.Dop = c, "object" === i(e) && (e.exports = c);
        }).call(t, n(1)(e));
    },
    function(e, t) {
        e.exports = function(e) {
            return e.webpackPolyfill || (e.deprecate = function() {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {
                enumerable: !0,
                get: function() {
                    return e.l;
                }
            }), Object.defineProperty(e, "id", {
                enumerable: !0,
                get: function() {
                    return e.i;
                }
            }), e.webpackPolyfill = 1), e;
        };
    }
]);

//# sourceMappingURL=index.2d266dc5.js.map
