!function (a) {
	if (Modernizr.texttrackapi && document.addEventListener) {
		var b = webshims.cfg.track, c = function (b) {a(b.target).filter("track").each(e)}, d = webshims.bugs.track, e = function () {return d || !b.override && 3 == a.prop(this, "readyState") ? (b.override = !0, webshims.reTest("track"), document.removeEventListener("error", c, !0), this && a.nodeName(this, "track") ? webshims.error("track support was overwritten. Please check your vtt including your vtt mime-type") : webshims.info("track support was overwritten. due to bad browser support"), !1) : void 0}, f = function () {document.addEventListener("error", c, !0), d ? e() : a("track").each(e)};
		b.override || f()
	}
}(webshims.$), webshims.register("track-ui", function (a, b) {
	"use strict";
	function c(a, b) {
		var c = !0, d = 0, e = a.length;
		if (e != b.length)c = !1; else for (; e > d; d++)if (a[d] != b[d]) {
			c = !1;
			break
		}
		return c
	}

	var d = b.cfg.track, e = {subtitles: 1, captions: 1, descriptions: 1}, f = b.mediaelement, g = function () {return!d.override && Modernizr.texttrackapi}, h = {update: function (d, e) {d.activeCues.length ? c(d.displayedActiveCues, d.activeCues) || (d.displayedActiveCues = d.activeCues, d.trackDisplay || (d.trackDisplay = a('<div class="cue-display"><span class="description-cues" aria-live="assertive" /></div>').insertAfter(e), this.addEvents(d, e), b.docObserve()), d.hasDirtyTrackDisplay && e.triggerHandler("forceupdatetrackdisplay"), this.showCues(d)) : this.hide(d)}, showCues: function (b) {
		var c = a('<span class="cue-wrapper" />');
		a.each(b.displayedActiveCues, function (d, e) {
			var f = e.id ? 'id="cue-id-' + e.id + '"' : "", g = a('<span class="cue-line"><span ' + f + ' class="cue" /></span>').find("span").html(e.getCueAsHTML()).end();
			"descriptions" == e.track.kind ? setTimeout(function () {a("span.description-cues", b.trackDisplay).html(g)}, 0) : c.prepend(g)
		}), a("span.cue-wrapper", b.trackDisplay).remove(), b.trackDisplay.append(c)
	}, addEvents                                                                                                                                                         : function (a, b) {
		if (d.positionDisplay) {
			var c, e = function (c) {
				if (a.displayedActiveCues.length || c === !0) {
					a.trackDisplay.css({display: "none"});
					var d = b.getShadowElement(), e = (d.offsetParent(), d.innerHeight()), f = d.innerWidth(), g = d.position();
					a.trackDisplay.css({left: g.left, width: f, height: e - 45, top: g.top, display: "block"}), a.trackDisplay.css("fontSize", Math.max(Math.round(e / 30), 7)), a.hasDirtyTrackDisplay = !1
				} else a.hasDirtyTrackDisplay = !0
			}, f = function () {clearTimeout(c), c = setTimeout(e, 0)}, g = function () {e(!0)};
			b.on("playerdimensionchange mediaelementapichange updatetrackdisplay updatemediaelementdimensions swfstageresize", f), b.on("forceupdatetrackdisplay", g).onWSOff("updateshadowdom", f), g()
		}
	}, hide                                                                                                                                                              : function (b) {b.trackDisplay && b.displayedActiveCues.length && (b.displayedActiveCues = [], a("span.cue-wrapper", b.trackDisplay).remove(), a("span.description-cues", b.trackDisplay).empty())}};
	if (f.trackDisplay = h, !f.createCueList) {
		var i = {getCueById: function (a) {
			for (var b = null, c = 0, d = this.length; d > c; c++)if (this[c].id === a) {
				b = this[c];
				break
			}
			return b
		}};
		f.createCueList = function () {return a.extend([], i)}
	}
	f.getActiveCue = function (b, c, g, h) {
		b._lastFoundCue || (b._lastFoundCue = {index: 0, time: 0}), !Modernizr.texttrackapi || d.override || b._shimActiveCues || (b._shimActiveCues = f.createCueList());
		for (var i, j, k = 0; k < b.shimActiveCues.length; k++)j = b.shimActiveCues[k], j.startTime > g || j.endTime < g ? (b.shimActiveCues.splice(k, 1), k--, j.pauseOnExit && a(c).pause(), a(b).triggerHandler("cuechange"), a(j).triggerHandler("exit")) : "showing" == b.mode && e[b.kind] && -1 == a.inArray(j, h.activeCues) && h.activeCues.push(j);
		for (i = b.cues.length, k = b._lastFoundCue.time < g ? b._lastFoundCue.index : 0; i > k && (j = b.cues[k], j.startTime <= g && j.endTime >= g && -1 == a.inArray(j, b.shimActiveCues) && (b.shimActiveCues.push(j), "showing" == b.mode && e[b.kind] && h.activeCues.push(j), a(b).triggerHandler("cuechange"), a(j).triggerHandler("enter"), b._lastFoundCue.time = g, b._lastFoundCue.index = k), !(j.startTime > g)); k++);
	}, g() && (!function () {
		var c, d = function (b) {c = !0, setTimeout(function () {a(b).triggerHandler("updatetrackdisplay"), c = !1}, 9)}, e = function (e, f, h) {
			var i, j = "_sup" + h, k = {prop: {}};
			k.prop[h] = function () {return!c && g() && d(a(this).closest("audio, video")), i.prop[j].apply(this, arguments)}, i = b.defineNodeNameProperty(e, f, k)
		};
		e("track", "track", "get"), ["audio", "video"].forEach(function (a) {e(a, "textTracks", "get"), e("nodeName", "addTextTrack", "value")})
	}(), a.propHooks.activeCues = {get: function (a) {return a._shimActiveCues || a.activeCues}}), b.addReady(function (c, d) {
		a("video, audio", c).add(d.filter("video, audio")).filter(function () {return b.implement(this, "trackui")}).each(function () {
			var c, d, e, i, j = a(this), k = function () {
				var a, e;
				if (d && c || (d = j.prop("textTracks"), c = b.data(j[0], "mediaelementBase") || b.data(j[0], "mediaelementBase", {}), c.displayedActiveCues || (c.displayedActiveCues = [])), d && (e = j.prop("currentTime"), e || 0 === e)) {
					c.activeCues = [];
					for (var g = 0, i = d.length; i > g; g++)a = d[g], "disabled" != a.mode && a.cues && a.cues.length && f.getActiveCue(a, j, e, c);
					h.update(c, j)
				}
			}, l = function (a) {clearTimeout(e), a ? ("timeupdate" == a.type && k(), i = setTimeout(l, 90)) : e = setTimeout(k, 9)}, m = function () {d || (d = j.prop("textTracks")), a([d]).on("change", l), j.off(".trackview").on("play.trackview timeupdate.trackview updatetrackdisplay.trackview", l)};
			j.on("remove", function (a) {!a.originalEvent && c && c.trackDisplay && setTimeout(function () {c.trackDisplay.remove()}, 4)}), g() ? (j.is(".nonnative-api-active") && m(), j.on("mediaelementapichange trackapichange", function () {!g() || j.is(".nonnative-api-active") ? m() : (clearTimeout(e), clearTimeout(i), d = j.prop("textTracks"), c = b.data(j[0], "mediaelementBase") || b.data(j[0], "mediaelementBase", {}), a.each(d, function (a, b) {b._shimActiveCues && delete b._shimActiveCues}), h.hide(c), j.off(".trackview"))})) : m()
		})
	})
});