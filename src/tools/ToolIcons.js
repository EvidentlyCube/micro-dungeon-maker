import CURSOR_CONTROLLER from "../controllers/CursorController.js";
import UndoController from "../controllers/UndoController.js";
import MAP_API from "../MapApi.js";
import { isFunctionKey } from "../Utils.js";

let isEditingText = false;

/** @type {Tool} */
const TOOL_ICONS = {
	get tooltip() {
		return "<header>Icons (I)</header>Place icons."
	},

	get iconDetails() {
		return {
			class: 'gg-smile-mouth-open',
			marginTop: 0,
			marginLeft: 0
		};
	},

	get helpDescription() {
		return {
			title: "Icons",
			points: [
				'Press <kbd>.</kbd> / <kbd>,</kbd> to change to the next/previous icon.',
				'Click <kbd>LMB</kbd> / <kbd>RMB</kbd> to change to the next/previous icon.',
				'Press <kbd>Delete</kbd> / <kbd>Backspace</kbd> to remove icon.',
				'Click <kbd>MMB</kbd> to remove icon.',
			]
		}
	},

	handleKeyDown(keypress, preventDefault) {
		if (keypress.summary === '.') {
			preventDefault();
			changeIcon(CURSOR_CONTROLLER.cursorX, CURSOR_CONTROLLER.cursorY, 1);

		} else if (keypress.summary === ',') {
			preventDefault();
			changeIcon(CURSOR_CONTROLLER.cursorX, CURSOR_CONTROLLER.cursorY, -1);

		} else if (keypress.summary === 'Delete' || keypress.summary === 'Backspace') {
			preventDefault();
			deleteIcon(CURSOR_CONTROLLER.cursorX, CURSOR_CONTROLLER.cursorY);

		}
	},

	handleMouseDown(mousepress, preventDefault) {
		if (!CURSOR_CONTROLLER.isMouseCursorAtTile) {
			return;
		}

		if (mousepress.summary === '0') {
			preventDefault();
			changeIcon(CURSOR_CONTROLLER.mouseCursorX, CURSOR_CONTROLLER.mouseCursorY, 1);
			CURSOR_CONTROLLER.setCursorTo(CURSOR_CONTROLLER.mouseCursorX, CURSOR_CONTROLLER.mouseCursorY);

		} else if (mousepress.summary === '1') {
			preventDefault();
			deleteIcon(CURSOR_CONTROLLER.mouseCursorX, CURSOR_CONTROLLER.mouseCursorY, -1);
			CURSOR_CONTROLLER.setCursorTo(CURSOR_CONTROLLER.mouseCursorX, CURSOR_CONTROLLER.mouseCursorY);

		} else if (mousepress.summary === '2') {
			preventDefault();
			changeIcon(CURSOR_CONTROLLER.mouseCursorX, CURSOR_CONTROLLER.mouseCursorY, -1);
			CURSOR_CONTROLLER.setCursorTo(CURSOR_CONTROLLER.mouseCursorX, CURSOR_CONTROLLER.mouseCursorY);
		}
	}
}

function deleteIcon(x, y) {
	UndoController.storeUndoTentatively(`icon-${x}-${y}`);

	MAP_API.setTileIcon(x, y, undefined);
}

function changeIcon(x, y, delta) {
	UndoController.storeUndoTentatively(`icon-${x}-${y}`);

	const tile = MAP_API.getTileData(x, y);
	const iconIndex = (tile.icon ? tile.icon.i : 0) + delta;

	MAP_API.setTileIcon(x, y, iconIndex !== 0 ? { i: iconIndex } : undefined);
}

export default TOOL_ICONS;