
const Audio = {
	async visualizeFile(url) {
		let arrayBuffer = await $.fetch(url);

		let audioContext = new AudioContext();
		let buffer = await audioContext.decodeAudioData(arrayBuffer);

		return this.visualize(buffer)
	},
	visualize(buffer) {
		let rawData = buffer.getChannelData(0);
		let samples = 70;
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
	}
};

export  { Audio }
