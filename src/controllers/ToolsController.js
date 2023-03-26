import { createElement, describeMousepress, mod } from "../Utils.js";
import CURSOR_CONTROLLER from "./CursorController.js";
import HELP_CONTROLLER from "./HelpController.js";
import TOOLTIP_CONTROLLER from "./TooltipController.js";

const ToolMethods = [
	'init',
	'handleSelected',
	'handleDeselected',
	'handleKeyDown',
	'handleKeyUp',
	'handleMouseDown',
	'handleMouseUp',
	'handleCursorMoved',
	'handleCursorRepositioned',
	'handleMouseCursorRepositioned',
];

/** @type {Tool} */
let currentTool;
/** @type {HTMLElement} */
let currentToolDom;
/** @type {Tool[]} */
let tools;
/** @type {HTMLElement[]} */
let toolDoms;

/** @type {ToolbarButton[]} */
let buttons;
/** @type {HTMLElement[]} */
let buttonDoms;

const TOOLS_CONTROLLER = {
	/**
	 * @param {Tool[]} _tools
	 * @param {ToolbarButton[]} _buttons
	 */
	init(_tools, _buttons) {
		_tools.forEach(tool => validateTool(tool));
		_buttons.forEach(button => validateButton(button));

		tools = _tools.concat();
		buttons = _buttons.concat();
		toolDoms = tools.map(tool => createToolDom(tool));
		addSeparator();
		buttonDoms = buttons.map(button => createButtonDom(button));

		buttons = _buttons.concat();

		tools.forEach(tool => addMissingMethods(tool));
		tools.forEach(tool => tool.init());

		this.selectToolByIndex(0);
	},

	selectTool(tool) {
		const index = tools.indexOf(tool);

		if (index !== -1) {
			TOOLS_CONTROLLER.selectToolByIndex(index);
		}
	},

	selectToolByIndex(index) {
		index = mod(index, tools.length);

		const newTool = tools[index];
		const newToolDom = toolDoms[index];

		if (newTool === currentTool) {
			return;
		}

		if (currentTool) {
			currentTool.handleDeselected();
		}
		if (currentToolDom) {
			currentToolDom.classList.remove('selected');
		}

		currentTool = newTool;
		currentToolDom = newToolDom;

		currentTool.handleSelected();
		newToolDom.classList.add('selected');

		HELP_CONTROLLER.updateHelp(currentTool.helpDescription);
	},

	/**
	 * @param {ToolbarButton} button
	 * @param {Mousepress} mousepress
	 */
	executeButton(button, mousepress) {
		button.click(mousepress);
	},

	executeButtonByIndex(index, mousepress) {
		index = mod(index, buttons.length);

		const button = buttons[index];
		this.executeButton(button, mousepress);
	},

	handle: {
		selected: createDefaultToolHandler('handleSelected'),
		deselected: createDefaultToolHandler('handleDeselected'),
		keyDown: createDefaultToolHandler('handleKeyDown'),
		keyUp: createDefaultToolHandler('handleKeyUp'),
		mouseDown: createDefaultToolHandler('handleMouseDown'),
		mouseUp: createDefaultToolHandler('handleMouseUp'),
		arrowKeyPressed: createDefaultToolHandler('handleArrowKeyPressed', (_, delta) => CURSOR_CONTROLLER.moveCursorBy(delta.x, delta.y)),
		cursorMoved: createDefaultToolHandler('handleCursorMoved'),
		cursorRepositioned: createDefaultToolHandler('handleCursorRepositioned'),
		mouseCursorRepositioned: createDefaultToolHandler('handleMouseCursorRepositioned'),
	}
}

function createDefaultToolHandler(method, defaultCallback) {
	return function(...args) {
		if (typeof currentTool[method] === 'function') {
			currentTool[method](...args);
		} else if(defaultCallback) {
			defaultCallback(...args);
		}
	}
}

/**
 * @param {Tool} tool
 */
function addMissingMethods(tool) {
	for (const method of ToolMethods) {
		if (typeof tool[method] === 'undefined') {
			tool[method] = function () { };
		}
	}
}

function validateTool(tool) {
	if (!tool.tooltip) {
		console.error(tool);
		throw new Error("Tool is missing `tooltip`");
	}
	if (!tool.iconDetails) {
		console.error(tool);
		throw new Error("Tool is missing `iconDetails`");
	}
	if (!tool.helpDescription) {
		console.error(tool);
		throw new Error("Tool is missing `helpDescription`");
	}
}

function validateButton(button) {
	if (!button.tooltip) {
		console.error(button);
		throw new Error("Button is missing `tooltip`");
	}
	if (!button.iconDetails) {
		console.error(button);
		throw new Error("Button is missing `iconDetails`");
	}
}

function addSeparator() {
	document.querySelector('#toolbar').appendChild(createElement('hr'));
}

function createToolDom(tool) {
	const { iconDetails, tooltip } = tool;
	const icon = createElement('i', iconDetails.class);
	if (typeof iconDetails.marginLeft !== 'undefined') {
		icon.style.marginLeft = `${iconDetails.marginLeft}px`;
	}
	if (typeof iconDetails.marginTop !== 'undefined') {
		icon.style.marginTop = `${iconDetails.marginTop}px`;
	}

	const toolDomIcon = createElement('span', { children: [icon] });

	toolDomIcon.addEventListener('click', event => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const index = toolDoms.indexOf(event.currentTarget);

		if (index !== -1) {
			TOOLS_CONTROLLER.selectToolByIndex(index);
		}
	});

	toolDomIcon.addEventListener('mouseover', () => TOOLTIP_CONTROLLER.hookTo(toolDomIcon, tooltip))

	document.querySelector('#toolbar').appendChild(toolDomIcon);

	return toolDomIcon;
}

function createButtonDom(button) {
	const { iconDetails, tooltip } = button;
	const icon = createElement('i', iconDetails.class);
	if (typeof iconDetails.marginLeft !== 'undefined') {
		icon.style.marginLeft = `${iconDetails.marginLeft}px`;
	}
	if (typeof iconDetails.marginTop !== 'undefined') {
		icon.style.marginTop = `${iconDetails.marginTop}px`;
	}

	const buttonDomIcon = createElement('span', { children: [icon] });

	buttonDomIcon.addEventListener('click', event => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const index = buttonDoms.indexOf(event.currentTarget);

		if (index !== -1) {
			TOOLS_CONTROLLER.executeButtonByIndex(index, describeMousepress(event));
		}
	});

	buttonDomIcon.addEventListener('mouseover', () => TOOLTIP_CONTROLLER.hookTo(buttonDomIcon, tooltip))

	document.querySelector('#toolbar').appendChild(buttonDomIcon);

	return buttonDomIcon;
}

export default TOOLS_CONTROLLER;