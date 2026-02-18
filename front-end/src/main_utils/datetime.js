const {exec, escapeShellArg, getLines} = require("./processes");

/**
 * Lists the known timezones.
 * @returns {Promise<{code: number, timezones: string[]}>} The list of timezones (async function).
 */
async function listTimezones() {
    // Run the process.
    const {stdout, result} = await exec("timedatectl list-timezones --no-pager");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, timezones: code ? [] : getLines(stdout)};
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

/**
 * Activates or deactivates the NTP service.
 * @param active Whether to activate the NTP or not.
 * @returns {Promise<{code: (*|number), stdout: *, stderr: *}>} The {code, stdout, stderr} with the result of the operation (async function).
 */
async function setNTPActive(active) {
    // Create the command.
    const command = `timedatectl set-ntp ${escapeShellArg(active.toString())}`;

    // Run the process.
    const {stdout, stderr, result} = await exec(command);

    // Get the code.
    const code = result?.code || 0;

    // Get the result.
    return {code, stdout, stderr};
}

/**
 * Gets the whole time data.
 * @returns {Promise<{code: (*|number), data: (null|{canNTP: boolean, ntpSynchronized: boolean, timezone: *, ntp: boolean, time: (*|string), localRTC: boolean, rtcTime: (*|string)})}>} The data (async function).
 */
async function getTimeData() {
    // Run the process.
    const {stdout, result} = await exec("timedatectl show");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, data: code ? null : (() => {
        const lines = getLines(stdout);
        const obj_ = {};
        lines.forEach((l) => {
            const [key, value] = l.trim().split("=");
            obj_[key] = value;
        });
        return {
            timezone: obj_.Timezone,
            localRTC: obj_.LocalRTC === "yes",
            canNTP: obj_.CanNTP === "yes",
            ntp: obj_.NTP === "yes",
            ntpSynchronized: obj_.NTPSynchronized === "yes",
            time: obj_.TimeUSec || "unknown",
            rtcTime: obj_.RTCTimeUSec || "unknown"
        };
    })()};
}

module.exports = {
    listTimezones, setTimezone, setNTPActive, getTimeData
}