const {exec, escapeShellArg} = require("./processes");

/**
 * Gets the master volume.
 * @returns {Promise<void>} The master volume (async function).
 */
async function getVolume() {
    // Run the process.
    const {stdout, stderr, result} = await exec(`dragonshark-sound-get-volume`);
    const output = (stdout || "").trim();

    // Get the code.
    const code = result?.code || 0;

    if (code) {
        return {
            code, status: "error", hint: "unknown", dump: stderr
        }
    } else {
        return {
            code: 0, volume: parseInt(output.trim())
        }
    }
}

/**
 * Sets the master volume.
 * @param volume The volume (integer between 0 and 100).
 * @returns {Promise<void>} Nothing (async function).
 */
async function setVolume(volume) {
    const {stdout, stderr, result} = await exec(`dragonshark-sound-set-volume ${escapeShellArg(volume.toString())}`);
    const output = (stdout || "").trim();

    // Get the code.
    const code = result?.code || 0;

    if (code) {
        return {
            code, status: "error", hint: "unknown", dump: stderr
        }
    } else {
        return {
            code: 0
        }
    }
}

module.exports = {
    getVolume, setVolume
}