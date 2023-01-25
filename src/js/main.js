
@import "./modules/ux.js";
@import "./modules/audio.js";

@import "./modules/test.js";


const defjam = {
	init() {
		// fast references
		this.content = window.find("content");
		this.panelLeft = window.find(".panel-left");
		this.sidebar = window.find(".sidebar");
		this.audioChart = window.find(".audio-chart");
		this.panelBottom = window.find(".panel-bottom");
		this.rack = window.find(".box.rack");
		this.rowFoot = window.find(".row-foot");

		UX.init();
		Audio.init();

		// tag all list items with id's
		window.bluePrint.selectNodes("//Sounds//*")
			.map((node, i) => node.setAttribute("id", 100 + i));

		// DEV-ONLY-START
		this.dispatch({ type: "render-view" });

		Test.init();
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = defjam,
			path,
			url,
			name,
			value,
			isOn,
			pEl,
			el;
		//console.log(event);
		switch (event.type) {
			case "render-view":
				// temp
				//setTimeout(() => Self.sidebar.find(".item:nth-child(2)").trigger("click"), 2000);
				//await karaqu.cache.clear();
				
				window.cache.clear("Snare-512x108.png");
				//window.cache.clear();

				// Audio.visualizeFile({
				// 		url: "~/sounds/909 Core Kit/Kick.ogg",
				// 		width: 202,
				// 		height: 33,
				// 		color: "#71a1ca",
				// 	})
				// 	 .then(path => Self.audioChart.css({ "background-image": `url(${path})` }));

				// Audio.visualizeFile({
				// 		url: "~/sounds/909 Core Kit/Snare.ogg",
				// 		width: 512,
				// 		height: 108,
				// 	})
				// 	.then(path => window.find("canvas").css({ "background-image": `url(${path})` }));

				break;
			case "play-audio":
				Self.audioChart
					.cssSequence("play", "transitionend", el => el.removeClass("play"));
				break;
			case "preview-audio":
				/*
				el = $(event.target);
				if (event.target === event.el[0]) return;
				if (el.prop("nodeName") === "SPAN") el = el.parents(".folder, .item");
				pEl = el.parents(".box-body");

				if (el.hasClass("item")) {
					pEl.find(".active").removeClass("active");
					el.addClass("active");
					// update audio chart box
					url = "~/sounds/"+ el.data("path");
					path = await Audio.visualizeFile({ url, width: 202, height: 31 });
					Self.audioChart
						.css({ "background-image": `url(${path})` })
						.cssSequence("play", "transitionend", el => el.removeClass("play"));
				} else {
					// folder
					if (el.hasClass("open")) {
						el.cssSequence("!open", "transitionend", e => e.find("> div > div").html(""));
					} else {
						// collapse previously open folder
						pEl.find(".open span").trigger("click");
						// render contents of folder
						window.render({
							template: "sidebar-list",
							data: window.bluePrint.selectSingleNode("//data"),
							match: `//*[@id = "${el.data("id")}"]`,
							append: el.find("> div > div")
						});
						// expand folder
						el.addClass("open");
					}
				}
				*/
				break;
			case "show-sounds":
			case "show-drums":
			case "show-instruments":
			case "show-fx":
				if (event.el.hasClass("active")) return;
				event.el.parent().find(".active").removeClass("active");
				event.el.addClass("active");

				name = ["from"];
				name.push(Self.sidebar.prop("className").split("show-")[1].split(" ")[0]);
				name.push("to");
				name.push(event.type.split("-")[1]);
				name = name.join("-");

				Self.sidebar
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
			case "toggle-work-panel":
				el = event.el;
				isOn = el.hasClass("toggled");
				el.toggleClass("toggled", isOn);
				Self.panelLeft.toggleClass("hide", isOn);
				break;
			case "toggle-rack-panel":
				el = event.el;
				isOn = el.hasClass("toggled");
				el.toggleClass("toggled", isOn);
				Self.panelBottom.toggleClass("hide", isOn);

				Self.rowFoot.find(".box.active").toggleClass("hidden", isOn);
				break;
			case "show-devices-rack":
			case "show-drumkit-rack":
			case "show-midi-rack":
				event.el.parent().find(".box.active").removeClass("active");
				event.el.addClass("active");

				Self.rack
					.removeClass("show-devices show-drumkit show-midi")
					.addClass("show-"+ event.type.split("-")[1]);

				// expand rack - if needed
				el = Self.rowFoot.find(".ball-button");
				if (el.hasClass("toggled")) {
					el.trigger("click");
				}
				break;
		}
	}
};

window.exports = defjam;
