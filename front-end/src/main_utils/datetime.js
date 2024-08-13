const {exec} = require("./processes");

/**
 * Lists the known timezones.
 * @returns {Promise<{code: number, timezones: string[]}>} The list of timezones (async functions).
 */
async function listTimezones() {
    // Run the process.
    const {stdout, result} = await exec("timedatectl list-timezones --no-pager");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, timezones: code ? [] : stdout.trim().split("\n")};
}

module.exports = {
    listTimezones
}