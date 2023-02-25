
// defjam.foot

{
	init() {
		// fast references
		this.els = {
			rack: window.find(".panel-bottom"),
			panelBottom: window.find(".panel-bottom"),
			rowFoot: window.find(".row-foot"),
		};
		
		Audio.visualizeFile({
				url: "~/sounds/909 Core Kit/Snare.ogg",
				width: 512,
				height: 108,
			})
			.then(path => window.find("canvas").css({ "background-image": `url(${path})` }));
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
			case "show-drumkit-rack":
			case "show-midi-rack":
				event.el.parent().find(".box.active").removeClass("active");
				event.el.addClass("active");

				[name, value] = event.type.split("-");
				Self.els.rack
					.removeClass("show-devices show-drumkit show-midi")
					.addClass(`show-${value}`);
				break;
		}
	}
}
