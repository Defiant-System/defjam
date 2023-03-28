
// defjam.devices.envelope

{
	init() {
		// fast references
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.devices.envelope,
			rect,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "show-curves-popup":
				// remember srcElement
				Self.srcEl = $(event.target);
				value = Self.srcEl.data("arg") === "attack" ? "" : "decay-icons";
				rect = window.getBoundingClientRect(event.target);
				el = window.find(`.popups .envelope-curve-options`).addClass("show "+ value);
				el.data({
						section: "devices",
						rack: "envelope",
					})
					.css({
						top: rect.top - +el.prop("offsetHeight"),
						left: rect.left,
					});
				// cover app UI
				APP.els.content.addClass("cover");

				let func = event => {
					Self.dispatch({ type: "hide-curves-popup" });
					APP.els.content.off("mouseup", func);
				};
				APP.els.content.on("mouseup", func);
				break;
			case "set-envelope-curve":
				el = $(event.target);
				value = Self.srcEl.data("arg") === "attack" ? "" : "decay_";
				Self.srcEl.find("> i").prop({ className: `icon-curve_${value + el.data("arg")}` });
				/* falls through */
			case "hide-curves-popup":
				// reset menu
				window.find(`.popups .envelope-curve-options`)
					.removeAttr("data-section")
					.removeClass("show decay-icons");
				// cover app UI
				APP.els.content.removeClass("cover");
				break;
		}
	}
}
