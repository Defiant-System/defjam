
// defjam.arrangement

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};

		Audio.visualizeFile({
				url: "~/sounds/909 Core Kit/ClosedHat.ogg",
				width: 191,
				height: 47,
				color: "#151",
			})
			 .then(path => this.els.content.find(".channel:nth(2) b").css({ "--clip-bg": `url(${path})` }));

	},
	dispatch(event) {
		let APP = defjam,
			Self =  APP.arrangement,
			name,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "show-midi-rack":
				break;
		}
	}
}
