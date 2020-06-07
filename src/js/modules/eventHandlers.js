
const EventHandlers = {
	init(content) {
		// fast references
		this.doc = $(document);
		this.content = window.find("content");

		// bind event handlers
		this.content.on("mousedown", ".knob, .pan-knob", this.doKnob);
		this.content.on("mousedown", ".visualizer .handle", this.doShape);
	},
	doKnob(event) {
		let self = EventHandlers,
			drag = self.drag,
			value,
			el;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				el = $(event.target);
				value = +el.data("value");

				self.drag = {
					el,
					value,
					clientY: event.clientY,
					clientX: event.clientX,
					min: el.hasClass("pan-knob") ? -50 : 0,
					max: el.hasClass("pan-knob") ? 50 : 100,
				};
				// bind event handlers
				self.content.addClass("hide-cursor");
				self.doc.on("mousemove mouseup", self.doKnob);
				break;
			case "mousemove":
				value = ((drag.clientY - event.clientY) * 2) + drag.value;
				value = Math.min(Math.max(value, drag.min), drag.max);
				value -= value % 2;
				drag.el.data({ value });
				break;
			case "mouseup":
				// unbind event handlers
				self.content.removeClass("hide-cursor");
				self.doc.off("mousemove mouseup", self.doKnob);
				break;
		}
	},
	doShape(event) {
		let self = EventHandlers,
			drag = self.drag,
			connect,
			rect,
			value,
			cX,
			cY,
			el;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				rect = event.target.parentNode.getBoundingClientRect();
				el = $(event.target).addClass("on");
				cX = +el.attr("cx");
				cY = +el.attr("cy");

				self.drag = {
					el,
					cX,
					cY,
					clientY: event.clientY,
					clientX: event.clientX,
					min: { x: cX, y: cY },
					max: { x: cX, y: cY }
				};

				// connection to knobs
				connect = el.data("conn");
				if (connect) {
					connect = connect.split(";");
					self.drag.xConn = el.parents(".box-body").find("."+ connect[0]);
					self.drag.min.x = +connect[1];
					self.drag.max.x = +connect[2];

					if (connect.length > 3) {
						self.drag.yConn = el.parents(".box-body").find("."+ connect[3]);
						self.drag.min.y = +connect[4];
						self.drag.max.y = +connect[5];
					}
				}

				// bind event handlers
				self.content.addClass("hide-cursor");
				self.doc.on("mousemove mouseup", self.doShape);
				break;
			case "mousemove":
				//console.log(drag.cY , event.clientY , drag.clientY, drag.min.y, drag.max.y);
				cx = Math.min(Math.max(drag.cX + event.clientX - drag.clientX, drag.min.x), drag.max.x);
				cy = Math.min(Math.max(drag.cY + event.clientY - drag.clientY, drag.min.y), drag.max.y);
				drag.el.attr({ cx, cy });

				if (self.drag.xConn) {
					value = Math.floor((cx / drag.max.x) * 100);
					value -= value % 2;
					self.drag.xConn.data({ value });
				}
				if (self.drag.yConn) {
					value = Math.floor((cy / drag.max.y) * 100);
					value -= value % 2;
					self.drag.yConn.data({ value });
				}
				break;
			case "mouseup":
				// reset & unbind event handlers
				drag.el.removeClass("on");
				self.content.removeClass("hide-cursor");
				self.doc.off("mousemove mouseup", self.doShape);
				break;
		}
	}
};

export  { EventHandlers }
