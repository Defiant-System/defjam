
// defjam.session

{
	init() {
		// fast references
		this.els = {
			el: window.find(".sess-layout"),
		}
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.session,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "render-file":
				// render file tracks
				window.render({
					template: "file-tracks",
					match: `//file`,
					target: Self.els.el.find(`.tracks-wrapper .tracks`),
				});
				// render file tracks
				window.render({
					template: "file-io",
					match: `//file`,
					target: Self.els.el.find(`.io-master .tracks`),
				});
				break;
			case "select-clip":
				let clipId = $(event.target).data("id"),
					xClip = APP.File._file.selectSingleNode(`//Tracks//Clip[@id="${clipId}"]`);
				// render clip contents in midi note editor
				APP.midiEditor.dispatch({ type: "render-clip", xClip });
				break;
			case "select-io-track":
				break;
		}
	}
}
