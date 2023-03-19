
// defjam.arrangement

{
	init() {
		// fast references
		this.els = {
			el: window.find(".arr-layout"),
			sel: window.find(".arr-layout .row-track .selection"),
			loopSpan: window.find(".arr-layout .row-ruler .loop-span"),
			playHead: window.find(".arr-layout .row-track .play-head"),
			lanes: window.find(".arr-layout .row-track .col-clips .box-body"),
			mixers: window.find(".arr-layout .row-track .col-mixers .box-body"),
			ioLanes: window.find(".arr-layout .row-outputs .col-clips .box-body"),
			ioMixers: window.find(".arr-layout .row-outputs .col-mixers .box-body"),
		};

	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.arrangement,
			name,
			value,
			lEl,
			el;
		//console.log(event);
		switch (event.type) {
			case "set-session-view":
				let node = event.file.data.selectSingleNode(`//Head/Duration`),
					value = node ? +node.getAttribute("value") : 13,
					dur = value.toString(),
					[dBar, dBeat=1, d16=1] = dur.split(".").map(i => +i),
					dLen = ((dBar - 1) * 4) + (dBeat - 1) + ((d16 - 1) / 4) * 16,
					barW = parseInt(Self.els.el.cssProp("--barW"), 10);
				// set loop span width
				Self.els.loopSpan.css({ width: `${dLen * barW}px` });
				break;
			case "render-file":
				// clear "old" lanes
				Self.els.lanes.find(".lane").remove();
				// render track lanes
				window.render({
					data: event.file.data,
					template: "track-lanes",
					prepend: Self.els.lanes,
				});
				// render track mixers
				window.render({
					data: event.file.data,
					template: "track-mixers",
					target: Self.els.mixers,
				});

				// render i/o track lanes
				window.render({
					data: event.file.data,
					template: "io-track-lanes",
					target: Self.els.ioLanes,
				});
				// render i/o track mixers
				window.render({
					data: event.file.data,
					template: "io-track-mixers",
					target: Self.els.ioMixers,
				});
				break;
			case "toggle-lane":
				// select lane row
				Self.dispatch({ ...event, type: "select-lane" });
				
				lEl = event.el.parents(".lane");
				value = lEl.hasClass("collapsed");
				name = lEl.parents(".row-track").length ? "row-track" : "row-outputs";
				Self.els.el.find(`.${name} .box-body .lane:nth-child(${lEl.index()+1})`).toggleClass("collapsed", value);
				break;
			case "select-lane":
				el = $(event.target);
				lEl = el.parents("?.lane");
				// console.log( lEl );
				if (!lEl.length) return;

				name = lEl.parents(".row-track").length ? "row-track" : "row-outputs";
				Self.els.el.find(`.lane.selected`).removeClass("selected");
				Self.els.el.find(`.${name} .box-body .lane:nth-child(${lEl.index()+1})`).addClass("selected");
				break;
			case "select-clip":
				// select lane row
				Self.dispatch({ ...event, type: "select-lane" });

				el = $(event.target);
				lEl = el.parents(".lane");
				if (el.prop("nodeName") === "B") {
					let top = lEl.prop("offsetTop"),
						left = el.prop("offsetLeft"),
						width = el.prop("offsetWidth"),
						height = el.prop("offsetHeight");
					Self.els.sel.css({ top, left, width, height });

					let clipId = el.data("id"),
						trackId = lEl.data("id");
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
						clipId,
						trackId,
					});
				}
				break;
		}
	}
}
