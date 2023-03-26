import CONSTS from "./Consts.js";
import SAVE_CONTROLLER from "./controllers/SaveController.js";
import ICONS from "./Icons.js";
import MAP_RENDERER from "./MapRenderer.js";
import { Signal } from "./Signal.js";
import { clamp, create2dArray, mod } from "./Utils.js";

let mapWidth = 0;
let mapHeight = 0;
/** @type {MapGrid} */
let map = [[]];

const MAP_API = {
	onResized: new Signal(),
	onLoaded: new Signal(),

	get mapWidth() {
		return mapWidth;
	},

	get mapHeight() {
		return mapHeight;
	},

	get mapJson() {
		return JSON.stringify(map);
	},

	/**
	 * @returns {MapGrid}
	 */
	createMapArray(width, height) {
		return create2dArray(width, height, () => ({ t: 0 }))
	},
	resizeMap(newWidth, newHeight) {
		const oldMap = MAP_API.createSnapshot();
		mapWidth = clamp(newWidth, CONSTS.MIN_MAP_WIDTH, CONSTS.MAX_MAP_WIDTH);
		mapHeight = clamp(newHeight, CONSTS.MIN_MAP_HEIGHT, CONSTS.MAX_MAP_HEIGHT);
		map = MAP_API.createMapArray(mapWidth, mapHeight);

		// MAP_RENDERER
		MAP_RENDERER.recreateMapDom();
		MAP_API.loadMapGrid(oldMap.map);
		MAP_API.onResized.emit();
	},
	/**
	 * @param {(MapGrid|undefined)} mapGrid
	 */
	loadMapGrid(mapGrid) {
		if (!mapGrid) {
			return;
		}

		for (let y = 0; y < mapHeight; y++) {
			for (let x = 0; x < mapWidth; x++) {
				const tile = mapGrid[y] && mapGrid[y][x];

				if (tile) {
					MAP_API.setTileType(x, y, tile.t);
					MAP_API.setTileText(x, y, tile.text);
					MAP_API.setTileIcon(x, y, tile.icon);
				}
			}
		}

		MAP_API.onLoaded.emit();
	},
	getTileData(x, y) {
		assertValidPosition(x, y);

		return map[y][x];
	},
	setTileType(x, y, type) {
		assertValidPosition(x, y);

		map[y][x].t = type;
		MAP_RENDERER.setTileType(x, y, type);
		SAVE_CONTROLLER.queueSave();
	},
	/**
	 * @param {integer} x
	 * @param {integer} y
	 * @param {MapTileText|undefined} text
	 */
	setTileText(x, y, text) {
		assertValidPosition(x, y);

		if (text === undefined) {
			delete map[y][x].text;

		} else {
			map[y][x].text = { ...text };
		}

		MAP_RENDERER.setTileText(x, y, text);
		SAVE_CONTROLLER.queueSave();
	},
	/**
	 * @param {integer} x
	 * @param {integer} y
	 * @param {MapTileIcon|undefined} icon
	 */
	setTileIcon(x, y, icon) {
		assertValidPosition(x, y);

		if (icon === undefined) {
			delete map[y][x].icon;

		} else {
			icon.i = mod(icon.i, ICONS.length);
			map[y][x].icon = { ...icon };
		}

		MAP_RENDERER.setTileIcon(x, y, icon);
		SAVE_CONTROLLER.queueSave();
	},
	/**
	 * @returns {MapSnapshot}
	 */
	createSnapshot() {
		return {
			map: JSON.parse(JSON.stringify(map)),
			width: mapWidth,
			height: mapHeight
		};
	},
	isValidPosition(x, y) {
		return x >= 0 && y >= 0 && x < mapWidth && y < mapHeight;
	}
}

function assertValidPosition(x, y) {
	if (!MAP_API.isValidPosition(x, y)) {
		throw new Error(`Attempted to access invalid position (${x},${y}) on map of dimensions (${mapWidth},${mapHeight})`);
	}
}

export default MAP_API;