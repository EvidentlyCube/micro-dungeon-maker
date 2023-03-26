import CURSOR_CONTROLLER from "./controllers/CursorController.js";
import UPDATE_CONTROLLER from "./controllers/UpdateController.js";
import ICONS from "./Icons.js";
import MAP_API from "./MapApi.js";
import { approachFraction, createElement } from "./Utils.js";

const FRACTION = 0.5;

/** @type {HTMLElement} */
let mapDom;
/** @type {HTMLElement} */
let mapContainerDom;
/** @type {HTMLElement} */
let layoutBodyDom;
let targetPosition = { x: 0, y: 0 };
let currentPosition = { x: 0, y: 0 };

const MAP_RENDERER = {
	/** @type {Element} */
	_dom: [[]],

	init() {
		mapDom = document.querySelector('#map');
		mapContainerDom = document.querySelector('#map-container');
		layoutBodyDom = document.querySelector('#layout-body');

		targetPosition = calculateTargetPosition();
		currentPosition = { ...targetPosition };
		setMapPositionTo(currentPosition.x, currentPosition.y)

		UPDATE_CONTROLLER.onUpdate.on(update);
	},

	recreateMapDom() {
		MAP_RENDERER._dom = [];

		const map = document.getElementById("map");
		map.innerHTML = '';

		for (let y = 0; y < MAP_API.mapHeight; y++) {
			MAP_RENDERER._dom[y] = [];
			const row = createElement('div', { class: 'row' });
			map.appendChild(row);

			for (let x = 0; x < MAP_API.mapWidth; x++) {
				const tile = createElement('div', {
					class: `tile tile-${x}-${y}`,
					data: { x, y },
					children: [
						createElement('span', 'text'),
						createElement('span', 'icon'),
					]
				});

				MAP_RENDERER._dom[y][x] = tile;
				row.appendChild(tile);
			}
		}
	},

	setTileType(x, y, type) {
		const tile = getTileDom(x, y);

		if (type) {
			tile.classList.add('wall');
		} else {
			tile.classList.remove('wall');
		}
	},

	/**
	 * @param {integer} x
	 * @param {integer} y
	 * @param {MapTileText|undefined} textData
	*/
	setTileText(x, y, textData) {
		const text = getTileTextContainerDom(x, y);

		text.innerText = textData ? textData.c : '';
	},

	/**
	 * @param {integer} x
	 * @param {integer} y
	 * @param {MapTileIcon|undefined} iconData
	 */
	setTileIcon(x, y, iconData) {
		const icon = getTileIconDom(x, y);
		const iconIndex = iconData ? iconData.i : 0;

		icon.className = `icon ${ICONS[iconIndex]}`;
	}
}

function update() {
	targetPosition = calculateTargetPosition();

	if (targetPosition.x !== currentPosition.x || targetPosition.y !== currentPosition.y) {
		currentPosition.x = approachFraction(currentPosition.x, targetPosition.x, FRACTION, 1);
		currentPosition.y = approachFraction(currentPosition.y, targetPosition.y, FRACTION, 1);

		setMapPositionTo(currentPosition.x, currentPosition.y);
	}
}

function setMapPositionTo(x, y) {
	mapContainerDom.style.left = (x | 0) + 'px';
	mapContainerDom.style.top = (y | 0) + 'px';

	CURSOR_CONTROLLER.refreshCursor();
}

function calculateTargetPosition() {
	const allowedWidth = layoutBodyDom.offsetWidth;
	const allowedHeight = layoutBodyDom.offsetHeight;
	const mapWidth = mapDom.scrollWidth;
	const mapHeight = mapDom.scrollHeight;

	return {
		x: mapWidth > allowedWidth ? 0 : ((allowedWidth - mapWidth) / 2 | 0),
		y: mapHeight > allowedHeight ? 0 : ((allowedHeight - mapHeight) / 2 | 0),
	}
}

/**
 * @returns {Element}
 */
function getTileDom(x, y) {
	if (!MAP_API.isValidPosition(x, y)) {
		throw new Error(`Attempted to access invalid position (${x},${y}) in map renderer for map of dimensions (${MAP_API, mapWidth},${MAP_API, mapHeight})`);
	}

	const tile = MAP_RENDERER._dom[y][x];

	if (!tile) {
		throw new Error(`Attempted to access invalid position (${x},${y}) in map renderer for map of dimensions (${MAP_API, mapWidth},${MAP_API, mapHeight})`);
	}

	return tile;
}

/**
 * @returns {Element}
 */
function getTileTextContainerDom(x, y) {
	const textContainer = getTileDom(x, y).querySelector('.text');

	if (!textContainer) {
		throw new Error(`Missing text container DOM for tile (${x},${y}) in map renderer for map of dimensions (${MAP_API, mapWidth},${MAP_API, mapHeight})`);
	}

	return textContainer;
}

/**
 * @returns {Element}
 */
function getTileIconDom(x, y) {
	const icon = getTileDom(x, y).querySelector('.icon');

	if (!icon) {
		throw new Error(`Missing icon DOM for tile (${x},${y}) in map renderer for map of dimensions (${MAP_API.mapWidth},${MAP_API.mapHeight})`);
	}

	return icon;
}

export default MAP_RENDERER;