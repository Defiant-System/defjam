
// defjam.devices.envelope

{
	init() {
		// fast references
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.devices.envelope,
			width, height, y, x,
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
				// optimisation
				if (Self._drawing) return;
				Self._drawing = true;
				// values
				[y, x, width, height] = Self.svgEl.attr("viewBox").split(" ");

				Self.instrument.envelope.asArray(width >> 1).then(values => {
					let points = [`3,${height-2}`],
						max = Math.max(0.001, ...values) * 1.1,
						min = Math.min(-0.001, ...values) * 1.1,
						scale = (v, inMin, inMax, outMin, outMax) =>
							Math.round(((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin);
						// translate values
						values.map((v, i) => {
							let x = scale(i, 0, values.length, 3, width),
								y = scale(v, max, min, -5, height-3),
								p = `${x},${y}`;
							if (points[points.length-1] !== p) points.push(p);
						});
					// plot cruve in SVG element
					Self.svgEl.find(`polyline.st1`).attr({ points: points.join(" ") });
					// change flag
					Self._drawing = false;
				});
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
	}
}
