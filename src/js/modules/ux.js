
const UX = {
	init() {
		// fast references
		this.doc = $(document);
		this.content = window.find("content");

		// bind event handlers
		this.content.on("mousedown", ".knob, .knob2, .pan-knob", this.doKnob);
		this.content.on("mousedown", ".toggle-btn", this.doToggleButton);
		this.content.on("mousedown", ".volume", this.doVolume);
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
	doVolume(event) {
		let Self = UX,
			Drag = Self.drag,
			value,
			el;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				el = $(event.target);
				value = parseInt(el.cssProp("--vol"), 10);

				Self.drag = {
					el,
					clickY: event.clientY + value,
					min_: Math.min,
					max_: Math.max,
				};

				// bind event handlers
				Self.content.addClass("hide-cursor");
				Self.doc.on("mousemove mouseup", Self.doVolume);
				break;
			case "mousemove":
				value = Drag.min_(Drag.max_(Drag.clickY - event.clientY, 0), 100);
				Drag.el.css({ "--vol": `${value}%` });
				break;
			case "mouseup":
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
