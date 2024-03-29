!function (a, b) {
	"use strict";
	var c, d, e = b.$, f = a.audio && a.video, g = !1, h = b.bugs, i = "mediaelement-jaris", j = function () {b.ready(i, function () {b.mediaelement.createSWF || (b.mediaelement.loadSwf = !0, b.reTest([i], f))})}, k = b.cfg, l = k.mediaelement;
	if (!l)return b.error("mediaelement wasn't implemented but loaded"), void 0;
	if (f) {
		var m = document.createElement("video");
		if (a.videoBuffered = "buffered"in m, a.mediaDefaultMuted = "defaultMuted"in m, g = "loop"in m, b.capturingEvents(["play", "playing", "waiting", "paused", "ended", "durationchange", "loadedmetadata", "canplay", "volumechange"]), a.videoBuffered || (b.addPolyfill("mediaelement-native-fix", {d: ["dom-support"]}), b.loader.loadList(["mediaelement-native-fix"])), !l.preferFlash) {
			var n = {1: 1}, o = function (a) {
				var c, f, g;
				!l.preferFlash && (e(a.target).is("audio, video") || (g = a.target.parentNode) && e("source", g).last()[0] == a.target) && (c = e(a.target).closest("audio, video")) && (f = c.prop("error")) && !n[f.code] && e(function () {d && !l.preferFlash ? (j(), b.ready("WINDOWLOAD " + i, function () {setTimeout(function () {l.preferFlash || !b.mediaelement.createSWF || c.is(".nonnative-api-active") || (l.preferFlash = !0, document.removeEventListener("error", o, !0), e("audio, video").each(function () {b.mediaelement.selectSource(this)}), b.error("switching mediaelements option to 'preferFlash', due to an error with native player: " + a.target.src + " Mediaerror: " + c.prop("error") + "first error: " + f))}, 9)})) : document.removeEventListener("error", o, !0)})
			};
			document.addEventListener("error", o, !0), e("audio, video").each(function () {
				var a = e.prop(this, "error");
				return a && !n[a] ? (o({target: this}), !1) : void 0
			})
		}
	}
	a.track && !h.track && !function () {if (h.track || (h.track = "number" != typeof e("<track />")[0].readyState), !h.track)try {new TextTrackCue(2, 3, "")} catch (a) {h.track = !0}}(), c = a.track && !h.track, b.register("mediaelement-core", function (b, e, h, k, l, m) {
		d = swfmini.hasFlashPlayerVersion("9.0.115"), b("html").addClass(d ? "swf" : "no-swf");
		var n = e.mediaelement;
		n.parseRtmp = function (a) {
			var b, c, d, f = a.src.split("://"), g = f[1].split("/");
			for (a.server = f[0] + "://" + g[0] + "/", a.streamId = [], b = 1, c = g.length; c > b; b++)d || -1 === g[b].indexOf(":") || (g[b] = g[b].split(":")[1], d = !0), d ? a.streamId.push(g[b]) : a.server += g[b] + "/";
			a.streamId.length || e.error("Could not parse rtmp url"), a.streamId = a.streamId.join("/")
		};
		var o = function (a, c) {
			a = b(a);
			var d, e = {src: a.attr("src") || "", elem: a, srcProp: a.prop("src")};
			return e.src ? (d = a.attr("data-server"), null != d && (e.server = d), d = a.attr("type") || a.attr("data-type"), d ? (e.type = d, e.container = b.trim(d.split(";")[0])) : (c || (c = a[0].nodeName.toLowerCase(), "source" == c && (c = (a.closest("video, audio")[0] || {nodeName: "video"}).nodeName.toLowerCase())), e.server ? (e.type = c + "/rtmp", e.container = c + "/rtmp") : (d = n.getTypeForSrc(e.src, c, e), d && (e.type = d, e.container = d))), e.container || b(a).attr("data-wsrecheckmimetype", ""), d = a.attr("media"), d && (e.media = d), ("audio/rtmp" == e.type || "video/rtmp" == e.type) && (e.server ? e.streamId = e.src : n.parseRtmp(e)), e) : e
		}, p = !d && "postMessage"in h && f, q = function () {q.loaded || (q.loaded = !0, m.noAutoTrack || e.ready("WINDOWLOAD", function () {s(), e.loader.loadList(["track-ui"])}))}, r = function () {
			var a;
			return function () {!a && p && (a = !0, e.loader.loadScript("https://www.youtube.com/player_api"), b(function () {e._polyfill(["mediaelement-yt"])}))}
		}(), s = function () {d ? j() : r()};
		e.addPolyfill("mediaelement-yt", {test: !p, d: ["dom-support"]}), n.mimeTypes = {audio: {"audio/ogg": ["ogg", "oga", "ogm"], 'audio/ogg;codecs="opus"': "opus", "audio/mpeg": ["mp2", "mp3", "mpga", "mpega"], "audio/mp4": ["mp4", "mpg4", "m4r", "m4a", "m4p", "m4b", "aac"], "audio/wav": ["wav"], "audio/3gpp": ["3gp", "3gpp"], "audio/webm": ["webm"], "audio/fla": ["flv", "f4a", "fla"], "application/x-mpegURL": ["m3u8", "m3u"]}, video: {"video/ogg": ["ogg", "ogv", "ogm"], "video/mpeg": ["mpg", "mpeg", "mpe"], "video/mp4": ["mp4", "mpg4", "m4v"], "video/quicktime": ["mov", "qt"], "video/x-msvideo": ["avi"], "video/x-ms-asf": ["asf", "asx"], "video/flv": ["flv", "f4v"], "video/3gpp": ["3gp", "3gpp"], "video/webm": ["webm"], "application/x-mpegURL": ["m3u8", "m3u"], "video/MP2T": ["ts"]}}, n.mimeTypes.source = b.extend({}, n.mimeTypes.audio, n.mimeTypes.video), n.getTypeForSrc = function (a, c) {
			if (-1 != a.indexOf("youtube.com/watch?") || -1 != a.indexOf("youtube.com/v/"))return"video/youtube";
			if (0 === a.indexOf("rtmp"))return c + "/rtmp";
			a = a.split("?")[0].split("#")[0].split("."), a = a[a.length - 1];
			var d;
			return b.each(n.mimeTypes[c], function (b, c) {return-1 !== c.indexOf(a) ? (d = b, !1) : void 0}), d
		}, n.srces = function (a, c) {
			if (a = b(a), !c) {
				c = [];
				var d = a[0].nodeName.toLowerCase(), e = o(a, d);
				return e.src ? c.push(e) : b("source", a).each(function () {e = o(this, d), e.src && c.push(e)}), c
			}
			a.removeAttr("src").removeAttr("type").find("source").remove(), b.isArray(c) || (c = [c]), c.forEach(function (c) {"string" == typeof c && (c = {src: c}), a.append(b(k.createElement("source")).attr(c))})
		}, b.fn.loadMediaSrc = function (a, c) {return this.each(function () {c !== l && (b(this).removeAttr("poster"), c && b.attr(this, "poster", c)), n.srces(this, a), b(this).mediaLoad()})}, n.swfMimeTypes = ["video/3gpp", "video/x-msvideo", "video/quicktime", "video/x-m4v", "video/mp4", "video/m4p", "video/x-flv", "video/flv", "audio/mpeg", "audio/aac", "audio/mp4", "audio/x-m4a", "audio/m4a", "audio/mp3", "audio/x-fla", "audio/fla", "youtube/flv", "video/jarisplayer", "jarisplayer/jarisplayer", "video/youtube", "video/rtmp", "audio/rtmp"], n.canThirdPlaySrces = function (a, c) {
			var e = "";
			return(d || p) && (a = b(a), c = c || n.srces(a), b.each(c, function (a, b) {return b.container && b.src && (d && -1 != n.swfMimeTypes.indexOf(b.container) || p && "video/youtube" == b.container) ? (e = b, !1) : void 0})), e
		};
		var t = {};
		n.canNativePlaySrces = function (a, c) {
			var d = "";
			if (f) {
				a = b(a);
				var e = (a[0].nodeName || "").toLowerCase(), g = (t[e] || {prop: {_supvalue: !1}}).prop._supvalue || a[0].canPlayType;
				if (!g)return d;
				c = c || n.srces(a), b.each(c, function (b, c) {return c.type && g.call(a[0], c.type) ? (d = c, !1) : void 0})
			}
			return d
		};
		var u = /^\s*application\/octet\-stream\s*$/i, v = function () {
			var a = u.test(b.attr(this, "type") || "");
			return a && b(this).removeAttr("type"), a
		};
		n.setError = function (a, c) {
			if (b("source", a).filter(v).length) {
				e.error('"application/octet-stream" is a useless mimetype for audio/video. Please change this attribute.');
				try {b(a).mediaLoad()} catch (d) {}
			} else c || (c = "can't play sources"), b(a).pause().data("mediaerror", c), e.error("mediaelementError: " + c), setTimeout(function () {b(a).data("mediaerror") && b(a).addClass("media-error").trigger("mediaerror")}, 1)
		};
		var w = function () {
			var a, c = d ? i : "mediaelement-yt";
			return function (d, f, g) {e.ready(c, function () {n.createSWF && b(d).parent()[0] ? n.createSWF(d, f, g) : a || (a = !0, s(), w(d, f, g))}), a || !p || n.createSWF || r()}
		}(), x = function (a, b, c, d, e) {
			var f;
			c || c !== !1 && b && "third" == b.isActive ? (f = n.canThirdPlaySrces(a, d), f ? w(a, f, b) : e ? n.setError(a, !1) : x(a, b, !1, d, !0)) : (f = n.canNativePlaySrces(a, d), f ? b && "third" == b.isActive && n.setActive(a, "html5", b) : e ? (n.setError(a, !1), b && "third" == b.isActive && n.setActive(a, "html5", b)) : x(a, b, !0, d, !0))
		}, y = /^(?:embed|object|datalist)$/i, z = function (a, c) {
			var d = e.data(a, "mediaelementBase") || e.data(a, "mediaelementBase", {}), f = n.srces(a), g = a.parentNode;
			clearTimeout(d.loadTimer), b(a).removeClass("media-error"), b.data(a, "mediaerror", !1), f.length && g && 1 == g.nodeType && !y.test(g.nodeName || "") && (c = c || e.data(a, "mediaelement"), n.sortMedia && f.sort(n.sortMedia), x(a, c, m.preferFlash || l, f))
		};
		n.selectSource = z, b(k).on("ended", function (a) {
			var c = e.data(a.target, "mediaelement");
			(!g || c && "html5" != c.isActive || b.prop(a.target, "loop")) && setTimeout(function () {!b.prop(a.target, "paused") && b.prop(a.target, "loop") && b(a.target).prop("currentTime", 0).play()}, 1)
		});
		var A = !1, B = function () {
			var c = function () {
				if (e.implement(this, "mediaelement") && (z(this), a.mediaDefaultMuted || null == b.attr(this, "muted") || b.prop(this, "muted", !0), f && (!g || "ActiveXObject"in h))) {
					var c, d, i = this, j = function () {
						var a = b.prop(i, "buffered");
						if (a) {
							for (var c = "", d = 0, e = a.length; e > d; d++)c += a.end(d);
							return c
						}
					}, k = function () {
						var a = j();
						a != d && (d = a, e.info("needed to trigger progress manually"), b(i).triggerHandler("progress"))
					};
					b(this).on({"play loadstart progress": function (a) {"progress" == a.type && (d = j()), clearTimeout(c), c = setTimeout(k, 400)}, "emptied stalled mediaerror abort suspend": function (a) {"emptied" == a.type && (d = !1), clearTimeout(c)}}), "ActiveXObject"in h && b.prop(this, "paused") && !b.prop(this, "readyState") && b(this).is('audio[preload="none"][controls]:not([autoplay],.nonnative-api-active)') && b(this).prop("preload", "metadata").mediaLoad()
				}
			};
			e.ready("dom-support", function () {
				A = !0, g || e.defineNodeNamesBooleanProperty(["audio", "video"], "loop"), ["audio", "video"].forEach(function (a) {
					var c;
					c = e.defineNodeNameProperty(a, "load", {prop: {value: function () {
						var a = e.data(this, "mediaelement");
						z(this, a), !f || a && "html5" != a.isActive || !c.prop._supvalue || c.prop._supvalue.apply(this, arguments)
					}}}), t[a] = e.defineNodeNameProperty(a, "canPlayType", {prop: {value: function (c) {
						var e = "";
						return f && t[a].prop._supvalue && (e = t[a].prop._supvalue.call(this, c), "no" == e && (e = "")), !e && d && (c = b.trim((c || "").split(";")[0]), -1 != n.swfMimeTypes.indexOf(c) && (e = "maybe")), e
					}}})
				}), e.onNodeNamesPropertyModify(["audio", "video"], ["src", "poster"], {set: function () {
					var a = this, b = e.data(a, "mediaelementBase") || e.data(a, "mediaelementBase", {});
					clearTimeout(b.loadTimer), b.loadTimer = setTimeout(function () {z(a), a = null}, 9)
				}}), e.addReady(function (a, d) {
					var e = b("video, audio", a).add(d.filter("video, audio")).each(c);
					!q.loaded && b("track", e).length && q(), e = null
				})
			}), f && !A && e.addReady(function (a, c) {A || b("video, audio", a).add(c.filter("video, audio")).each(function () {return n.canNativePlaySrces(this) ? void 0 : (s(), A = !0, !1)})})
		};
		c && e.defineProperty(TextTrack.prototype, "shimActiveCues", {get: function () {return this._shimActiveCues || this.activeCues}}), f ? (e.isReady("mediaelement-core", !0), B(), e.ready("WINDOWLOAD mediaelement", s)) : e.ready(i, B), e.ready("track", q)
	})
}(Modernizr, webshims);