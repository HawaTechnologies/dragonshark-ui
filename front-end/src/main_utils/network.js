const { exec } = require("./processes");

/**
 * Lists the available IPv4 interfaces.
 * @returns {Promise<{interfaces: (Array[]), code: any}>} The list of [address, type, wireless?] triples (async function).
 */
async function listIPv4Interfaces() {
    // Run the process.
    const {stdout, stderr, result} = await exec("dragonshark-network-list-ipv4-interfaces");

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
 * @returns {Promise<{interfaces: (string[]), code: any}>} The list of wireless network interface names.
 */
async function listWLANInterfaces() {
    // Run the process.
    const {stdout, stderr, result} = await exec("dragonshark-network-list-wlan-interfaces");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, interfaces: code ? [] : stdout.trim().split("\n")};
}

module.exports = {
    listIPv4Interfaces, listWLANInterfaces
}