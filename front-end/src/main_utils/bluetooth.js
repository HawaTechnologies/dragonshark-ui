const {exec, escapeShellArg} = require("./processes");

/**
 * Lists the paired devices. Returns a list of {mac, name}
 * devices that are currently paired. These devices are
 * typically trusted as well (if untrusted, they can be
 * made trusted again by unpairing and re-pairing).
 * @returns {Promise<{code: number, data: null | {mac: string, name: string}[]}>} The list of paired devices (async function).
 */
async function listPairedDevices() {
    // Run the process.
    const {stdout, result} = await exec("dragonshark-bluetooth-list-paired-devices");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, data: code ? null : (() => {
        return stdout.trim().split("\n").map(line => {
            const [mac, name] = line.split(/\s+/);
            return {mac, name};
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
        return stdout.trim().split("\n").map(line => {
            const [mac, name] = line.split(/\s+/);
            return {mac, name};
        });
    })()};
}

/**
 * Pairs a device. The chosen device can be a device name
 * or a mac. In the case of a mac, it must be valid. In the
 * case of a device name, exactly an unpaired device entry
 * must exist for that device name.
 * @param device The mac / name of the device to pair.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function pairDevice(device) {
    // Run the process.
    const {stdout, result, stderr} = await exec(`dragonshark-bluetooth-pair-device ${escapeShellArg(device)}`);

    // Get the code.
    const code = result?.code || 0;

    // Forward the results directly.
    return {code, stdout, stderr};
}

/**
 * Unpairs a device. The chosen device can be a device name
 * or a mac. In the case of a mac, it must be valid. In the
 * case of a device name, exactly a paired device entry
 * must exist for that device name.
 * @param device The mac / name of the device to unpair.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function unpairDevice(device) {
    // Run the process.
    const {stdout, result, stderr} = await exec(`dragonshark-bluetooth-unpair-device ${escapeShellArg(device)}`);

    // Get the code.
    const code = result?.code || 0;

    // Forward the results directly.
    return {code, stdout, stderr};
}

module.exports = {
    listPairedDevices, listUnpairedDevices, pairDevice, unpairDevice
}
