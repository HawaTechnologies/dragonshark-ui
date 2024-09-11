import {useNavigate} from "react-router-dom";
import {network} from "../../../../main_utils";
import {useEffect, useMemo, useRef, useState} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../../hooks/gamepad";
import * as React from "react";

/**
 * Invokes the network interfaces' listing and properly
 * updates the state on each stage. This function is
 * means to be invoked in an effect.
 * @param setInterfaceFetchData The state callback to invoke, packed in a ref-like object.
 * @returns {Promise<void>} Nothing (async function).
 */
async function listInterfaces({current: setInterfaceFetchData}) {
    setInterfaceFetchData({status: "fetching"});
    try {
        const {code, interfaces, stderr} = await network.listWLANInterfaces();
        if (code) {
            setInterfaceFetchData({status: "error", stderr});
        } else if (interfaces.length) {
            setInterfaceFetchData({status: "success", interfaces});
        } else {
            setInterfaceFetchData({status: "empty"});
        }
    } catch(e) {
        setInterfaceFetchData({status: "error", stderr: e.toString()});
    }
}

/**
 * This component is meant to choose a wireless interface. The rule
 * will be like this:
 * 1. If no wireless interfaces are available, then just show a
 *    message that no interfaces are available.
 * 2. If there are interfaces, then the user can select one of
 *    them by toggling with their joysticks's "<" and ">" arrows.
 *    Once onf of these interfaces is selected, then the user
 *    can press the [2] button to continue to the next section
 */
export default function ChooseInterface() {
    // First, let's get the `navigate` function to use in the menu
    // for networking.
    const navigate = useNavigate();

    // Create the data status here. It will be used to manage the list
    // of interface or any related error. The callback is stored in the
    // ref to avoid reactivity / dependency linting for it.
    const [interfaceFetchData, setInterfaceFetchData] = useState({status: "ready"});
    const ref = useRef(async (cb) => {});
    ref.current = setInterfaceFetchData;

    // Also track the selected interface, which is only meaningful for "success".
    const [selectedInterface, setSelectedInterface] = useState(0);

    // Then we also track the end value of the interface being selected,
    // which is also only meaningful for "success".
    const selectedInterfaceName = useMemo(() => {
        if (interfaceFetchData.status !== "success") return "";
        return interfaceFetchData.interfaces[selectedInterface];
    }, [interfaceFetchData, selectedInterface]);

    // Finally, also only meaningful for "success", we have the
    // setup of keys:
    const {joystick: [leftRightAxis, _], buttonY: keyPressed} = useGamepad();
    const {down: leftPressed, up: rightPressed} = getDiscreteAxisStates(leftRightAxis);
    const leftRef = useRef(() => {});
    const rightRef = useRef(() => {});
    const keyRef = useRef(() => {});
    leftRef.current = () => {
        const l = interfaceFetchData.interfaces.length;
        setSelectedInterface(selectedInterface === 0 ? l - 1 : selectedInterface - 1);
    }
    rightRef.current = () => {
        const l = interfaceFetchData.interfaces.length;
        setSelectedInterface(selectedInterface === l - 1 ? 0 : selectedInterface + 1);
    }
    keyRef.current = () => {
        navigate("/interfaces/" + selectedInterfaceName);
    }
    usePressEffect(leftPressed, 500, leftRef);
    usePressEffect(rightPressed, 500, rightRef);
    usePressEffect(keyPressed, 500, keyRef, 1000);

    // This is a state only meaningful for "fetching". Tells how many
    // dots (., .., ...) to show to the "fetching" text to tell that
    // the call is busy but not dead.
    const [fetchingFrame, setFetchingFrame] = useState(0);

    // Launch the refresh for the first time. This first time is always
    // given when this component loads.
    useEffect(() => {
        // Deliberately ignoring the result.
        const _ = listInterfaces(ref);
    }, []);

    // Launch an effect to track status changes.
    useEffect(() => {
        if (interfaceFetchData.status === "fetching") {
            // Set a clock to animate "fetching".
            let frame = 0;
            setFetchingFrame(0);
            const t = setInterval(() => {
                frame = (frame + 1) % 3;
                setFetchingFrame(frame);
            }, 1000);
            return () => clearInterval(t);
        } else if (interfaceFetchData.status === "success") {
            // Reset the interface index.
            setSelectedInterface(0);
        }
        return () => {};
    }, [interfaceFetchData.status]);

    switch(interfaceFetchData.status) {
        case "ready":
            return <div className="text-soft" style={{
                textAlign: "center", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"
            }}>
                Wireless network interfaces will be listed here.
            </div>;
        case "fetching":
            let ellipsis = "";
            for(let idx = 0; idx <= frames; idx++) {
                ellipsis += ".";
            }

            return <div className="text-soft" style={{
                textAlign: "center", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"
            }}>
                Fetching network interfaces{ellipsis}
            </div>;
        case "success":
            // TODO render a handler that attends the </> axis to switch, and BDown (buttonY) to select interface.
            return <></>;
        case "empty":
            return <div className="text-soft" style={{
                textAlign: "center", position: "absolute",
                left: "50%", top: "50%", transform: "translate(-50%, -50%)"
            }}>
                No wireless network interfaces were detected.
            </div>;
        case "error":
            // TODO render an error, with the possibility to press BLeft (not sure which button is) to toggle debug stderr.
            return <></>;
    }
}