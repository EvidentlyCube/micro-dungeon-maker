import CURSOR_CONTROLLER from "../controllers/CursorController.js";
import UndoController from "../controllers/UndoController.js";
import MAP_API_EXTENSION from "../MapApiExtension.js";

/** @type {Tool} */
const TOOL_FILL = {
	get tooltip() {
		return "<header>Fill (F)</header>Flood fill area"
	},

	get iconDetails() {
		return {
			class: 'gg-color-bucket',
			marginTop: -11,
			marginLeft: -8
		};
	},

	get helpDescription() {
		return {
			title: "Fill",
			points: [
				'Press <kbd>Space</kbd> to fill.',
				'Press <kbd>Left Mouse Button</kbd> to fill.',
			]
		}
	},

	handleKeyDown(keypress, preventDefault) {
		if (keypress.summary !== ' ') {
			return;
		}

		preventDefault();

		UndoController.storeUndo();

		MAP_API_EXTENSION.floodToggle(CURSOR_CONTROLLER.cursorX, CURSOR_CONTROLLER.cursorY)
	},

	handleMouseDown(mousepress) {
		if (mousepress.summary !== '0' || !CURSOR_CONTROLLER.isMouseCursorAtTile) {
			return;
		}

		UndoController.storeUndo();

		MAP_API_EXTENSION.floodToggle(CURSOR_CONTROLLER.mouseCursorX, CURSOR_CONTROLLER.mouseCursorY)
	}
}

export default TOOL_FILL;