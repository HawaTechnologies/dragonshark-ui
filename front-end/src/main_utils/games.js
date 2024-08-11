const { exec } = require("./processes");

/**
 * Lists the available external devices' directories.
 * @returns {Promise<{dirs: (string[]), code: number}>} The list of directories (async function).
 */
async function listExternalDeviceDirs() {
    // Run the process.
    const {stdout, result} = await exec("dragonshark-games-enumerate-external-device-dirs");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, dirs: code ? [] : stdout.trim().split("\n")};
}

module.exports = {
    listExternalDeviceDirs
}