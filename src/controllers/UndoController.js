import MAP_API from "../MapApi.js";

const UndoController = {
	/** @type {MapSnapshot[]} */
	_stateStack: [],
	/** @type {MapSnapshot} */
	_tentativeUndoSnapshot: null,
	/** @type {string} */
	_tentativeUndoId: null,
	storeUndoTentatively(id) {
		if (UndoController._tentativeUndoId !== id) {
			if (UndoController._tentativeUndoSnapshot) {
				UndoController._stateStack.push(UndoController._tentativeUndoSnapshot);
			}

			UndoController._tentativeUndoSnapshot = MAP_API.createSnapshot();
			UndoController._tentativeUndoId = id;
		}
	},
	storeUndo() {
		if (UndoController._tentativeUndoSnapshot) {
			UndoController._stateStack.push(UndoController._tentativeUndoSnapshot);
			UndoController._tentativeUndoSnapshot = null;
			UndoController._tentativeUndoId = null;
		}
		UndoController._stateStack.push(MAP_API.createSnapshot());
	},
	undo() {
		if (UndoController._tentativeUndoSnapshot) {
			UndoController._loadUndoState(UndoController._tentativeUndoSnapshot);
			UndoController._tentativeUndoSnapshot = null;
			UndoController._tentativeUndoId = null;

		} else {
			UndoController._loadUndoState(UndoController._stateStack.pop());
		}
	},
	_loadUndoState(undoState) {
		if (!undoState) {
			return;
		}

		if (undoState.width !== MAP_API.mapWidth || undoState.height !== MAP_API.mapHeight) {
			MAP_API.resizeMap(undoState.width, undoState.height);
		}

		MAP_API.loadMapGrid(undoState.map);
	}
}

export default UndoController;