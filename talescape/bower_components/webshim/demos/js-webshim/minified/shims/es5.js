!function () {
	var a, b, c = Function.prototype.call, d = Array.prototype, e = Object.prototype, f = d.slice;
	if (Function.prototype.bind || (Function.prototype.bind = function (a) {
		var b = this;
		if ("function" != typeof b)throw new TypeError;
		var c = f.call(arguments, 1), d = function () {
			if (this instanceof d) {
				var e = function () {};
				e.prototype = b.prototype;
				var g = new e, h = b.apply(g, c.concat(f.call(arguments)));
				return null !== h && Object(h) === h ? h : g
			}
			return b.apply(a, c.concat(f.call(arguments)))
		};
		return d
	}), b = c.bind(e.toString), a = c.bind(e.hasOwnProperty), Array.isArray || (Array.isArray = function (a) {return"[object Array]" == b(a)}), Array.prototype.forEach || (Array.prototype.forEach = function (a) {
		var c = s(this), d = arguments[1], e = 0, f = c.length >>> 0;
		if ("[object Function]" != b(a))throw new TypeError;
		for (; f > e;)e in c && a.call(d, c[e], e, c), e++
	}), Array.prototype.map || (Array.prototype.map = function (a) {
		var c = s(this), d = c.length >>> 0, e = Array(d), f = arguments[1];
		if ("[object Function]" != b(a))throw new TypeError;
		for (var g = 0; d > g; g++)g in c && (e[g] = a.call(f, c[g], g, c));
		return e
	}), Array.prototype.filter || (Array.prototype.filter = function (a) {
		var c = s(this), d = c.length >>> 0, e = [], f = arguments[1];
		if ("[object Function]" != b(a))throw new TypeError;
		for (var g = 0; d > g; g++)g in c && a.call(f, c[g], g, c) && e.push(c[g]);
		return e
	}), Array.prototype.every || (Array.prototype.every = function (a) {
		var c = s(this), d = c.length >>> 0, e = arguments[1];
		if ("[object Function]" != b(a))throw new TypeError;
		for (var f = 0; d > f; f++)if (f in c && !a.call(e, c[f], f, c))return!1;
		return!0
	}), Array.prototype.some || (Array.prototype.some = function (a) {
		var c = s(this), d = c.length >>> 0, e = arguments[1];
		if ("[object Function]" != b(a))throw new TypeError;
		for (var f = 0; d > f; f++)if (f in c && a.call(e, c[f], f, c))return!0;
		return!1
	}), Array.prototype.reduce || (Array.prototype.reduce = function (a) {
		var c = s(this), d = c.length >>> 0;
		if ("[object Function]" != b(a))throw new TypeError;
		if (!d && 1 == arguments.length)throw new TypeError;
		var e, f = 0;
		if (arguments.length >= 2)e = arguments[1]; else for (; ;) {
			if (f in c) {
				e = c[f++];
				break
			}
			if (++f >= d)throw new TypeError
		}
		for (; d > f; f++)f in c && (e = a.call(void 0, e, c[f], f, c));
		return e
	}), Array.prototype.reduceRight || (Array.prototype.reduceRight = function (a) {
		var c = s(this), d = c.length >>> 0;
		if ("[object Function]" != b(a))throw new TypeError;
		if (!d && 1 == arguments.length)throw new TypeError;
		var e, f = d - 1;
		if (arguments.length >= 2)e = arguments[1]; else for (; ;) {
			if (f in c) {
				e = c[f--];
				break
			}
			if (--f < 0)throw new TypeError
		}
		do f in this && (e = a.call(void 0, e, c[f], f, c)); while (f--);
		return e
	}), Array.prototype.indexOf || (Array.prototype.indexOf = function (a) {
		var b = s(this), c = b.length >>> 0;
		if (!c)return-1;
		var d = 0;
		for (arguments.length > 1 && (d = q(arguments[1])), d = d >= 0 ? d : c - Math.abs(d); c > d; d++)if (d in b && b[d] === a)return d;
		return-1
	}), Array.prototype.lastIndexOf || (Array.prototype.lastIndexOf = function (a) {
		var b = s(this), c = b.length >>> 0;
		if (!c)return-1;
		var d = c - 1;
		for (arguments.length > 1 && (d = q(arguments[1])), d = d >= 0 ? d : c - Math.abs(d); d >= 0; d--)if (d in b && a === b[d])return d;
		return-1
	}), 2 != [1, 2].splice(0).length) {
		var g = Array.prototype.splice;
		Array.prototype.splice = function (a, b) {return arguments.length ? g.apply(this, [void 0 === a ? 0 : a, void 0 === b ? this.length - a : b].concat(f.call(arguments, 2))) : []}
	}
	if (!Object.keys) {
		var h = !0, i = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], j = i.length;
		for (var k in{toString: null})h = !1;
		Object.keys = function t(b) {
			if ("object" != typeof b && "function" != typeof b || null === b)throw new TypeError("Object.keys called on a non-object");
			var t = [];
			for (var c in b)a(b, c) && t.push(c);
			if (h)for (var d = 0, e = j; e > d; d++) {
				var f = i[d];
				a(b, f) && t.push(f)
			}
			return t
		}
	}
	Date.prototype.toISOString || (Date.prototype.toISOString = function () {
		var a, b, c;
		if (!isFinite(this))throw new RangeError;
		for (a = [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()], b = a.length; b--;)c = a[b], 10 > c && (a[b] = "0" + c);
		return a.slice(0, 3).join("-") + "T" + a.slice(3).join(":") + "." + ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
	}), Date.now || (Date.now = function () {return(new Date).getTime()}), Date.prototype.toJSON || (Date.prototype.toJSON = function () {
		if ("function" != typeof this.toISOString)throw new TypeError;
		return this.toISOString()
	});
	var l = "	\n\f\r \xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff";
	if (!String.prototype.trim || l.trim()) {
		l = "[" + l + "]";
		var m = new RegExp("^" + l + l + "*"), n = new RegExp(l + l + "*$");
		String.prototype.trim = function () {return String(this).replace(m, "").replace(n, "")}
	}
	if ("0".split(void 0, 0).length) {
		var o = String.prototype.split;
		String.prototype.split = function (a, b) {return void 0 === a && 0 === b ? [] : o.apply(this, arguments)}
	}
	if ("".substr && "b" !== "0b".substr(-1)) {
		var p = String.prototype.substr;
		String.prototype.substr = function (a, b) {return p.call(this, 0 > a ? (a = this.length + a) < 0 ? 0 : a : a, b)}
	}
	var q = function (a) {return a = +a, a !== a ? a = -1 : 0 !== a && a !== 1 / 0 && a !== -(1 / 0) && (a = (a > 0 || -1) * Math.floor(Math.abs(a))), a}, r = "a" != "a"[0], s = function (a) {
		if (null == a)throw new TypeError;
		return r && "string" == typeof a && a ? a.split("") : Object(a)
	}
}(), function (a, b) {
	var c = "defineProperty", d = !!(Object.create && Object.defineProperties && Object.getOwnPropertyDescriptor);
	if (d && Object[c] && Object.prototype.__defineGetter__ && !function () {
		try {
			var a = document.createElement("foo");
			Object[c](a, "bar", {get: function () {return!0}}), d = !!a.bar
		} catch (b) {d = !1}
		a = null
	}(), Modernizr.objectAccessor = !!(d || Object.prototype.__defineGetter__ && Object.prototype.__lookupSetter__), Modernizr.advancedObjectProperties = d, !(d && Object.create && Object.defineProperties && Object.getOwnPropertyDescriptor && Object.defineProperty)) {
		var e = Function.prototype.call, f = Object.prototype, g = e.bind(f.hasOwnProperty);
		b.objectCreate = function (c, d, e, f) {
			var g, h = function () {};
			return h.prototype = c, g = new h, f || "__proto__"in g || Modernizr.objectAccessor || (g.__proto__ = c), d && b.defineProperties(g, d), e && (g.options = a.extend(!0, {}, g.options || {}, e), e = g.options), g._create && a.isFunction(g._create) && g._create(e), g
		}, b.defineProperties = function (a, c) {
			for (var d in c)g(c, d) && b.defineProperty(a, d, c[d]);
			return a
		};
		b.defineProperty = function (a, b, c) {return"object" != typeof c || null === c ? a : g(c, "value") ? (a[b] = c.value, a) : (a.__defineGetter__ && ("function" == typeof c.get && a.__defineGetter__(b, c.get), "function" == typeof c.set && a.__defineSetter__(b, c.set)), a)}, b.getPrototypeOf = function (a) {return Object.getPrototypeOf && Object.getPrototypeOf(a) || a.__proto__ || a.constructor && a.constructor.prototype}, b.getOwnPropertyDescriptor = function (a, b) {
			if ("object" != typeof a && "function" != typeof a || null === a)throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object");
			var c;
			if (Object.defineProperty && Object.getOwnPropertyDescriptor)try {return c = Object.getOwnPropertyDescriptor(a, b)} catch (d) {}
			c = {configurable: !0, enumerable: !0, writable: !0, value: void 0};
			var e = a.__lookupGetter__ && a.__lookupGetter__(b), f = a.__lookupSetter__ && a.__lookupSetter__(b);
			if (!e && !f) {
				if (!g(a, b))return;
				return c.value = a[b], c
			}
			return delete c.writable, delete c.value, c.get = c.set = void 0, e && (c.get = e), f && (c.set = f), c
		}
	}
}(webshims.$, webshims);