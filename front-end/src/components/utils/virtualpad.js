const vpAPI = window.dragonSharkAPI.virtualpad;
const nwAPI = window.dragonSharkAPI.network;

async function getVirtualPadServerStatus() {
    // 1. Get whether the server is connected or not.
    const checkServerResult = await vpAPI.checkServer();
    if (checkServerResult.code || !checkServerResult.details
        || checkServerResult.details.type !== "response"
        || checkServerResult.details.code !== 'server:is-running') {
        console.error("Unexpected VirtualPad checkServer result:", checkServerResult);
        return {
            result: 'error'
        };
    }
    const serverConnected = checkServerResult.details.value;
    if (!serverConnected) {
        return {
            result: 'success',
            connected: false
        };
    }

    // 2. Get the network interfaces this server reads. We care about
    //    the addresses belonging to wireless devices.
    const ipv4InterfacesResult = await nwAPI.listIPv4Interfaces();
    if (ipv4InterfacesResult.code) {
        console.error("Unexpected Network listIPv4Interfaces result:", ipv4InterfacesResult);
        return {
            result: 'error'
        };
    }
    const wirelessInterfaces = ipv4InterfacesResult.interfaces.filter((e) => {
        return e[1] === "lan" && e[2];
    }).map(e => e[0]);

    // 3. Get the server's status.
    const statusResult = await vpAPI.status();
    if (statusResult.code || !statusResult.details
        || statusResult.details.type !== "response"
        || statusResult.details.code !== "pad:status") {
        console.error("Unexpected VirtualPad status result:", statusResult);
        return {
            result: 'error'
        };
    }
    const {pads, passwords} = statusResult.details.value;

    // Return everything.
    return {
        result: 'success',
        connected: true,
        wirelessInterfaces,
        pads, passwords
    }
}

module.exports = {
    getVirtualPadServerStatus
}