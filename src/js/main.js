
// temp
let file = `<data>
		<Tracks>
			<i name="Drums" />
			<i name="Grand Piano" />
			<i name="Vocals" />
		</Tracks>
		<IoMaster>
			<i name="Reverb" />
			<i name="Delay" />
			<i name="Master" />
		</IoMaster>
	</data>`;


const jam = {
	init() {
		// fast references
		this.content = window.find("content");
		this.panelLeft = window.find(".panel-left");
		this.panelBottom = window.find(".panel-bottom");

		// bind event handlers
		this.content.on("mousedown", ".knob, .pan-knob", this.doKnob);

		// temp
		this.dispatch({ type: "render-view" });
	},
	dispatch(event) {
		let self = jam,
			isOn,
			el;
		//console.log(event);
		switch (event.type) {
			case "render-view":
				let data = $.xmlFromString(file);

				window.render({
					data,
					template: "session",
					prepend: self.content.find(".session-wrapper")
				});
				break;
			case "toggle-work-panel":
				el = event.el;
				isOn = el.hasClass("toggled");
				el.toggleClass("toggled", isOn);
				self.panelLeft.toggleClass("hide", isOn);
				break;
			case "toggle-rack-panel":
				el = event.el;
				isOn = el.hasClass("toggled");
				el.toggleClass("toggled", isOn);
				self.panelBottom.toggleClass("hide", isOn);
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
