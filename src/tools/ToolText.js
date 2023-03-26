import CURSOR_CONTROLLER from "../controllers/CursorController.js";
import UndoController from "../controllers/UndoController.js";
import MAP_API from "../MapApi.js";
import { isFunctionKey } from "../Utils.js";

let isEditingText = false;

/** @type {Tool} */
const TOOL_TEXT = {
	get tooltip() {
		return "<header>Text (T)</header>Add text to a tile."
	},

	get iconDetails() {
		return {
			class: 'gg-format-uppercase',
			marginTop: 2,
			marginLeft: -6
		};
	},

	get helpDescription() {
		return {
			title: "Text",
			points: [
				'Press <kbd>Enter</kbd> to begin/finish editing text.',
				'Type during text editing',
			]
		}
	},

	handleDeselected() {
		stopEditing();
	},

	handleKeyDown(keypress, preventDefault) {
		if (keypress.key === 'Escape') {
			preventDefault();
			stopEditing();

		} else if (keypress.key === 'Enter') {
			preventDefault();
			toggleEditing();
			return;

		} else if (!isEditingText || isFunctionKey(keypress.key)) {
			return;
		}

		preventDefault();

		UndoController.storeUndoTentatively(`tool-type-${CURSOR_CONTROLLER.cursorX}-${CURSOR_CONTROLLER.cursorY}`);

		const tile = MAP_API.getTileData(CURSOR_CONTROLLER.cursorX, CURSOR_CONTROLLER.cursorY);
		const tileText = tile.text || {c: ''};
		const newTileText = {
			...tileText,
			c: modifyText(keypress, tileText.c || '')
		};

		MAP_API.setTileText(
			CURSOR_CONTROLLER.cursorX,
			CURSOR_CONTROLLER.cursorY,
			newTileText.c ? newTileText : undefined
		);
	},

	handleMouseDown(mousepress) {
		if (
			mousepress.summary === '0'
			&& CURSOR_CONTROLLER.isMouseCursorAtTile
		) {
			if (isEditingText) {
				stopEditing();
			}

			CURSOR_CONTROLLER.setCursorTo(CURSOR_CONTROLLER.mouseCursorX, CURSOR_CONTROLLER.mouseCursorY);
			startEditing();
		}
	}
}

function toggleEditing() {
	if (isEditingText) {
		stopEditing();
	} else {
		startEditing();
	}
}

function startEditing() {
	CURSOR_CONTROLLER.setCursorClass('text-type', true);
	isEditingText = true;
}

function stopEditing() {
	CURSOR_CONTROLLER.setCursorClass('text-type', false);
	isEditingText = false;
}

/**
 * @param {Keypress} keypress
 * @param {string} text
 * @returns
 */
function modifyText(keypress, text) {
	if (keypress.key === 'Backspace') {
		return text.substring(0, text.length - 1);
	} else if (keypress.key.length === 1) {
		return text + keypress.key;
	} else {
		return text;
	}
}

export default TOOL_TEXT;