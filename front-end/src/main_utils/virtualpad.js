const { exec, escapeShellArg } = require("./processes");

async function startServer() {
    // TODO
}

async function stopServer() {
    // TODO
}

async function checkServer() {
    // TODO
}

async function clearPad(pad) {
    // TODO (pad is a number or "all")
}

async function status() {
    // TODO
}

const _pads = [
    0, 1, 2, 3, 4, 5, 6, 7, "0", "1", "2", "3", "4", "5", "6", "7"
]

async function resetPasswords(pads) {
    pads ||= [];
    if (pads === "all") pads = [0, 1, 2, 3, 4, 5, 6, 7];
    pads = pads.filter(e => _pads.findIndex(pe => pe === e) >= 0);
    if (pads.length === 0) return {code: 0};

    pads = pads.join(" ");
    // TODO
}

module.exports = {
    startServer, stopServer, checkServer, clearPad, status, resetPasswords
};