
// defjam.drumkit

{
	init() {
		// fast references
		this.els = {
			el: window.find(`.rack-body[data-section="drumkit"] .pads-wrapper`),
		};
		// temp
		// this.dispatch({ type: "load-drumkit", name: "TR Kit" });
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
				// window.render({
				// 	data: event.file.data,
				// 	template: "drumkit-pads",
				// 	match: `//Project//Track[@id="track-1"]/Pads`,
				// 	target: Self.els.el,
				// });
				break;
			// case "load-drumkit":
			// 	xPath = `//Drums//Item[@name="${event.name}"]`;
			// 	// render clip notes
			// 	window.render({
			// 		template: "drumkit-pads",
			// 		match: xPath,
			// 		append: Self.els.el,
			// 	});

			// 	value = {
			// 		urls: {},
			// 		fadeOut: "4n",
			// 		baseUrl: BASE_URL,
			// 	};
			// 	window.bluePrint.selectNodes(`${xPath}/s`)
			// 		.map(x => {
			// 			let i = +x.getAttribute("i"),
			// 				n = +x.getAttribute("n");
			// 			value.urls[n] = `${i}.ogg`;
			// 		});
			// 	Self.pads = new Tone.Players(value).toDestination();
			// 	break;
			case "play-pad":
				Self.pads.player(+event.arg).start();
				break;
		}
	}
}
