
/**
 * @typedef {Object} Point
 * @property {integer} x
 * @property {integer} y
 */

/**
 * @typedef {Object} Keypress
 * @property {string} summary
 * @property {string} key
 * @property {boolean} isCtrl
 * @property {boolean} isAlt
 * @property {boolean} isShift
 */

/**
 * @typedef {Object} Mousepress
 * @property {string} summary
 * @property {integer} button
 * @property {boolean} isCtrl
 * @property {boolean} isAlt
 * @property {boolean} isShift
 */

/**
 * @typedef {Object} MapTileText
 * @property {string} c Text contents
 */

/**
 * @typedef {Object} MapTileIcon
 * @property {integer} i Icon index
 */

/**
 * @typedef {Object} MapTile
 * @property {integer} t
 * @property {MapTileText} [text]
 * @property {MapTileIcon} [icon]
 */

/**
 * @typedef {MapTile[][]} MapGrid
 */

/**
 * @typedef {Object} MapSnapshot
 * @property {integer} width
 * @property {integer} height
 * @property {MapGrid} map
 */

/**
 * @typedef {Object} ToolbarIconDetails
 * @property {string} class
 * @property {integer} [marginTop]
 * @property {integer} [marginLeft]
 */


/**
 * @callback ToolCallbackEmpty
 */

/**
 * @callback ToolCallbackKeyInteraction
 * @param {Keypress} key
 * @param {ToolCallbackEmpty} preventDefault
 */

/**
 * @callback ToolCallbackMouseInteraction
 * @param {Mousepress} button
 * @param {ToolCallbackEmpty} preventDefault
 */

/**
 * @callback ToolCallbackCursorDelta
 * @param {Point} delta
 * @param {Point} from
 * @param {Point} to
 */
/**
 * @callback ToolCallbackArrowKeys
 * @param {Keypress} keypress
 * @param {Point} delta
 */

/**
 * @callback ToolCallbackCursor
 * @param {Point} from
 * @param {Point} to
 */

/**
 * @typedef {Object} Tool
 * @property {string} tooltip
 * @property {ToolbarIconDetails} iconDetails
 * @property {ToolCallbackEmpty} init
 * @property {ToolCallbackEmpty} handleSelected
 * @property {ToolCallbackEmpty} handleDeselected
 * @property {ToolCallbackKeyInteraction} handleKeyDown
 * @property {ToolCallbackKeyInteraction} handleKeyUp
 * @property {ToolCallbackMouseInteraction} handleMouseDown
 * @property {ToolCallbackMouseInteraction} handleMouseUp
 * @property {ToolCallbackArrowKeys} handleArrowKeyPressed
 * @property {ToolCallbackCursorDelta} handleCursorMoved
 * @property {ToolCallbackCursor} handleCursorRepositioned
 * @property {ToolCallbackCursor} handleMouseCursorRepositioned
 */

/**
 * @callback ToolbarButtonExecute
 * @param {Mousepress} mousepress
 */

/**
 * @typedef {Object} ToolbarButton
 * @property {string} tooltip
 * @property {ToolbarIconDetails} iconDetails
 * @property {ToolbarButtonExecute} click
 */