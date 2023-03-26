export function mod(value, modulo) {
	if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
		value = 0;

	} else if (value < 0) {
		value += Math.ceil(-value / modulo) * modulo;
	}

	if (modulo <= 0) {
		return 0;
	}

	return (value + modulo) % modulo;
}

export function create2dArray(width, height, valueCallback) {
	const arr = [];

	for (let y = 0; y < height; y++) {
		arr.push([]);
		for (let x = 0; x < width; x++) {
			arr[y].push(valueCallback(x, y));
		}
	}

	return arr;
}

export function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

export function approachStep(value, to, step, roundWhen) {
	if (Math.abs(value - to) <= roundWhen) {
		return to;
	} else {
		return value + Math.sign(to - value) * step;
	}
}

export function approachFraction(value, to, fraction, roundWhen) {
	fraction = clamp(fraction, 0, 1);

	if (value !== to) {
		const delta = (to - value);

		if (Math.abs(delta) <= roundWhen) {
			return to;
		}

		return value + fraction * delta;
	}

	return to;
}

/**
 * @returns {HTMLElement}
 */
export function createElement(tag, options) {
	/** @type {HTMLElement} */
	const element = document.createElement(tag);

	if (options === null || options === undefined) {
		options = {};

	} else if (typeof options === 'string') {
		options = { class: options };
	}

	if (options.class) {
		element.className = options.class;
	}

	if (options.text) {
		element.innerText = options.text;
	} else if (options.html) {
		element.innerHTML = options.html;
	}

	if (options.data) {
		for (const key in options.data) {
			element.setAttribute(`data-${key}`, options.data[key]);
		}
	}

	if (options.children) {
		options.children.forEach(child => element.appendChild(child));
	}

	return element;
}

/**
 * @param {Point} from
 * @param {Point} to
 * @returns {Point[]}
 */
export function getAllPointsBetween(from, to) {
	const points = [];

	const directionX = Math.sign(to.x - from.x);
	const directionY = Math.sign(to.y - from.y);

	const dY = Math.abs(from.x - to.x);
	const dX = Math.abs(from.y - to.y);
	const smallerDelta = Math.min(dX, dY);

	let stepX = 0;
	let stepY = 0;

	let stepsLeft = Math.max(dX, dY);

	let currentX = from.x;
	let currentY = from.y;

	points.push({ x: currentX, y: currentY });

	while (stepsLeft-- > 0) {
		stepX += smallerDelta;
		stepY += smallerDelta;

		if (stepX >= dX) {
			currentX += directionX;
			points.push({ x: currentX, y: currentY });
			stepX -= dX;
		}
		if (stepY >= dY) {
			currentY += directionY;
			points.push({ x: currentX, y: currentY });
			stepY -= dY;
		}
	}

	return points;
}

/**
 * @returns {Point}
 */
export function getDeltaForArrow(key) {
	if (key === 'ArrowUp') {
		return { x: 0, y: -1 };
	} else if (key === 'ArrowDown') {
		return { x: 0, y: 1 };
	} else if (key === 'ArrowLeft') {
		return { x: -1, y: 0 };
	} else if (key === 'ArrowRight') {
		return { x: 1, y: 0 };
	} else {
		return { x: 0, y: 0 };
	}
}

/**
 * @param {MouseEvent} event
 * @returns {Mousepress}
 */
export function describeMousepress(event) {
	const bits = [
		event.ctrlKey ? 'ctrl' : '',
		event.altKey ? 'alt' : '',
		event.shiftKey ? 'shift' : '',
		event.button.toString()
	];

	return {
		summary: bits.filter(x => x).join('+'),
		button: event.button,
		isAlt: !!event.altKey,
		isCtrl: !!event.ctrlKey,
		isShift: !!event.shiftKey,
	};
}

export function isFunctionKey(key) {
	return /^F\d+$/.test(key);
}