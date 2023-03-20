
// defjam.foot

{
	init() {
		// fast references
		this.els = {
			rack: window.find(".panel-bottom"),
			panelBottom: window.find(".panel-bottom"),
			rowFoot: window.find(".row-foot"),
		};
		
		// Audio.visualizeFile({
		// 		url: "~/sounds/909 Core Kit/Snare.ogg",
		// 		width: 512,
		// 		height: 108,
		// 	})
		// 	.then(path => window.find("canvas").css({ "background-image": `url(${path})` }));
	},
	dispatch(event) {
		let APP = defjam,
			Self =  APP.foot,
			name,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "toggle-rack-panel":
				el = event.el;
				value = el.hasClass("toggled");
				el.toggleClass("toggled", value);
				Self.els.panelBottom.toggleClass("hide", value);

				Self.els.rowFoot.find(".box.active").toggleClass("hidden", value);
				Self.els.rowFoot.prevAll(".resize:first").toggleClass("hidden", value);
				break;
			case "show-devices-rack":
			case "show-midi-rack":
				name = event.type.split("-")[1];
				Self.els.rowFoot.find(".box.active").removeClass("active");
				Self.els.rowFoot.find(`.box.foot-${name}`).addClass("active");

				if (name === "devices") {
					value = APP.devices.els.pEl.cssProp("--pH");
					APP.devices.els.pEl.css({ "--pH": "" }).data({ value });
				} else {
					value = parseInt(APP.devices.els.pEl.data("value") || "320px", 10);
					APP.devices.els.pEl.css({ "--pH": `${value}px` });
				}

				// start view animations, if any
				Jam.anim.dispatch({ type: `${name}-turn-on` });

				APP.els.content
					.removeClass("show-devices show-drumkit show-midi")
					.addClass(`show-${name}`);
				break;
		}
	}
}
