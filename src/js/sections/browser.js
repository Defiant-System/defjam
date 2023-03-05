
// defjam.browser

{
	init() {
		// fast references
		this.els = {
			el: window.find(`.panel-left[data-section="browser"]`),
			soundsBody: window.find(".sounds-body"),
			audioChart: window.find(".audio-chart"),
		};

		// render trees
		this.dispatch({ type: "init-browser-tree" });
	},
	dispatch(event) {
		let APP = defjam,
			Self =  APP.browser,
			name,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "init-browser-tree":
				// render sounds
				window.render({
					template: "browser-tree",
					match: `//Presets`,
					target: Self.els.el.find(".sounds-body .tree"),
				});
				// render drums
				window.render({
					template: "browser-tree",
					match: `//Drums`,
					target: Self.els.el.find(".drums-body .tree"),
				});
				break;
			case "do-tree-leaf":
				console.log(event);
				el = $(event.target);
				el.parents(".box-body").find(".leaf.active").removeClass("active");

				if (el.hasClass("box-body")) {
					// hide audio preview
					return Self.els.soundsBody.removeClass("show-audio-preview");
				} else if (el.hasClass("icon-folder")) {
					el.parent().toggleClass("expanded", el.parent().hasClass("expanded"));
					return;
				} else if (el.parent().hasClass("leaf")) {
					el = el.parent();
				}
				el.addClass("active");

				if (el.data("id")) {
					return Self.dispatch({ type: "preview-audio", id: +el.data("id") });
				}
				break;
			case "preview-audio":
				console.log(event);
				/*
				Audio.visualizeFile({
					url: `~/sounds/909 Core Kit/${event.path}`,
					width: 202,
					height: 33,
					color: "#71a1ca",
				})
				.then(path => {
					Self.els.soundsBody.addClass("show-audio-preview");
					Self.els.audioChart.css({ "background-image": `url(${path})` });
				});
				*/
				break;
		}
	}
}
