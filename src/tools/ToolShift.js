import CURSOR_CONTROLLER from "../controllers/CursorController.js";
import UndoController from "../controllers/UndoController.js";
import MAP_API_EXTENSION from "../MapApiExtension.js";

let isSpaceDown = false;
let isMouseDragging = false;

/** @type {Tool} */
const TOOL_SHIFT = {
	get tooltip() {
		return "Shift - Shift the map, wrapping around"
	},

	get iconDetails() {
		return {
			class: 'gg-controller',
			marginTop: 0,
			marginLeft: 0
		};
	},

	get helpDescription() {
		return {
			title: "Shift",
			points: [
				'Shift the dungeon map around',
				'Hold <kbd>Space</kbd> and use <kbd>Arrow Keys</kbd>.',
				'Hold <kbd>Left Mouse Button</kbd> and drag.',
			]
		}
	},

	handleDeselected() {
		isSpaceDown = false;
	},

	handleKeyDown(keypress, preventDefault) {
		if (keypress.summary === ' ') {
			preventDefault();

			isSpaceDown = true;
			return;
		}
	},

	handleKeyUp(keypress, preventDefault) {
		if (keypress.key === ' ') {
			preventDefault();

			isSpaceDown = false;
		}
	},

	handleCursorMoved(delta) {
		if (!isSpaceDown || isMouseDragging) {
			return;
		}

		if (delta.x !== 0 || delta.y !== 0) {
			UndoController.storeUndoTentatively('tool-shift');

			MAP_API_EXTENSION.shiftMap(delta.x, delta.y);
		}
	},

	handleMouseDown(button) {
		if (button.summary !== '0') {
			return;
		}

		isMouseDragging = true;
	},

	handleMouseUp(button) {
		if (button.summary !== '0') {
			return;
		}

		isMouseDragging = false;
	},

	handleMouseCursorRepositioned(from, to) {
		if (!isMouseDragging) {
			return;
		}

		const deltaX = to.x - from.x;
		const deltaY = to.y - from.y;

		if (deltaX !== 0 || deltaY !== 0) {
			UndoController.storeUndoTentatively('tool-shift');

			MAP_API_EXTENSION.shiftMap(deltaX, deltaY);
			CURSOR_CONTROLLER.moveCursorBy(deltaX, deltaY);
		}
	}
}

export default TOOL_SHIFT;