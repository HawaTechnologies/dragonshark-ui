const { exec: exec_ } = require('node:child_process');

function escapeShellArg(command) {
    return `'${command.replace(/'/g, `'\\''`)}'`;
}

/**
 * Executes a child process.
 * @param command The command to execute.
 * @returns {Promise<{stdout, stderr, result}>} The process result (async function).
 */
function exec(command) {
    return new Promise((resolve, reject) => {
        try {
            const embeddedCommand = `bash -i -c "source ~/.bashrc && ${command}"`;
            exec_(embeddedCommand, (error, stdout, stderr) => {
                resolve({stdout, stderr, result: error});
            });
        } catch(e) {
            reject(e);
        }
    })
}

module.exports = {
    exec, escapeShellArg
}