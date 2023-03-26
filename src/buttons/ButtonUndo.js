import UndoController from "../controllers/UndoController.js";

/** @type {ToolbarButton} */
const BUTTON_UNDO = {
	get tooltip() {
		return "<header>Undo (Ctrl+Z)</header><kbd>Click</kbd> &mdash; Undoes the last action"
	},

	get iconDetails() {
		return {
			class: 'gg-undo',
			marginTop: 0,
			marginLeft: 0
		};
	},

	click() {
		UndoController.undo();
	}
}

export default BUTTON_UNDO;