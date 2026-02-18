const { exec, spawn, escapeShellArg, getLines } = require("./processes");
const { readGameManifest } = require("./manifest");
const path = require("node:path");
const fs = require("node:fs");

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
    return {code, dirs: code ? [] : getLines(stdout)};
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
 * Initializes the ROMs directories.
 * @param dir The parent directory.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} The process code and empty output data.
 */
async function setupRomsDirs(dir) {
    // Run the process.
    const {stdout, stderr, result} = await exec(`dragonshark-games-roms-setup ${escapeShellArg(dir)}`);

    // Get the code.
    const code = result?.code || 0;

    // Return the results.
    return {code, stdout, stderr};
}

/**
 * Initializes the save directories.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} The process code and empty output data.
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
 * @param gameDir The directory of the game.
 * @returns {Promise<{code: number, hint: string, status: string, type?: string, traceback?: string}>}
 * The execution result (async function).
 */
async function launchGame(gameDir) {
    // First, get the ROMS directory and external devices.
    // If the directory is not valid, then abort.
    const { code: code1, dir } = await getRomsDir();
    const { code: code2, dirs } = await listExternalDeviceDirs();
    if (code1 !== 0 || code2 !== 0 || !dirs.includes(dir)) {
        return {
            code: code1 || code2,
            status: "error",
            hint: "roms-dir:invalid"
        };
    }

    // Get the full manifest path, run the process, and get the code.
    const manifest = `${dir}/dragonshark/${gameDir}/manifest.xml`;
    const {stdout, stderr, result} = await exec(`launch-game ${escapeShellArg(manifest)}`);
    const output = (stdout || "").trim();
    const code = result?.code || 0;

    // Return the result.
    if (code) {
        return {
            code, status: "error", hint: "unknown", dump: stderr
        }
    } else {
        return {
            code, ...(output ? JSON.parse(output) : {status: "ok", hint: "command:success"})
        }
    }
}

/**
 * Launches emulationstation.
 * @returns {Promise<number>} The process id (async function).
 */
async function launchEmulationStation() {
    const child = spawn(
        'emulationstation', [], { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] }
    );
    child.unref();
    return child.pid;
}

/**
 * Enumerates the available games, with metadata and image.
 * @returns {Promise<*[]>} The list of elements.
 */
async function enumerateGames() {
    // First, get the ROMS directory and external devices.
    // If the directory is not valid, then abort.
    const { code, dir } = await getRomsDir();
    const { code: code2, dirs } = await listExternalDeviceDirs();
    if (code !== 0 || code2 !== 0 || !dirs.includes(dir)) {
        return [];
    }

    // Get the directory that will hold all the games.
    // Then, get the list of subdirectories.
    const dragonsharkSubdir = path.join(dir, "dragonshark");
    let subdirs = fs.readdirSync(dragonsharkSubdir, { withFileTypes: true }).filter(
        dirent => dirent.isDirectory()
    ).map(dirent => dirent.name);

    // Generate the final entries.
    let finalEntries = [];
    for(let subdir of subdirs) {
        // First, assemble the subdir, and check it exists + is a file.
        const manifest = path.join(dragonsharkSubdir, subdir, "manifest.xml");
        if (!fs.existsSync(manifest) || !fs.statSync(manifest).isFile()) {
            continue;
        }

        // Then, open it as XML and extract the data.
        try {
            const obj = await readGameManifest(manifest);
            finalEntries.push(obj);
        } catch(e) {
            console.error("Error loading manifest:", manifest, e);
        }
    }
    return finalEntries;
}

module.exports = {
    listExternalDeviceDirs, setRomsDir, getRomsDir, setupSavesDirs, backupSavesDirs, restoreSavesDirs,
    launchGame, launchEmulationStation, setupRomsDirs, enumerateGames
}