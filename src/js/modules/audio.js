
const Audio = {
	async visualizeFile(url, ctx) {
		let arrayBuffer = await $.fetch(url);
		let audioContext = new AudioContext();
		let buffer = await audioContext.decodeAudioData(arrayBuffer);
		let data = this.visualize(buffer);

		this.draw(ctx, data);
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
	draw(ctx, data) {
		ctx.clearRect(0, 0, 1e4, 1e4);
		ctx.save();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#71a1ca";
		ctx.translate(0.5, 0.5);

		data.map((v, x) => {
			//let y = (v * 11);
			// ctx.beginPath();
			// ctx.moveTo(5 + (x * 2), 15 - y);
			// ctx.lineTo(5 + (x * 2), 1 + y + 15);
			// ctx.stroke();

			let y = (v * 11),
				x1 = 2 + (x * 3),
				y1 = 16 - y,
				x2 = 1,
				y2 = (y * 2);
			ctx.strokeRect(x1, y1, x2, y2);
		});

		ctx.restore();

		defiant.cache({ url: "/ant/app/", data: "123" });
	}
};

export  { Audio }
