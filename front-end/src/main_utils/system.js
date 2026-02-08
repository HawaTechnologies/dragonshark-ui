const {exec, escapeShellArg} = require("./processes");

/**
 * Restarts in debug mode.
 * @returns {Promise<{code: number}>} A code. Doesn't matter, actually.
 */
async function restartInDebugMode() {
    const {result} = await exec("touch ~/.run-in-debug-mode && sudo reboot");

    return {
        code: result?.code || 0
    }
}

module.exports = {
    restartInDebugMode
}
