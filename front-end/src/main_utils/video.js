const {exec, escapeShellArg, getLines} = require("./processes");

/**
 * Parses the resolution list command output.
 * @param output The command output.
 * @returns {{list: string[], selected: string}} The parsed resolutions.
 */
function parseResolutions(output) {
    const resolutions = getLines(output)
        .map((line) => line.trim())
        .filter(Boolean);

    const selected = resolutions.find((resolution) => resolution.endsWith("*"));
    return {
        list: resolutions.map((resolution) => resolution.replace(/\*$/, "")),
        selected: selected ? selected.replace(/\*$/, "") : ""
    };
}

/**
 * Lists all available video resolutions.
 * @returns {Promise<{code: number, list: string[], selected: string, stderr?: string}>} The available resolutions.
 */
async function listResolutions() {
    const {stdout, stderr, result} = await exec("dragonshark-video-list-resolutions");
    const code = result?.code || 0;

    if (code) {
        return {code, list: [], selected: "", stderr};
    }

    return {code, ...parseResolutions(stdout)};
}

/**
 * Selects the closest available video resolution.
 * @param width The desired width.
 * @param height The desired height.
 * @returns {Promise<{code: number, stderr: string, stdout: string}>} The command result.
 */
async function selectResolution(width, height) {
    width = Number(width);
    height = Number(height);

    if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
        return {code: 1, stdout: "", stderr: "Width and height must be positive integers."};
    }

    const command = `dragonshark-video-pick-closest-resolution ${escapeShellArg(width.toString())} ${escapeShellArg(height.toString())}`;
    const {stdout, stderr, result} = await exec(command);
    const code = result?.code || 0;

    return {code, stdout, stderr: stderr ? "An error occurred while setting the resolution" : ""};
}

module.exports = {
    listResolutions, selectResolution
}
