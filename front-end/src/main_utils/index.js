const network = require("./network");
const games = require("./games");
const virtualpad = require("./virtualpad");


module.exports = {
    ...network,
    ...games,
    ...virtualpad
}