
const Audio = {
	async visualizeFile(url) {
		let arrayBuffer = await $.fetch(url);

		let audioContext = new AudioContext();
		let buffer = await audioContext.decodeAudioData(arrayBuffer);
		
		this.visualize(buffer)
	},
	visualize(buffer) {
		
	}
};

export  { Audio }
