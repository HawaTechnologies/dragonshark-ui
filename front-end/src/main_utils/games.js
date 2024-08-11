const { exec, escapeShellArg} = require("./processes");

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

/**
 * Sets the new ROMs dir. It must belong to an external device.
 * @param dir The new directory.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function setRomsDir(dir) {
    // Run the process.
    const {stdout, stderr, result} = await exec(`dragonshark-games-set-roms-dir ${escapeShellArg(dir)}`);

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, stdout, stderr};
}

/**
 * Gets the current ROMs dir.
 * @returns {Promise<{code: number, dir: string} The process code and current directory (async function).
 */
async function getRomsDir() {
    // Run the process.
    const {stdout, result} = await exec("dragonshark-games-get-roms-dir");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, dir: stdout.trim()};
}

/**
 * Initializes the save directories.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>}
 */
async function setupSavesDirs() {
    // Run the process.
    const {stdout, stderr, result} = await exec("dragonshark-games-saves-setup");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, stdout, stderr};
}

module.exports = {
    listExternalDeviceDirs, setRomsDir, getRomsDir, setupSavesDirs
}