
const Audio = {
	init() {
		this.cvs = document.createElement("canvas");
		this.ctx = this.cvs.getContext("2d");
		this.cvs.width = 202;
		this.cvs.height = 31;
	},
	async visualizeFile(url) {
		let arrayBuffer = await $.fetch(url);
		let audioContext = new AudioContext();
		let buffer = await audioContext.decodeAudioData(arrayBuffer);
		let data = this.visualize(buffer);

		url = url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf(".")) +".png";
		let path = await defiant.cache.get(url);
		if (!path) {
			this.draw({ url, data });
			path = "~/cache/"+ url;
		}

		return path;
	},
	visualize(buffer) {
		let rawData = buffer.getChannelData(0);
		let samples = 66;
		let blockSize = Math.floor(rawData.length / samples);
		let filteredData = [];

		for (let i=0; i<samples; i++) {
			let blockStart = blockSize * i;
			let sum = 0;
			for (let j=0; j<blockSize; j++) {
				sum = sum + Math.abs(rawData[blockStart + j])
			}
			filteredData.push(sum / blockSize);
		}

		let multiplier = Math.pow(Math.max(...filteredData), -1);
		filteredData = filteredData.map(n => n * multiplier);

		return filteredData;
	},
	draw(opt) {
		this.ctx.clearRect(0, 0, 1e4, 1e4);
		this.ctx.save();
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = "#71a1ca";
		this.ctx.translate(0.5, 0.5);
		// iterate points
		opt.data.map((v, x) => {
			let y = (v * 11),
				x1 = 2 + (x * 3),
				y1 = 15 - y,
				x2 = 1,
				y2 = (y * 2);
			this.ctx.strokeRect(x1, y1, x2, y2);
		});
		this.ctx.restore();

		// store wave in cache to avoid multiple renders
		this.ctx.canvas.toBlob(blob => defiant.cache.set({ url: opt.url, blob }));
	}
};

export  { Audio }
