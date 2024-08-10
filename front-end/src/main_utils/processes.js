const util = require('node:util');
const { exec: exec_ } = require('node:child_process');

/**
 * Executes a child process.
 * @param command The command to execute.
 * @returns {Promise<{stdout, stderr, result}>} The process result (async function).
 */
function exec(command) {
    return new Promise((resolve, reject) => {
        try {
            exec_(command, (error, stdout, stderr) => {
                resolve({stdout, stderr, result: error});
            });
        } catch(e) {
            reject(e);
        }
    })
}