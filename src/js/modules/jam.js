
const Jam = {
	init() {
		// initial display
		this.display.init();
		// defaults
		this.stop();
	},
	start() {
		this._stopped = false;
		Tone.Transport.start();
		this.update();
	},
	stop() {
		this._stopped = true;
		Tone.Transport.stop();
	},
	update() {
		if (this._stopped) return;
		// do calculations

		// render whats need to be rendered
		this.render();

		requestAnimationFrame(this.update.bind(this));
	},
	render() {
		console.log( Tone.Transport.position );
	},
	display: {
		init() {
			// toolbar display
			this.cvs = window.find(".win-caption-toolbar_ .display canvas");
			this.ctx = this.cvs[0].getContext("2d");
			this.width = this.cvs.prop("offsetWidth");
			this.height = this.cvs.prop("offsetHeight");
			// show bar/beat or time
			this.show = window.find(".win-caption-toolbar_ .display").hasClass("show-time") ? "time" : "bar-beat";
			// reset dim
			this.cvs.attr({
				width: this.width,
				height: this.height,
				"data-context": "display-menu",
			});
			// text defaults
			this.ctx.font = "17px Lucida Console";
			this.ctx.fillStyle = "#b7cbe0";
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "bottom";
			// initial render
			this.render();
		},
		render(data={}) {
			let time = data.time || `00 00 00`,
				bars = data.bars || ` 1 1 1`,
				tempo = data.tempo || `120`;
			// clear canvas
			this.ctx.clearRect(0, 0, this.width, this.height);

			switch (this.show) {
				case "bar-beat":
					this.ctx.fillText(bars, 44, 22);
					break;
				case "time":
					this.ctx.fillText(time, 54, 22);
					break;
			}
			// tempo
			this.ctx.fillText(tempo, 144, 22);
		}
	}
};
