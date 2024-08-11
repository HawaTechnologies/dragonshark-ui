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

/**
 * Makes a backup of the current games' saves.
 * @param dir The directory into which the generated backup.zip file will be stored.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function backupSavesDirs(dir) {
    // Run the process.
    const {stdout, stderr, result} = await exec(`dragonshark-games-saves-backup ${escapeShellArg(dir)}`);

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, stdout, stderr};
}

/**
 * Restores the backup.zip into /mnt/SAVES file from a directory. For this
 * function to be safe, the $USER must belong to the owner group of that
 * directory, and the directory must have g+rw permissions as well, but no
 * other user should be directly allowed to edit (w) that directory.
 * @param dir The directory from which the backup.zip file will be read.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function restoreSavesDirs(dir) {
    // Run the process.
    const {stdout, stderr, result} = await exec(`dragonshark-games-saves-restore ${escapeShellArg(dir)}`);

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, stdout, stderr};
}

module.exports = {
    listExternalDeviceDirs, setRomsDir, getRomsDir, setupSavesDirs, backupSavesDirs, restoreSavesDirs
}