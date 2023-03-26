import BUTTON_UNDO from "../buttons/ButtonUndo.js";
import TOOL_FILL from "../tools/ToolFill.js";
import TOOL_ICONS from "../tools/ToolIcons.js";
import TOOL_TEXT from "../tools/ToolText.js";
import TOOL_TOGGLE_BRUSH from "../tools/ToolToggleBrush.js";
import { describeMousepress, getDeltaForArrow } from "../Utils.js";
import TOOLS_CONTROLLER from "./ToolsController.js";

const HANDLERS_DOWN = new Map();
const HANDLERS_UP = new Map();

const KEYBOARD_CONTROLLER = {
	isActive: false,

	init() {
		document.addEventListener("keydown", activeCurry(onKeyDown));
		document.addEventListener("keyup", activeCurry(onKeyUp));

		HANDLERS_DOWN.set('ArrowUp', handleArrowKey);
		HANDLERS_DOWN.set('ArrowDown', handleArrowKey);
		HANDLERS_DOWN.set('ArrowLeft', handleArrowKey);
		HANDLERS_DOWN.set('ArrowRight', handleArrowKey);

		HANDLERS_DOWN.set('v', () => TOOLS_CONTROLLER.selectTool(TOOL_TOGGLE_BRUSH));
		HANDLERS_DOWN.set('f', () => TOOLS_CONTROLLER.selectTool(TOOL_FILL));
		HANDLERS_DOWN.set('t', () => TOOLS_CONTROLLER.selectTool(TOOL_TEXT));
		HANDLERS_DOWN.set('i', () => TOOLS_CONTROLLER.selectTool(TOOL_ICONS));
		HANDLERS_DOWN.set('ctrl+z', () => TOOLS_CONTROLLER.executeButton(BUTTON_UNDO, getMousepress(0, false, false, false)));
	}
}

function activeCurry(callback) {
	return function(...args) {
		if (KEYBOARD_CONTROLLER.isActive) {
			return callback(...args);
		}
	}
}

function handleArrowKey(keypress) {
	const delta = getDeltaForArrow(keypress.key);

	TOOLS_CONTROLLER.handle.arrowKeyPressed(keypress, delta);
}

/**
 * @returns {Mouse}
 */
function getMousepress(button, ctrlKey, altKey, shiftKey) {
	return describeMousepress({ button, ctrlKey, altKey, shiftKey });
}

/**
 * @param {KeyboardEvent} event
 */
function onKeyDown(event) {
	const keypress = describeKeypress(event);

	TOOLS_CONTROLLER.handle.keyDown(keypress, () => event.preventDefault());

	if (event.defaultPrevented) {
		return;
	}

	const handler = HANDLERS_DOWN.get(keypress.summary);

	if (handler) {
		event.stopPropagation();
		event.preventDefault();
		handler(keypress);
	}
}
/**
 * @param {KeyboardEvent} event
 */
function onKeyUp(event) {
	const keypress = describeKeypress(event);

	TOOLS_CONTROLLER.handle.keyUp(keypress, () => event.preventDefault());

	if (event.defaultPrevented) {
		return;
	}

	const handler = HANDLERS_UP.get(keypress.summary);

	if (handler) {
		event.stopPropagation();
		event.preventDefault();
		handler(keypress);
	}
}

/**
 * @param {KeyboardEvent} event
 * @returns {Keypress}
 */
function describeKeypress(event) {
	const bits = [
		event.ctrlKey ? 'ctrl' : '',
		event.altKey ? 'alt' : '',
		event.shiftKey ? 'shift' : '',
		event.key.length === 1 ? event.key.toLowerCase() : event.key
	];

	return {
		summary: bits.filter(x => x).join('+'),
		key: event.key,
		isAlt: !!event.altKey,
		isCtrl: !!event.ctrlKey,
		isShift: !!event.shiftKey,
	};
}

export default KEYBOARD_CONTROLLER;