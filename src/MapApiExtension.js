import UndoController from "./controllers/UndoController.js";
import MAP_API from "./MapApi.js";
import { create2dArray } from "./Utils.js";

const MAP_API_EXTENSION = {
	resizeMapBy(deltaX, deltaY) {
		MAP_API.resizeMap(MAP_API.mapWidth + deltaX, MAP_API.mapHeight + deltaY);
	},
	shiftMap(deltaX, deltaY) {
		deltaX = Math.round(deltaX);
		deltaY = Math.round(deltaY);

		if (deltaX === 0 && deltaY === 0) {
			return;
		}

		shiftMap(deltaX, deltaY);
	},
	floodToggle(x, y) {
		const doToggle = (x, y, fromState) => {
			if (!MAP_API.isValidPosition(x, y)) {
				return;
			}

			const tile = MAP_API.getTileData(x, y);
			if (tile.t === fromState) {
				MAP_API.setTileType(x, y, fromState ? 0 : 1);
				doToggle(x - 1, y, fromState);
				doToggle(x + 1, y, fromState);
				doToggle(x, y - 1, fromState);
				doToggle(x, y + 1, fromState);
			}
		}

		const tile = MAP_API.getTileData(x, y);
		doToggle(x, y, tile.t);
	},

	toggleAllTiles() {
		for (let y = 0; y < MAP_API.mapHeight; y++) {
			for (let x = 0; x < MAP_API.mapWidth; x++) {
				const tile = MAP_API.getTileData(x, y);
				MAP_API.setTileType(x, y, tile.t ? 0 : 1);
			}
		}
	},
	clear(type) {
		for (let y = 0; y < MAP_API.mapHeight; y++) {
			for (let x = 0; x < MAP_API.mapWidth; x++) {
				MAP_API.setTileType(x, y, type);
				MAP_API.setTileText(x, y, undefined);
				MAP_API.setTileIcon(x, y, undefined);
			}
		}
	},
	toggleTileAt(x, y) {
		const tile = MAP_API.getTileData(x, y);
		MAP_API.setTileType(x, y, tile.t ? 0 : 1);
	}
}

function shiftMap(deltaX, deltaY) {
	const oldMap = MAP_API.createSnapshot();
	const newMapGrid = create2dArray(oldMap.width, oldMap.height, (x, y) => {
		const oldX = (x - deltaX + oldMap.width) % oldMap.width;
		const oldY = (y - deltaY + oldMap.height) % oldMap.height;

		return oldMap.map[oldY][oldX];
	});

	MAP_API.loadMapGrid(newMapGrid);
}

export default MAP_API_EXTENSION;