
// defjam.drumkit

{
	init() {
		// fast references
		this.els = {
			el: window.find(`.rack-body[data-section="drumkit"] .pads-wrapper`),
		};
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.drumkit,
			xPath,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "render-file":
				// render file tracks
				window.render({
					data: event.file.data,
					template: "drumkit-pads",
					match: `//Project//Track[@id="track-1"]/Pads`,
					target: Self.els.el,
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
