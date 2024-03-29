webshims.register("dom-extend", function (e, t, n, i, a) {
	"use strict";
	var r = !("hrefNormalized"in e.support) || e.support.hrefNormalized, o = !("getSetAttribute"in e.support) || e.support.getSetAttribute;
	if (t.assumeARIA = o || Modernizr.canvas || Modernizr.video || Modernizr.boxsizing, ("text" == e('<input type="email" />').attr("type") || "" === e("<form />").attr("novalidate") || "required"in e("<input />")[0].attributes) && t.error("IE browser modes are busted in IE10. Please test your HTML/CSS/JS with a real IE version or at least IETester or similiar tools"), e.parseHTML || t.error("Webshims needs jQuery 1.8+ to work properly. Please update your jQuery version or downgrade webshims."), !t.cfg.no$Switch) {
		var s = function () {
			if (!n.jQuery || n.$ && n.jQuery != n.$ || n.jQuery.webshims || (t.error("jQuery was included more than once. Make sure to include it only once or try the $.noConflict(extreme) feature! Webshims and other Plugins might not work properly. Or set webshims.cfg.no$Switch to 'true'."), n.$ && (n.$ = t.$), n.jQuery = t.$), t.M != Modernizr) {
				t.error("Modernizr was included more than once. Make sure to include it only once! Webshims and other scripts might not work properly.");
				for (var e in Modernizr)e in t.M || (t.M[e] = Modernizr[e]);
				Modernizr = t.M
			}
		};
		s(), setTimeout(s, 90), t.ready("DOM", s), e(s), t.ready("WINDOWLOAD", s)
	}
	var l = t.modules, u = /\s*,\s*/, c = {}, d = {}, p = {}, h = {}, f = {}, m = e.fn.val, v = function (t, n, i, a, r) {return r ? m.call(e(t)) : m.call(e(t), i)};
	e.widget || function () {
		var t = e.cleanData;
		e.cleanData = function (n) {
			if (!e.widget)for (var i, a = 0; null != (i = n[a]); a++)try {e(i).triggerHandler("remove")} catch (r) {}
			t(n)
		}
	}(), e.fn.val = function (t) {
		var n = this[0];
		if (arguments.length && null == t && (t = ""), !arguments.length)return n && 1 === n.nodeType ? e.prop(n, "value", t, "val", !0) : m.call(this);
		if (e.isArray(t))return m.apply(this, arguments);
		var i = e.isFunction(t);
		return this.each(function (r) {
			if (n = this, 1 === n.nodeType)if (i) {
				var o = t.call(n, r, e.prop(n, "value", a, "val", !0));
				null == o && (o = ""), e.prop(n, "value", o, "val")
			} else e.prop(n, "value", t, "val")
		})
	}, e.fn.onTrigger = function (e, t) {return this.on(e, t).each(t)}, e.fn.onWSOff = function (t, n, a, r) {return r || (r = i), e(r)[a ? "onTrigger" : "on"](t, n), this.on("remove", function (i) {i.originalEvent || e(r).off(t, n)}), this};
	var g = "_webshimsLib" + Math.round(1e3 * Math.random()), y = function (t, n, i) {
		if (t = t.jquery ? t[0] : t, !t)return i || {};
		var r = e.data(t, g);
		return i !== a && (r || (r = e.data(t, g, {})), n && (r[n] = i)), n ? r && r[n] : r
	};
	[
		{name: "getNativeElement", prop: "nativeElement"},
		{name: "getShadowElement", prop: "shadowElement"},
		{name: "getShadowFocusElement", prop: "shadowFocusElement"}
	].forEach(function (t) {
		e.fn[t.name] = function () {
			var n = [];
			return this.each(function () {
				var i = y(this, "shadowData"), a = i && i[t.prop] || this;
				-1 == e.inArray(a, n) && n.push(a)
			}), this.pushStack(n)
		}
	}), ["removeAttr", "prop", "attr"].forEach(function (n) {
		c[n] = e[n], e[n] = function (t, i, r, o, s) {
			var l = "val" == o, u = l ? v : c[n];
			if (!t || !d[i] || 1 !== t.nodeType || !l && o && "attr" == n && e.attrFn[i])return u(t, i, r, o, s);
			var h, m, g, y = (t.nodeName || "").toLowerCase(), b = p[y], w = "attr" != n || r !== !1 && null !== r ? n : "removeAttr";
			if (b || (b = p["*"]), b && (b = b[i]), b && (h = b[w]), h) {
				if ("value" == i && (m = h.isVal, h.isVal = l), "removeAttr" === w)return h.value.call(t);
				if (r === a)return h.get ? h.get.call(t) : h.value;
				h.set && ("attr" == n && r === !0 && (r = i), g = h.set.call(t, r)), "value" == i && (h.isVal = m)
			} else g = u(t, i, r, o, s);
			if ((r !== a || "removeAttr" === w) && f[y] && f[y][i]) {
				var x;
				x = "removeAttr" == w ? !1 : "prop" == w ? !!r : !0, f[y][i].forEach(function (e) {(!e.only || (e.only = "prop" && "prop" == n) || "attr" == e.only && "prop" != n) && e.call(t, r, x, l ? "val" : w, n)})
			}
			return g
		}, h[n] = function (e, i, r) {
			p[e] || (p[e] = {}), p[e][i] || (p[e][i] = {});
			var o = p[e][i][n], s = function (e, t, a) {
				return t && t[e] ? t[e] : a && a[e] ? a[e] : "prop" == n && "value" == i ? function (e) {
					var t = this;
					return r.isVal ? v(t, i, e, !1, 0 === arguments.length) : c[n](t, i, e)
				} : "prop" == n && "value" == e && r.value.apply ? function () {
					var e = c[n](this, i);
					return e && e.apply && (e = e.apply(this, arguments)), e
				} : function (e) {return c[n](this, i, e)}
			};
			p[e][i][n] = r, r.value === a && (r.set || (r.set = r.writeable ? s("set", r, o) : t.cfg.useStrict && "prop" == i ? function () {throw i + " is readonly on " + e} : function () {t.info(i + " is readonly on " + e)}), r.get || (r.get = s("get", r, o))), ["value", "get", "set"].forEach(function (e) {r[e] && (r["_sup" + e] = s(e, o))})
		}
	});
	var b = function () {
		var e = t.getPrototypeOf(i.createElement("foobar")), n = Object.prototype.hasOwnProperty, a = Modernizr.advancedObjectProperties && Modernizr.objectAccessor;
		return function (r, o, s) {
			var l, u;
			if (!(a && (l = i.createElement(r)) && (u = t.getPrototypeOf(l)) && e !== u) || l[o] && n.call(l, o))s._supvalue = function () {
				var e = y(this, "propValue");
				return e && e[o] && e[o].apply ? e[o].apply(this, arguments) : e && e[o]
			}, w.extendValue(r, o, s.value); else {
				var c = l[o];
				s._supvalue = function () {return c && c.apply ? c.apply(this, arguments) : c}, u[o] = s.value
			}
			s.value._supvalue = s._supvalue
		}
	}(), w = function () {
		var n = {};
		t.addReady(function (i, r) {
			var o = {}, s = function (t) {o[t] || (o[t] = e(i.getElementsByTagName(t)), r[0] && e.nodeName(r[0], t) && (o[t] = o[t].add(r)))};
			e.each(n, function (e, n) {return s(e), n && n.forEach ? (n.forEach(function (t) {o[e].each(t)}), a) : (t.warn("Error: with " + e + "-property. methods: " + n), a)}), o = null
		});
		var r, o = e([]), s = function (t, a) {n[t] ? n[t].push(a) : n[t] = [a], e.isDOMReady && (r || e(i.getElementsByTagName(t))).each(a)};
		return{createTmpCache: function (t) {return e.isDOMReady && (r = r || e(i.getElementsByTagName(t))), r || o}, flushTmpCache: function () {r = null}, content: function (t, n) {
			s(t, function () {
				var t = e.attr(this, n);
				null != t && e.attr(this, n, t)
			})
		}, createElement     : function (e, t) {s(e, t)}, extendValue: function (t, n, i) {
			s(t, function () {
				e(this).each(function () {
					var e = y(this, "propValue", {});
					e[n] = this[n], this[n] = i
				})
			})
		}}
	}(), x = function (e, t) {e.defaultValue === a && (e.defaultValue = ""), e.removeAttr || (e.removeAttr = {value: function () {e[t || "prop"].set.call(this, e.defaultValue), e.removeAttr._supvalue.call(this)}}), e.attr || (e.attr = {})};
	e.extend(t, {getID          : function () {
		var t = (new Date).getTime();
		return function (n) {
			n = e(n);
			var i = n.prop("id");
			return i || (t++, i = "ID-" + t, n.eq(0).prop("id", i)), i
		}
	}(), implement              : function (e, n) {
		var i = y(e, "implemented") || y(e, "implemented", {});
		return i[n] ? (t.warn(n + " already implemented for element #" + e.id), !1) : (i[n] = !0, !0)
	}, extendUNDEFProp          : function (t, n) {e.each(n, function (e, n) {e in t || (t[e] = n)})}, createPropDefault: x, data: y, moveToFirstEvent: function (t, n, i) {
		var a, r = (e._data(t, "events") || {})[n];
		r && r.length > 1 && (a = r.pop(), i || (i = "bind"), "bind" == i && r.delegateCount ? r.splice(r.delegateCount, 0, a) : r.unshift(a)), t = null
	}, addShadowDom             : function () {
		var a, r, o, s = {init: !1, runs: 0, test: function () {
			var e = s.getHeight(), t = s.getWidth();
			e != s.height || t != s.width ? (s.height = e, s.width = t, s.handler({type: "docresize"}), s.runs++, 9 > s.runs && setTimeout(s.test, 90)) : s.runs = 0
		}, handler            : function (t) {
			clearTimeout(a), a = setTimeout(function () {
				if ("resize" == t.type) {
					var a = e(n).width(), l = e(n).width();
					if (l == r && a == o)return;
					r = l, o = a, s.height = s.getHeight(), s.width = s.getWidth()
				}
				e(i).triggerHandler("updateshadowdom")
			}, "resize" == t.type ? 50 : 9)
		}, _create            : function () {
			e.each({Height: "getHeight", Width: "getWidth"}, function (e, t) {
				var n = i.body, a = i.documentElement;
				s[t] = function () {return Math.max(n["scroll" + e], a["scroll" + e], n["offset" + e], a["offset" + e], a["client" + e])}
			})
		}, start              : function () {
			!this.init && i.body && (this.init = !0, this._create(), this.height = s.getHeight(), this.width = s.getWidth(), setInterval(this.test, 600), e(this.test), t.ready("WINDOWLOAD", this.test), e(i).on("updatelayout", this.handler), e(n).bind("resize", this.handler), function () {
				var t, n = e.fn.animate;
				e.fn.animate = function () {return clearTimeout(t), t = setTimeout(function () {s.test()}, 99), n.apply(this, arguments)}
			}())
		}};
		return t.docObserve = function () {t.ready("DOM", function () {s.start()})}, function (n, i, a) {
			if (n && i) {
				a = a || {}, n.jquery && (n = n[0]), i.jquery && (i = i[0]);
				var r = e.data(n, g) || e.data(n, g, {}), o = e.data(i, g) || e.data(i, g, {}), s = {};
				a.shadowFocusElement ? a.shadowFocusElement && (a.shadowFocusElement.jquery && (a.shadowFocusElement = a.shadowFocusElement[0]), s = e.data(a.shadowFocusElement, g) || e.data(a.shadowFocusElement, g, s)) : a.shadowFocusElement = i, e(n).on("remove", function (t) {t.originalEvent || setTimeout(function () {e(i).remove()}, 4)}), r.hasShadow = i, s.nativeElement = o.nativeElement = n, s.shadowData = o.shadowData = r.shadowData = {nativeElement: n, shadowElement: i, shadowFocusElement: a.shadowFocusElement}, a.shadowChilds && a.shadowChilds.each(function () {y(this, "shadowData", o.shadowData)}), a.data && (s.shadowData.data = o.shadowData.data = r.shadowData.data = a.data), a = null
			}
			t.docObserve()
		}
	}(), propTypes              : {standard: function (e) {x(e), e.prop || (e.prop = {set: function (t) {e.attr.set.call(this, "" + t)}, get: function () {return e.attr.get.call(this) || e.defaultValue}})}, "boolean": function (e) {x(e), e.prop || (e.prop = {set: function (t) {t ? e.attr.set.call(this, "") : e.removeAttr.value.call(this)}, get: function () {return null != e.attr.get.call(this)}})}, src: function () {
		var t = i.createElement("a");
		return t.style.display = "none", function (n, i) {
			x(n), n.prop || (n.prop = {set: function (e) {n.attr.set.call(this, e)}, get: function () {
				var n, a = this.getAttribute(i);
				if (null == a)return"";
				if (t.setAttribute("href", a + ""), !r) {
					try {e(t).insertAfter(this), n = t.getAttribute("href", 4)} catch (o) {n = t.getAttribute("href", 4)}
					e(t).detach()
				}
				return n || t.href
			}})
		}
	}(), enumarated                        : function (e) {
		x(e), e.prop || (e.prop = {set: function (t) {e.attr.set.call(this, t)}, get: function () {
			var t = (e.attr.get.call(this) || "").toLowerCase();
			return t && -1 != e.limitedTo.indexOf(t) || (t = e.defaultValue), t
		}})
	}}, reflectProperties       : function (n, i) {"string" == typeof i && (i = i.split(u)), i.forEach(function (i) {t.defineNodeNamesProperty(n, i, {prop: {set: function (t) {e.attr(this, i, t)}, get: function () {return e.attr(this, i) || ""}}})})}, defineNodeNameProperty: function (n, i, a) {
		return d[i] = !0, a.reflect && t.propTypes[a.propType || "standard"](a, i), ["prop", "attr", "removeAttr"].forEach(function (r) {
			var o = a[r];
			o && (o = "prop" === r ? e.extend({writeable: !0}, o) : e.extend({}, o, {writeable: !0}), h[r](n, i, o), "*" != n && t.cfg.extendNative && "prop" == r && o.value && e.isFunction(o.value) && b(n, i, o), a[r] = o)
		}), a.initAttr && w.content(n, i), a
	}, defineNodeNameProperties : function (e, n, i, a) {
		for (var r in n)!a && n[r].initAttr && w.createTmpCache(e), i && (n[r][i] || (n[r][i] = {}, ["value", "set", "get"].forEach(function (e) {e in n[r] && (n[r][i][e] = n[r][e], delete n[r][e])}))), n[r] = t.defineNodeNameProperty(e, r, n[r]);
		return a || w.flushTmpCache(), n
	}, createElement            : function (n, i, a) {
		var r;
		return e.isFunction(i) && (i = {after: i}), w.createTmpCache(n), i.before && w.createElement(n, i.before), a && (r = t.defineNodeNameProperties(n, a, !1, !0)), i.after && w.createElement(n, i.after), w.flushTmpCache(), r
	}, onNodeNamesPropertyModify: function (t, n, i, a) {"string" == typeof t && (t = t.split(u)), e.isFunction(i) && (i = {set: i}), t.forEach(function (e) {f[e] || (f[e] = {}), "string" == typeof n && (n = n.split(u)), i.initAttr && w.createTmpCache(e), n.forEach(function (t) {f[e][t] || (f[e][t] = [], d[t] = !0), i.set && (a && (i.set.only = a), f[e][t].push(i.set)), i.initAttr && w.content(e, t)}), w.flushTmpCache()})}, defineNodeNamesBooleanProperty: function (n, i, r) {
		r || (r = {}), e.isFunction(r) && (r.set = r), t.defineNodeNamesProperty(n, i, {attr: {set: function (e) {this.setAttribute(i, e), r.set && r.set.call(this, !0)}, get: function () {
			var e = this.getAttribute(i);
			return null == e ? a : i
		}}, removeAttr                                                                      : {value: function () {this.removeAttribute(i), r.set && r.set.call(this, !1)}}, reflect: !0, propType: "boolean", initAttr: r.initAttr || !1})
	}, contentAttr              : function (e, t, n) {
		if (e.nodeName) {
			var i;
			return n === a ? (i = e.attributes[t] || {}, n = i.specified ? i.value : null, null == n ? a : n) : ("boolean" == typeof n ? n ? e.setAttribute(t, t) : e.removeAttribute(t) : e.setAttribute(t, n), a)
		}
	}, activeLang               : function () {
		var n, i, a = [], r = {}, o = /:\/\/|^\.*\//, s = function (n, i, a) {
			var r;
			return i && a && -1 !== e.inArray(i, a.availabeLangs || []) ? (n.loading = !0, r = a.langSrc, o.test(r) || (r = t.cfg.basePath + r), t.loader.loadScript(r + i + ".js", function () {n.langObj[i] ? (n.loading = !1, c(n, !0)) : e(function () {n.langObj[i] && c(n, !0), n.loading = !1})}), !0) : !1
		}, u = function (e) {r[e] && r[e].forEach(function (e) {e.callback(n, i, "")})}, c = function (e, t) {
			if (e.activeLang != n && e.activeLang !== i) {
				var a = l[e.module].options;
				e.langObj[n] || i && e.langObj[i] ? (e.activeLang = n, e.callback(e.langObj[n] || e.langObj[i], n), u(e.module)) : t || s(e, n, a) || s(e, i, a) || !e.langObj[""] || "" === e.activeLang || (e.activeLang = "", e.callback(e.langObj[""], n), u(e.module))
			}
		}, d = function (t) {return"string" == typeof t && t !== n ? (n = t, i = n.split("-")[0], n == i && (i = !1), e.each(a, function (e, t) {c(t)})) : "object" == typeof t && (t.register ? (r[t.register] || (r[t.register] = []), r[t.register].push(t), t.callback(n, i, "")) : (t.activeLang || (t.activeLang = ""), a.push(t), c(t))), n};
		return d
	}()}), e.each({defineNodeNamesProperty: "defineNodeNameProperty", defineNodeNamesProperties: "defineNodeNameProperties", createElements: "createElement"}, function (e, n) {
		t[e] = function (e, i, a, r) {
			"string" == typeof e && (e = e.split(u));
			var o = {};
			return e.forEach(function (e) {o[e] = t[n](e, i, a, r)}), o
		}
	}), t.isReady("webshimLocalization", !0)
}), function (e, t) {
	if (!(!e.webshims.assumeARIA || "content"in t.createElement("template") || (e(function () {
		var t = e("main").attr({role: "main"});
		t.length > 1 ? webshims.error("only one main element allowed in document") : t.is("article *, section *") && webshims.error("main not allowed inside of article/section elements")
	}), "hidden"in t.createElement("a")))) {
		var n = {article: "article", aside: "complementary", section: "region", nav: "navigation", address: "contentinfo"}, i = function (e, t) {
			var n = e.getAttribute("role");
			n || e.setAttribute("role", t)
		};
		e.webshims.addReady(function (a, r) {
			if (e.each(n, function (t, n) {for (var o = e(t, a).add(r.filter(t)), s = 0, l = o.length; l > s; s++)i(o[s], n)}), a === t) {
				var o = t.getElementsByTagName("header")[0], s = t.getElementsByTagName("footer"), l = s.length;
				if (o && !e(o).closest("section, article")[0] && i(o, "banner"), !l)return;
				var u = s[l - 1];
				e(u).closest("section, article")[0] || i(u, "contentinfo")
			}
		})
	}
}(webshims.$, document), webshims.register("form-core", function (e, t, n, i, a, r) {
	"use strict";
	t.capturingEventPrevented = function (t) {
		if (!t._isPolyfilled) {
			var n = t.isDefaultPrevented, i = t.preventDefault;
			t.preventDefault = function () {return clearTimeout(e.data(t.target, t.type + "DefaultPrevented")), e.data(t.target, t.type + "DefaultPrevented", setTimeout(function () {e.removeData(t.target, t.type + "DefaultPrevented")}, 30)), i.apply(this, arguments)}, t.isDefaultPrevented = function () {return!(!n.apply(this, arguments) && !e.data(t.target, t.type + "DefaultPrevented"))}, t._isPolyfilled = !0
		}
	}, Modernizr.formvalidation && !t.bugs.bustedValidity && t.capturingEvents(["invalid"], !0);
	var o = function (t) {return(e.prop(t, "validity") || {valid: 1}).valid}, s = function () {
		var n = ["form-validation"];
		r.lazyCustomMessages && (r.customMessages = !0, n.push("form-message")), r.customDatalist && (r.fD = !0, n.push("form-datalist")), r.addValidators && n.push("form-validators"), t.reTest(n), e(i).off(".lazyloadvalidation")
	}, l = function (t) {
		var n = !1;
		return e(t).jProp("elements").each(function () {return n = e(this).is(":invalid"), n ? !1 : a}), n
	}, u = /^(?:form)$/i;
	e.extend(e.expr[":"], {"valid-element": function (t) {return u.test(t.nodeName || "") ? !l(t) : !(!e.prop(t, "willValidate") || !o(t))}, "invalid-element": function (t) {return u.test(t.nodeName || "") ? l(t) : !(!e.prop(t, "willValidate") || o(t))}, "required-element": function (t) {return!(!e.prop(t, "willValidate") || !e.prop(t, "required"))}, "user-error": function (t) {return e.prop(t, "willValidate") && e(t).hasClass("user-error")}, "optional-element": function (t) {return!(!e.prop(t, "willValidate") || e.prop(t, "required") !== !1)}}), ["valid", "invalid", "required", "optional"].forEach(function (t) {e.expr[":"][t] = e.expr.filters[t + "-element"]});
	var c = e.expr[":"].focus;
	e.expr[":"].focus = function () {
		try {return c.apply(this, arguments)} catch (e) {t.error(e)}
		return!1
	}, t.triggerInlineForm = function (t, n) {e(t).trigger(n)};
	var d = function (e, n, i) {s(), t.ready("form-validation", function () {e[n].apply(e, i)})}, p = "transitionDelay"in i.documentElement.style ? "" : " no-transition", h = t.cfg.wspopover;
	h.position || h.position === !1 || (h.position = {at: "left bottom", my: "left top", collision: "fit flip"}), t.wsPopover = {id: 0, _create: function () {this.options = e.extend(!0, {}, h, this.options), this.id = t.wsPopover.id++, this.eventns = ".wsoverlay" + this.id, this.timers = {}, this.element = e('<div class="ws-popover' + p + '" tabindex="-1"><div class="ws-po-outerbox"><div class="ws-po-arrow"><div class="ws-po-arrowbox" /></div><div class="ws-po-box" /></div></div>'), this.contentElement = e(".ws-po-box", this.element), this.lastElement = e([]), this.bindElement(), this.element.data("wspopover", this)}, options: {}, content: function (e) {this.contentElement.html(e)}, bindElement: function () {
		var e = this, t = function () {e.stopBlur = !1};
		this.preventBlur = function () {e.stopBlur = !0, clearTimeout(e.timers.stopBlur), e.timers.stopBlur = setTimeout(t, 9)}, this.element.on({mousedown: this.preventBlur})
	}, show                                                                                                                        : function () {d(this, "show", arguments)}}, t.validityAlert = {showFor: function () {d(this, "showFor", arguments)}}, t.getContentValidationMessage = function (t, n, i) {
		var r = e(t).data("errormessage") || t.getAttribute("x-moz-errormessage") || "";
		return i && r[i] ? r = r[i] : r && (n = n || e.prop(t, "validity") || {valid: 1}, n.valid && (r = "")), "object" == typeof r && (n = n || e.prop(t, "validity") || {valid: 1}, n.valid || (e.each(n, function (e, t) {return t && "valid" != e && r[e] ? (r = r[e], !1) : a}), "object" == typeof r && (n.typeMismatch && r.badInput && (r = r.badInput), n.badInput && r.typeMismatch && (r = r.typeMismatch)))), "object" == typeof r && (r = r.defaultMessage), r || ""
	}, e.fn.getErrorMessage = function (n) {
		var i = "", a = this[0];
		return a && (i = t.getContentValidationMessage(a, !1, n) || e.prop(a, "customValidationMessage") || e.prop(a, "validationMessage")), i
	}, e(i).on("focusin.lazyloadvalidation", function (t) {"form"in t.target && (t.target.list || e(t.target).is(":invalid")) && s()}), t.ready("WINDOWLOAD", s)
}), (!Modernizr.formvalidation || webshims.bugs.bustedValidity) && webshims.register("form-shim-extend", function (e, t, n, i, a, r) {
	"use strict";
	t.inputTypes = t.inputTypes || {};
	var o, s = t.cfg.forms, l = t.bugs, u = function (e) {return"number" == typeof e || e && e == 1 * e}, c = t.inputTypes, d = {radio: 1, checkbox: 1}, p = function (e) {return(e.getAttribute("type") || e.type || "").toLowerCase()};
	(function () {
		if ("querySelector"in i) {
			try {l.findRequired = !e('<form action="#" style="width: 1px; height: 1px; overflow: hidden;"><select name="b" required="" /></form>')[0].querySelector("select:required")} catch (t) {l.findRequired = !1}
			(l.bustedValidity || l.findRequired) && function () {
				var t = e.find, n = e.find.matchesSelector, a = /(\:valid|\:invalid|\:optional|\:required|\:in-range|\:out-of-range)(?=[\s\[\~\.\+\>\:\#*]|$)/gi, r = function (e) {return e + "-element"};
				e.find = function () {
					var e = Array.prototype.slice, n = function (n) {
						var i = arguments;
						return i = e.call(i, 1, i.length), i.unshift(n.replace(a, r)), t.apply(this, i)
					};
					for (var i in t)t.hasOwnProperty(i) && (n[i] = t[i]);
					return n
				}(), (!Modernizr.prefixed || Modernizr.prefixed("matchesSelector", i.documentElement)) && (e.find.matchesSelector = function (e, t) {return t = t.replace(a, r), n.call(this, e, t)})
			}()
		}
	})(), t.addInputType = function (e, t) {c[e] = t};
	var h = {customError: !1, typeMismatch: !1, badInput: !1, rangeUnderflow: !1, rangeOverflow: !1, stepMismatch: !1, tooLong: !1, patternMismatch: !1, valueMissing: !1, valid: !0}, f = function (t) {
		if ("select-one" == t.type && 2 > t.size) {
			var n = e("> option:first-child", t);
			return!!n.prop("selected")
		}
		return!1
	}, m = t.modules, v = e([]), g = function (t) {
		t = e(t);
		var n, a, r = v;
		return"radio" == t[0].type && (a = t.prop("form"), n = t[0].name, r = n ? a ? e(a[n]) : e(i.getElementsByName(n)).filter(function () {return!e.prop(this, "form")}) : t, r = r.filter('[type="radio"]')), r
	}, y = {valueMissing: function (e, t, n) {
		if (!e.prop("required"))return!1;
		var i = !1;
		return"type"in n || (n.type = p(e[0])), i = "select" == n.nodeName ? !t && (0 > e[0].selectedIndex || f(e[0])) : d[n.type] ? "checkbox" == n.type ? !e.is(":checked") : !g(e).filter(":checked")[0] : !t
	}, tooLong          : function () {return!1}, patternMismatch: function (e, n, i) {
		if ("" === n || "select" == i.nodeName)return!1;
		var a = e.attr("pattern");
		if (!a)return!1;
		try {a = RegExp("^(?:" + a + ")$")} catch (r) {t.error('invalid pattern value: "' + a + '" | ' + r), a = !1}
		return a ? !a.test(n) : !1
	}};
	e.each({typeMismatch: "mismatch", badInput: "bad"}, function (e, t) {
		y[e] = function (n, i, a) {
			if ("" === i || "select" == a.nodeName)return!1;
			var r = !1;
			return"type"in a || (a.type = p(n[0])), c[a.type] && c[a.type][t] ? r = c[a.type][t](i, n) : "validity"in n[0] && "name"in n[0].validity && (r = n[0].validity[e] || !1), r
		}
	}), t.addValidityRule = function (e, t) {y[e] = t}, e.event.special.invalid = {add: function () {e.event.special.invalid.setup.call(this.form || this)}, setup: function () {
		var n = this.form || this;
		return e.data(n, "invalidEventShim") ? (n = null, a) : (e(n).data("invalidEventShim", !0).on("submit", e.event.special.invalid.handler), t.moveToFirstEvent(n, "submit"), t.bugs.bustedValidity && e.nodeName(n, "form") && function () {
			var e = n.getAttribute("novalidate");
			n.setAttribute("novalidate", "novalidate"), t.data(n, "bustedNoValidate", null == e ? null : e)
		}(), n = null, a)
	}, teardown                                                                       : e.noop, handler: function (t) {
		if ("submit" == t.type && !t.testedValidity && t.originalEvent && e.nodeName(t.target, "form") && !e.prop(t.target, "noValidate")) {
			o = !0, t.testedValidity = !0;
			var n = !e(t.target).checkValidity();
			return n ? (t.stopImmediatePropagation(), o = !1, !1) : (o = !1, a)
		}
	}};
	var b = !("submitBubbles"in e.support) || e.support.submitBubbles, w = function (t) {b || !t || "object" != typeof t || t._submit_attached || (e.event.add(t, "submit._submit", function (e) {e._submit_bubble = !0}), t._submit_attached = !0)};
	!b && e.event.special.submit && (e.event.special.submit.setup = function () {
		return e.nodeName(this, "form") ? !1 : (e.event.add(this, "click._submit keypress._submit", function (t) {
			var n = t.target, i = e.nodeName(n, "input") || e.nodeName(n, "button") ? e.prop(n, "form") : a;
			w(i)
		}), a)
	}), e.event.special.submit = e.event.special.submit || {setup: function () {return!1}};
	var x = e.event.special.submit.setup;
	e.extend(e.event.special.submit, {setup: function () {return e.nodeName(this, "form") ? e(this).on("invalid", e.noop) : e("form", this).on("invalid", e.noop), x.apply(this, arguments)}}), e(n).on("invalid", e.noop), t.addInputType("email", {mismatch: function () {
		var e = s.emailReg || /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		return function (t) {
			if (n.punycode && punycode.toASCII)try {if (e.test(punycode.toASCII(t)))return!1} catch (i) {}
			return!e.test(t)
		}
	}()}), t.addInputType("url", {mismatch: function () {
		var e = s.urlReg || /^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
		return function (t) {return!e.test(t)}
	}()}), t.defineNodeNameProperty("input", "type", {prop: {get: function () {
		var e = this, n = (e.getAttribute("type") || "").toLowerCase();
		return t.inputTypes[n] ? n : e.type
	}}}), t.defineNodeNamesProperties(["button", "fieldset", "output"], {checkValidity: {value: function () {return!0}}, willValidate: {value: !1}, setCustomValidity: {value: e.noop}, validity: {writeable: !1, get: function () {return e.extend({}, h)}}}, "prop");
	var k = function (n) {
		var i, a = e.prop(n, "validity");
		if (!a)return!0;
		if (e.data(n, "cachedValidity", a), !a.valid) {
			i = e.Event("invalid");
			var r = e(n).trigger(i);
			!o || k.unhandledInvalids || i.isDefaultPrevented() || (t.validityAlert.showFor(r), k.unhandledInvalids = !0)
		}
		return e.removeData(n, "cachedValidity"), a.valid
	}, T = /^(?:select|textarea|input)/i;
	if (t.defineNodeNameProperty("form", "checkValidity", {prop: {value: function () {
		var n = !0, i = e(e.prop(this, "elements")).filter(function () {
			if (!T.test(this.nodeName))return!1;
			var e = t.data(this, "shadowData");
			return!e || !e.nativeElement || e.nativeElement === this
		});
		k.unhandledInvalids = !1;
		for (var a = 0, r = i.length; r > a; a++)k(i[a]) || (n = !1);
		return n
	}}}), t.defineNodeNamesProperties(["input", "textarea", "select"], {checkValidity: {value: function () {return k.unhandledInvalids = !1, k(e(this).getNativeElement()[0])}}, setCustomValidity: {value: function (n) {e.removeData(this, "cachedValidity"), t.data(this, "customvalidationMessage", "" + n)}}, willValidate: {writeable: !1, get: function () {
		var t = {button: 1, reset: 1, hidden: 1, image: 1};
		return function () {
			var n = e(this).getNativeElement()[0];
			return!(n.disabled || n.readOnly || t[n.type])
		}
	}()}, validity                                                                   : {writeable: !1, get: function () {
		var n = e(this).getNativeElement(), i = n[0], a = e.data(i, "cachedValidity");
		if (a)return a;
		if (a = e.extend({}, h), !e.prop(i, "willValidate") || "submit" == i.type)return a;
		var r = n.val(), o = {nodeName: i.nodeName.toLowerCase()};
		return a.customError = !!t.data(i, "customvalidationMessage"), a.customError && (a.valid = !1), e.each(y, function (e, t) {t(n, r, o) && (a[e] = !0, a.valid = !1)}), e(this).getShadowFocusElement().attr("aria-invalid", a.valid ? "false" : "true"), n = null, i = null, a
	}}}, "prop"), t.defineNodeNamesBooleanProperty(["input", "textarea", "select"], "required", {set: function (t) {e(this).getShadowFocusElement().attr("aria-required", !!t + "")}, initAttr: Modernizr.localstorage}), t.reflectProperties(["input"], ["pattern"]), !("maxLength"in i.createElement("textarea"))) {
		var C = function () {
			var t, n = 0, i = e([]), a = 1e9, r = function () {
				var e = i.prop("value"), t = e.length;
				t > n && t > a && (t = Math.max(n, a), i.prop("value", e.substr(0, t))), n = t
			}, o = function () {clearTimeout(t), i.unbind(".maxlengthconstraint")};
			return function (s, l) {o(), l > -1 && (a = l, n = e.prop(s, "value").length, i = e(s), i.on({"keydown.maxlengthconstraint keypress.maxlengthconstraint paste.maxlengthconstraint cut.maxlengthconstraint": function () {setTimeout(r, 0)}, "keyup.maxlengthconstraint": r, "blur.maxlengthconstraint": o}), t = setInterval(r, 200))}
		}();
		C.update = function (t, n) {e(t).is(":focus") && (n || (n = e.prop(t, "maxlength")), C(t, n))}, e(i).on("focusin", function (t) {
			var n;
			"TEXTAREA" == t.target.nodeName && (n = e.prop(t.target, "maxlength")) > -1 && C(t.target, n)
		}), t.defineNodeNameProperty("textarea", "maxlength", {attr: {set: function (e) {this.setAttribute("maxlength", "" + e), C.update(this)}, get: function () {
			var e = this.getAttribute("maxlength");
			return null == e ? a : e
		}}, prop                                                   : {set: function (e) {
			if (u(e)) {
				if (0 > e)throw"INDEX_SIZE_ERR";
				return e = parseInt(e, 10), this.setAttribute("maxlength", e), C.update(this, e), a
			}
			this.setAttribute("maxlength", "0"), C.update(this, 0)
		}, get                                                           : function () {
			var e = this.getAttribute("maxlength");
			return u(e) && e >= 0 ? parseInt(e, 10) : -1
		}}}), t.defineNodeNameProperty("textarea", "maxLength", {prop: {set: function (t) {e.prop(this, "maxlength", t)}, get: function () {return e.prop(this, "maxlength")}}})
	}
	var E = {submit: 1, button: 1, image: 1}, N = {};
	[
		{name: "enctype", limitedTo: {"application/x-www-form-urlencoded": 1, "multipart/form-data": 1, "text/plain": 1}, defaultProp: "application/x-www-form-urlencoded", proptype: "enum"},
		{name: "method", limitedTo: {get: 1, post: 1}, defaultProp: "get", proptype: "enum"},
		{name: "action", proptype: "url"},
		{name: "target"},
		{name: "novalidate", propName: "noValidate", proptype: "boolean"}
	].forEach(function (t) {
		var n = "form" + (t.propName || t.name).replace(/^[a-z]/, function (e) {return e.toUpperCase()}), a = "form" + t.name, r = t.name, o = "click.webshimssubmittermutate" + r, s = function () {
			var i = this;
			if ("form"in i && E[i.type]) {
				var o = e.prop(i, "form");
				if (o) {
					var s = e.attr(i, a);
					if (null != s && (!t.limitedTo || s.toLowerCase() === e.prop(i, n))) {
						var l = e.attr(o, r);
						e.attr(o, r, s), setTimeout(function () {if (null != l)e.attr(o, r, l); else try {e(o).removeAttr(r)} catch (t) {o.removeAttribute(r)}}, 9)
					}
				}
			}
		};
		switch (t.proptype) {
			case"url":
				var l = i.createElement("form");
				N[n] = {prop: {set: function (t) {e.attr(this, a, t)}, get: function () {
					var t = e.attr(this, a);
					return null == t ? "" : (l.setAttribute("action", t), l.action)
				}}};
				break;
			case"boolean":
				N[n] = {prop: {set: function (t) {t = !!t, t ? e.attr(this, "formnovalidate", "formnovalidate") : e(this).removeAttr("formnovalidate")}, get: function () {return null != e.attr(this, "formnovalidate")}}};
				break;
			case"enum":
				N[n] = {prop: {set: function (t) {e.attr(this, a, t)}, get: function () {
					var n = e.attr(this, a);
					return!n || (n = n.toLowerCase()) && !t.limitedTo[n] ? t.defaultProp : n
				}}};
				break;
			default:
				N[n] = {prop: {set: function (t) {e.attr(this, a, t)}, get: function () {
					var t = e.attr(this, a);
					return null != t ? t : ""
				}}}
		}
		N[a] || (N[a] = {}), N[a].attr = {set: function (t) {N[a].attr._supset.call(this, t), e(this).unbind(o).on(o, s)}, get: function () {return N[a].attr._supget.call(this)}}, N[a].initAttr = !0, N[a].removeAttr = {value: function () {e(this).unbind(o), N[a].removeAttr._supvalue.call(this)}}
	}), t.defineNodeNamesProperties(["input", "button"], N), e.support.getSetAttribute || null != e("<form novalidate></form>").attr("novalidate") ? t.bugs.bustedValidity && (t.defineNodeNameProperty("form", "novalidate", {attr: {set: function (e) {t.data(this, "bustedNoValidate", "" + e)}, get: function () {
		var e = t.data(this, "bustedNoValidate");
		return null == e ? a : e
	}}, removeAttr                                                                                                                                                                                                                 : {value: function () {t.data(this, "bustedNoValidate", null)}}}), e.each(["rangeUnderflow", "rangeOverflow", "stepMismatch"], function (e, t) {y[t] = function (e) {return(e[0].validity || {})[t] || !1}})) : t.defineNodeNameProperty("form", "novalidate", {attr: {set: function (e) {this.setAttribute("novalidate", "" + e)}, get: function () {
		var e = this.getAttribute("novalidate");
		return null == e ? a : e
	}}}), t.defineNodeNameProperty("form", "noValidate", {prop: {set: function (t) {t = !!t, t ? e.attr(this, "novalidate", "novalidate") : e(this).removeAttr("novalidate")}, get: function () {return null != e.attr(this, "novalidate")}}}), Modernizr.inputtypes.date && /webkit/i.test(navigator.userAgent) && function () {
		var t = {updateInput: 1, input: 1}, n = {date: 1, time: 1, month: 1, week: 1, "datetime-local": 1}, a = {focusout: 1, blur: 1}, r = {updateInput: 1, change: 1}, o = function (e) {
			var n, i, o = !0, s = e.prop("value"), l = s, u = function (n) {
				if (e) {
					var i = e.prop("value");
					i !== s && (s = i, n && t[n.type] || e.trigger("input")), n && r[n.type] && (l = i), o || i === l || e.trigger("change")
				}
			}, c = function () {clearTimeout(i), i = setTimeout(u, 9)}, d = function (t) {clearInterval(n), setTimeout(function () {t && a[t.type] && (o = !1), e && (e.unbind("focusout blur", d).unbind("input change updateInput", u), u()), e = null}, 1)};
			clearInterval(n), n = setInterval(u, 160), c(), e.off({"focusout blur": d, "input change updateInput": u}).on({"focusout blur": d, "input updateInput change": u})
		};
		e(i).on("focusin", function (t) {t.target && n[t.target.type] && !t.target.readOnly && !t.target.disabled && o(e(t.target))})
	}(), t.addReady(function (t, n) {
		var a;
		e("form", t).add(n.filter("form")).bind("invalid", e.noop);
		try {t != i || "form"in(i.activeElement || {}) || (a = e("input[autofocus], select[autofocus], textarea[autofocus]", t).eq(0).getShadowFocusElement()[0], a && a.offsetHeight && a.offsetWidth && a.focus())} catch (r) {}
	}), Modernizr.input.list || (t.defineNodeNameProperty("datalist", "options", {prop: {writeable: !1, get: function () {
		var n, i = this, a = e("select", i);
		return a[0] ? n = a[0].options : (n = e("option", i).get(), n.length && t.warn("you should wrap your option-elements for a datalist in a select element to support IE and other old browsers.")), n
	}}}), t.ready("form-datalist", function () {
		t.defineNodeNameProperties("input", {list: {attr: {get: function () {
			var e = t.contentAttr(this, "list");
			return null == e ? a : e
		}, set                                                : function (n) {
			var i = this;
			t.contentAttr(i, "list", n), t.objectCreate(r.shadowListProto, a, {input: i, id: n, datalist: e.prop(i, "list")}), e(i).triggerHandler("listdatalistchange")
		}}, initAttr                                    : !0, reflect: !0, propType: "element", propNodeName: "datalist"}})
	})), Modernizr.formattribute && Modernizr.fieldsetdisabled || function () {
		(function (t, n) {
			e.prop = function (a, r, o) {
				var s;
				return a && 1 == a.nodeType && o === n && e.nodeName(a, "form") && a.id && (s = i.getElementsByName(r), s && s.length || (s = i.getElementById(r)), s && (s = e(s).filter(function () {return e.prop(this, "form") == a}).get(), s.length)) ? 1 == s.length ? s[0] : s : t.apply(this, arguments)
			}
		})(e.prop, a);
		var n = function (t) {
			var n = e.data(t, "webshimsAddedElements");
			n && (n.remove(), e.removeData(t, "webshimsAddedElements"))
		};
		if (Modernizr.formattribute || (t.defineNodeNamesProperty(["input", "textarea", "select", "button", "fieldset"], "form", {prop: {get: function () {
			var n = t.contentAttr(this, "form");
			return n && (n = i.getElementById(n), n && !e.nodeName(n, "form") && (n = null)), n || this.form
		}, writeable                                                                                                                        : !1}}), t.defineNodeNamesProperty(["form"], "elements", {prop: {get: function () {
			var t = this.id, n = e.makeArray(this.elements);
			return t && (n = e(n).add('input[form="' + t + '"], select[form="' + t + '"], textarea[form="' + t + '"], button[form="' + t + '"], fieldset[form="' + t + '"]').not(".webshims-visual-hide > *").get()), n
		}, writeable                                                                                                                                                                                            : !1}}), e(function () {
			var t = function (e) {e.stopPropagation()};
			e(i).on("submit", function (t) {
				if (!t.isDefaultPrevented()) {
					var i, a = t.target, r = a.id;
					r && (n(a), i = e('input[form="' + r + '"], select[form="' + r + '"], textarea[form="' + r + '"]').filter(function () {return!this.disabled && this.name && this.form != a}).clone(), i.length && (e.data(a, "webshimsAddedElements", e('<div class="webshims-visual-hide" />').append(i).appendTo(a)), setTimeout(function () {n(a)}, 9)), i = null)
				}
			}), e(i).on("click", function (n) {
				if (!n.isDefaultPrevented() && e(n.target).is('input[type="submit"][form], button[form], input[type="button"][form], input[type="image"][form], input[type="reset"][form]')) {
					var i, a = e.prop(n.target, "form"), r = n.target.form;
					a && a != r && (i = e(n.target).clone().removeAttr("form").addClass("webshims-visual-hide").on("click", t).appendTo(a), r && n.preventDefault(), w(a), i.trigger("click"), setTimeout(function () {i.remove(), i = null}, 9))
				}
			})
		})), Modernizr.fieldsetdisabled || t.defineNodeNamesProperty(["fieldset"], "elements", {prop: {get: function () {return e("input, select, textarea, button, fieldset", this).get() || []}, writeable: !1}}), !e.fn.finish && 1.9 > parseFloat(e.fn.jquery, 10)) {
			var r = /\r?\n/g, o = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, s = /^(?:select|textarea)/i;
			e.fn.serializeArray = function () {
				return this.map(function () {
					var t = e.prop(this, "elements");
					return t ? e.makeArray(t) : this
				}).filter(function () {return this.name && !this.disabled && (this.checked || s.test(this.nodeName) || o.test(this.type))}).map(function (t, n) {
					var i = e(this).val();
					return null == i ? null : e.isArray(i) ? e.map(i, function (e) {return{name: n.name, value: e.replace(r, "\r\n")}}) : {name: n.name, value: i.replace(r, "\r\n")}
				}).get()
			}
		}
	}(), null == e("<input />").prop("labels") && t.defineNodeNamesProperty("button, input, keygen, meter, output, progress, select, textarea", "labels", {prop: {get: function () {
		if ("hidden" == this.type)return null;
		var t = this.id, n = e(this).closest("label").filter(function () {
			var e = this.attributes["for"] || {};
			return!e.specified || e.value == t
		});
		return t && (n = n.add('label[for="' + t + '"]')), n.get()
	}, writeable                                                                                                                                                     : !1}}), "value"in i.createElement("progress") || function () {
		var n = parseInt("NaN", 10), i = function (t) {
			var n;
			n = e.prop(t, "position"), e.attr(t, "data-position", n), e("> span", t).css({width: (0 > n ? 100 : 100 * n) + "%"})
		}, a = {position: {prop: {get: function () {
			var t, a = this.getAttribute("value"), r = -1;
			return a = a ? 1 * a : n, isNaN(a) ? i.isInChange && e(this).removeAttr("aria-valuenow") : (t = e.prop(this, "max"), r = Math.max(Math.min(a / t, 1), 0), i.isInChange && (e.attr(this, "aria-valuenow", 100 * r), "max" == i.isInChange && e.attr(this, "aria-valuemax", t))), r
		}, writeable                 : !1}}};
		e.each({value: 0, max: 1}, function (n, r) {
			var o = "value" == n && !e.fn.finish;
			a[n] = {attr  : {set: function (e) {
				var t = a[n].attr._supset.call(this, e);
				return i.isInChange = n, i(this), i.isInChange = !1, t
			}}, removeAttr: {value: function () {
				if (this.removeAttribute(n), o)try {delete this.value} catch (e) {}
				i.isInChange = n, i(this), i.isInChange = !1
			}}, prop      : {get: function () {
				var t = 1 * a[n].attr.get.call(this);
				return 0 > t || isNaN(t) ? t = r : "value" == n ? t = Math.min(t, e.prop(this, "max")) : 0 === t && (t = r), t
			}, set              : function (e) {return e = 1 * e, isNaN(e) && t.error("Floating-point value is not finite."), a[n].attr.set.call(this, e)}}}
		}), t.createElement("progress", function () {
			var n = e(this).attr({role: "progressbar", "aria-valuemin": "0"}).html('<span class="progress-value" />').jProp("labels").map(function () {return t.getID(this)}).get();
			n.length ? e.attr(this, "aria-labelledby", n.join(" ")) : t.info("you should use label elements for your prgogress elements"), i.isInChange = "max", i(this), i.isInChange = !1
		}, a)
	}();
	try {i.querySelector(":checked")} catch (A) {
		(function () {
			e("html").addClass("no-csschecked");
			var n = {radio: 1, checkbox: 1}, a = function () {
				var t, n, i, a = this.options || [];
				for (t = 0, n = a.length; n > t; t++)i = e(a[t]), i[e.prop(a[t], "selected") ? "addClass" : "removeClass"]("prop-checked")
			}, r = function () {
				var t, n = e.prop(this, "checked") ? "addClass" : "removeClass", i = this.className || "";
				-1 == i.indexOf("prop-checked") == ("addClass" == n) && (e(this)[n]("prop-checked"), (t = this.parentNode) && (t.className = t.className))
			};
			t.onNodeNamesPropertyModify("select", "value", a), t.onNodeNamesPropertyModify("select", "selectedIndex", a), t.onNodeNamesPropertyModify("option", "selected", function () {e(this).closest("select").each(a)}), t.onNodeNamesPropertyModify("input", "checked", function (t, i) {
				var a = this.type;
				"radio" == a && i ? g(this).each(r) : n[a] && e(this).each(r)
			}), e(i).on("change", function (t) {n[t.target.type] ? "radio" == t.target.type ? g(t.target).each(r) : e(t.target)[e.prop(t.target, "checked") ? "addClass" : "removeClass"]("prop-checked") : "select" == t.target.nodeName.toLowerCase() && e(t.target).each(a)}), t.addReady(function (t, i) {
				e("option, input", t).add(i.filter("option, input")).each(function () {
					var t;
					n[this.type] ? t = "checked" : "option" == this.nodeName.toLowerCase() && (t = "selected"), t && e(this)[e.prop(this, t) ? "addClass" : "removeClass"]("prop-checked")
				})
			})
		})()
	}
	(function () {
		var i;
		if (Modernizr.textareaPlaceholder = !!("placeholder"in e("<textarea />")[0]), Modernizr.input.placeholder && r.overridePlaceholder && (i = !0), Modernizr.input.placeholder && Modernizr.textareaPlaceholder && !i)return function () {
			var t = navigator.userAgent;
			-1 != t.indexOf("Mobile") && -1 != t.indexOf("Safari") && e(n).on("orientationchange", function () {
				var t, n = function (e, t) {return t}, i = function () {e("input[placeholder], textarea[placeholder]").attr("placeholder", n)};
				return function () {clearTimeout(t), t = setTimeout(i, 9)}
			}())
		}(), a;
		var o = "over" == t.cfg.forms.placeholderType, s = t.cfg.forms.responsivePlaceholder, l = ["textarea"];
		t.debug !== !1, (!Modernizr.input.placeholder || i) && l.push("input");
		var u = function (e) {
			try {
				if (e.setSelectionRange)return e.setSelectionRange(0, 0), !0;
				if (e.createTextRange) {
					var t = e.createTextRange();
					return t.collapse(!0), t.moveEnd("character", 0), t.moveStart("character", 0), t.select(), !0
				}
			} catch (n) {}
		}, c = function (t, n, i, r) {
			if (i === !1 && (i = e.prop(t, "value")), o || "password" == t.type) {if (!i && r)return e(t).off(".placeholderremove").on({"keydown.placeholderremove keypress.placeholderremove paste.placeholderremove input.placeholderremove": function (i) {(!i || 17 != i.keyCode && 16 != i.keyCode) && (n.box.removeClass("placeholder-visible"), e(t).unbind(".placeholderremove"))}, "blur.placeholderremove": function () {e(t).unbind(".placeholderremove")}}), a} else {
				if (!i && r && u(t)) {
					var s = setTimeout(function () {u(t)}, 9);
					return e(t).off(".placeholderremove").on({"keydown.placeholderremove keypress.placeholderremove paste.placeholderremove input.placeholderremove": function (i) {(!i || 17 != i.keyCode && 16 != i.keyCode) && (t.value = e.prop(t, "value"), n.box.removeClass("placeholder-visible"), clearTimeout(s), e(t).unbind(".placeholderremove"))}, "mousedown.placeholderremove drag.placeholderremove select.placeholderremove": function () {u(t), clearTimeout(s), s = setTimeout(function () {u(t)}, 9)}, "blur.placeholderremove": function () {clearTimeout(s), e(t).unbind(".placeholderremove")}}), a
				}
				r || i || !t.value || (t.value = i)
			}
			n.box.removeClass("placeholder-visible")
		}, d = function (t, n, i) {i === !1 && (i = e.prop(t, "placeholder")), o || "password" == t.type || (t.value = i), n.box.addClass("placeholder-visible")}, p = function (t, n, i, r, s) {
			if (r || (r = e.data(t, "placeHolder"))) {
				var l = e(t).hasClass("placeholder-visible");
				return i === !1 && (i = e.attr(t, "placeholder") || ""), e(t).unbind(".placeholderremove"), n === !1 && (n = e.prop(t, "value")), n || "focus" != s && (s || !e(t).is(":focus")) ? n ? (c(t, r, n), a) : (i && !n ? d(t, r, i) : c(t, r, n), a) : (("password" == t.type || o || l) && c(t, r, "", !0), a)
			}
		}, h = function (t) {return t = e(t), !!(t.prop("title") || t.attr("aria-labelledby") || t.attr("aria-label") || t.jProp("labels").length)}, f = function (t) {return t = e(t), e(h(t) ? '<span class="placeholder-text"></span>' : '<label for="' + t.prop("id") + '" class="placeholder-text"></label>')}, v = function () {
			var i = {text: 1, search: 1, url: 1, email: 1, password: 1, tel: 1, number: 1};
			return m["form-number-date-ui"].loaded && delete i.number, {create: function (t) {
				var i, a, r = e.data(t, "placeHolder");
				if (r)return r;
				if (r = e.data(t, "placeHolder", {}), e(t).on("focus.placeholder blur.placeholder", function (e) {p(this, !1, !1, r, e.type), r.box["focus" == e.type ? "addClass" : "removeClass"]("placeholder-focused")}), (i = e.prop(t, "form")) && e(t).onWSOff("reset.placeholder", function (e) {setTimeout(function () {p(t, !1, !1, r, e.type)}, 0)}, !1, i), "password" == t.type || o)r.text = f(t), s || e(t).is(".responsive-width") || -1 != (t.currentStyle || {width: ""}).width.indexOf("%") ? (a = !0, r.box = r.text) : r.box = e(t).wrap('<span class="placeholder-box placeholder-box-' + (t.nodeName || "").toLowerCase() + " placeholder-box-" + e.css(t, "float") + '" />').parent(), r.text.insertAfter(t).on("mousedown.placeholder", function () {
					p(this, !1, !1, r, "focus");
					try {setTimeout(function () {t.focus()}, 0)} catch (e) {}
					return!1
				}), e.each(["lineHeight", "fontSize", "fontFamily", "fontWeight"], function (n, i) {
					var a = e.css(t, i);
					r.text.css(i) != a && r.text.css(i, a)
				}), e.each(["Left", "Top"], function (n, i) {
					var a = (parseInt(e.css(t, "padding" + i), 10) || 0) + Math.max(parseInt(e.css(t, "margin" + i), 10) || 0, 0) + (parseInt(e.css(t, "border" + i + "Width"), 10) || 0);
					r.text.css("padding" + i, a)
				}), e(t).onWSOff("updateshadowdom", function () {
					var n, i;
					((i = t.offsetWidth) || (n = t.offsetHeight)) && r.text.css({width: i, height: n}).css(e(t).position())
				}, !0); else {
					var l = function (n) {e(t).hasClass("placeholder-visible") && (c(t, r, ""), setTimeout(function () {(!n || "submit" != n.type || n.isDefaultPrevented()) && p(t, !1, !1, r)}, 9))};
					e(t).onWSOff("beforeunload", l, !1, n), r.box = e(t), i && e(t).onWSOff("submit", l, !1, i)
				}
				return r
			}, update                                                         : function (n, r) {
				var o = (e.attr(n, "type") || e.prop(n, "type") || "").toLowerCase();
				if (!i[o] && !e.nodeName(n, "textarea"))return t.warn('placeholder not allowed on input[type="' + o + '"], but it is a good fallback :-)'), a;
				var s = v.create(n);
				s.text && s.text.text(r), p(n, !1, r, s)
			}}
		}();
		e.webshims.publicMethods = {pHolder: v}, l.forEach(function (e) {
			t.defineNodeNameProperty(e, "placeholder", {attr: {set: function (e) {
				var n = this;
				i ? (t.data(n, "bustedPlaceholder", e), n.placeholder = "") : t.contentAttr(n, "placeholder", e), v.update(n, e)
			}, get                                                : function () {
				var e;
				return i && (e = t.data(this, "bustedPlaceholder")), e || t.contentAttr(this, "placeholder")
			}}, reflect                                     : !0, initAttr: !0})
		}), l.forEach(function (n) {
			var a, r = {};
			["attr", "prop"].forEach(function (n) {
				r[n] = {set: function (r) {
					var o, s = this;
					i && (o = t.data(s, "bustedPlaceholder")), o || (o = t.contentAttr(s, "placeholder")), e.removeData(s, "cachedValidity");
					var l = a[n]._supset.call(s, r);
					return o && "value"in s && p(s, r, o), l
				}, get     : function () {
					var t = this;
					return e(t).hasClass("placeholder-visible") ? "" : a[n]._supget.call(t)
				}}
			}), a = t.defineNodeNameProperty(n, "value", r)
		})
	})(), function () {
		var n = i;
		if (!("value"in i.createElement("output"))) {
			t.defineNodeNameProperty("output", "value", {prop: {set: function (t) {
				var n = e.data(this, "outputShim");
				n || (n = a(this)), n(t)
			}, get                                                 : function () {return t.contentAttr(this, "value") || e(this).text() || ""}}}), t.onNodeNamesPropertyModify("input", "value", function (t, n, i) {
				if ("removeAttr" != i) {
					var a = e.data(this, "outputShim");
					a && a(t)
				}
			});
			var a = function (a) {
				if (!a.getAttribute("aria-live")) {
					a = e(a);
					var r = (a.text() || "").trim(), o = a.prop("id"), s = a.attr("for"), l = e('<input class="output-shim" type="text" disabled name="' + (a.attr("name") || "") + '" value="' + r + '" style="display: none !important;" />').insertAfter(a);
					l[0].form || n;
					var u = function (e) {l[0].value = e, e = l[0].value, a.text(e), t.contentAttr(a[0], "value", e)};
					return a[0].defaultValue = r, t.contentAttr(a[0], "value", r), a.attr({"aria-live": "polite"}), o && (l.attr("id", o), a.attr("aria-labelledby", a.jProp("labels").map(function () {return t.getID(this)}).get().join(" "))), s && (o = t.getID(a), s.split(" ").forEach(function (e) {e = i.getElementById(e), e && e.setAttribute("aria-controls", o)})), a.data("outputShim", u), l.data("outputShim", u), u
				}
			};
			t.addReady(function (t, n) {e("output", t).add(n.filter("output")).each(function () {a(this)})}), function () {
				var i = {updateInput: 1, input: 1}, a = {radio: 1, checkbox: 1, submit: 1, button: 1, image: 1, reset: 1, file: 1, color: 1}, r = function (e) {
					var n, a, r = e.prop("value"), o = function (n) {
						if (e) {
							var a = e.prop("value");
							a !== r && (r = a, n && i[n.type] || t.triggerInlineForm && t.triggerInlineForm(e[0], "input"))
						}
					}, s = function () {clearTimeout(a), a = setTimeout(o, 9)}, l = function () {e.unbind("focusout", l).unbind("keyup keypress keydown paste cut", s).unbind("input change updateInput", o), clearInterval(n), setTimeout(function () {o(), e = null}, 1)};
					clearInterval(n), n = setInterval(o, 200), s(), e.on({"keyup keypress keydown paste cut": s, focusout: l, "input updateInput change": o})
				};
				e(n).on("focusin", function (n) {!n.target || n.target.readOnly || n.target.disabled || "input" != (n.target.nodeName || "").toLowerCase() || a[n.target.type] || (t.data(n.target, "implemented") || {}).inputwidgets || r(e(n.target))})
			}()
		}
	}()
}), webshims.register("form-message", function (e, t, n, i, a, r) {
	"use strict";
	r.lazyCustomMessages && (r.customMessages = !0);
	var o = t.validityMessages, s = r.customMessages ? ["customValidationMessage"] : [];
	o.en = e.extend(!0, {typeMismatch: {defaultMessage: "Please enter a valid value.", email: "Please enter an email address.", url: "Please enter a URL."}, badInput: {defaultMessage: "Please enter a valid value.", number: "Please enter a number.", date: "Please enter a date.", time: "Please enter a time.", range: "Invalid input.", month: "Please enter a valid value.", "datetime-local": "Please enter a datetime."}, rangeUnderflow: {defaultMessage: "Value must be greater than or equal to {%min}."}, rangeOverflow: {defaultMessage: "Value must be less than or equal to {%max}."}, stepMismatch: "Invalid input.", tooLong: "Please enter at most {%maxlength} character(s). You entered {%valueLen}.", patternMismatch: "Invalid input. {%title}", valueMissing: {defaultMessage: "Please fill out this field.", checkbox: "Please check this box if you want to proceed."}}, o.en || o["en-US"] || {}), "object" == typeof o.en.valueMissing && ["select", "radio"].forEach(function (e) {o.en.valueMissing[e] = o.en.valueMissing[e] || "Please select an option."}), "object" == typeof o.en.rangeUnderflow && ["date", "time", "datetime-local", "month"].forEach(function (e) {o.en.rangeUnderflow[e] = o.en.rangeUnderflow[e] || "Value must be at or after {%min}."}), "object" == typeof o.en.rangeOverflow && ["date", "time", "datetime-local", "month"].forEach(function (e) {o.en.rangeOverflow[e] = o.en.rangeOverflow[e] || "Value must be at or before {%max}."}), o["en-US"] || (o["en-US"] = e.extend(!0, {}, o.en)), o["en-GB"] || (o["en-GB"] = e.extend(!0, {}, o.en)), o["en-AU"] || (o["en-AU"] = e.extend(!0, {}, o.en)), o[""] = o[""] || o["en-US"], o.de = e.extend(!0, {typeMismatch: {defaultMessage: "{%value} ist in diesem Feld nicht zul\u00e4ssig.", email: "{%value} ist keine g\u00fcltige E-Mail-Adresse.", url: "{%value} ist kein(e) g\u00fcltige(r) Webadresse/Pfad."}, badInput: {defaultMessage: "Geben Sie einen zul\u00e4ssigen Wert ein.", number: "Geben Sie eine Nummer ein.", date: "Geben Sie ein Datum ein.", time: "Geben Sie eine Uhrzeit ein.", month: "Geben Sie einen Monat mit Jahr ein.", range: "Geben Sie eine Nummer.", "datetime-local": "Geben Sie ein Datum mit Uhrzeit ein."}, rangeUnderflow: {defaultMessage: "{%value} ist zu niedrig. {%min} ist der unterste Wert, den Sie benutzen k\u00f6nnen."}, rangeOverflow: {defaultMessage: "{%value} ist zu hoch. {%max} ist der oberste Wert, den Sie benutzen k\u00f6nnen."}, stepMismatch: "Der Wert {%value} ist in diesem Feld nicht zul\u00e4ssig. Hier sind nur bestimmte Werte zul\u00e4ssig. {%title}", tooLong: "Der eingegebene Text ist zu lang! Sie haben {%valueLen} Zeichen eingegeben, dabei sind {%maxlength} das Maximum.", patternMismatch: "{%value} hat f\u00fcr dieses Eingabefeld ein falsches Format. {%title}", valueMissing: {defaultMessage: "Bitte geben Sie einen Wert ein.", checkbox: "Bitte aktivieren Sie das K\u00e4stchen."}}, o.de || {}), "object" == typeof o.de.valueMissing && ["select", "radio"].forEach(function (e) {o.de.valueMissing[e] = o.de.valueMissing[e] || "Bitte w\u00e4hlen Sie eine Option aus."}), "object" == typeof o.de.rangeUnderflow && ["date", "time", "datetime-local", "month"].forEach(function (e) {o.de.rangeUnderflow[e] = o.de.rangeUnderflow[e] || "{%value} ist zu fr\u00fch. {%min} ist die fr\u00fcheste Zeit, die Sie benutzen k\u00f6nnen."}), "object" == typeof o.de.rangeOverflow && ["date", "time", "datetime-local", "month"].forEach(function (e) {o.de.rangeOverflow[e] = o.de.rangeOverflow[e] || "{%value} ist zu sp\u00e4t. {%max} ist die sp\u00e4teste Zeit, die Sie benutzen k\u00f6nnen."});
	var l = o[""], u = function (t, n) {return t && "string" != typeof t && (t = t[e.prop(n, "type")] || t[(n.nodeName || "").toLowerCase()] || t.defaultMessage), t || ""}, c = {value: 1, min: 1, max: 1};
	t.createValidationMessage = function (n, i) {
		var a, r = e.prop(n, "type"), s = u(l[i], n);
		return s || "badInput" != i || (s = u(l.typeMismatch, n)), s || "typeMismatch" != i || (s = u(l.badInput, n)), s || (s = u(o[""][i], n) || e.prop(n, "validationMessage"), t.info("could not find errormessage for: " + i + " / " + r + ". in language: " + t.activeLang())), s && ["value", "min", "max", "title", "maxlength", "label"].forEach(function (o) {
			if (-1 !== s.indexOf("{%" + o)) {
				var l = ("label" == o ? e.trim(e('label[for="' + n.id + '"]', n.form).text()).replace(/\*$|:$/, "") : e.prop(n, o)) || "";
				"patternMismatch" != i || "title" != o || l || t.error("no title for patternMismatch provided. Always add a title attribute."), c[o] && (a || (a = e(n).getShadowElement().data("wsWidget" + r)), a && a.formatValue && (l = a.formatValue(l, !1))), s = s.replace("{%" + o + "}", l), "value" == o && (s = s.replace("{%valueLen}", l.length))
			}
		}), s || ""
	}, (!Modernizr.formvalidation || t.bugs.bustedValidity) && s.push("validationMessage"), t.activeLang({langObj: o, module: "form-core", callback: function (e) {l = e}}), t.activeLang({register: "form-core", callback: function (e) {o[e] && (l = o[e])}}), s.forEach(function (n) {
		t.defineNodeNamesProperty(["fieldset", "output", "button"], n, {prop: {value: "", writeable: !1}}), ["input", "select", "textarea"].forEach(function (i) {
			var r = t.defineNodeNameProperty(i, n, {prop: {get: function () {
				var n = this, i = "";
				if (!e.prop(n, "willValidate"))return i;
				var o = e.prop(n, "validity") || {valid: 1};
				return o.valid ? i : (i = t.getContentValidationMessage(n, o)) ? i : o.customError && n.nodeName && (i = Modernizr.formvalidation && !t.bugs.bustedValidity && r.prop._supget ? r.prop._supget.call(n) : t.data(n, "customvalidationMessage")) ? i : (e.each(o, function (e, r) {return"valid" != e && r ? (i = t.createValidationMessage(n, e), i ? !1 : a) : a}), i || "")
			}, writeable                                      : !1}})
		})
	})
}), webshims.register("form-datalist", function (e, t, n, i, a, r) {
	"use strict";
	var o = function (e) {e && "string" == typeof e || (e = "DOM"), o[e + "Loaded"] || (o[e + "Loaded"] = !0, t.ready(e, function () {t.loader.loadList(["form-datalist-lazy"])}))}, s = {submit: 1, button: 1, reset: 1, hidden: 1, range: 1, date: 1, month: 1};
	t.modules["form-number-date-ui"].loaded && e.extend(s, {number: 1, time: 1}), t.propTypes.element = function (n) {
		t.createPropDefault(n, "attr"), n.prop || (n.prop = {get: function () {
			var t = e.attr(this, "list");
			return t && (t = i.getElementById(t), t && n.propNodeName && !e.nodeName(t, n.propNodeName) && (t = null)), t || null
		}, writeable                                            : !1})
	}, function () {
		var l = e.webshims.cfg.forms, u = Modernizr.input.list;
		if (!u || l.customDatalist) {
			var c = function () {
				var n = {autocomplete: {attr: {get: function () {
					var t = this, n = e.data(t, "datalistWidget");
					return n ? n._autocomplete : "autocomplete"in t ? t.autocomplete : t.getAttribute("autocomplete")
				}, set                            : function (t) {
					var n = this, i = e.data(n, "datalistWidget");
					i ? (i._autocomplete = t, "off" == t && i.hideList()) : "autocomplete"in n ? n.autocomplete = t : n.setAttribute("autocomplete", t)
				}}}};
				u && ((e("<datalist><select><option></option></select></datalist>").prop("options") || []).length || t.defineNodeNameProperty("datalist", "options", {prop: {writeable: !1, get: function () {
					var t = this.options || [];
					if (!t.length) {
						var n = this, i = e("select", n);
						i[0] && i[0].options && i[0].options.length && (t = i[0].options)
					}
					return t
				}}}), n.list = {attr: {get: function () {
					var n = t.contentAttr(this, "list");
					return null != n ? (e.data(this, "datalistListAttr", n), s[e.prop(this, "type")] || s[e.attr(this, "type")] || this.removeAttribute("list")) : n = e.data(this, "datalistListAttr"), null == n ? a : n
				}, set                    : function (n) {
					var i = this;
					e.data(i, "datalistListAttr", n), s[e.prop(this, "type")] || s[e.attr(this, "type")] ? i.setAttribute("list", n) : t.objectCreate(d, a, {input: i, id: n, datalist: e.prop(i, "list")}), e(i).triggerHandler("listdatalistchange")
				}}, initAttr        : !0, reflect: !0, propType: "element", propNodeName: "datalist"}), t.defineNodeNameProperties("input", n), t.addReady(function (t, n) {n.filter("datalist > select, datalist, datalist > option, datalist > select > option").closest("datalist").each(function () {e(this).triggerHandler("updateDatalist")})})
			}, d = {_create: function (n) {
				if (!s[e.prop(n.input, "type")] && !s[e.attr(n.input, "type")]) {
					var i = n.datalist, r = e.data(n.input, "datalistWidget"), l = this;
					return i && r && r.datalist !== i ? (r.datalist = i, r.id = n.id, e(r.datalist).off("updateDatalist.datalistWidget").on("updateDatalist.datalistWidget", e.proxy(r, "_resetListCached")), r._resetListCached(), a) : i ? (r && r.datalist === i || (this.datalist = i, this.id = n.id, this.hasViewableData = !0, this._autocomplete = e.attr(n.input, "autocomplete"), e.data(n.input, "datalistWidget", this), o("WINDOWLOAD"), t.isReady("form-datalist-lazy") ? this._lazyCreate(n) : (e(n.input).one("focus", o), t.ready("form-datalist-lazy", function () {l._destroyed || l._lazyCreate(n)}))), a) : (r && r.destroy(), a)
				}
			}, destroy     : function (t) {
				var r, o = e.attr(this.input, "autocomplete");
				e(this.input).off(".datalistWidget").removeData("datalistWidget"), this.shadowList.remove(), e(i).off(".datalist" + this.id), e(n).off(".datalist" + this.id), this.input.form && this.input.id && e(this.input.form).off("submit.datalistWidget" + this.input.id), this.input.removeAttribute("aria-haspopup"), o === a ? this.input.removeAttribute("autocomplete") : e(this.input).attr("autocomplete", o), t && "beforeunload" == t.type && (r = this.input, setTimeout(function () {e.attr(r, "list", e.attr(r, "list"))}, 9)), this._destroyed = !0
			}};
			t.loader.addModule("form-datalist-lazy", {noAutoCallback: !0, options: e.extend(r, {shadowListProto: d})}), c()
		}
	}()
});