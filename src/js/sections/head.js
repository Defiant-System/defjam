
// defjam.head

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			panelLeft: window.find(".panel-left"),
			sidebar: window.find(".sidebar"),
		};
	},
	dispatch(event) {
		let APP = defjam,
			Self =  APP.head,
			name,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "toggle-work-panel":
				el = event.el;
				value = el.hasClass("toggled");
				el.toggleClass("toggled", value);
				Self.els.panelLeft.toggleClass("hide", value);
				Self.els.panelLeft.nextAll(".resize:first").toggleClass("hidden", value);
				break;
			case "show-sounds":
			case "show-drums":
			case "show-instruments":
			case "show-fx":
				if (event.el.hasClass("active")) return;
				event.el.parent().find(".active").removeClass("active");
				event.el.addClass("active");

				name = ["from"];
				name.push(Self.els.sidebar.prop("className").split("show-")[1].split(" ")[0]);
				name.push("to");
				name.push(event.type.split("-")[1]);
				name = name.join("-");

				Self.els.sidebar
					.cssSequence(name, "animationend", el =>
						el.parent()
							.removeClass("show-sounds show-drums show-instruments show-fx "+ name)
							.addClass(event.type));
				break;
			case "show-arrangement-view":
				event.el.parent().find(".active").removeClass("active");
				event.el.addClass("active");

				event.el.parents(".row-work")
					.find(".panel-right")
					.removeClass("show-session show-arrangement")
					.addClass("show-arrangement");
				break;
			case "show-session-view":
				event.el.parent().find(".active").removeClass("active");
				event.el.addClass("active");

				event.el.parents(".row-work")
					.find(".panel-right")
					.removeClass("show-session show-arrangement")
					.addClass("show-session");
				break;
		}
	}
}
