
// defjam.devices.drumkit

{
	dispatch(event) {
		let APP = defjam,
			Self = APP.devices.drumkit,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "init-rack":
				Self.trackId = event.trackId;
				break;
			case "mute-pad": break;
			case "solo-pad": break;
			case "play-pad":
				el = event.el.parents("li:first");
				Jam.track.play(Self.trackId, el.data("key"));
				break;
		}
	}
}
