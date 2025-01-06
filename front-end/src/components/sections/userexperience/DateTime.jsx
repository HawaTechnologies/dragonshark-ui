import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../hooks/gamepad.js";

const datetime = window.dragonSharkAPI.datetime;

/**
 * Updates the relevant properties of this date/time interface.
 * @param timezone The timezone.
 * @param canNTP Whether it can do NTP or not.
 * @param ntp Whether to use NTP or not.
 * @returns {Promise<void>} Nothing (async function).
 */
async function updateAll({timezone, canNTP, ntp}) {
    if (timezone) await datetime.setTimezone(timezone);
    if (canNTP) await datetime.setNTPActive(ntp);
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
    const timezone = timeData?.timezone;
    const setTimezone = useCallback(function(timezone) {
        setTimeData({...timeData, timezone});
    }, [timeData, setTimeData]);
    // Fake hook for the NTP property.
    const ntp = timeData?.ntp;
    const toggleNTP = useCallback(function() {
        setTimeData({...timeData, ntp: !ntp});
    }, [timeData, setTimeData]);
    // Fake read-only properties.
    const { time, canNTP, ntpSynchronized } = timeData || {};

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

    refLeft.current = function () {
        const index = timezones.indexOf(timezone);
        if (index < 0) {
            setTimezone(timezones[0]);
        } else if (index === 0) {
            setTimezone(timezones[timezones.length - 1]);
        } else {
            setTimezone(timezones[index - 1]);
        }
    }
    refRight.current = function () {
        const index = timezones.indexOf(timezone);
        if (index < 0) {
            setTimezone(timezones[0]);
        } else if (index === timezones.length - 1) {
            setTimezone(timezones[0]);
        } else {
            setTimezone(timezones[index - 1]);
        }
    }
    refNTP.current = function () {
        toggleNTP();
    }
    refRefreshAll.current = function () {
        const _ = refreshAll();
    }
    refUpdateAll.current = function () {
        const _ = updateAll({timezone, canNTP, ntp});
    }

    usePressEffect(timezones.length !== 0 && timeData && leftPressed, 500, refLeft);
    usePressEffect(timezones.length !== 0 && timeData && rightPressed, 500, refRight);
    usePressEffect(timeData && buttonA, 500, refUpdateAll);
    usePressEffect(timeData && buttonB, 500, refRefreshAll);
    usePressEffect(timeData && buttonX, 500, refNTP);

    return <BaseActivitySection caption="Date & Time" backPath="/user-experience">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            This section is not ready yet.
        </div>
    </BaseActivitySection>;
}