
// defjam.devices

{
	init() {
		// fast references
		this.els = {
			el: window.find(`.panel-bottom .devices-body`),
		};
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.devices,
			rect,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "render-device":
				// remove existing device, if any
				Self.els.el.find("> div:not(.box-body)").remove();
				// render file tracks
				window.render({
					data: event.file.data,
					template: "devices",
					match: `//Project//Track[@id="${event.trackId}"]`,
					prepend: Self.els.el,
				});
				break;
			case "mute-pad": break;
			case "solo-pad": break;
			case "play-pad":
				el = event.el.parents("li:first");
				Jam.track.play("track-1", el.data("key"));
				break;
			case "show-curves-popup":
				rect = window.getBoundingClientRect(event.target);
				el = window.find(`.popup-menu.envelope-curve-options`).addClass("show");
				el.data({ section: "devices" })
					.css({
						top: rect.top - +el.prop("offsetHeight"),
						left: rect.left,
					});
				// remember srcElement
				Self.srcEl = $(event.target);
				// cover app UI
				APP.els.content.addClass("cover");
				break;
			case "set-envelope-curve":
				el = $(event.target);
				Self.srcEl.find("> i").prop({ className: `icon-curve_${el.data("arg")}` });
				/* falls through */
			case "hide-curves-popup":
				// reset menu
				window.find(`.popup-menu.envelope-curve-options`)
					.removeAttr("data-section")
					.removeClass("show");
				// cover app UI
				APP.els.content.removeClass("cover");
				break;
		}
	}
}
