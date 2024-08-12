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

    // Return the results.
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

    // Return the results.
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

    // Return the results.
    return {code, stdout, stderr};
}

/**
 * Executes a DragonShark game. Possible results are:
 * 1. {code != 0, status: "error", hint: "unknown", dump: stderr}
 * 2. {code: 0, status: "error", hint: "request:format"}
 * 3. {code: 0, status: "error", hint: "directory:invalid"}
 * 4. {code: 0, status: "error", hint: "command:invalid"}
 * 5. {code: 0, status: "error", hint: "command:invalid-format"}
 * 6. {code: 0, status: "error", hint: "command:game-already-running"}
 * 7. {code: 0, status: "error", hint: "unknown", "type": "SomeException", "traceback": "..."}
 * 8. {code: 0, status: "ok", hint: "command:success"}
 * @param manifest The path to the game's XML manifest.
 * @returns {Promise<{code: number, hint: string, status: string, type?: string, traceback?: string}>}
 * The execution result (async function).
 */
async function launchGame(manifest) {
    // Run the process.
    const {stdout, stderr, result} = await exec(`launch-game ${escapeShellArg(manifest)}`);
    const output = stdout.trim();

    // Get the code.
    const code = result?.code || 0;

    let jsonResult = null;
    if (code) {
        return {
            code, status: "error", hint: "unknown", dump: stderr
        }
    } else {
        // Known error dumps:
        // {"status": "error", "hint": "request:format"}
        // {"status": "error", "hint": "directory:invalid"}
        // {"status": "error", "hint": "command:invalid"}
        // {"status": "error", "hint": "command:invalid-format"}
        // {"status": "error", "hint": "command:game-already-running"}
        // {"status": "error", "hint": "unknown", "type": type(e).__name__, "traceback": traceback.format_exc()}
        return {
            code, ...(output ? JSON.parse(output) : {status: "ok", hint: "command:success"})
        }
    }
}

module.exports = {
    listExternalDeviceDirs, setRomsDir, getRomsDir, setupSavesDirs, backupSavesDirs, restoreSavesDirs, launchGame
}