
// defjam.foot

{
	init() {
		// fast references
		this.els = {
			rack: window.find(".panel-bottom"),
			panelBottom: window.find(".panel-bottom"),
			rowFoot: window.find(".row-foot"),
			btnToggle: window.find(`.row-foot .ball-button[data-click="toggle-rack-panel"]`),
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
			case "set-height":
				// prepare for quick UI switch
				APP.els.content.addClass("no-anim");

				value = +event.node.getAttribute("height");
				if (value === 0) {
					Self.els.panelBottom.addClass("hide");
					Self.els.panelBottom.prevAll(".resize").addClass("hidden");
					Self.els.btnToggle.addClass("toggled");
					Self.els.rowFoot.find(".box.active").removeClass("active");
				} else {
					Self.els.panelBottom.css({ "--pH": `${value}px` });
				}
				// restore quick UI
				requestAnimationFrame(() => APP.els.content.removeClass("no-anim"));
				break;
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
				// open bottom panel, if closed
				if (Self.els.panelBottom.hasClass("hide")) {
					Self.els.btnToggle.trigger("click");
				}
				// toggle panel height
				if (name === "devices") {
					value = Self.els.panelBottom.cssProp("--pH");
					Self.els.panelBottom.css({ "--pH": "" }).data({ value });
				} else {
					value = parseInt(Self.els.panelBottom.data("value") || "320px", 10);
					Self.els.panelBottom.css({ "--pH": `${value}px` });
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
