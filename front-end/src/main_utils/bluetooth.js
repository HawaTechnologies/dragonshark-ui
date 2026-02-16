const {exec, escapeShellArg} = require("./processes");

/**
 * Lists the paired devices. Returns a list of {mac, name}
 * devices that are currently paired. These devices are
 * typically trusted as well (if untrusted, they can be
 * made trusted again by unpairing and re-pairing).
 * @returns {Promise<{mac: string, name: string}[]>} The list of paired devices.
 */
async function listPairedDevices() {
    // dragonshark-bluetooth-list-paired-devices
}

/**
 * Lists the unpaired devices. Returns a list of {mac, name}
 * devices that are currently unpaired. Scanning for these
 * devices is time-consuming (the time is passed as argument).
 * @param time The time, in seconds. An integer value.
 * @returns {Promise<{mac: string, name: string}[]>} The list of unpaired devices.
 */
async function listUnpairedDevices(time) {
    // dragonshark-bluetooth-list-unpaired-devices <max(3, int(time))>
}

/**
 * Pairs a device. The chosen device can be a device name
 * or a mac. In the case of a mac, it must be valid. In the
 * case of a device name, exactly an unpaired device entry
 * must exist for that device name.
 * @param device
 * @returns {Promise<void>}
 */
async function pairDevice(device) {
    // dragonshark-bluetooth-pair-device <device>
}

async function unpairDevice(device) {
    // dragonshark-bluetooth-unpair-device <device>
}

module.exports = {
    listPairedDevices, listUnpairedDevices, pairDevice, unpairDevice
}
