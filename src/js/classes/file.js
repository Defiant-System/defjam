
class File {

	constructor(fsFile) {
		// save reference to original FS file
		this._file = fsFile || new karaqu.File({ kind: "xml" });

		// let str = window.bluePrint.selectSingleNode(`//file`).xml;
		// this._file = $.xmlFromString(str);
		// this._tempo = 120;

		// console.log( this._file );
		// defjam.session.dispatch({ type: "render-file", file: this._file });
	}

	dispatch(event) {
		let APP = defjam,
			name,
			value,
			str;
		switch (event.type) {
			case "reset-names":
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
