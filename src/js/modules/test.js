
let Test = {
	init() {
		// window.find(`.ball-button[data-click="show-arrangement-view"]`).trigger("click");
		// window.find(`.foot-devices`).trigger("click");
		// window.find(`.foot-midi`).trigger("click");
		// window.find(`.foot-drumkit`).trigger("click");

		// window.find(`.channel:nth(3)`).trigger("click");
		// window.find(`.toolbar-tool_[data-click="pencil"]`).trigger("click");

		// window.find(`.panel-left .leaf[data-path="Kick.ogg"]`).trigger("click");

		defjam.session.dispatch({ type: "render-file" });

		window.find(`.slots b[data-id="clip-1-0"]`).trigger("click");
		// window.find(`.slots b[data-id="clip-2-1"]`).trigger("click");
	}
};
