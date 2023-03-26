import CURSOR_CONTROLLER from "../controllers/CursorController.js";
import UndoController from "../controllers/UndoController.js";
import MAP_API from "../MapApi.js";
import { getAllPointsBetween } from "../Utils.js";

let isKeyboardDrawing = false;
let isMouseDrawing = false;
let drawingType = null;

/** @type {Tool} */
const TOOL_TOGGLE_BRUSH = {
	get tooltip() {
		return "Brush (V) - Toggle walls and floors at a point"
	},

	get iconDetails() {
		return {
			class: 'gg-pen',
			marginTop: -2,
			marginLeft: 2
		};
	},

	get helpDescription() {
		return {
			title: "Brush",
			points: [
				'Press <kbd>Space</kbd> to draw.',
				'Hold <kbd>Space</kbd> and move around to draw.',
				'Press <kbd>Left Mouse Button</kbd> to draw.',
				'Hold <kbd>Left Mouse Button</kbd> and move around to draw.',
			]
		}
	},

	handleDeselected() {
		isKeyboardDrawing = false;
		isMouseDrawing = false;
		drawingType = null;
	},

	handleKeyDown(keypress, preventDefault) {
		if (keypress.summary !== ' ' || isMouseDrawing) {
			return;
		}

		preventDefault();

		UndoController.storeUndo();

		const tile = MAP_API.getTileData(CURSOR_CONTROLLER.cursorX, CURSOR_CONTROLLER.cursorY);

		isKeyboardDrawing = true;
		drawingType = tile.t ? 0 : 1;

		MAP_API.setTileType(CURSOR_CONTROLLER.cursorX, CURSOR_CONTROLLER.cursorY, drawingType);
	},

	handleKeyUp(keypress, preventDefault) {
		if (keypress.summary !== ' ') {
			return;
		}

		preventDefault();

		isKeyboardDrawing = false;
		drawingType = null;
	},

	handleMouseDown(mousepress) {
		if (mousepress.summary !== '0' || isKeyboardDrawing || !CURSOR_CONTROLLER.isMouseCursorAtTile) {
			return;
		}

		if (!isMouseDrawing) {
			UndoController.storeUndo();

			const tile = MAP_API.getTileData(CURSOR_CONTROLLER.mouseCursorX, CURSOR_CONTROLLER.mouseCursorY);

			isMouseDrawing = true;
			drawingType = tile.t ? 0 : 1;

			MAP_API.setTileType(CURSOR_CONTROLLER.mouseCursorX, CURSOR_CONTROLLER.mouseCursorY, drawingType);
		}
	},

	handleMouseUp(button) {
		if (button.button !== 0) {
			return;
		}

		isMouseDrawing = false;
		drawingType = null;
	},

	handleCursorRepositioned(from, to) {
		if (isKeyboardDrawing) {
			MAP_API.setTileType(to.x, to.y, drawingType);
		}
	},

	handleMouseCursorRepositioned(from, to) {
		if (isMouseDrawing) {
			const points = getAllPointsBetween(from, to);

			for (const point of points) {
				MAP_API.setTileType(point.x, point.y, drawingType);
			}
		}
	}
}

export default TOOL_TOGGLE_BRUSH;