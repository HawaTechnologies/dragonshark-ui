import React, {useState, useEffect, Children, cloneElement, useCallback, useRef} from 'react';
import Section from "./Section.jsx";
import Option from "./Option.jsx";
import Panel from "../Panel.jsx";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../hooks/gamepad.js";

/**
 * Counts the option components inside a section.
 * @param section The section to count components.
 * @returns {number} The count of options.
 */
function countOptionsInSection(section) {
    return Children.toArray(section.props.children).filter(child => (
        child.type === Option
    )).length
}
/**
 * Gets the Section elements (which have inner options) and the amount of options within each.
 * @param children The children of the component.
 * @returns {[React.ComponentElement,number][]} A list of pairs [element, numChildren].
 */
function getSectionsAndOptionCounts(children) {
    return Children.toArray(children).map((child) => {
        return [child, child.type !== Section ? 0 : countOptionsInSection(child)];
    }).filter((pair) => pair[1] > 0);
}

/**
 * Given a current "global" index and the valid sections, gets the valid section index and
 * the proper in-section option index.
 * @param globalIndex The global index.
 * @param sectionAndOptions A list of pairs [element, numChildren].
 * @returns {[number, number]} The two indices.
 */
function getCurrentSectionAndOptionIndex(globalIndex, sectionAndOptions) {
    globalIndex ||= 0;
    if (globalIndex < 0 || globalIndex === 0 || sectionAndOptions.length === 0) {
        return [0, 0];
    }

    let previousOptions = 0;
    for(let sectionIndex = 0; sectionIndex < sectionAndOptions.length; sectionIndex++) {
        const [_, count] = sectionAndOptions[sectionIndex];
        if (previousOptions <= globalIndex && previousOptions + count > globalIndex) {
            return [sectionIndex, globalIndex - previousOptions];
        } else {
            previousOptions += count;
        }
    }
    return [-1, -1];
}

/**
 * Returns the sections, but only showing one section and
 * only highlighting one option among their children.
 * @param sectionIndex The index of the section to show.
 * @param optionIndex The index of the option to highlight.
 * @param sectionAndOptions The total existing sections.
 * @returns {[any[], () => void]} The sections (including which section/option is selected) and the callback.
 */
function cleanAndSelectSectionAndOption(sectionIndex, optionIndex, sectionAndOptions) {
    let callback = null;
    return [sectionAndOptions.map(([section, count], secIndex) => {
        const options = Children.toArray(section.props.children).map((option, optIndex) => {
            const selected = optionIndex === optIndex;
            if (selected && (sectionIndex === secIndex)) {
                callback = option.props.callback;
            }
            return cloneElement(option, {selected});
        });

        return cloneElement(section, {
            visible: sectionIndex === secIndex,
            children: options
        });
    }), callback];
}

/**
 * Takes the global index and all the children (a hierarchy of sections
 * with their options) and returns a valid index among them and the
 * filtered / re-rendered options.
 * @param globalIndex The selected index.
 * @param children The children to render.
 * @returns {[number, React.ComponentElement[], () => void]} The filtered global index and options, and current callback.
 */
function getFilteredSectionsAndIndex(globalIndex, children) {
    const filteredSections = getSectionsAndOptionCounts(children);
    let [sectionIdx, optionIdx] = getCurrentSectionAndOptionIndex(globalIndex, filteredSections);
    if (sectionIdx === -1) {
        // We force these values for pure convenience to force one of the
        // sections and there one of the options to be selected.
        const lastSectionIndex = filteredSections.length - 1;
        [sectionIdx, optionIdx] = [lastSectionIndex, filteredSections[lastSectionIndex][1] - 1];
        globalIndex = filteredSections.map(([_, c]) => c).reduce((a, b) => a + b) - 1;
    }
    return [globalIndex, ...cleanAndSelectSectionAndOption(sectionIdx, optionIdx, filteredSections)];
}

/**
 * This is a Menu. It has sections and, once there, it has
 * options that will be rendered.
 * @param style The style to apply to the menu.
 * @param selectedIndex If set, an option that will be
 * selected by default. By default, this stands for the
 * first option of the first section.
 * @param navigationInterval The interval of movement between
 * each option when left/right is pressed.
 * @param children The children of this component.
 * @constructor
 */
export default function Menu({ style, children, selectedIndex = 0, navigationInterval = 500}) {
    // 1. Define the new state to track the global index, and the
    //    state to track the filtered children.
    const [globalIndex, setGlobalIndex] = useState(selectedIndex);
    const [filteredChildren, setFilteredChildren] = useState(children);
    const [menuCallback, setMenuCallback] = useState(null);
    const finalMenuCallback = useRef();
    finalMenuCallback.current = () => {
        if (menuCallback?.func) menuCallback.func();
    };
    const navigateLeftCallback = useRef();
    navigateLeftCallback.current = () => {
        setGlobalIndex(Math.max(0, globalIndex - 1));
    };
    const navigateRightCallback = useRef();
    navigateRightCallback.current = () => {
        setGlobalIndex(globalIndex + 1);
    };

    // 2. If the selectedIndex change, update the global index.
    useEffect(() => {
        setGlobalIndex(selectedIndex);
    }, [selectedIndex]);

    // 3. In a state, tell to fix the globalIndex based on it
    //    being filtered.
    useEffect(() => {
        const [filteredGlobalIndex, filteredSections, callback] = getFilteredSectionsAndIndex(globalIndex, children);
        setFilteredChildren(filteredSections);

        if (filteredGlobalIndex !== globalIndex) {
            setGlobalIndex(filteredGlobalIndex);
        }

        setMenuCallback({func: callback});
    }, [globalIndex, children]);

    // 4. Enable left/right gamepad commands.
    const {joystick: [leftRightAxis, _], buttonX: menuPressed} = useGamepad();
    const {down: leftPressed, up: rightPressed} = getDiscreteAxisStates(leftRightAxis);
    usePressEffect(leftPressed, navigationInterval, navigateLeftCallback);
    usePressEffect(rightPressed, navigationInterval, navigateRightCallback);
    usePressEffect(menuPressed, navigationInterval, finalMenuCallback);

    return <Panel style={{...(style || {})}}>
        {filteredChildren}
    </Panel>
}