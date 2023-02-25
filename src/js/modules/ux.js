
const UX = {
	init() {
		// fast references
		this.doc = $(document);
		this.content = window.find("content");

		// bind event handlers
		this.content.on("mousedown", ".knob, .knob2, .pan-knob", this.doKnob);
		this.content.on("mousedown", ".toggle-btn", this.doToggleButton);
		this.content.on("mousedown", ".volume", this.doVolume);
		this.content.on("mousedown", ".resize", this.doResize);
	},
	doToggleButton(event) {
		let self = UX,
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
					clickX,
					clickY;
				if (type == "horisontal") {
					el = el.prevAll(".panel-left:first");
					clickX = event.clientX - parseInt(el.cssProp("--pW"), 10);
				} else {
					el = el.nextAll(".panel-bottom:first");
					clickY = event.clientY + parseInt(el.cssProp("--pH"), 10);
				}
				Self.drag = { el, type, clickX, clickY };

				// bind event handlers
				Self.content.addClass("hide-cursor no-anim");
				Self.doc.on("mousemove mouseup", Self.doResize);
				break;
			case "mousemove":
				if (Drag.type == "horisontal") {
					let width = event.clientX - Drag.clickX;
					Drag.el.css({ width });
					// save value for mouse up
					Drag.value = width;
				} else {
					let height = Drag.clickY - event.clientY;
					Drag.el.css({ height });
					// save value for mouse up
					Drag.value = height;
				}
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
	doKnob(event) {
		let Self = UX,
			Drag = Self.drag,
			value,
			el;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				el = $(event.target);
				value = +el.data("value");

				Self.drag = {
					el,
					value,
					clientY: event.clientY,
					clientX: event.clientX,
					min: el.hasClass("pan-knob") ? -50 : 0,
					max: el.hasClass("pan-knob") ? 50 : 100,
				};
				// bind event handlers
				Self.content.addClass("hide-cursor");
				Self.doc.on("mousemove mouseup", Self.doKnob);
				break;
			case "mousemove":
				value = ((Drag.clientY - event.clientY) * 2) + Drag.value;
				value = Math.min(Math.max(value, Drag.min), Drag.max);
				value -= value % 2;
				Drag.el.data({ value });
				break;
			case "mouseup":
				// unbind event handlers
				Self.content.removeClass("hide-cursor");
				Self.doc.off("mousemove mouseup", Self.doKnob);
				break;
		}
	}
};
