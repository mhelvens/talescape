var swfmini = function () {
	function a() {
		if (!B) {
			try {
				var a = v.getElementsByTagName("body")[0].appendChild(l("span"));
				a.parentNode.removeChild(a)
			} catch (b) {return}
			B = !0;
			for (var c = y.length, d = 0; c > d; d++)y[d]()
		}
	}

	function b(a) {B ? a() : y[y.length] = a}

	function c() {}

	function d() {x && e()}

	function e() {
		var a = v.getElementsByTagName("body")[0], b = l(p);
		b.setAttribute("type", t);
		var c = a.appendChild(b);
		if (c) {
			var d = 0;
			!function () {
				if (typeof c.GetVariable != o) {
					var e = c.GetVariable("$version");
					e && (e = e.split(" ")[1].split(","), D.pv = [parseInt(e[0], 10), parseInt(e[1], 10), parseInt(e[2], 10)])
				} else if (10 > d)return d++, setTimeout(arguments.callee, 10), void 0;
				a.removeChild(b), c = null
			}()
		}
	}

	function f(a) {
		var b = null, c = k(a);
		if (c && "OBJECT" == c.nodeName)if (typeof c.SetVariable != o)b = c; else {
			var d = c.getElementsByTagName(p)[0];
			d && (b = d)
		}
		return b
	}

	function g(a, b, c) {
		var d, e = k(c);
		if (D.wk && D.wk < 312)return d;
		if (e)if (typeof a.id == o && (a.id = c), D.ie && D.win) {
			var f = "";
			for (var g in a)a[g] != Object.prototype[g] && ("data" == g.toLowerCase() ? b.movie = a[g] : "styleclass" == g.toLowerCase() ? f += ' class="' + a[g] + '"' : "classid" != g.toLowerCase() && (f += " " + g + '="' + a[g] + '"'));
			var i = "";
			for (var j in b)b[j] != Object.prototype[j] && (i += '<param name="' + j + '" value="' + b[j] + '" />');
			e.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + f + ">" + i + "</object>", z[z.length] = a.id, d = k(a.id)
		} else {
			var m = l(p);
			m.setAttribute("type", t);
			for (var n in a)a[n] != Object.prototype[n] && ("styleclass" == n.toLowerCase() ? m.setAttribute("class", a[n]) : "classid" != n.toLowerCase() && m.setAttribute(n, a[n]));
			for (var q in b)b[q] != Object.prototype[q] && "movie" != q.toLowerCase() && h(m, q, b[q]);
			e.parentNode.replaceChild(m, e), d = m
		}
		return d
	}

	function h(a, b, c) {
		var d = l("param");
		d.setAttribute("name", b), d.setAttribute("value", c), a.appendChild(d)
	}

	function i(a) {
		var b = k(a);
		b && "OBJECT" == b.nodeName && (D.ie && D.win ? (b.style.display = "none", function () {4 == b.readyState ? j(a) : setTimeout(arguments.callee, 10)}()) : b.parentNode.removeChild(b))
	}

	function j(a) {
		var b = k(a);
		if (b) {
			for (var c in b)"function" == typeof b[c] && (b[c] = null);
			b.parentNode.removeChild(b)
		}
	}

	function k(a) {
		var b = null;
		try {b = v.getElementById(a)} catch (c) {}
		return b
	}

	function l(a) {return v.createElement(a)}

	function m(a) {
		var b = D.pv, c = a.split(".");
		return c[0] = parseInt(c[0], 10), c[1] = parseInt(c[1], 10) || 0, c[2] = parseInt(c[2], 10) || 0, b[0] > c[0] || b[0] == c[0] && b[1] > c[1] || b[0] == c[0] && b[1] == c[1] && b[2] >= c[2] ? !0 : !1
	}

	function n(a, b) {
		if (C) {
			var c, d = b ? "visible" : "hidden";
			B && c && k(a) && (k(a).style.visibility = d)
		}
	}

	{
		var o = "undefined", p = "object", q = window.webshims, r = "Shockwave Flash", s = "ShockwaveFlash.ShockwaveFlash", t = "application/x-shockwave-flash", u = window, v = document, w = navigator, x = !1, y = [d], z = [], A = [], B = !1, C = !0, D = function () {
			var a = typeof v.getElementById != o && typeof v.getElementsByTagName != o && typeof v.createElement != o, b = w.userAgent.toLowerCase(), c = w.platform.toLowerCase(), d = c ? /win/.test(c) : /win/.test(b), e = c ? /mac/.test(c) : /mac/.test(b), f = /webkit/.test(b) ? parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1, g = !1, h = [0, 0, 0], i = null;
			if (typeof w.plugins != o && typeof w.plugins[r] == p)i = w.plugins[r].description, !i || typeof w.mimeTypes != o && w.mimeTypes[t] && !w.mimeTypes[t].enabledPlugin || (x = !0, g = !1, i = i.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), h[0] = parseInt(i.replace(/^(.*)\..*$/, "$1"), 10), h[1] = parseInt(i.replace(/^.*\.(.*)\s.*$/, "$1"), 10), h[2] = /[a-zA-Z]/.test(i) ? parseInt(i.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0); else if (typeof u.ActiveXObject != o)try {
				var j = new ActiveXObject(s);
				j && (i = j.GetVariable("$version"), i && (g = !0, i = i.split(" ")[1].split(","), h = [parseInt(i[0], 10), parseInt(i[1], 10), parseInt(i[2], 10)]))
			} catch (k) {}
			return{w3: a, pv: h, wk: f, ie: g, win: d, mac: e}
		}();
		!function () {
			D.ie && D.win && window.attachEvent && window.attachEvent("onunload", function () {
				for (var a = A.length, b = 0; a > b; b++)A[b][0].detachEvent(A[b][1], A[b][2]);
				for (var c = z.length, d = 0; c > d; d++)i(z[d]);
				for (var e in D)D[e] = null;
				D = null;
				for (var f in swfmini)swfmini[f] = null;
				swfmini = null
			})
		}()
	}
	return q.ready("DOM", a), {registerObject: function () {}, getObjectById: function (a) {return D.w3 ? f(a) : void 0}, embedSWF: function (a, c, d, e, f, h, i, j, k, l) {
		var q = {success: !1, id: c};
		D.w3 && !(D.wk && D.wk < 312) && a && c && d && e && f ? (n(c, !1), b(function () {
			d += "", e += "";
			var b = {};
			if (k && typeof k === p)for (var h in k)b[h] = k[h];
			b.data = a, b.width = d, b.height = e;
			var r = {};
			if (j && typeof j === p)for (var s in j)r[s] = j[s];
			if (i && typeof i === p)for (var t in i)typeof r.flashvars != o ? r.flashvars += "&" + t + "=" + i[t] : r.flashvars = t + "=" + i[t];
			if (m(f)) {
				var u = g(b, r, c);
				b.id == c && n(c, !0), q.success = !0, q.ref = u
			} else n(c, !0);
			l && l(q)
		})) : l && l(q)
	}, switchOffAutoHideShow                 : function () {C = !1}, ua: D, getFlashPlayerVersion: function () {return{major: D.pv[0], minor: D.pv[1], release: D.pv[2]}}, hasFlashPlayerVersion: m, createSWF: function (a, b, c) {return D.w3 ? g(a, b, c) : void 0}, showExpressInstall: function () {}, removeSWF: function (a) {D.w3 && i(a)}, createCSS: function () {}, addDomLoadEvent: b, addLoadEvent: c, expressInstallCallback: function () {}}
}();