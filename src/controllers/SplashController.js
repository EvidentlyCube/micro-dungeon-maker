import { approachStep } from "../Utils.js";
import KEYBOARD_CONTROLLER from "./KeyboardController.js";
import MOUSE_CONTROLLER from "./MouseController.js";
import UPDATE_CONTROLLER from "./UpdateController.js";

const FADE_SPEED = 0.1;

let currentFade = 1;
/** @type {HTMLElement} */
let root;
/** @type {HTMLElement} */
let splashDom;

const SPLASH_CONTROLLER = {
	init() {
		root = document.querySelector(':root');
		splashDom = document.querySelector('#splash-modal');


		splashDom.addEventListener('mousedown', startFading);
	}
}

function startFading(event) {
	event.preventDefault();
	event.stopImmediatePropagation();

	splashDom.removeEventListener('mousedown', startFading)
	UPDATE_CONTROLLER.onUpdate.on(update);
}

function update() {
	const targetFade = 0;

	if (currentFade !== targetFade) {
		currentFade = approachStep(currentFade, targetFade, FADE_SPEED, FADE_SPEED / 2);
		root.style.setProperty('--splash-fade', `${currentFade.toFixed(4)}`);
	} else {
		UPDATE_CONTROLLER.onUpdate.off(update);
		splashDom.parentElement.removeChild(splashDom);

		KEYBOARD_CONTROLLER.isActive = true;
		MOUSE_CONTROLLER.isActive = true;
	}
}

export default SPLASH_CONTROLLER;