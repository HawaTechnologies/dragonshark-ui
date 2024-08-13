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

async function startServer() {
    // TODO
    // {"type": "response", "code": "server:ok", "status": [["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""]]}
    // {"type": "response", "code": "server:already-running"}
}

async function stopServer() {
    // TODO
    // {"type": "response", "code": "server:ok"}
    // {"type": "response", "code": "server:not-running"}
}

async function checkServer() {
    // TODO
    // {"type": "response", "code": "server:is-running", "value": true|false})
}

async function clearPad(pad) {
    // TODO (pad is a number or "all")
    // Index (clear):
    //   {"type": "response", "code": "pad:ok", "index": pad}
    //   {"type": "response", "code": "pad:invalid-index", "index": pad}
    // 'all' (clear-all):
    //   {"type": "response", "code": "pad:ok"}
}

async function status() {
    // TODO
    // {"type": "response", "code": "pad:status", "value": {"pads": [["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""], ["empty", ""]], "passwords": ["xyku", "xoap", "lwdq", "lbjz", "uxvn", "rpjf", "uklm", "vyfa"]}}
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