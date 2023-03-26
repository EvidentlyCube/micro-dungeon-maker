import UndoController from "../controllers/UndoController.js";
import MAP_API_EXTENSION from "../MapApiExtension.js";

/** @type {ToolbarButton} */
const BUTTON_INVERT = {
	get tooltip() {
		return "<header>Invert</header><kbd>Click</kbd> &mdash; Replace walls with floors and floors with walls"
	},

	get iconDetails() {
		return {
			class: 'gg-path-back',
			marginTop: 0,
			marginLeft: 0
		};
	},

	click() {
		UndoController.storeUndo();
		MAP_API_EXTENSION.toggleAllTiles();
	}
}

export default BUTTON_INVERT;