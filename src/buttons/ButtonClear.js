import UndoController from "../controllers/UndoController.js";
import MAP_API_EXTENSION from "../MapApiExtension.js";

/** @type {ToolbarButton} */
const BUTTON_CLEAR = {
	get tooltip() {
		return "<header>Clear</header><kbd>Click</kbd> &mdash; Remove everything and replace it with floor<br><kbd>Ctrl+Click</kbd> &mdash; Remove everything and replace it with walls"
	},

	get iconDetails() {
		return {
			class: 'gg-trash',
			marginTop: 0,
			marginLeft: 0
		};
	},

	click(mousepress) {
		if (mousepress.summary === '0') {
			UndoController.storeUndo();
			MAP_API_EXTENSION.clear(0);

		} else if (mousepress.summary === 'ctrl+0') {
			UndoController.storeUndo();
			MAP_API_EXTENSION.clear(1);
		}
	}
}

export default BUTTON_CLEAR;