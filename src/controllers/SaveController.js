import CONSTS from "../Consts.js";
import MAP_API from "../MapApi.js";
import { clamp } from "../Utils.js";

const KEY_MAP_DATA = 'map';
const KEY_MAP_WIDTH = 'map-width';
const KEY_MAP_HEIGHT = 'map-height';

let isSaveQueued = false;

const SAVE_CONTROLLER = {
	init() {
		setInterval(saveQueued, 50);
	},
	queueSave() {
		isSaveQueued = true;
	},
	doSave() {
		isSaveQueued = false;
		localStorage.setItem(KEY_MAP_DATA, MAP_API.mapJson);
		localStorage.setItem(KEY_MAP_WIDTH, MAP_API.mapWidth);
		localStorage.setItem(KEY_MAP_HEIGHT, MAP_API.mapHeight);
	},
	store: {
		get mapWidth() {
			return clamp(parseInt(localStorage.getItem(KEY_MAP_WIDTH) || 20), CONSTS.MIN_MAP_WIDTH, CONSTS.MAX_MAP_WIDTH);
		},
		get mapHeight() {
			return clamp(parseInt(localStorage.getItem(KEY_MAP_HEIGHT) || 20), CONSTS.MIN_MAP_HEIGHT, CONSTS.MAX_MAP_HEIGHT);
		},
		get map() {
			try {
				return JSON.parse(localStorage.getItem(KEY_MAP_DATA)) || createEmptyMap();
			} catch (e) {
				return createEmptyMap();
			}
		}
	}
}

function createEmptyMap() {
	return MAP_API.createMapArray(MAP_API.mapWidth, MAP_API.mapHeight);
}

function saveQueued() {
	if (isSaveQueued) {
		SAVE_CONTROLLER.doSave();
	}
}

export default SAVE_CONTROLLER;