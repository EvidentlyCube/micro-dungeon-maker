import { approachStep } from "../Utils.js";
import UPDATE_CONTROLLER from "./UpdateController.js";

const FADE_SPEED = 0.4;

let currentFade = 1;
let targetFade = 1;
/** @type {HTMLElement} */
let root;

const FOCUS_CONTROLLER = {
	get hasFocus() {
		return document.hasFocus();
	},

	init() {
		root = document.querySelector(':root');
		UPDATE_CONTROLLER.onUpdate.on(update);
	}
}

function update() {
	targetFade = document.hasFocus() ? 0 : 1;

	if (currentFade !== targetFade) {
		currentFade = approachStep(currentFade, targetFade, FADE_SPEED, FADE_SPEED);
		root.style.setProperty('--focus-overlay-fade', `${currentFade.toFixed(4)}`);
	}
}

export default FOCUS_CONTROLLER;