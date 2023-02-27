
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
		switch (event.type) {
			case "render-file":
				// render file tracks
				window.render({
					template: "file-tracks",
					match: `//file`,
					target: Self.els.el.find(`.tracks-wrapper .tracks`),
				});
				break;
			case "select-clip":
				// render clip contents in midi note editor
				APP.midiEditor.dispatch({ type: "render-clip", id: $(event.target).data("id") });
				break;
			case "select-io-track":
				break;
		}
	}
}
