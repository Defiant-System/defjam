
const UX = {
	init() {
		// fast references
		this.doc = $(document);
		this.content = window.find(".content");

		// bind event handlers
		this.content.on("mousedown change", ".knob, .knob2, .pan-knob, .pan2", this.doKnob);
		this.content.on("mousedown", ".range-input, .pan-input", this.doRange);
		this.content.on("mousedown", ".toggle-btn", this.doToggleButton);
		this.content.on("mousedown", ".volume", this.doVolume);
		this.content.on("mousedown", ".resize", this.doResize);
	},
	doToggleButton(event) {
		let Self = UX,
			el;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				el = $(event.target);
				el.toggleClass("on", el.hasClass("on"));
				break;
		}
	},
	doResize(event) {
		let Self = UX,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let el = $(this),
					type = el.prop("className").split(" ")[1],
					btnEl,
					clickX,
					clickY;
				if (type == "horisontal") {
					el = el.prevAll(".panel-left:first");
					clickX = event.clientX - parseInt(el.cssProp("--pW"), 10);
					btnEl = el.parent().find(`.buttons .ball-button[data-click="toggle-work-panel"]`);
				} else {
					if (defjam.els.content.hasClass("show-devices")) return;
					el = el.nextAll(".panel-bottom:first");
					clickY = event.clientY + parseInt(el.cssProp("--pH"), 10);
					btnEl = el.parent().find(`.buttons .ball-button[data-click="toggle-rack-panel"]`);
				}
				Self.drag = { el, btnEl, type, clickX, clickY };

				// bind event handlers
				Self.content.addClass("hide-cursor no-anim");
				Self.doc.on("mousemove mouseup", Self.doResize);
				break;
			case "mousemove":
				let data = {},
					autoCollapse;
				if (Drag.type == "horisontal") {
					data.width = event.clientX - Drag.clickX;
					// save value for mouse up
					Drag.value = data.width;
				} else {
					data.height = Drag.clickY - event.clientY;
					// save value for mouse up
					Drag.value = data.height;
				}
				autoCollapse = Drag.value > 120;
				Drag.btnEl.toggleClass("toggled", autoCollapse);
				Drag.el.css(data);
				break;
			case "mouseup":
				if (Drag.value) {
					if (Drag.type == "horisontal") {
						Drag.el.css({ "width": "", "--pW": `${Drag.value}px` });
					} else {
						Drag.el.css({ "height": "", "--pH": `${Drag.value}px` });
					}
				}
				// UI reset on next tick
				setTimeout(() => Self.content.removeClass("no-anim"), 1);
				// unbind event handlers
				Self.content.removeClass("hide-cursor");
				Self.doc.off("mousemove mouseup", Self.doResize);
				break;
		}
	},
	doVolume(event) {
		let Self = UX,
			Drag = Self.drag,
			value;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let el = $(event.target),
					height = el.prop("offsetHeight");

				value = Math.round((1-(event.offsetY / height)) * 100);
				el.css({ "--vol": `${value}%` });

				Self.drag = {
					el,
					clickY: event.clientY + value,
					min_: Math.min,
					max_: Math.max,
				};
				// snap to
				setTimeout(() => el.addClass("dnd"), 1);
				// bind event handlers
				Self.content.addClass("hide-cursor");
				Self.doc.on("mousemove mouseup", Self.doVolume);
				break;
			case "mousemove":
				value = Drag.min_(Drag.max_(Drag.clickY - event.clientY, 0), 100);
				Drag.el.css({ "--vol": `${value}%` });

				// temp
				// console.log( value );
				// Jam.channel1.set({ volume: value });
				break;
			case "mouseup":
				// reset elemeent
				Drag.el.removeClass("dnd");
				// unbind event handlers
				Self.content.removeClass("hide-cursor");
				Self.doc.off("mousemove mouseup", Self.doVolume);
				break;
		}
	},
	doRange(event) {
		let Self = UX,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				// prepare drag object
				let el = $(event.target),
					isPan = el.hasClass("pan-input"),
					value = parseInt(el.cssProp("--val"), 10),
					// for event handler
					rack = el.parents(`[data-rack]`),
					section = rack.parents(`[data-section]`),
					eType = el.data("change"),
					eFunc = defjam[section.data("section")][rack.data("rack")].dispatch;
				
				if (isPan) {
					value = el.data("val");
					switch (true) {
						case value.startsWith("C"): value = 0;                    break;
						case value.startsWith("L"): value = +value.slice(1) * -1; break;
						case value.startsWith("R"): value = +value.slice(1);      break;
					}
				}

				Self.drag = {
					el,
					isPan,
					value,
					eType,
					eFunc,
					clientX: event.clientX,
					min: isPan ? -50 : 0,
					max: isPan ? 50 : 100,
				};

				// bind event handlers
				Self.content.addClass("hide-cursor");
				Self.doc.on("mousemove mouseup", Self.doRange);
				break;
			case "mousemove":
				if (Drag.isPan) {
					let v1 = 50,
						v2 = 50,
						val,
						value = event.clientX - Drag.clientX + Drag.value;
					value = Math.min(Math.max(value, Drag.min), Drag.max);
					// value logic
					switch (true) {
						case value < 0:
							v1 = 50 + value;
							val = "L"+ value.toString().slice(1);
							break;
						case value > 0:
							v2 = 50 + value;
							val = "R"+ value;
							break;
						default:
							val = "C";
							v1 = v2 = 50;
							break;
					}
					// UI update
					Drag.el.css({ "--v1": `${v1}%`, "--v2": `${v2}%` }).data({ val });
				} else {
					let value = event.clientX - Drag.clientX + Drag.value;
					value = Math.min(Math.max(value, Drag.min), Drag.max);
					Drag.el.css({ "--val": value });
					// prevents "too many" calls
					if (Drag.v !== value) {
						// call event handler
						Drag.eFunc({ type: Drag.eType, value });
						// save value
						Drag.v = value;
					}
				}
				break;
			case "mouseup":
				// unbind event handlers
				Self.content.removeClass("hide-cursor");
				Self.doc.off("mousemove mouseup", Self.doRange);
				break;
		}
	},
	doKnob(event) {
		let Self = UX,
			Drag = Self.drag,
			value,
			val,
			el;
		switch (event.type) {
			case "change":
				el = $(event.target);
				value = +el.data("value");
				// calculations
				let prefix = el.data("prefix") || "",
					suffix = el.data("suffix") || "",
					min = +el.data("min"),
					max = +el.data("max"),
					step = +el.data("step");
				// update sibling span value
				val = Math.round(((value / 100) * (max - min)) / step) * step;
				el.parent().find("span").html(`${prefix} ${val} ${suffix}`);
				break;
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				// variables
				el = $(event.target);
				value = +el.data("value");

				let isPan = el.hasClass("pan-knob") || el.hasClass("pan2"),
					rack = el.parents(`[data-rack]`),
					section = rack.parents(`[data-section]`),
					eType = el.data("change"),
					eFunc = section.length && rack.length
							? defjam[section.data("section")][rack.data("rack")].dispatch
							: e => {};

				// prepare drag object
				Self.drag = {
					el,
					value,
					eType,
					eFunc,
					sEl: el.parent().find("span"),
					prefix: el.data("prefix") || "",
					suffix: el.data("suffix") || "",
					vMin: +el.data("min"),
					vMax: +el.data("max"),
					step: +el.data("step"),
					clientY: event.clientY,
					clientX: event.clientX,
					min: isPan ? -50 : 0,
					max: isPan ? 50 : 100,
				};
				// bind event handlers
				Self.content.addClass("hide-cursor");
				Self.doc.on("mousemove mouseup", Self.doKnob);
				break;
			case "mousemove":
				value = (Drag.clientY - event.clientY) + Drag.value;
				value = Math.min(Math.max(value, Drag.min), Drag.max);
				value -= value % 2;
				Drag.el.data({ value });
				// update span element
				val = Math.round(((value / 100) * (Drag.vMax - Drag.vMin)) / Drag.step) * Drag.step;
				Drag.sEl.html(`${Drag.prefix} ${val} ${Drag.suffix}`);
				// prevents "too many" calls
				if (Drag.v !== val) {
					// call event handler
					Drag.eFunc({ type: Drag.eType, value: val });
					// save value
					Drag.v = val;
				}
				break;
			case "mouseup":
				// unbind event handlers
				Self.content.removeClass("hide-cursor");
				Self.doc.off("mousemove mouseup", Self.doKnob);
				break;
		}
	}
};
