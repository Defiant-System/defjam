
const jam = {
	init() {
		// fast references
		this.content = window.find("content");

		// bind event handlers
		this.content.on("mousedown", ".knob, .pan-knob", this.doKnob);
	},
	dispatch(event) {
		switch (event.type) {
			case "window.open":
				break;
		}
	},
	doKnob(event) {
		let self = jam,
			drag = self.drag,
			value,
			el;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				el = $(event.target);
				value = +el.data("value");

				self.drag = {
					el,
					value,
					clientY: event.clientY,
					clientX: event.clientX,
					min: el.hasClass("pan-knob") ? -50 : 0,
					max: el.hasClass("pan-knob") ? 50 : 100,
				};
				// bind event handlers
				self.content
					.addClass("hide-cursor")
					.on("mousemove mouseup", self.doKnob);
				break;
			case "mousemove":
				value = ((drag.clientY - event.clientY) * 2) + drag.value;
				value = Math.min(Math.max(value, drag.min), drag.max);
				value -= value % 2;
				drag.el.data({ value });
				break;
			case "mouseup":
				// unbind event handlers
				self.content
					.removeClass("hide-cursor")
					.off("mousemove mouseup", self.doKnob);
				break;
		}
	}
};

window.exports = jam;
