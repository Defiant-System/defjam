
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
				// prepare track clip notes
				Self._file.data.selectNodes(`//Track/Clip/b[@n]`).map(xNote => {
					let duration = +xNote.getAttribute("d"),
						key = xNote.getAttribute("n").slice(0,1),
						octave = +xNote.getAttribute("n").slice(1),
						y = ((7 - octave) * 12) + (11 - OCTAVE.indexOf(key));
					xNote.setAttribute("y", y);
					xNote.setAttribute("w", 2);
				});
				// ui update session view
				APP.session.dispatch({ type: "render-file", file: Self._file });
				// load file instruments
				Jam.loadProject(Self._file);
				// TODO: auto select a track

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
