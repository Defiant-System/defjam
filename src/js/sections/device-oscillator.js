
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
				let trackId = event.el.data("track"),
					osc = Jam.track._list[trackId].instrument.oscillator,
					// partials = osc._oscillator._carrier.partials,
					partials = [0.0860851900077161, 0.007236810378086416, 1, .5],
					svgEl = event.el.find(`div[data-rack="oscillator"] svg`),
					[y, x, width, height] = svgEl.attr("viewBox").split(" "),
					rects = [];

				osc.asArray(width >> 1).then(values => {
					let points = [],
						max = Math.max(0.001, ...values) * 1.1,
						min = Math.min(-0.001, ...values) * 1.1,
						scale = (v, inMin, inMax, outMin, outMax) =>
							Math.round(((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin);
						// translate values
						values.map((v, i) => {
							let x = scale(i, 0, values.length, 0, width);
							let y = scale(v, max, min, 0, height);
							points.push(`${x},${y}`);
						});
					// plot cruve in SVG element
					svgEl.find(`polyline.st1`).attr({ points: points.join(" ") });
				});


				// first clear "old" partial rects
				svgEl.find(`rect.st3`).remove();
				// make sure values are non-negative
				partials = partials.map(Math.abs);

				let bWidth = width - 2,
					bHeight = height * .35,
		        	min = Math.min(...partials, 0),
		        	max = Math.max(...partials, 1),
		        	scale = (v, inMin, inMax, outMin, outMax) =>
		        		Math.pow((v - inMin) / (inMax - inMin), 0.25) * (outMax - outMin) + outMin;

				// iterate partials
				partials.map((val, i) => {
					let pL = partials.length,
						w = Math.round((bWidth - (pL * 2)) / pL),
						h = Math.round(scale(val, min, max, 0, bHeight)),
						x = Math.round(2 + (i * (w + 2))),
						y = Math.round(height - h - 2);
					if (i === pL-1) {
						w += (bWidth - (x + w));
					}
					rects.push(`<rect class="st3" x="${x}" y="${y}" width="${w}" height="${h}"/>`);
				});
				// transform into svg rectangles and append to element
				$.svgFromString(rects.join("")).map(rectEl => svgEl[0].appendChild(rectEl));
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
