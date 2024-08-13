const { exec, escapeShellArg } = require("./processes");

/**
 * Lists the available IPv4 interfaces.
 * @returns {Promise<{interfaces: (Array[]), code: number}>} The list of [address, type, wireless?] triples (async function).
 */
async function listIPv4Interfaces() {
    // Run the process.
    const {stdout, result} = await exec("dragonshark-network-list-ipv4-interfaces");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, interfaces: code ? [] : stdout.trim().split("\n").map(e => {
        const [address, type, wireless] = e.trim().split(",");
        return [address, type, wireless === "yes"];
    }).filter(e => e[1] !== "unknown")};
}

/**
 * Lists the available wireless network interfaces.
 * @returns {Promise<{interfaces: (string[]), code: number}>} The list of wireless network interface names.
 */
async function listWLANInterfaces() {
    // Run the process.
    const {stdout, result} = await exec("dragonshark-network-list-wlan-interfaces");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, interfaces: code ? [] : stdout.trim().split("\n")};
}

/**
 * Lists the available wireless networks.
 * @returns {Promise<{interfaces: (Array[]), code: number}>} The list of [active, ssid, signal] triples (async function).
 */
async function listWirelessNetworks() {
    // Run the process.
    const {stdout, result} = await exec("dragonshark-network-list-wireless-networks");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, interfaces: code ? [] : stdout.trim().split("\n").map(e => {
        const [active, ssid, signal] = e.split(":");
        return [active === "*", ssid, parseInt(signal)];
    }).filter(e => e[1])};
}

/**
 * Attempts a connection to a wireless network.
 * @param ssid The SSID of the network.
 * @param password The password to use.
 * @param interfaceName The name of the wireless interface to use.
 * @returns {Promise<{code: number, stderr: string, stdout: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function connectToNetwork(ssid, password, interfaceName) {
    // Create the command.
    const command = `dragonshark-network-connect ${escapeShellArg(ssid)} ${escapeShellArg(password)} ${escapeShellArg(interfaceName)}`;

    // Run the process.
    const {stdout, stderr, result} = await exec(command);

    // Get the code.
    const code = result?.code || 0;

    // Get the result.
    return {code, stdout, stderr};
}

/**
 * Attempts a disconnection from a wireless network.
 * @param interfaceName The name of the wireless interface to disconnect.
 * @returns {Promise<{code: number, stderr: string, stdout: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function disconnectFromNetwork(interfaceName) {
    // Create the command.
    const command = `dragonshark-network-disconnect ${escapeShellArg(interfaceName)}`;

    // Run the process.
    const {stdout, stderr, result} = await exec(command);

    // Get the code.
    const code = result?.code || 0;

    // Get the result.
    return {code, stdout, stderr};
}

module.exports = {
    listIPv4Interfaces, listWLANInterfaces, listWirelessNetworks, connectToNetwork, disconnectFromNetwork
}