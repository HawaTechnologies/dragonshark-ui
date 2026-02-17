import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../hooks/gamepad.js";

function getValue(e) {
    return typeof e === "string" ? e : e.value;
}

function getLabel(e) {
    return typeof e === "string" ? e : e.label;
}

/**
 * A selector component.
 * @param options The options (string or {label, value}).
 * @param value The selected value.
 * @param onChange The callback to update the value.
 * @param disabled Whether it is disabled or not (disabled select
 * does not change the selected option with the d-pad).
 * @param emptyLabel The empty label to show.
 * @constructor
 */
export default function Select({
    options, value, onChange, emptyLabel = "(no options)",
    disabled = false
}) {
    // First, a state here. Not for the options, but for the current index.
    // The index will be -1 if unset or invalid.
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Then, compute the selected label.
    const selectedLabel = useMemo(() => {
        if (!options || !options.length || selectedIndex === -1) {
            return emptyLabel;
        } else {
            return getLabel(options[selectedIndex]);
        }
    }, [options, selectedIndex, emptyLabel]);

    // Then, the gamepad effects go here.
    const {joystick: [leftRightAxis, _], buttonA: keyPressed} = useGamepad();
    const {down: leftPressed, up: rightPressed} = getDiscreteAxisStates(leftRightAxis);
    usePressEffect(leftPressed, 500, () => {
        if (disabled) return;
        const l = options?.length;
        if (!l) return;
        const newIndex = selectedIndex <= 0 ? l - 1 : selectedIndex - 1;
        setSelectedIndex(newIndex);
        onChange(options[newIndex]);
    }, 1000, [options, disabled]);
    usePressEffect(rightPressed, 500, () => {
        if (disabled) return;
        const l = options?.length;
        if (!l) return;
        const newIndex = selectedIndex >= l - 1 ? 0 : selectedIndex + 1;
        setSelectedIndex(newIndex);
        onChange(options[newIndex]);
    }, 1000, [options, disabled]);

    // On mount, understand the current value and translate it to an index.
    // Technically, this runs on mount or when the options / value change.
    useEffect(() => {
        const index = options.findIndex((e) => {
            return getValue(e) === value;
        });
        if (index === -1) {
            if (!options || !options.length) {
                setSelectedIndex(-1);
                onChange(null);
            } else {
                setSelectedIndex(0);
                onChange(getValue(options[0]));
            }
        } else {
            setSelectedIndex(index);
            if (value !== getValue(options[0])) {
                onChange(getValue(options[0]));
            }
        }
    }, [options, value]);

    return <div style={{display: "inline-block"}}>
        <span className="text-red">⮜</span>
        <div style={{display: "inline", padding: "0 8px"}}>{selectedLabel}</div>
        <span className="text-blue">⮞</span>
    </div>;
}
