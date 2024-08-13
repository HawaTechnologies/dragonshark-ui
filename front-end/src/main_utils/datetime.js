const {exec, escapeShellArg} = require("./processes");

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

/**
 * Sets the new timezone.
 * @param tz The new timezone.
 * @returns {Promise<{code: number, stderr: string, stdout: string}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function setTimezone(tz) {
    // Create the command.
    const command = `timedatectl set-timezone ${escapeShellArg(tz)}`;

    // Run the process.
    const {stdout, stderr, result} = await exec(command);

    // Get the code.
    const code = result?.code || 0;

    // Get the result.
    return {code, stdout, stderr};
}

module.exports = {
    listTimezones, setTimezone
}