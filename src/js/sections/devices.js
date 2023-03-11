
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
			xPath,
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
		}
	}
}
