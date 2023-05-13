
// defjam.devices.omniOscillator

{
	dispatch(event) {
		let APP = defjam,
			Self = APP.devices.omniOscillator,
			width, height, y, x,
			name, value,
			list, rect,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-rack":
				// reference track & instrument
				Self.trackId = event.trackId;
				Self.instrument = Jam.track._list[Self.trackId].instrument;
				Self.svgEl = event.el.find("svg");

				Self.dispatch({ type: "draw-oscilator-curve" });
				Self.dispatch({ type: "draw-oscilator-rectangles" });

				// values for UI
				let values = Self.instrument.get();

				// set partial count (option-group)
				event.el.find(`.option-group span:contains("${values.oscillator.partialCount}")`).trigger("click");
				
				// harmonicity value (range-input)
				value = Math.round((values.oscillator.harmonicity / 2) * 100);
				event.el.find(`.range-input`).css({ "--val": value });

				// modulationIndex value (pan knob)
				value = parseInt((((values.oscillator.modulationIndex + 10) / 20) * 100) - 50, 10);
				event.el.find(`.ctrl-knob2 .pan2`).data({ value }).trigger("change");

				// phase value (knob)
				value = parseInt((values.oscillator.phase / 360) * 100, 10);
				event.el.find(`.ctrl-knob2 .knob2`).data({ value }).trigger("change");
				
				value = values.oscillator.type.slice(0, 2).toUpperCase();
				event.el.find(`.am-fm-switch b:contains("${value}")`).trigger("click");

				value = "icon-shape_"+ values.oscillator.type.slice(2);
				event.el.find(`.value-row div[data-arg="type"] i`).prop({ className: value });

				value = "icon-shape_"+ values.oscillator.modulationType;
				event.el.find(`.value-row div[data-arg="modulationType"] i`).prop({ className: value });

				// console.log(values);
				break;
			case "draw-oscilator-curve":
				// optimisation
				if (Self._drawing) return;
				Self._drawing = true;
				// values
				[y, x, width, height] = Self.svgEl.attr("viewBox").split(" ");

				Self.instrument.oscillator.asArray(width >> 1).then(values => {
					let points = [],
						max = Math.max(0.001, ...values) * 1.1,
						min = Math.min(-0.001, ...values) * 1.1,
						scale = (v, inMin, inMax, outMin, outMax) =>
							Math.round(((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin);
						// translate values
						values.map((v, i) => {
							let x = scale(i, 0, values.length, 0, width),
								y = scale(v, max, min, 0, height),
								p = `${x},${y}`;
							if (points[points.length-1] !== p) points.push(p);
						});
					// plot cruve in SVG element
					Self.svgEl.find(`polyline.st1`).attr({ points: points.join(" ") });
					// change flag
					Self._drawing = false;
				});
				break;
			case "draw-oscilator-rectangles":
				// values
				[y, x, width, height] = Self.svgEl.attr("viewBox").split(" ");
				// make sure values are non-negative
				list = Self.instrument.get().oscillator.partials.map(Math.abs);
				rect = [];

				// first clear "old" partial rects
				Self.svgEl.find(`g.st3`).remove();

				let bW = width - 2,
					bH = Math.round(height * .35),
		        	min = Math.min(...list, 0),
		        	max = Math.max(...list, 1),
		        	scale = (v, inMin, inMax, outMin, outMax) =>
		        		Math.pow((v - inMin) / (inMax - inMin), 0.25) * (outMax - outMin) + outMin;

				// iterate partials
				list.map((val, i) => {
					let pL = list.length,
						w = Math.round((bW - (pL * 2)) / pL),
						h = Math.round(scale(val, min, max, 0, bH)),
						x = Math.round(2 + (i * (w + 2))),
						y = bH-h;
					if (i === pL-1) {
						w += (bW - (x + w));
					}
					rect.push(`<g class="st3" transform="translate(${x},${height-bH-2})" index="${i}">
									<rect x="0" y="0" width="${w}" height="${bH}"/>
									<rect x="0" y="${y}" width="${w}" height="${h}"/>
								</g>`);
				});
				// transform into svg rectangles and append to element
				$.svgFromString(rect.join("")).map(rectEl => Self.svgEl[0].appendChild(rectEl));
				break;
			case "set-partials":
				event.el.find(".active").removeClass("active");
				el = $(event.target).addClass("active");

				value = +el.html();
				list = Self.instrument.oscillator.partials;
				if (list.length < value) {
					Self.instrument.oscillator.partials = list.concat([...Array(value - list.length)].map(e => 1));
				} else {
					Self.instrument.oscillator.partials = list.slice(0, value);
				}

				Self.dispatch({ type: "draw-oscilator-rectangles" });
				break;
			case "set-harmonicity":
				// set phase value of synth: min: 0, max: 2
				Self.instrument.oscillator.harmonicity.value = (event.value / 100) * 10;
				// update curve
				Self.dispatch({ type: "draw-oscilator-curve" });
				break;
			case "set-modulation-index":
				// set modulationIndex value of synth
				Self.instrument.oscillator.modulationIndex.value = event.value;
				// update curve
				Self.dispatch({ type: "draw-oscilator-curve" });
				break;
			case "set-phase":
				// set phase value of synth
				Self.instrument.oscillator.phase = event.value;
				// update curve
				Self.dispatch({ type: "draw-oscilator-curve" });
				break;
			case "set-am-fm-type":
				event.el.find(".active").removeClass("active");
				$(event.target).addClass("active");
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
				APP.els.workarea.addClass("cover");

				let func = event => {
					Self.dispatch({ type: "hide-shapes-popup" });
					APP.els.workarea.off("mouseup", func);
				};
				APP.els.workarea.on("mouseup", func);
				break;
			case "set-oscillator-shape":
				el = $(event.target);
				Self.srcEl.find("> i").prop({ className: `icon-shape_${el.data("arg")}` });

				switch (Self.srcEl.data("arg")) {
					case "modulationType":
						Self.instrument.oscillator.modulationType = el.data("arg");
						// update curve
						Self.dispatch({ type: "draw-oscilator-curve" });
						break;
					case "type":
						// handle am/fm (?)
						break;
				}

				/* falls through */
			case "hide-shapes-popup":
				// reset menu
				window.find(`.popups .oscillator-shape-options`)
					.removeAttr("data-section")
					.removeClass("show");
				// cover app UI
				APP.els.workarea.removeClass("cover");
				break;
		}
	},
	doPartialRect(event) {
		let Self = defjam.devices.omniOscillator,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				let el = $(event.target);
				if (el.prop("nodeName") !== "rect") return;

				// prevent default behaviour
				event.preventDefault();

				// make sure to select visible "rect" element
				el = $(event.target.parentNode).find("rect:nth(1)");

				let oscillator = Self.instrument.oscillator,
					partials = oscillator.partials,
					index = +el.parent().attr("index"),
					clickY = event.clientY,
					offset = {
						y: +el.attr("y"),
						h: +el.attr("height"),
					},
					limit = {
						minY: 0,
						maxY: +el.attr("y") + +el.attr("height"),
					},
					max_ = Math.max,
					min_ = Math.min;
				// drag object
				Self.drag = { el, oscillator, partials, index, clickY, offset, limit, max_, min_ };

				// bind event handlers
				UX.workarea.addClass("hide-cursor no-anim");
				UX.doc.on("mousemove mouseup", Self.doPartialRect);
				break;
			case "mousemove":
				let dY = event.clientY - Drag.clickY,
					y = Drag.max_(Drag.min_(Drag.offset.y + dY, Drag.limit.maxY), Drag.limit.minY),
					height = Drag.max_(Drag.min_(Drag.offset.h - dY, Drag.limit.maxY), Drag.limit.minY);
				Drag.el.attr({ y, height });
				// update partials array
				Drag.partials[Drag.index] = height / Drag.limit.maxY;
				Drag.oscillator.partials = Drag.partials;
				// update curve
				Self.dispatch({ type: "draw-oscilator-curve" });
				break;
			case "mouseup":
				// unbind event handlers
				UX.workarea.removeClass("hide-cursor");
				UX.doc.off("mousemove mouseup", Self.doPartialRect);
				break;
		}
	}
}
