
class File {

	constructor(fsFile) {
		// save reference to original FS file
		this._file = fsFile || new karaqu.File({ kind: "xml" });

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
					let note = xNote.getAttribute("n"),
						key = note.slice(0,-1),
						octave = +note.slice(-1),
						y = ((7 - octave) * 12) + (11 - OCTAVE.indexOf(key)),
						w = +xNote.getAttribute("d"),
						xTrack = xNote.parentNode.parentNode;
					if (xTrack.getAttribute("type") == "drumkit") {
						let padMap = xTrack.selectNodes(`.//Pads/Pad[@sample]`).map(xPad =>
							({
								kI: +xPad.getAttribute("kI"),
								key: xPad.getAttribute("key"),
								sample: xPad.getAttribute("sample"),
								name: xPad.getAttribute("name"),
							}))
							// sort pad array using key index (as viewed in UI)
							.sort((a, b) => a.kI - b.kI);
						// change y value
						y = padMap.findIndex(p => p.key === note);
					}
					xNote.setAttribute("y", y);
					xNote.setAttribute("w", w);
				});
				// ui update session view
				APP.session.dispatch({ type: "render-file", file: Self._file });
				// load file instruments
				Jam.loadProject(Self._file);
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
