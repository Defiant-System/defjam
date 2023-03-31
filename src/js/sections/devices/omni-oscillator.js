
// defjam.devices.omniOscillator

{
	init() {
		// fast references
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.devices.omniOscillator,
			rect,
			svgEl,
			width, height, y, x,
			name, value,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-rack":
				let synth = Jam.track._list[event.trackId].instrument,
					values = synth.get(),
					svgEl = event.el.find(`svg`);
				Self.dispatch({ ...event, synth, svgEl, type: "draw-oscilator-curve" });
				Self.dispatch({ ...event, synth, svgEl, type: "draw-oscilator-rectangles" });

				// set partial count (option-group)
				event.el.find(`.option-group span:contains("${values.oscillator.partialCount}")`).trigger("click");

				value = Math.round((values.oscillator.harmonicity / 2) * 100);
				event.el.find(`.range-input`).css({ "--val": value });
				
				event.el.find(`.ctrl-knob2 .knob2`).data({ value: 76 }).trigger("change");
				
				// console.log(values);

				break;
			case "draw-oscilator-curve":
				[y, x, width, height] = event.svgEl.attr("viewBox").split(" ");

				event.synth.oscillator.asArray(width >> 1).then(values => {
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
					event.svgEl.find(`polyline.st1`).attr({ points: points.join(" ") });
				});
				break;
			case "draw-oscilator-rectangles":
				[y, x, width, height] = event.svgEl.attr("viewBox").split(" ");
				// make sure values are non-negative
				let partials = event.synth.get().oscillator.partials.map(Math.abs);
				let rects = [];

				// first clear "old" partial rects
				event.svgEl.find(`g.st3`).remove();

				let bW = width - 2,
					bH = height * .35,
		        	min = Math.min(...partials, 0),
		        	max = Math.max(...partials, 1),
		        	scale = (v, inMin, inMax, outMin, outMax) =>
		        		Math.pow((v - inMin) / (inMax - inMin), 0.25) * (outMax - outMin) + outMin;

				// iterate partials
				partials.map((val, i) => {
					let pL = partials.length,
						w = Math.round((bW - (pL * 2)) / pL),
						h = Math.round(scale(val, min, max, 0, bH)),
						x = Math.round(2 + (i * (w + 2))),
						y = bH-h;
					if (i === pL-1) {
						w += (bW - (x + w));
					}
					rects.push(`<g class="st3" transform="translate(${x},${height-bH-2})">
									<rect x="0" y="0" width="${w}" height="${bH}"/>
									<rect x="0" y="${y}" width="${w}" height="${h}"/>
								</g>`);
				});
				// transform into svg rectangles and append to element
				$.svgFromString(rects.join("")).map(rectEl => event.svgEl[0].appendChild(rectEl));
				break;
			case "set-partials":
				event.el.find(".active").removeClass("active");
				el = $(event.target).addClass("active");
				break;
			case "set-harmonicity":
				// min: 0, max: 2
				
				break;
			case "set-phase":
				break;
			case "show-shape-popup":
				// remember srcElement
				Self.srcEl = $(event.target);
				rect = window.getBoundingClientRect(event.target);
				el = window.find(`.popups .oscillator-shape-options`).addClass("show");
				el.data({
						section: "devices",
						rack: "omniOscillator",
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
	},
	doPartialRect(event) {
		let Self = defjam.devices.omniOscillator,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				console.log(event.target);
				break;
			case "mousemove":
				break;
			case "mouseup":
				break;
		}
	}
}
