/** @type {HTMLElement} */
let tooltipDom;
/** @type {HTMLElement} */
let hookedDom;

const TOOLTIP_CONTROLLER = {
	init() {
		tooltipDom = document.querySelector('#tooltip')
	},

	/**
	 * @param {HTMLElement} element
	 * @param {string} text
	 */
	hookTo(element, text) {
		const callback = () => {
			if (hookedDom === element) {
				tooltipDom.style.display = "none";
			}

			element.removeEventListener('mouseout', callback, true);
		}

		element.addEventListener('mouseout', callback, true);

		hookedDom = element;
		tooltipDom.innerHTML = text;
		tooltipDom.style.display = "block";

		const elementBounds = element.getBoundingClientRect();
		const tooltipBounds = tooltipDom.getBoundingClientRect();
		tooltipDom.style.left = `${elementBounds.right + 10}px`;
		tooltipDom.style.top = `${elementBounds.top + (elementBounds.height - tooltipBounds.height) / 2 | 0}px`;
	}
}

export default TOOLTIP_CONTROLLER;