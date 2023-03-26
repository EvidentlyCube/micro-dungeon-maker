import BUTTON_CLEAR from "./src/buttons/ButtonClear.js";
import BUTTON_INVERT from "./src/buttons/ButtonInvert.js";
import BUTTON_UNDO from "./src/buttons/ButtonUndo.js";
import CURSOR_CONTROLLER from "./src/controllers/CursorController.js";
import FOCUS_CONTROLLER from "./src/controllers/FocusController.js";
import HELP_CONTROLLER from "./src/controllers/HelpController.js";
import KEYBOARD_CONTROLLER from "./src/controllers/KeyboardController.js";
import MOUSE_CONTROLLER from "./src/controllers/MouseController.js";
import SAVE_CONTROLLER from "./src/controllers/SaveController.js";
import SPLASH_CONTROLLER from "./src/controllers/SplashController.js";
import TOOLS_CONTROLLER from "./src/controllers/ToolsController.js";
import TOOLTIP_CONTROLLER from "./src/controllers/TooltipController.js";
import UPDATE_CONTROLLER from "./src/controllers/UpdateController.js";
import MAP_API from "./src/MapApi.js";
import MAP_RENDERER from "./src/MapRenderer.js";
import TOOL_FILL from "./src/tools/ToolFill.js";
import TOOL_ICONS from "./src/tools/ToolIcons.js";
import TOOL_RESIZE from "./src/tools/ToolResize.js";
import TOOL_SHIFT from "./src/tools/ToolShift.js";
import TOOL_TEXT from "./src/tools/ToolText.js";
import TOOL_TOGGLE_BRUSH from "./src/tools/ToolToggleBrush.js";

setTimeout(init, 50);

function init() {
	MAP_API.resizeMap(
		parseInt(localStorage.getItem('map-width') || 20),
		parseInt(localStorage.getItem('map-height') || 10)
	);
	MAP_RENDERER.recreateMapDom();
	MAP_API.loadMapGrid(SAVE_CONTROLLER.store.map);

	SPLASH_CONTROLLER.init();
	HELP_CONTROLLER.init();
	TOOLTIP_CONTROLLER.init();

	TOOLS_CONTROLLER.init([
		TOOL_TOGGLE_BRUSH,
		TOOL_FILL,
		TOOL_TEXT,
		TOOL_ICONS,
		TOOL_SHIFT,
		TOOL_RESIZE
	], [
		BUTTON_INVERT,
		BUTTON_CLEAR,
		BUTTON_UNDO
	]);

	UPDATE_CONTROLLER.init();
	SAVE_CONTROLLER.init();
	KEYBOARD_CONTROLLER.init();
	MOUSE_CONTROLLER.init();
	FOCUS_CONTROLLER.init();
	CURSOR_CONTROLLER.init();
	MAP_RENDERER.init();
}