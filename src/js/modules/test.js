
let Test = {
	init() {
		// window.find(`.ball-button[data-click="show-arrangement-view"]`).trigger("click");
		// window.find(`.foot-devices`).trigger("click");
		window.find(`.foot-midi`).trigger("click");
		// window.find(`.foot-drumkit`).trigger("click");

		// window.find(`.channel:nth(3)`).trigger("click");
		// window.find(`.toolbar-tool_[data-click="pencil"]`).trigger("click");

		// window.find(`.panel-left .drums-body .leaf:nth(0) .icon-folder`).trigger("click");
		// setTimeout(() => window.find(`.chWrapper .leaf:nth(0)`).trigger("click"), 200);

		// setTimeout(() => defjam.midiEditor.doPiano({ type: "window.keystroke", char: "a" }), 1000);
		// setTimeout(() => defjam.midiEditor.doPiano({ type: "window.keystroke", char: "s" }), 1300);
		// setTimeout(() => defjam.midiEditor.doPiano({ type: "window.keystroke", char: "d" }), 1600);

		defjam.session.dispatch({ type: "render-file" });

		// window.find(`.slots b[data-id="clip-1-0"]`).trigger("click");
		window.find(`.slots b[data-id="clip-2-1"]`).trigger("click");
	}
};
