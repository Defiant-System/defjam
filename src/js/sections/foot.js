
// defjam.foot

{
	init() {
		// fast references
		this.els = {
			rack: window.find(".panel-bottom"),
		};
	},
	dispatch(event) {
		let APP = defjam,
			Self =  APP.foot,
			name,
			value,
			el;
		//console.log(event);
		switch (event.type) {
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
