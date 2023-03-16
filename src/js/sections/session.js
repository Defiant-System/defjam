
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
					target: Self.els.el.find(`.tracks-wrapper .tracks`),
				});
				// render io tracks
				window.render({
					data: event.file.data,
					template: "file-io",
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
					row = tEl.hasClass("slots") ? Math.ceil((event.clientY - rect.top) / slotH) : +tEl.cssProp("--r") + 1;
				if (slotEl.length && row < 8) {
					Self.els.wrapper.css({ "--selRow": row });
				}
				// selecte track column
				Self.dispatch({ ...event, type: "select-track" });
				// track column element
				el = slotEl.parents(".track");
				trackId = el.data("id");
				// signal devices panel to render
				APP.devices.dispatch({
					type: "render-device",
					file: APP.File._file,
					trackId,
				});
				// signal midi panel to render
				APP.midi.dispatch({
					type: "render-clip",
					file: APP.File._file,
					clipId: tEl.data("id"),
					trackId,
				});
				if (event.offsetX < slotH) {
					// play if icons is clicked
					if (tEl.prop("nodeName") === "B") {
						if (tEl.hasClass("playing")) {
							// update UI
							tEl.removeClass("playing");
							// stop already playing track
							return Jam.track.stop(el.data("id"));
						}
						slotEl.find("b.playing").removeClass("playing");
						tEl.addClass("playing");
						// start play clip
						Jam.track.playClip(trackId, tEl.data("id"));
					} else if (el.data("id") === "master") {
						Self.els.wTracks.find(`.track`).map(cEl => {
							let track = $(cEl);
							// stop already playing clips
							Jam.track.stop(track.data("id"));
							// loop all tracks, find clips on row & play them
							track.find(`b`).map(b => {
								let clip = $(b);
								if (+clip.cssProp("--r") === row-1) {
									// ui update
									clip.addClass("playing");
									// start play clip
									Jam.track.playClip(track.data("id"), clip.data("id"));
								}
							});
						});
					} else {
						console.log("record new clip")
					}
				}
				break;
			case "track-stop":
				el = event.el.parents(".track");
				// ui update
				el.find("b.playing").removeClass("playing");
				// stop already playing track
				Jam.track.stop(el.data("id"));
				break;
			case "stop-all":
				Self.els.wTracks.find(`.track`).map(cEl => {
					let track = $(cEl);
					// stop already playing clips
					Jam.track.stop(track.data("id"));
					// ui update
					track.find(`b.playing`).removeClass("playing");
				});
				break;
		}
	}
}
