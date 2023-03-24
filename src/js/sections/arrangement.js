
// defjam.arrangement

{
	init() {
		// fast references
		this.els = {
			el: window.find(".arr-layout"),
			minimap: window.find(".arr-layout .row-minimap"),
			lengthSpan: window.find(".arr-layout .row-ruler .length-span"),
			loopSpan: window.find(".arr-layout .row-ruler .loop-span"),
			lanes: window.find(".arr-layout .row-track .col-clips .lane-wrapper"),
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
					val = node.getAttribute("value"),
					dLen = DUR.toBeats(val) - 4,
					barW = parseInt(Self.els.el.cssProp("--barW"), 10);
				// set loop span width
				Self.els.lengthSpan.css({ width: `${dLen * barW}px` });
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
				// render mini-map
				Self.dispatch({ ...event, type: "lane-to-minimap" });
				break;
			case "lane-to-minimap":
				// lane ui to background-image
				lEl = Self.els.minimap.find(`> div:not(.hotspot)`);
				// available width
				let jW = Self.els.lengthSpan.prop("offsetWidth"), // jam width
					aW = Self.els.minimap.prop("offsetWidth"), // available width
					bW = parseInt(Self.els.el.cssProp("--barW"), 10);
				// only handle first 5 lanes
				event.file.data.selectNodes(`//Track/Lane`).filter((e,i) => i<5).map((xLane, index) => {
					let laneEl = lEl.get(index),
						laneColor = xLane.parentNode.getAttribute("color"),
						gradient = [],
						ccX = 0,
						tX = 0;
					xLane.selectNodes(`./Clip`).map(xClip => {
						let cX = +xClip.getAttribute("cX"),
							cW = +xClip.getAttribute("cW"),
							tS = parseInt(((cW * bW) / jW) * 100, 10),
							color = ccX === cX ? laneColor : "transparent";
						
						// console.log( ccX, cX, cW );
						gradient.push(`${color} ${tX}%, ${color} ${tX+tS}%`);
						tX += tS;
						ccX = cX + cW;
					});
					gradient.push(`transparent ${tX}%, transparent 100%`);
					laneEl.css({ "background-image": `linear-gradient(90deg, ${gradient.join(",")})` });
				});
				break;
			case "toggle-lane":
				// select lane row
				Self.dispatch({ ...event, type: "select-lane" });

				lEl = event.el.parents(".lane");
				value = lEl.hasClass("collapsed");
				name = lEl.parents(".row-track").length ? "row-track" : "row-outputs";
				Self.els.el.find(`.${name} .box-body .lane:nth-child(${lEl.index()+1})`).toggleClass("collapsed", value);
				
				// notify track object
				el = lEl.find(".vol-analyser canvas");
				Jam.track.updateAnalyserHeight({ id: lEl.data("id"), type: "lane" });
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

				Self.els.lanes.find("b.selected").removeClass("selected");
				el = $(event.target).addClass("selected");
				lEl = el.parents(".lane");
				if (el.prop("nodeName") === "B") {
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
