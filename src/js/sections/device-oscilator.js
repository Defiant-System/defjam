
// defjam.devices.oscilator

{
	init() {
		// fast references
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.devices.oscilator,
			rect,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-rack":
				el = event.el.find(`div[data-rack="oscilator"] svg path.st1`);
				value = "M3.8,60.5c6-3.1,17.9-51.1,26.1-51.1S49,58.1,60,58.1s9-2.9,15.2-2.9s14.8,13.2,18.9,23.1 c4.2,9.9,7.5,19.4,13.7,18.9c12.8-0.9,17.4-38.3,29.7-38.5c12.3-0.2,12.6,7.5,18.2,2.6c9.1-8,15.3-51.7,25.9-52 c10.6-0.2,19.4,35.9,21.5,39.9";
				// set "d" for display path
				el.attr({ d: value });
				break;
			case "show-shape-popup":
				// remember srcElement
				Self.srcEl = $(event.target);
				rect = window.getBoundingClientRect(event.target);
				el = window.find(`.popups .oscilator-shape-options`).addClass("show");
				el.data({
						section: "devices",
						rack: "oscilator",
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
			case "set-oscilator-shape":
				el = $(event.target);
				Self.srcEl.find("> i").prop({ className: `icon-shape_${el.data("arg")}` });
				/* falls through */
			case "hide-shapes-popup":
				// reset menu
				window.find(`.popups .oscilator-shape-options`)
					.removeAttr("data-section")
					.removeClass("show");
				// cover app UI
				APP.els.content.removeClass("cover");
				break;
		}
	}
}
