import * as React from 'react';
import {useEffect, useMemo, useState} from "react";
import Panel from "./Panel.jsx";
import {BLeft} from "./icons/RightPanelButton.jsx";

/**
 * Gets the offset in format like "+03:00" or "-04:00".
 * @returns {string} The offset string.
 */
function getOffset(d) {
    const offsetFullMinutes = d.getTimezoneOffset();
    const sign = offsetFullMinutes > 0 ? '-' : '+';
    const offsetHours = String(Math.floor(Math.abs(offsetFullMinutes) / 60)).padStart(2, '0');
    const offsetMinutes = String(Math.abs(offsetFullMinutes) % 60).padStart(2, '0');
    return `${sign}${offsetHours}:${offsetMinutes}`;
}

/**
 * Gets the current date in format Www dd/Mmm/yyyy HH:MM.
 * @returns {string} The date string.
 */
function getDateTime(d) {
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    const day = d.getDate();
    const month = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ][d.getMonth()];
    const year = d.getFullYear();
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${weekDay} ${day}/${month}/${year} ${hh}:${mm}`;
}

/**
 * Gets the current timezone (e.g. UTC).
 * @returns {string} The timezone string.
 */
function getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get the full date parts.
 * @param d The date.
 * @returns {{timezone: string, dateTime: string, offset: string}} The result parts.
 */
function getFullDateParts(d) {
    return {
        timezone: getTimeZone(),
        dateTime: getDateTime(d),
        offset: getOffset(d)
    };
}

/**
 * A small clock component.
 * @param style The extra style to use.
 * @returns {JSX.Element} The click element.
 * @constructor
 */
export default function Clock({ style }) {
    const [dateParts, setDateParts] = useState(getFullDateParts(new Date()));
    const timezone = useMemo(() => dateParts.timezone, [dateParts.timezone]);
    const dateTime = useMemo(() => dateParts.dateTime, [dateParts.dateTime]);
    const offset = useMemo(() => dateParts.offset, [dateParts.offset]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDateParts(getFullDateParts(new Date()));
        }, 100);

        return () => {
            clearInterval(interval);
        }
    })

    return <Panel style={style}>
        <div className={"big text-blue text-right"}>{dateTime}</div>
        <div className={"text-blue text-right"}>{timezone} ({offset})</div>
        {/*
             <div className={"text-blue text-right"}>Press <BLeft /> to configure the date & time</div>
         */}
    </Panel>;
}