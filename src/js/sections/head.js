
// defjam.head

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			panelLeft: window.find(".panel-left"),
			sidebar: window.find(".sidebar"),
			btnSess: window.find(`.row-work .buttons .ball-button[data-click="show-session-view"]`),
			btnArr: window.find(`.row-work .buttons .ball-button[data-click="show-arrangement-view"]`),
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
				el = event.el || Self.els.btnArr;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// start view animations, if any
				Jam.anim.dispatch({ type: "arrangement-turn-on" });

				el.parents(".row-work")
					.find(".panel-right")
					.removeClass("show-session show-arrangement")
					.addClass("show-arrangement");

				// make sure all analyser canvases are correct height
				Object.keys(Jam.track._list).map(id => Jam.track.updateAnalyserHeight({ id, type: "lane" }));
				break;
			case "show-session-view":
				el = event.el || Self.els.btnSess;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// start view animations, if any
				Jam.anim.dispatch({ type: "session-turn-on" });

				el.parents(".row-work")
					.find(".panel-right")
					.removeClass("show-session show-arrangement")
					.addClass("show-session");

				// make sure all analyser canvases are correct height
				Object.keys(Jam.track._list).map(id => Jam.track.updateAnalyserHeight({ id, type: "chan" }));
				break;
		}
	}
}
