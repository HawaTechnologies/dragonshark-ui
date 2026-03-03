const {exec, escapeShellArg, getLines} = require("./processes");

/**
 * Lists the available joysticks (be them considered from
 * bluetooth or another type of connection). Each joystick
 * name in the result comes from /dev/input/js{x} pattern.
 * @returns {Promise<{code: number, data: null | string[]}>} The list of joystick names (async function).
 */
async function listAvailableJoysticks() {
    // Run the process.
    const {stdout, result} = await exec("dragonshark-input-list-joysticks");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, data: code ? null : getLines(stdout)}
}

/**
 * Given a joystick name (js{x}), gets a button pressed from
 * it. The result is a number. If no button is pressed after
 * the timeout (by default: 6 seconds), then -1 is returned.
 * @param joystick The joystick name, like js0.
 * @param timeout The timeout, in seconds.
 * @returns {Promise<{code: number, data: null | number}>} The button code (async function).
 */
async function getJoystickButton(joystick, timeout) {
    // Adjust the parameters.
    timeout = Math.max(1, timeout);

    // Run the process.
    const {stdout, result} = await exec(`dragonshark-input-get-joystick-button ${escapeShellArg(joystick)} ${escapeShellArg(String(timeout))}`);

    // Get the code.
    const code = result?.code || 0;

    // Return the number.
    return {code, data: code ? null : parseInt(stdout.trim())};
}

/**
 * Gets joystick hotkey button mappings.
 * The output order is:
 * [hotkeyButton, loadStateButton, saveStateButton, saveSlotIncreaseButton, saveSlotDecreaseButton, exitEmulatorButton]
 * @returns {Promise<{code: number, data: null | number[]}>} The six mapped button values.
 */
async function hotkeysGet() {
    // Run the process.
    const {stdout, result} = await exec("dragonshark-input-hotkeys-get");

    // Get the code.
    let code = result?.code || 0;

    // Parse the values from "$a $b $c $d $e $f".
    const values = (stdout || "").trim().split(/\s+/).filter(Boolean).map((value) => {
        const parsed = parseInt(value, 10);
        return Number.isInteger(parsed) ? parsed : null;
    });
    const data = values.length === 6 && values.every((e) => Number.isInteger(e) || Number.isNaN(e) || e === null) ? values : null;
    if (!data && code === 0) code = 1;

    return {code, data};
}

/**
 * Sets joystick hotkey button mappings.
 * Arguments are in this order:
 * (hotkeyButton, loadStateButton, saveStateButton, saveSlotIncreaseButton, saveSlotDecreaseButton, exitEmulatorButton)
 * @param hotkeyButton The hotkey button.
 * @param loadStateButton The button to load a state.
 * @param saveStateButton The button to save a state.
 * @param saveSlotIncreaseButton The button to increase the current save slot.
 * @param saveSlotDecreaseButton The button to decrease the current save slot.
 * @param exitEmulatorButton The button to close the emulator.
 * @returns {Promise<{code: number, data: null | number[]}>}
 */
async function hotkeysSet(hotkeyButton, loadStateButton, saveStateButton, saveSlotIncreaseButton, saveSlotDecreaseButton, exitEmulatorButton) {
    // Run the process.
    const {result} = await exec(
        `dragonshark-input-hotkeys-set ${escapeShellArg(String(hotkeyButton))} ${escapeShellArg(String(loadStateButton))} ` +
        `${escapeShellArg(String(saveStateButton))} ${escapeShellArg(String(saveSlotIncreaseButton))} ` +
        `${escapeShellArg(String(saveSlotDecreaseButton))} ${escapeShellArg(String(exitEmulatorButton))}`
    );

    // Get the code.
    const code = result?.code || 0;

    // Return the normalized values as the operation payload.
    return {code, data: code ? null : [hotkeyButton, loadStateButton, saveStateButton, saveSlotIncreaseButton, saveSlotDecreaseButton, exitEmulatorButton]};
}

module.exports = {
    getJoystickButton, listAvailableJoysticks, hotkeysGet, hotkeysSet
}
