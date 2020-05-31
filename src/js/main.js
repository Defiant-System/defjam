
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
		this.sidebar = window.find(".sidebar");
		this.panelBottom = window.find(".panel-bottom");
		this.footDevices = window.find(".foot-devices");
		this.footMidi = window.find(".foot-midi");
		this.rowFoot = window.find(".row-foot");

		// bind event handlers
		this.content.on("mousedown", ".knob, .pan-knob", this.doKnob);

		// temp
		this.dispatch({ type: "render-view" });
	},
	dispatch(event) {
		let self = jam,
			name,
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
			case "show-sounds":
			case "show-drums":
			case "show-instruments":
			case "show-fx":
				event.el.parent().find(".active").removeClass("active");
				event.el.addClass("active");

				name = ["from"];
				name.push(self.sidebar.prop("className").split("show-")[1].split(" ")[0]);
				name.push("to");
				name.push(event.type.split("-")[1]);
				name = name.join("-");

				self.sidebar
					.cssSequence(name, "animationend", el =>
						el.parent()
							.removeClass("show-sounds show-drums show-instruments show-fx "+ name)
							.addClass(event.type));
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

				self.footDevices.toggleClass("hidden", isOn);
				self.footMidi.toggleClass("hidden", isOn);
				break;
			case "show-device-rack":
				event.el.addClass("active");
				self.footMidi.removeClass("active");
				// expand rack - if needed
				el = self.rowFoot.find(".ball-button");
				if (el.hasClass("toggled")) {
					el.trigger("click");
				}
				break;
			case "show-midi-rack":
				event.el.addClass("active");
				self.footDevices.removeClass("active");
				// expand rack - if needed
				el = self.rowFoot.find(".ball-button");
				if (el.hasClass("toggled")) {
					el.trigger("click");
				}
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
