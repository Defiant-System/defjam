
// defjam.blankView

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			el: window.find(".blank-view"),
		};

		// disable toolbar tools
		this.dispatch({ type: "show-blank-view" });

		// get settings, if any
		let xList = $.xmlFromString(`<Recents/>`);
		let xSamples = window.bluePrint.selectSingleNode(`//Samples`);
		this.xRecent = window.settings.getItem("recents") || xList.documentElement;

		Promise.all(this.xRecent.selectNodes("./*").map(async xItem => {
				let filepath = xItem.getAttribute("filepath"),
					check = await karaqu.shell(`fs -f '${filepath}'`);
				if (!check.result) {
					xItem.parentNode.removeChild(xItem)
				}
			}))
			.then(() => {
				// add recent files in to data-section
				xSamples.parentNode.append(this.xRecent);

				// render blank view
				window.render({
					template: "blank-view",
					match: `//Data`,
					target: this.els.el
				});
			});
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.blankView,
			file,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "show-blank-view":
				// disable toolbar
				requestAnimationFrame(() => APP.toolbar.dispatch({ type: "disable-toolbar" }));
				//  change class name of content element
				Self.els.content.addClass("show-blank-view");
				break;
			case "hide-blank-view":
				// enable toolbar
				requestAnimationFrame(() => APP.toolbar.dispatch({ type: "enable-toolbar" }));
				//  change class name of content element
				Self.els.content.removeClass("show-blank-view");
				break;
			case "new-file":
				// TODO
				break;
			case "open-filesystem":
				APP.dispatch({ ...event, type: "open-file" });
				break;
			case "from-clipboard":
				// TODO
				break;
			case "select-sample":
				el = $(event.target);
				if (!el.hasClass("sample")) return;

				// send event to APP for proxy down to app
				APP.dispatch({ type: "load-sample", name: el.find("span").text() });
				break;
			case "select-recent-file":
				el = $(event.target);
				if (!el.hasClass("recent-file")) return;

				// close "current tab"
				APP.dispatch({ type: "close-tab", delayed: true });
				
				karaqu.shell(`fs -o '${el.data("path")}' null`)
					.then(exec => APP.dispatch({ ...exec.result }));
				break;
				break;
			case "add-recent-file":
				if (!event.file.path) return;
				let str = `<i kind="${event.file.kind}" name="${event.file.base}" path="${event.file.path}"/>`,
					xFile = $.nodeFromString(str),
					xExist = Self.xRecent.selectSingleNode(`//Recents/*[@path="${event.file.path}"]`);
				// remove entry if already exist
				if (xExist) xExist.parentNode.removeChild(xExist);
				// insert new entry at first position
				Self.xRecent.insertBefore(xFile, Self.xRecent.firstChild);
				break;
		}
	}
}