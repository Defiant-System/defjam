
// defjam.status

{
	init() {
		// fast references
		this.els = {
			el: window.find(".status-bar .box-body"),
		};
	},
	dispatch(event) {
		let APP = defjam,
			Self =  APP.status,
			name,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "display-filename":
				// show file name
				value = event.file._file.name;
				Self.els.el.html(value);
				break;
		}
	}
}
