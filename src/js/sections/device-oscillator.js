
// defjam.devices.oscillator

{
	init() {
		// fast references
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.devices.oscillator,
			rect,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-rack":
				let osc = Jam.track._list["track-2"].instrument.oscillator,
					svgEl = event.el.find(`div[data-rack="oscillator"] svg`),
					[y, x, width, height] = svgEl.attr("viewBox").split(" ");

				osc.asArray(width >> 1).then(values => {
					let points = [],
						lW = 1,
						max = Math.max(0.001, ...values) * 1.1,
						min = Math.min(-0.001, ...values) * 1.1,
						scale = (v, inMin, inMax, outMin, outMax) =>
							Math.round(((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin);
						// translate values
						values.map((v, i) => {
							let x = scale(i, 0, values.length, lW, width - lW);
							let y = scale(v, max, min, 0, height - lW);
							points.push(`${x},${y}`);
						});
					// plot cruve in SVG element
					svgEl.find(`polyline.st1`).attr({ points: points.join(" ") });
				});
				break;
			case "show-shape-popup":
				// remember srcElement
				Self.srcEl = $(event.target);
				rect = window.getBoundingClientRect(event.target);
				el = window.find(`.popups .oscillator-shape-options`).addClass("show");
				el.data({
						section: "devices",
						rack: "oscillator",
					})
					.css({
						top: rect.top - +el.prop("offsetHeight"),
						left: rect.left,
					});
				// cover app UI
				APP.els.content.addClass("cover");

				let func = event => {
					Self.dispatch({ type: "hide-shapes-popup" });
					APP.els.content.off("mouseup", func);
				};
				APP.els.content.on("mouseup", func);
				break;
			case "set-oscillator-shape":
				el = $(event.target);
				Self.srcEl.find("> i").prop({ className: `icon-shape_${el.data("arg")}` });
				/* falls through */
			case "hide-shapes-popup":
				// reset menu
				window.find(`.popups .oscillator-shape-options`)
					.removeAttr("data-section")
					.removeClass("show");
				// cover app UI
				APP.els.content.removeClass("cover");
				break;
		}
	}
}
