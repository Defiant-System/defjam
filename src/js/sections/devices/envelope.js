
// defjam.devices.envelope

{
	// curve types
	points: {
		attack: {
			linear: "M0,100 L100,0",
			exponential: "M0,100C0,40.5,35.6,0,100,0",
			sine: "M0,100C68.2,100,37.6,0,100,0",
			cosine: "M0,100C0,60.6,55.8,0,100,0",
			step: "M0,100V80.1l19.9,0l0-20l20.3-0.2L40.4,40L60,40l0.2-19.8l19.6,0L79.6,0H100",
			bounce: "",
			ripple: "M0,100c0-9.5,6-19.9,19.9-19.9s20-6.6,20-20s9.6-20,20-20s19.8-6.7,19.8-19.8C79.8,4.9,88.4,0,100,0",
		},
		decay: {
			linear: "M99,0 L202,100",
			exponential: "M99,0c0,59.9,33.8,100,103,100",
			sine: "M99,0c56.3,0,33.8,100,103,100",
			cosine: "M99,0c0,47.5,47.8,100,103,100",
			step: "M99,0v20.2l20.8,0l0.1,19.8l20.3,0l-0.1,20l20.7,0l0.1,20l20.5,0l0,19.9H202",
			bounce: "",
			ripple: "",
		},
		release: {
			linear: "M202,0 L302,100",
			exponential: "M202,0c0,64.3,37.7,100,100,100",
			sine: "M202,0c61.2,0,37.7,100,100,100",
			cosine: "M202,0c0,43.8,59.7,100,100,100",
			step: "M202,0v20.2l20.2,0l0,19.8l19.9,0l0.1,20l20,0l-0.3,20l20.3,0l-0.2,19.9H302",
			bounce: "",
			ripple: "",
		}
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.devices.envelope,
			rect, width, height, y, x,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-rack":
				// reference track & instrument
				Self.trackId = event.trackId;
				Self.instrument = Jam.track._list[Self.trackId].instrument;
				Self.svgEl = event.el.find("svg.envelope-curve");
				Self.curves = {
					attack: Self.svgEl.find(`path[data-curve="attack"]`),
					decay: Self.svgEl.find(`path[data-curve="decay"]`),
					sustain: Self.svgEl.find(`path[data-curve="sustain"]`),
					release: Self.svgEl.find(`path[data-curve="release"]`),
				};

				Self.dispatch({ type: "draw-envelope-curve" });

				// values for UI
				let values = Self.instrument.get();
				// console.log(values);

				break;
			case "draw-envelope-curve":
				// values
				// [y, x, width, height] = Self.svgEl.attr("viewBox").split(" ");

				value = Self.points.attack.ripple;
				Self.curves.attack.attr({ d: value });
				
				value = Self.points.decay.step;
				Self.curves.decay.attr({ d: value });
				
				value = `M202,100 L202,0`;
				Self.curves.sustain.attr({ d: value });
				
				value = Self.points.release.step;
				Self.curves.release.attr({ d: value });

				break;
			case "show-curves-popup":
				// remember srcElement
				Self.srcEl = $(event.target);
				value = Self.srcEl.data("arg") === "attack" ? "" : "decay-icons";
				rect = window.getBoundingClientRect(event.target);
				el = window.find(`.popups .envelope-curve-options`).addClass("show "+ value);
				el.data({
						section: "devices",
						rack: "envelope",
					})
					.css({
						top: rect.top - +el.prop("offsetHeight"),
						left: rect.left,
					});
				// cover app UI
				APP.els.content.addClass("cover");

				let func = event => {
					Self.dispatch({ type: "hide-curves-popup" });
					APP.els.content.off("mouseup", func);
				};
				APP.els.content.on("mouseup", func);
				break;
			case "set-envelope-curve":
				el = $(event.target);
				value = Self.srcEl.data("arg") === "attack" ? "" : "decay_";
				Self.srcEl.find("> i").prop({ className: `icon-curve_${value + el.data("arg")}` });
				/* falls through */
			case "hide-curves-popup":
				// reset menu
				window.find(`.popups .envelope-curve-options`)
					.removeAttr("data-section")
					.removeClass("show decay-icons");
				// cover app UI
				APP.els.content.removeClass("cover");
				break;
		}
	},
	doEnvelope(event) {
		let Self = defjam.devices.envelope,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				let el = $(event.target);
				if (el.prop("nodeName") !== "rect") return;

				let id = el.data("id"),
					shape = el.parent().find(`*[data-curve="attack"]`),
					points = shape[0].pathSegList._list,
					fnScale = Svg.scale.path,
					matrix = Svg.scale.matrix,
					bbox = shape[0].getBBox(),
					click = {
						x: event.clientX - +el.attr("x"),
						y: event.clientY - +el.attr("y"),
					},
					limit = {},
					min_ = Math.min,
					max_ = Math.max;

				let dArr = Svg.translate.path(points, { x: 20, y: 20 });
				shape.attr({ d: dArr.join("") });

				points = shape[0].pathSegList._list;

				switch (id) {
					case "attack": limit = { minX: 3, maxX: 97, minY: 3, maxY: 3 }; break;
					case "sustain": limit = { minX: 106, maxX: 200, minY: 3, maxY: 101 }; break;
					case "release": limit = { minX: 209, maxX: 303, minY: 101, maxY: 101 }; break;
				}

				// prepare drag object
				Drag = Self.drag = { el, id, shape, bbox, points, matrix, fnScale, click, limit, min_, max_ };

				// bind event handlers
				UX.content.addClass("hide-cursor");
				UX.doc.on("mousemove mouseup", Self.doEnvelope);
				break;
			case "mousemove":
				let data = {
						x: Drag.min_(Drag.max_(event.clientX - Drag.click.x, Drag.limit.minX), Drag.limit.maxX),
						y: Drag.min_(Drag.max_(event.clientY - Drag.click.y, Drag.limit.minY), Drag.limit.maxY),
					};
				// handle coordinates
				Drag.el.attr(data);

				data = {
					...data,
					...Drag.bbox,
					scale: { x: 1, y: 1 },
					matrix: Drag.matrix,
					points: Drag.points,
				}

				switch (Drag.id) {
					case "attack":
						data.scale.x = (data.x - Drag.limit.minX) / (Drag.limit.maxX - Drag.limit.minX) * 2;
						break;
					case "sustain": break;
					case "release": break;
				}
				// shape transformation
				Drag.fnScale(Drag.shape, data);
				break;
			case "mouseup":
				// unbind event handlers
				UX.content.removeClass("hide-cursor");
				UX.doc.off("mousemove mouseup", Self.doEnvelope);
				break;
		}
	}
}
