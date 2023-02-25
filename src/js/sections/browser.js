
// defjam.browser

{
	init() {
		// fast references
		this.els = {
			soundsBody: window.find(".sounds-body"),
			audioChart: window.find(".audio-chart"),
		};

		// temp
		this.els.soundsBody.find(`.leaf[data-path="Kick.ogg"]`).trigger("click");
		// this.dispatch({ type: "preview-audio", path: "Kick.ogg" });
	},
	dispatch(event) {
		let APP = defjam,
			Self =  APP.browser,
			name,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "do-tree-leaf":
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

				if (el.data("path")) {
					return Self.dispatch({ type: "preview-audio", path: el.data("path") });
				}
				break;
			case "preview-audio":
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
				break;
		}
	}
}
