
// defjam.devices.envelope

{
	init() {
		// fast references
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
				Self.svgEl = event.el.find("svg");

				Self.dispatch({ type: "draw-envelope-curve" });

				// values for UI
				let values = Self.instrument.get();
				console.log(values);

				break;
			case "draw-envelope-curve":
				// values
				[y, x, width, height] = Self.svgEl.attr("viewBox").split(" ");

				
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
