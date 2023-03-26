import { describeMousepress } from "../Utils.js";
import CURSOR_CONTROLLER from "./CursorController.js";
import TOOLS_CONTROLLER from "./ToolsController.js";

const MOUSE_CONTROLLER = {
	isActive: false,

	init() {
		document.addEventListener("mousemove", activeCurry(onMouseMove));
		document.addEventListener("mousedown", activeCurry(onMouseDown));
		document.addEventListener("contextmenu", activeCurry(onContextMenu), true);
		document.addEventListener("mouseup", activeCurry(onMouseUp));
	}
}


function activeCurry(callback) {
	return function(...args) {
		if (MOUSE_CONTROLLER.isActive) {
			return callback(...args);
		}
	}
}


function onContextMenu(event) {
	event.preventDefault();
}

function onMouseMove(event) {
	if (
		!event.target
		|| !event.target.classList
		|| !event.target.classList.contains('tile')
	) {
		CURSOR_CONTROLLER.setMouseCursorTo(null, null);
		return;
	}

	CURSOR_CONTROLLER.setMouseCursorTo(
		parseInt(event.target.getAttribute('data-x')),
		parseInt(event.target.getAttribute('data-y'))
	);
}

/**
 * @param {MouseEvent} event
 */
function onMouseDown(event) {
	TOOLS_CONTROLLER.handle.mouseDown(describeMousepress(event), () => event.preventDefault());
}

/**
 * @param {MouseEvent} event
 */
function onMouseUp(event) {
	TOOLS_CONTROLLER.handle.mouseUp(describeMousepress(event), () => event.preventDefault());
}

export default MOUSE_CONTROLLER;