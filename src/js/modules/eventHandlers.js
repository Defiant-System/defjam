
const EventHandlers = {
	init(content) {
		// fast references
		this.doc = $(document);
		this.content = window.find("content");

		// bind event handlers
		this.content.on("mousedown", ".knob, .pan-knob", this.doKnob);
		this.content.on("mousedown", ".visualizer .handle", this.doShape);

		setTimeout(() => {
			this.content.find(".fr-box .handle")
				.trigger("mousedown")
				.trigger("mousemove")
				.trigger("mouseup");

			this.content.find(".adsr-box .handle:last")
				.trigger("mousedown")
				.trigger("mousemove")
				.trigger("mouseup");
		}, 100);
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
			curve,
			points,
			shape,
			rect,
			value,
			cX,
			cY,
			pEl,
			el;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				rect = event.target.parentNode.getBoundingClientRect();
				el = $(event.target).addClass("on");
				pEl = el.parent();
				curve = Shapes[pEl.data("curve")];
				points = el.parent().find(".handle");
				shape = el.parent().find(".shape");
				cX = +el.attr("cX");
				cY = +el.attr("cY");

				self.drag = {
					el,
					cX,
					cY,
					shape,
					points,
					curve,
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
				cX = Math.min(Math.max(drag.cX + event.clientX - drag.clientX, drag.min.x), drag.max.x);
				cY = Math.min(Math.max(drag.cY + event.clientY - drag.clientY, drag.min.y), drag.max.y);
				drag.el.attr({ cX, cY });

				value = drag.points.map(p => [+p.getAttribute("cX"), +p.getAttribute("cY")]);
				//console.log({ d: drag.curve(value) }.d);
				drag.shape.attr({ d: drag.curve(value) });

				if (self.drag.xConn) {
					value = Math.floor(((cX - drag.min.x) / (drag.max.x - drag.min.x)) * 100);
					value -= value % 2;
					self.drag.xConn.data({ value });
				}
				if (self.drag.yConn) {
					value = Math.floor(((cY - drag.min.y) / (drag.max.y - drag.min.y)) * 100);
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

const Shapes = {
	// frequency response
	fr(value) {
		let h = 89,
			w = 204,
			x = value[0][0],
			y = value[0][1],
			r = ["M"];

		r.push(43, 89);

		r.push("C", 54, 76);
		r.push(75, 55);
		r.push(83, 46); // anchor

		r.push("C", 120, 11);
		r.push(115, 45);
		r.push(172, 45); // anchor

		r.push("C", 198, 45);
		r.push(204, 45);
		r.push(204, 45); // anchor
		
		return r.join(" ");
	},
	adsr(value) {
		let h = 69,
			w = 321,
			r = ["M", 5, h],
			aThird = w / 3,
			twoThirds = aThird * 2;

		r.push("C", 5, 5);
		r.push(Math.max(value[0][0] * .2, 5), 5);
		r.push(value[0]); // anchor

		r.push("C", value[0][0], value[1][1]);
		r.push(value[0][0], value[1][1]);
		r.push(value[1]); // anchor

		r.push("C", value[1][0], value[1][1]);
		r.push(value[1][0], value[1][1]);
		r.push(twoThirds, value[1][1]); // anchor

		r.push("C", twoThirds, h - 5);
		r.push(Math.min(twoThirds * 1.15, twoThirds), h - 5);
		r.push(value[2]); // anchor

		return r.join(" ");
	}
};

export  { EventHandlers }
