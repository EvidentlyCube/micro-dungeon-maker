import { createElement } from "../Utils.js";

/** @type {HTMLElement} */
let headerDom;
/** @type {HTMLElement} */
let listDom;

const HELP_CONTROLLER = {
	init() {
		headerDom = document.querySelector('#help header');
		listDom = document.querySelector('#help ul');
	},

	updateHelp(helpDetails) {
		headerDom.innerText = helpDetails.title;
		listDom.innerHTML = "";

		helpDetails.points.forEach(html => {
			listDom.appendChild(createElement('li', { html }))
		})
	}
}


export default HELP_CONTROLLER;