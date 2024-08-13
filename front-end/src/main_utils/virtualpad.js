const { exec, escapeShellArg } = require("./processes");

/**
 * Parses a JSON value. On error, returns {type: "error", dump: value, hint: "unknown"}.
 * @param value The value to parse.
 * @returns {any} The parsed value.
 */
function jsonParse(value) {
    try {
        return JSON.parse(value);
    } catch {
        return {status: "error", hint: "unknown", dump: value}
    }
}

/**
 * Starts the VirtualPad server. Possible successful values in the `details`:
 * - {"type": "response", "code": "server:ok", "status": [
 *     ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""],
 *     ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""]
 * ]}
 * - {"type": "response", "code": "server:already-running"}
 * @returns {Promise<{details: ({satus: string, hint: string, dump: *}|*), code: number}>}
 * The success/error result (async function).
 */
async function startServer() {
    // Run the process.
    const {stdout, stderr, result} = await exec("virtualpad-admin server start");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, details: code ? {satus: "error", hint: "unknown", dump: stderr} : jsonParse(stdout)};
}

/**
 * Stops the VirtualPad server. Possible successful values in the `details`:
 * - {"type": "response", "code": "server:ok"}
 * - {"type": "response", "code": "server:not-running"}
 * @returns {Promise<{details: ({satus: string, hint: string, dump: *}|*), code: number}>}
 * The success/error result (async function).
 */
async function stopServer() {
    // Run the process.
    const {stdout, stderr, result} = await exec("virtualpad-admin server stop");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, details: code ? {satus: "error", hint: "unknown", dump: stderr} : jsonParse(stdout)};
}

/**
 * Checks the VirtualPad server. Possible successful values in the `details`:
 * - {"type": "response", "code": "server:is-running", "value": boolean})
 * @returns {Promise<{interfaces: ({satus: string, hint: string, dump: *}|*), code: number}>}
 */
async function checkServer() {
    // Run the process.
    const {stdout, stderr, result} = await exec("virtualpad-admin server check");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, details: code ? {satus: "error", hint: "unknown", dump: stderr} : jsonParse(stdout)};
}

async function clearPad(pad) {
    // TODO (pad is a number or "all")
    // Index (clear):
    //   {"type": "response", "code": "pad:ok", "index": pad}
    //   {"type": "response", "code": "pad:invalid-index", "index": pad}
    // 'all' (clear-all):
    //   {"type": "response", "code": "pad:ok"}
}

/**
 * Gets the VirtualPad pads status. Possible successful values in the `details`:
 * - {"type": "response", "code": "pad:status", "value": {
 *       "pads": [
 *           ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""],
 *           ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""]
 *       ],
 *       "passwords": ["xyku", "xoap", "lwdq", "lbjz", "uxvn", "rpjf", "uklm", "vyfa"]
 *   }}
 * @returns {Promise<{details: ({satus: string, hint: string, dump: *}|*), code: number}>}
 */
async function status() {
    // Run the process.
    const {stdout, stderr, result} = await exec("virtualpad-admin pad status");

    // Get the code.
    const code = result?.code || 0;

    // Parse the results.
    return {code, details: code ? {satus: "error", hint: "unknown", dump: stderr} : jsonParse(stdout)};
}

const _pads = new Set([
    0, 1, 2, 3, 4, 5, 6, 7, "0", "1", "2", "3", "4", "5", "6", "7"
]);

async function resetPasswords(pads) {
    pads ||= [];
    if (pads === "all") pads = [0, 1, 2, 3, 4, 5, 6, 7];
    pads = pads.filter(e => _pads.has(e));
    if (pads.length === 0) return {code: 0};

    pads = pads.join(" ");
    // TODO
    // {"type": "response", "code": "ok", "value": {"passwords": ["xyku", "bxyw", "lwdq", "lbjz", "uxvn", "rpjf", "uklm", "vyfa"]}}
}

module.exports = {
    startServer, stopServer, checkServer, clearPad, status, resetPasswords
};