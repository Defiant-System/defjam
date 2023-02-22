
// defjam.browser

{
	init() {
		// fast references
		this.els = {
			audioChart: window.find(".audio-chart"),
		};

		Audio.visualizeFile({
				url: "~/sounds/909 Core Kit/Kick.ogg",
				width: 202,
				height: 33,
				color: "#71a1ca",
			})
			 .then(path => this.els.audioChart.css({ "background-image": `url(${path})` }));

	},
	dispatch(event) {
		let APP = defjam,
			Self =  APP.browser,
			name,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "show-sounds":
				break;
		}
	}
}
