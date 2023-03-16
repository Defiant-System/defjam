
// defjam.arrangement

{
	init() {
		// fast references
		this.els = {
			el: window.find(".arr-layout"),
			lanes: window.find(".arr-layout .row-track .col-clips .box-body"),
			mixers: window.find(".arr-layout .row-track .col-mixers .box-body"),
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
				// render track lanes
				window.render({
					data: event.file.data,
					template: "track-lanes",
					target: Self.els.lanes,
				});
				// render track mixers
				window.render({
					data: event.file.data,
					template: "track-mixers",
					target: Self.els.mixers,
				});
				break;
			case "select-lane":
				el = $(event.target);
				lEl = el.parents("?.lane");
				console.log( lEl );
				if (!lEl.length) return;

				name = lEl.parents(".row-track").length ? "row-track" : "row-outputs";

				Self.els.el.find(`.lane.selected`).removeClass("selected");
				Self.els.el.find(`.${name} .box-body .lane:nth-child(${lEl.index()+1})`).addClass("selected");
				break;
			case "select-clip":
				// console.log( event );
				// select lane row
				Self.dispatch({ ...event, type: "select-lane" });
				break;
		}
	}
}
