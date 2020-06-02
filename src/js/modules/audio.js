
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
		let samples = 96;
		let blockSize = Math.floor(rawData.length / samples);
		let filteredData = [];

		for (let i = 0; i < samples; i++) {
			let blockStart = blockSize * i; // the location of the first sample in the block
			let sum = 0;
			for (let j = 0; j < blockSize; j++) {
				sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
			}
			filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
		}

		let multiplier = Math.pow(Math.max(...filteredData), -1);
		filteredData = filteredData.map(n => n * multiplier);

		return filteredData;
	},
	draw(ctx, data) {
		ctx.clearRect(0, 0, 1e4, 1e4);
		ctx.save();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#9eb9d5";
		ctx.translate(0.5, 0.5);

		data.map((v, x) => {
			let y = (v * 11);

			ctx.beginPath();
			ctx.moveTo(5 + (x * 2), 15 - y);
			ctx.lineTo(5 + (x * 2), 1 + y + 15);
			ctx.stroke();
		});
		
		ctx.restore();
	}
};

export  { Audio }
