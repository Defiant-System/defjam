
class File {

	constructor(fsFile) {
		// save reference to original FS file
		this._file = fsFile || new karaqu.File({ kind: "xml" });

		this.dispatch({ type: "load-project" });
	}

	dispatch(event) {
		let APP = defjam,
			Self = this,
			xDoc = Self._file.data,
			name,
			value,
			str;
		switch (event.type) {
			case "load-project":
				// show filename in the status bar
				APP.status.dispatch({ type: "display-filename", file: this });
				// view: "arrangement" or "session"
				value = xDoc.selectSingleNode("//Project/Tracks");
				value = value ? value.getAttribute("view") : "session";
				APP.head.dispatch({ type: `show-${value}-view` });
				// view: "midi" or "device"
				value = xDoc.selectSingleNode("//Head/Details[@view]");
				value = value ? value.getAttribute("view") : "devices";
				APP.foot.dispatch({ type: `show-${value}-rack` });

				// translate lane clip details for session view
				xDoc.selectNodes(`//Track/Slot/Clip`).map(xClip => {
					let cW = DUR.toBeats(xClip.getAttribute("length"));
					xClip.setAttribute("cW", cW);
				});

				// translate lane clip details for arrangement view
				xDoc.selectNodes(`//Track/Lane/Clip`).map(xClip => {
					let cX = DUR.toBeats(xClip.getAttribute("start"))-4,
						cW = DUR.toBeats(xClip.getAttribute("length"));
					xClip.setAttribute("cX", cX);
					xClip.setAttribute("cW", cW);
				});

				// prepare track clip notes
				xDoc.selectNodes(`//Track//Clip/b[@n]`).map(xNote => {
					let note = xNote.getAttribute("n"),
						key = note.slice(0,-1),
						octave = +note.slice(-1),
						y = ((7 - octave) * 12) + (11 - OCTAVE.indexOf(key)),
						w = +xNote.getAttribute("d"),
						xTrack = xNote.parentNode.parentNode.parentNode;
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
					if (xNote.getAttribute("s")) {
						let noteW = 12,
							sX = (+xNote.getAttribute("s") / 16) * noteW;
						if (sX > 0) xNote.setAttribute("sX", sX);
					}
					xNote.setAttribute("y", y);
					xNote.setAttribute("w", w);
				});
				// ui update arrangement view
				APP.arrangement.dispatch({ type: "render-file", file: Self._file });
				// ui update session view
				APP.session.dispatch({ type: "render-file", file: Self._file });
				// create image from xml notes
				xDoc.selectNodes(`//Track/Lane/Clip`).map(xClip =>
					Audio.clipToImage(xDoc, xClip.getAttribute("id")));
				// load file instruments
				Jam.loadProject(Self._file);
				break;
			case "unload-project":
				// TODO
				console.log("TODO: unload project!");
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
