
import { Audio } from "./modules/audio";

const defjam = {
	init() {
		// fast references
		this.content = window.find("content");
		this.panelLeft = window.find(".panel-left");
		this.sidebar = window.find(".sidebar");
		this.audioChart = window.find(".audio-chart");
		this.panelBottom = window.find(".panel-bottom");
		this.footDevices = window.find(".foot-devices");
		this.footMidi = window.find(".foot-midi");
		this.rowFoot = window.find(".row-foot");

		Audio.init();

		// tag all list items with id's
		window.bluePrint.selectNodes("//Sounds//*")
			.map((node, i) => node.setAttribute("id", 100 + i));

		// bind event handlers
		this.content.on("mousedown", ".knob, .pan-knob", this.doKnob);

		// temp
		this.dispatch({ type: "render-view" });
	},
	async dispatch(event) {
		let self = defjam,
			path,
			name,
			value,
			isOn,
			pEl,
			el;
		//console.log(event);
		switch (event.type) {
			case "render-view":
				window.render({
					template: "sidebar-list",
					data: window.bluePrint.selectSingleNode("//Drums"),
					append: self.sidebar.find(".sounds-body .box-body:first")
				});

				window.render({
					template: "session",
					data: window.bluePrint.selectSingleNode("//file"),
					prepend: self.content.find(".session-wrapper")
				});

				// let test = await Audio.visualizeFile("~/sounds/drumkit/kick.wav", self.ctx);
				// console.log(test);
				break;
			case "preview-audio":
				el = $(event.target);
				if (event.target === event.el[0]) return;
				if (el.prop("nodeName") === "SPAN") el = el.parents(".folder, .item");
				pEl = el.parents(".box-body");

				if (el.hasClass("item")) {
					pEl.find(".active").removeClass("active");
					el.addClass("active");

					name = "~/sounds/"+ el.data("path");
					path = await Audio.visualizeFile(name, self.ctx);
					
					setTimeout(() => {
						self.audioChart.css({ "background-image": `url(${path})` });
					}, 500);

				} else {
					// folder
					if (el.hasClass("open")) {
						el.cssSequence("!open", "transitionend", e => e.find("> div > div").html(""));
					} else {
						// collapse previously open folder
						pEl.find(".open span").trigger("click");
						// render contents of folder
						window.render({
							template: "sidebar-list",
							data: window.bluePrint.selectSingleNode("//data"),
							match: `//*[@id = "${el.data("id")}"]`,
							append: el.find("> div > div")
						});
						// expand folder
						el.addClass("open");
					}
				}
				break;
			case "show-sounds":
			case "show-drums":
			case "show-instruments":
			case "show-fx":
				if (event.el.hasClass("active")) return;
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
		let self = defjam,
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

window.exports = defjam;
