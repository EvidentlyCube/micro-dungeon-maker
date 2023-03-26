import { Signal } from "../Signal.js";

const UPDATE_CONTROLLER = {
	onUpdate: new Signal(),

	init() {
		setInterval(() => {
			UPDATE_CONTROLLER.onUpdate.emit();
		}, 16);
	}
}

export default UPDATE_CONTROLLER;