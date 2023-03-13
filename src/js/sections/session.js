
// defjam.session

{
	init() {
		// fast references
		this.els = {
			el: window.find(".sess-layout"),
			wrapper: window.find(".session-wrapper"),
			wTracks: window.find(".tracks-wrapper"),
		}
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.session,
			name,
			value,
			trackId,
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
			case "track-activator":
				value = event.el.hasClass("off");
				// toggle button
				event.el.toggleClass("off", value);
				// make track selected
				Self.dispatch({ ...event, type: "select-track" });
				break;
			case "track-solo":
				value = event.el.hasClass("active");
				trackId = event.el.parents(".track").data("id");
				// silenced track UI
				Self.els.wTracks.find(`.track:not([data-id="${trackId}"])`).toggleClass("silenced", value);
				Self.els.wTracks.find(`.track .track-btn.activator`).toggleClass("off", value);
				// toggle button
				event.el.toggleClass("active", value);
				// make track selected
				Self.dispatch({ ...event, type: "select-track" });
				break;
			case "track-record":
				value = event.el.hasClass("active");
				if (!value) {
					// turn off previous active recording channel
					Self.els.wTracks.find(`.track .track-btn.record.active`).removeClass("active");
				}
				// toggle button
				event.el.toggleClass("active", value);
				// make track selected
				Self.dispatch({ ...event, type: "select-track" });
				break;
			case "select-track":
				el = $(event.target).parents(".track");
				if (!el.length || el.data("id") === "master") return;
				Self.els.wrapper.find(".track.selected").removeClass("selected");
				el.addClass("selected");
				break;
			case "select-clip":
				let rect = event.target.getBoundingClientRect(),
					tEl = $(event.target),
					slotEl = tEl.parents("?.slots"),
					slotH = parseInt(Self.els.wrapper.cssProp("--slotH"), 10),
					row = Math.ceil((event.clientY - rect.top) / slotH);
				if (slotEl.length && row < 8) {
					Self.els.wrapper.css({ "--selRow": row });
				}
				// selecte track column
				Self.dispatch({ ...event, type: "select-track" });
				// track column element
				el = slotEl.parents(".track");
				trackId = el.data("id");
				// signlal devices panel to render
				APP.devices.dispatch({
					type: "render-device",
					file: APP.File._file,
					trackId,
				});
				// signlal midi panel to render
				APP.midi.dispatch({
					type: "render-clip",
					file: APP.File._file,
					clipId: tEl.data("id"),
					trackId,
				});

				// let clipId = $(event.target).data("id"),
				// 	xClip = APP.File._file.data.selectSingleNode(`//Tracks//Clip[@id="${clipId}"]`);
				// // render clip contents in midi note editor
				// APP.midi.dispatch({ type: "render-clip", xClip });
				break;
		}
	}
}
