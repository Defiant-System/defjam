
const Audio = {
	init() {
		this.cvs = document.createElement("canvas");
		this.ctx = this.cvs.getContext("2d");
		this.cvs.width = 202;
		this.cvs.height = 31;
	},
	async visualizeFile(options) {
		let arrayBuffer = await window.fetch(options.url),
			audioContext = new AudioContext(),
			buffer = await audioContext.decodeAudioData(arrayBuffer),
			data = this.visualize(buffer, Math.floor(options.width / 3));

		let url = options.url.slice(options.url.lastIndexOf("/") + 1, options.url.lastIndexOf(".")) +".png";
		let path = await defiant.cache.get(url);
		if (!path) {
			await this.draw({ ...options, url, data });
			path = "~/cache/"+ url;
		}

		return path;
	},
	visualize(buffer, samples) {
		let rawData = buffer.getChannelData(0),
			blockSize = Math.floor(rawData.length / samples),
			filteredData = [];

		for (let i=0; i<samples; i++) {
			let blockStart = blockSize * i,
				sum = 0;
			for (let j=0; j<blockSize; j++) {
				sum = sum + Math.abs(rawData[blockStart + j])
			}
			filteredData.push(sum / blockSize);
		}

		let multiplier = Math.pow(Math.max(...filteredData), -1);
		filteredData = filteredData.map(n => n * multiplier);

		return filteredData;
	},
	draw(options) {
		this.cvs.width = options.width;
		this.cvs.height = options.height;
		this.ctx.clearRect(0, 0, options.width, options.height);
		
		this.ctx.save();
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = "#71a1ca";
		this.ctx.translate(0.5, 0.5);

		// iterate points
		let h = Math.floor(options.height / 2);
		options.data.map((v, x) => {
			let y = (v * (h - 4)),
				x1 = 2 + (x * 3),
				y1 = h - y,
				x2 = 1,
				y2 = (y * 2);
			this.ctx.strokeRect(x1, y1, x2, y2);
		});
		this.ctx.restore();

		return new Promise(resolve => {
			// store wave in cache to avoid multiple renders
			this.ctx.canvas.toBlob(async blob => {
				await defiant.cache.set({ url: options.url, blob });
				resolve();
			});
		});
	}
};

export  { Audio }
