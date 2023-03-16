
// defjam.arrangement

{
	init() {
		// fast references
		this.els = {
			el: window.find(".arr-layout"),
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
				// console.log( event );
				break;
		}
	}
}
