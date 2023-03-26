import CURSOR_CONTROLLER from "../controllers/CursorController.js";
import UndoController from "../controllers/UndoController.js";
import MAP_API from "../MapApi.js";

let isSpaceDown = false;
let isMouseDragging = false;

/** @type {Tool} */
const TOOL_RESIZE = {
	get tooltip() {
		return "Resize - Make the map larger or smaller"
	},

	get iconDetails() {
		return {
			class: 'gg-maximize-alt',
			marginTop: 0,
			marginLeft: 0
		};
	},

	get helpDescription() {
		return {
			title: "Resize",
			points: [
				'Resize the dungeon map.',
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

	handleArrowKeyPressed(keypress, delta) {
		if (!isSpaceDown || isMouseDragging) {
			CURSOR_CONTROLLER.moveCursorBy(delta.x, delta.y);
			return;
		}

		if (delta.x !== 0 || delta.y !== 0) {
			UndoController.storeUndoTentatively("tool-resize");

			MAP_API.resizeMap(MAP_API.mapWidth + delta.x, MAP_API.mapHeight + delta.y);
			CURSOR_CONTROLLER.setCursorTo(CURSOR_CONTROLLER.cursorX, CURSOR_CONTROLLER.cursorY);
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
			UndoController.storeUndoTentatively("tool-resize");

			MAP_API.resizeMap(MAP_API.mapWidth + deltaX, MAP_API.mapHeight + deltaY);
		}
	}
}

export default TOOL_RESIZE;