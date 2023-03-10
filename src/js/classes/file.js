
class File {

	constructor(fsFile) {
		// save reference to original FS file
		this._file = fsFile || new karaqu.File({ kind: "xml" });

		let xTempo = this._file.data.selectSingleNode(`//Head/Tempo`);
		this._tempo = xTempo ? +xTempo.getAttribute("value") : 120;

		this.dispatch({ type: "render-file" });
	}

	dispatch(event) {
		let APP = defjam,
			Self = this,
			name,
			value,
			str;
		switch (event.type) {
			case "render-file":
				APP.session.dispatch({ type: "render-file", file: Self._file });
				break;
		}
	}

	toBlob() {
		
	}

	get isDirty() {
		
	}

	undo() {
		
	}

	redo() {
		
	}

}
