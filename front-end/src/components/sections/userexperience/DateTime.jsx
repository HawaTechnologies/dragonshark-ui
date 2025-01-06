import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {getDiscreteAxisStates, useGamepad} from "../../hooks/gamepad";

const datetime = window.dragonSharkAPI.datetime;

/**
 * Updates the relevant properties of this date/time interface.
 * @param timezone The timezone.
 * @param ntp Whether to use NTP or not.
 * @returns {Promise<void>} Nothing (async function).
 */
async function updateAll({timezone, ntp}) {
    await datetime.setTimezone(timezone);
    await datetime.setNTPActive(ntp);
}

/**
 * The User Experience > Date & Time section.
 * @constructor
 */
export default function DateTime() {
    // Controls:
    // - left / right to manage timezone
    // - A/BDown to update all
    // - X/BRight to refresh time data
    // - Y/BLeft to manage NTP setting
    const {joystick: [leftRightAxis, _], buttonA, buttonX, buttonB} = useGamepad();
    const {left: leftPressed, right: rightPressed} = getDiscreteAxisStates(leftRightAxis);
    const refLeft = useRef(() => {});
    const refRight = useRef(() => {});
    const refUpdateAll = useRef(() => {});
    const refRefreshAll = useRef(() => {});
    const refNTP = useRef(() => {});
    // This data is fetched every 0 seconds.
    const [timezones, setTimezones] = useState([]);
    const [timeData, setTimeData] = useState(null);
    // Fake hook for the timezone.
    const timezone = timeData.timezone;
    const setTimezone = useCallback(function() {
        setTimeData({...timeData, timezone});
    }, [timeData, setTimeData]);
    // Fake hook for the NTP property.
    const ntp = timeData.ntp;
    const setNTP = useCallback(function() {
        setTimeData({...timeData, ntp});
    }, [timeData, setTimeData]);
    // Fake read-only properties.
    const { time, canNTP, ntpSynchronized } = timeData;

    // A small function I'll use always as a regular function.
    // Why? Because the array of timezones will always change
    // and the timeData will always be a new object.
    async function refreshAll() {
        // Update the available timezones.
        const {code, timezones} = await datetime.listTimezones();
        if (code === 0) setTimezones(timezones);

        // Update the timeData ONLY ONCE.
        if (timeData === null) {
            const newTimeData = await datetime.getTimeData();
            setTimeData(newTimeData);
        }
    }

    // Launch the refreshAll function every 10s, and also at start.
    useEffect(() => {
        const interval = setInterval(refreshAll, 10000);
        const _ = refreshAll();
        return () => clearInterval(interval);
    }, []);

    return <BaseActivitySection caption="Date & Time" backPath="/user-experience">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            This section is not ready yet.
        </div>
    </BaseActivitySection>;
}