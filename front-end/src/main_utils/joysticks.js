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
    const {stdout, result} = await exec(`dragonshark-input-get-joystick-button ${escapeShellArg(joystick)} ${escapeShellArg(timeout)}`);

    // Get the code.
    const code = result?.code || 0;

    // Return the number.
    return {code, data: code ? null : parseInt(stdout.trim())};
}


module.exports = {
    getJoystickButton, listAvailableJoysticks
}
