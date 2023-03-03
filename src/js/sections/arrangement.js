
// defjam.arrangement

{
	init() {
		// fast references
		this.els = {
			el: window.find(".arr-layout"),
			sel: window.find(".arr-layout .row-track .selection"),
		};

		// Audio.visualizeFile({
		// 		url: "~/sounds/909 Core Kit/ClosedHat.ogg",
		// 		width: 191,
		// 		height: 47,
		// 		color: "#151",
		// 	})
		// 	 .then(path => this.els.el.find(".channel:nth(2) b").css({ "--clip-bg": `url(${path})` }));

	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.arrangement,
			name,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "select-channel":
				el = $(event.target);
				if (!el.hasClass("channel")) el = el.parents(".channel");
				
				if (el.length) {
					let cEl = el.find("b"),
						top = el.prop("offsetTop"),
						left = cEl.prop("offsetLeft"),
						width = cEl.prop("offsetWidth"),
						height = cEl.prop("offsetHeight");
					Self.els.sel.css({ top, left, width, height });
					// change midi note editor color
					APP.midiEditor.els.el.css({ "--c": el.cssProp("--c") });
				}
				break;
		}
	}
}
