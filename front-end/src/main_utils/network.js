const { exec } = require("./processes");

/**
 * Lists the available interfaces.
 */
async function listIPv4Interfaces() {
    // Run the process.
    const {stdout, stderr, result} = await exec("dragonshark-network-list-ipv4-interfaces");

    // Get the code.
    const code = result?.code || null;
    return {code, interfaces: code ? [] : stdout.trim().split("\n").map(e => {
        const [address, type, wireless] = e.trim().split(",");
        return [address, type, wireless === "yes"];
    }).filter(e => e[1] !== "unknown")};
}

module.exports = {
    listIPv4Interfaces
}