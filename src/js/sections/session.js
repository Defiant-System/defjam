
// defjam.session

{
	init() {
		// fast references
		this.els = {
			el: window.find(".sess-layout"),
			wrapper: window.find(".session-wrapper"),
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
					data: event.file.data,
					template: "file-tracks",
					match: `//Project`,
					target: Self.els.el.find(`.tracks-wrapper .tracks`),
				});
				// render io tracks
				window.render({
					data: event.file.data,
					template: "file-io",
					match: `//Project`,
					target: Self.els.el.find(`.io-master .tracks`),
				});
				break;
			case "select-clip":
				let rect = event.target.getBoundingClientRect(),
					slotH = parseInt(Self.els.wrapper.cssProp("--slotH"), 10),
					row = Math.ceil((event.clientY - rect.top) / slotH);
				if (row < 8) {
					Self.els.wrapper.css({ "--selRow": row });
				}

				// track column element
				el = $(event.target).parents(".track");

				// signlal devices panel to render
				APP.devices.dispatch({
					type: "render-device",
					file: APP.File._file,
					trackId: el.data("id"),
				});

				// signlal midi panel to render
				APP.midi.dispatch({
					type: "render-device",
					file: APP.File._file,
					trackId: el.data("id"),
				});

				// let clipId = $(event.target).data("id"),
				// 	xClip = APP.File._file.data.selectSingleNode(`//Tracks//Clip[@id="${clipId}"]`);
				// // render clip contents in midi note editor
				// APP.midi.dispatch({ type: "render-clip", xClip });
				break;
			case "select-io-track":
				console.log(event);
				break;
		}
	}
}
