
// defjam.browser

{
	init() {
		// fast references
		this.els = {
			el: window.find(`.panel-left[data-section="browser"]`),
			soundsBody: window.find(".sounds-body"),
			audioChart: window.find(".audio-chart"),
		};

		// auto set id's on tree items that does not have id
		this.dispatch({ type: "set-sample-ids" });

		// render trees
		this.dispatch({ type: "init-browser-tree" });
	},
	dispatch(event) {
		let APP = defjam,
			Self =  APP.browser,
			name,
			value,
			xEl,
			pEl,
			el;
		//console.log(event);
		switch (event.type) {
			case "set-sample-ids":
				value = Date.now();
				window.bluePrint.selectNodes(`//Samples//*[not(@_id)]`)
					.map(xSample => xSample.setAttribute("_id", value++));
				break;
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
				// console.log(event);
				el = $(event.target);
				pEl = el.parents(".box-body");
				pEl.find(".leaf.active").removeClass("active");

				if (el.hasClass("box-body")) {
					// hide audio preview
					return Self.els.soundsBody.removeClass("show-audio-preview");
				} else if (el.hasClass("icon-folder")) {
					el = el.parent();
					el.toggleClass("expanded", el.hasClass("expanded"));

					if (el.find(".children").length) {

					} else { // check if node has child nodes ?
						window.render({
							template: "browser-tree",
							match: `//Drums/Set[@_id="${el.data("id")}"]`,
							target: el.append(`<div class="children"><div class="chWrapper"></div></div>`).find("div"),
						});
					}

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
				xEl = window.bluePrint.selectSingleNode(`//Samples//*[@_id="${event.id}"]`);
				if (!xEl.getAttribute("i")) return;
				
				let func = () => pad.start(),
					pad = new Tone.Player(`${BASE_URL}${xEl.getAttribute("i")}.ogg`, func).toDestination();

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
