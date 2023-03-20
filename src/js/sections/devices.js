
// defjam.devices

{
	init() {
		// fast references
		this.els = {
			el: window.find(`.panel-bottom .devices-body`),
			pEl: window.find(".panel-bottom"),
			btnToggle: window.find(`.row-foot .ball-button[data-click="toggle-rack-panel"]`),
		};
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.devices,
			xPath,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "set-height":
				// prepare for quick UI switch
				APP.els.content.addClass("no-anim");

				if (event.value === 0) {
					Self.els.pEl.addClass("hide");
					Self.els.pEl.prevAll(".resize").addClass("hidden");
					Self.els.btnToggle.addClass("toggled");
				} else {
					Self.els.pEl.css({ "--pH": `${event.value}px` });
				}
				// restore quick UI
				requestAnimationFrame(() => APP.els.content.removeClass("no-anim"));
				break;
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
		}
	}
}
