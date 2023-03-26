import MAP_API from "../MapApi.js";
import { clamp, mod } from "../Utils.js";
import TOOLS_CONTROLLER from "./ToolsController.js";

let cursorX;
let cursorY;
let mouseCursorX;
let mouseCursorY;

let isHandlingCursorMove = false;

/** @type {HTMLElement} */
let root;
/** @type {HTMLElement} */
let cursorDom;
/** @type {HTMLElement} */
let mouseCursorDom;

const CURSOR_CONTROLLER = {
	get cursorX() {
		return cursorX;
	},
	get cursorY() {
		return cursorY;
	},
	get mouseCursorX() {
		return mouseCursorX !== null ? mouseCursorX : cursorX;
	},
	get mouseCursorY() {
		return mouseCursorY !== null ? mouseCursorY : cursorY;
	},

	get isMouseCursorAtTile() {
		return mouseCursorX !== null && mouseCursorY !== null;
	},

	init() {
		root = document.querySelector(':root');
		cursorDom = document.querySelector('#cursor');
		mouseCursorDom = document.querySelector('#cursor-mouse');

		this.setCursorTo(0, 0);
		this.setMouseCursorTo(null, null);

		MAP_API.onResized.on(handleResize);
		MAP_API.onResized.on(this.refreshMouseCursor);
	},

	moveCursorBy(deltaX, deltaY) {
		const oldX = cursorX;
		const oldY = cursorY;

		CURSOR_CONTROLLER.setCursorTo(
			mod(cursorX + deltaX, MAP_API.mapWidth),
			mod(cursorY + deltaY, MAP_API.mapHeight)
		);

		if (!isHandlingCursorMove) {
			isHandlingCursorMove = true;
			TOOLS_CONTROLLER.handle.cursorMoved(
				{ x: deltaX, y: deltaY },
				{ x: oldX, y: oldY },
				{ x: cursorX, y: cursorY }
			);
			isHandlingCursorMove = false;
		}
	},

	setCursorTo(x, y) {
		const newCursorX = clamp(x, 0, MAP_API.mapWidth - 1);
		const newCursorY = clamp(y, 0, MAP_API.mapHeight - 1);

		if (newCursorX !== cursorX || newCursorY !== cursorY) {
			const oldCursorX = cursorX;
			const oldCursorY = cursorY;

			cursorX = newCursorX;
			cursorY = newCursorY;

			if (!isHandlingCursorMove) {
				isHandlingCursorMove = true;
				TOOLS_CONTROLLER.handle.cursorRepositioned({ x: oldCursorX, y: oldCursorY }, { x: newCursorX, y: newCursorY });
				isHandlingCursorMove = false;
			}

			CURSOR_CONTROLLER.refreshCursor();
		}
	},

	setMouseCursorTo(x, y) {
		let newX = x;
		let newY = y;

		if (x === null || y === null || !MAP_API.isValidPosition(x, y)) {
			newX = null;
			newY = null;
		}

		if (newX !== mouseCursorX || newY !== mouseCursorY) {
			const oldCursorX = mouseCursorX !== null ? mouseCursorX : newX;
			const oldCursorY = mouseCursorY !== null ? mouseCursorY : newY;

			mouseCursorX = newX;
			mouseCursorY = newY;

			if (newY !== null && newY !== null) {
				TOOLS_CONTROLLER.handle.mouseCursorRepositioned({ x: oldCursorX, y: oldCursorY }, { x: newX, y: newY });
			}

			CURSOR_CONTROLLER.refreshMouseCursor();
		}
	},

	refreshCursor() {
		const currentTile = document.querySelector('#map .selected');
		if (currentTile) {
			currentTile.classList.remove('selected');
		}

		root.style.setProperty('--cursor-x', cursorX);
		root.style.setProperty('--cursor-y', cursorY);
	},

	refreshMouseCursor() {
		const currentTile = document.querySelector('#map .mouse-hover');
		if (currentTile) {
			currentTile.classList.remove('mouse-hover');
		}

		if (mouseCursorX === null || mouseCursorY === null) {
			root.style.setProperty('--cursor-mouse-display', 'none');
			return;
		}

		root.style.setProperty('--cursor-mouse-display', 'block');
		root.style.setProperty('--cursor-mouse-x', mouseCursorX);
		root.style.setProperty('--cursor-mouse-y', mouseCursorY);
	},

	setCursorClass(className, add) {
		if (add) {
			cursorDom.classList.add(className);
		} else {
			cursorDom.classList.remove(className);
		}
	}

}

function handleResize() {
	CURSOR_CONTROLLER.setCursorTo(cursorX, cursorY);
}

export default CURSOR_CONTROLLER;