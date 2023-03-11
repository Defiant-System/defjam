
class File {

	constructor(fsFile) {
		// save reference to original FS file
		this._file = fsFile || new karaqu.File({ kind: "xml" });

		let xTempo = this._file.data.selectSingleNode(`//Head/Tempo`);
		this._tempo = xTempo ? +xTempo.getAttribute("value") : 120;

		this.dispatch({ type: "load-project" });
	}

	dispatch(event) {
		let APP = defjam,
			Self = this,
			name,
			value,
			str;
		switch (event.type) {
			case "load-project":
				// ui update session view
				APP.session.dispatch({ type: "render-file", file: Self._file });
				// load file instruments
				Jam.loadInstruments(Self._file);

				APP.drumkit.dispatch({ type: "render-file", file: Self._file });
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
