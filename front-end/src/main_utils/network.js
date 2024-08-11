const { exec } = require("./processes");

/**
 * Lists the available interfaces.
 */
async function listIPv4Interfaces() {
    // Run the process.
    const {stdout, stderr, result} = await exec("dragonshark-network-list-ipv4-interfaces");

    // Get the code.
    const code = result?.code;
    if (code) {
        return {code, interfaces: stdout.trim().split("\n").map(e => {
            // TODO actually split/parse everything for each line.
            return e.trim();
        })}
    }
}

module.exports = {
    listIPv4Interfaces
}