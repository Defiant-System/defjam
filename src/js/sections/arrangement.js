
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
		}
	}
}
