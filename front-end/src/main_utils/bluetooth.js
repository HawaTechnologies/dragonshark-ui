const {exec, escapeShellArg, getLines} = require("./processes");

/**
 * Lists the paired devices. Returns a list of {mac, name}
 * devices that are currently paired. These devices are
 * typically trusted as well (if untrusted, they can be
 * made trusted again by unpairing and re-pairing).
 * @returns {Promise<{code: number, data: null | {mac: string, name: string, connected: boolean}[]}>} The list of paired devices (async function).
 */
async function listPairedDevices() {
    // Run the process.
    const {stdout, result} = await exec("dragonshark-bluetooth-list-paired-devices");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, data: code ? null : (() => {
        return getLines(stdout).map(line => {
            const [mac, name, connected] = line.split(/\s+/);
            return {mac, name, connected: connected.trim().toLowerCase() === "yes"};
        });
    })()};
}

/**
 * Lists the unpaired devices. Returns a list of {mac, name}
 * devices that are currently unpaired. Scanning for these
 * devices is time-consuming (the time is passed as argument).
 * @param time The time, in seconds. An integer value.
 * @returns {Promise<{code: number, data: null | {mac: string, name: string}[]}>} The list of unpaired devices (async function).
 */
async function listUnpairedDevices(time) {
    // Run the process.
    time = Math.max(3, Math.floor(parseFloat(time) || 0));
    const {stdout, result} = await exec(`dragonshark-bluetooth-list-unpaired-devices ${escapeShellArg(time.toString())}`);

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, data: code ? null : (() => {
        return getLines(stdout).map(line => {
            const [mac, name] = line.split(/\s+/);
            return {mac, name};
        });
    })()};
}

/**
 * Pairs a device. The chosen device can be a device name
 * or a mac. In the case of a mac, it must be valid. In the
 * case of a device name, exactly an unpaired device entry
 * must exist for that device name. Resolving the name of
 * the device is time-consuming, if using a name.
 * @param device The mac / name of the device to pair.
 * @param time The time, in seconds. An integer value.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function pairDevice(device, time) {
    time = Math.max(3, Math.floor(parseFloat(time) || 0));

    // Run the process.
    const {stdout, result, stderr} = await exec(`dragonshark-bluetooth-pair-device ${escapeShellArg(device)} ${time}`);

    // Get the code.
    const code = result?.code || 0;

    // Forward the results directly.
    return {code, stdout, stderr};
}

/**
 * Unpairs a device. The chosen device can be a device name
 * or a mac. In the case of a mac, it must be valid. In the
 * case of a device name, exactly a paired device entry
 * must exist for that device name. Resolving the name of
 * the device is time-consuming, if using a name.
 * @param device The mac / name of the device to unpair.
 * @param time The time, in seconds. An integer value.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function unpairDevice(device, time) {
    time = Math.max(3, Math.floor(parseFloat(time) || 0));

    // Run the process.
    const {stdout, result, stderr} = await exec(`dragonshark-bluetooth-unpair-device ${escapeShellArg(device)} ${time}`);

    // Get the code.
    const code = result?.code || 0;

    // Forward the results directly.
    return {code, stdout, stderr};
}

/**
 * Connects a device. The chosen device can be a device name
 * or a mac. In the case of a mac, it must be valid. In the
 * case of a device name, exactly a paired device entry
 * must exist for that device name. Resolving the name of
 * the device is time-consuming, if using a name.
 * @param device The mac / name of the device to connect.
 * @param time The time, in seconds. An integer value.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */

async function connectDevice(device, time) {
    time = Math.max(3, Math.floor(parseFloat(time) || 0));

    // Run the process.
    const {stdout, result, stderr} = await exec(`dragonshark-bluetooth-connect-device ${escapeShellArg(device)} ${time}`);

    // Get the code.
    const code = result?.code || 0;

    // Forward the results directly.
    return {code, stdout, stderr};
}

module.exports = {
    listPairedDevices, listUnpairedDevices, pairDevice, unpairDevice, connectDevice
}
