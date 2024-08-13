const network = require("./network");
const games = require("./games");
const datetime = require("./datetime");
const virtualpad = require("./virtualpad");


module.exports = {
    ...network,
    ...games,
    ...datetime,
    virtualpad
}