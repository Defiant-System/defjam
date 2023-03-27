
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
				// el = event.el.find(`div[data-rack="oscillator"] svg path.st1`);
				// value = "M3.8,60.5c6-3.1,17.9-51.1,26.1-51.1S49,58.1,60,58.1s9-2.9,15.2-2.9s14.8,13.2,18.9,23.1 c4.2,9.9,7.5,19.4,13.7,18.9c12.8-0.9,17.4-38.3,29.7-38.5c12.3-0.2,12.6,7.5,18.2,2.6c9.1-8,15.3-51.7,25.9-52 c10.6-0.2,19.4,35.9,21.5,39.9";
				// // set "d" for display path
				// el.attr({ d: value });

				el = event.el.find(`div[data-rack="oscillator"] svg polyline.st1`);

				setTimeout(() => {
					let osc = Jam.track._list["track-2"].instrument.oscillator,
						points = [],
						width = 210,
						height = 108,
						lineWidth = 1;

					osc.asArray(210).then(values => {
						let max = Math.max(0.001, ...values) * 1.1,
							min = Math.min(-0.001, ...values) * 1.1,
							scale = (v, inMin, inMax, outMin, outMax) =>
								Math.round(((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin);
						
						for (let i=0; i<values.length; i++) {
							let v = values[i];
							let x = scale(i, 0, values.length, lineWidth, width - lineWidth);
							let y = scale(v, max, min, 0, height - lineWidth);
							
							points.push(`${x},${y}`);
						}

						el.attr({ points: points.join(" ") });
					});
				}, 200);

				// value = "1,54 100,24 209,54";
				// el.attr({ points: value });
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
