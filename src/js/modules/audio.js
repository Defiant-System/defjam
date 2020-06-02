
const Audio = {
	async visualizeFile(url, ctx) {
		let arrayBuffer = await $.fetch(url);
		let audioContext = new AudioContext();
		let buffer = await audioContext.decodeAudioData(arrayBuffer);
		let data = this.visualize(buffer);

		this.draw({ url, ctx, data });
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
		opt.ctx.clearRect(0, 0, 1e4, 1e4);
		opt.ctx.save();
		opt.ctx.lineWidth = 1;
		opt.ctx.strokeStyle = "#71a1ca";
		opt.ctx.translate(0.5, 0.5);

		opt.data.map((v, x) => {
			//let y = (v * 11);
			// opt.ctx.beginPath();
			// opt.ctx.moveTo(5 + (x * 2), 15 - y);
			// opt.ctx.lineTo(5 + (x * 2), 1 + y + 15);
			// opt.ctx.stroke();

			let y = (v * 11),
				x1 = 2 + (x * 3),
				y1 = 16 - y,
				x2 = 1,
				y2 = (y * 2);
			opt.ctx.strokeRect(x1, y1, x2, y2);
		});

		opt.ctx.restore();

		// let url = "test123.png",
		// 	uri = opt.ctx.canvas.toDataURL();
		// defiant.cache({ url, uri });

		let url = "test123.png";
		opt.ctx.canvas.toBlob(blob => defiant.cache({ url, blob }));
	}
};

export  { Audio }
