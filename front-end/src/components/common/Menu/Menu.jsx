import React, { useState, useEffect, Children, cloneElement } from 'react';
import Section from "./Section.jsx";
import Option from "./Option.jsx";
import Panel from "../Panel.jsx";

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
    if (globalIndex < 0 || globalIndex === 0 || sectionAndOptions.length === 0) {
        return [-1, -1];
    }

    let previousOptions = 0;
    for(let sectionIndex = 0; sectionIndex < sectionAndOptions.length; sectionIndex++) {
        const [_, count] = sectionAndOptions[sectionIndex];
        if (previousOptions + count < globalIndex) {
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
 */
function cleanAndSelectSectionAndOption(sectionIndex, optionIndex, sectionAndOptions) {
    return sectionAndOptions.map(([section, count], secIndex) => {
        const options = Children.toArray(section.props.children).map((option, optIndex) => {
            return cloneElement(option, {selected: optionIndex === optIndex});
        });

        return cloneElement(section, {
            visible: sectionIndex === secIndex,
            children: options
        });
    });
}

/**
 * Takes the global index and all the children (a hierarchy of sections
 * with their options) and returns a valid index among them and the
 * filtered / re-rendered options.
 * @param globalIndex The selected index.
 * @param children The children to render.
 * @returns {[number, [React.ComponentElement,number][]]} The filtered global index and options.
 */
function getFilteredSectionsAndIndex(globalIndex, children) {
    const filteredSections = getSectionsAndOptionCounts(children);
    let [sectionIdx, optionIdx] = getCurrentSectionAndOptionIndex(globalIndex, filteredSections);
    if (sectionIdx === -1) {
        // We force these values for pure convenience to force one of the
        // sections and there one of the options to be selected.
        [sectionIdx, optionIdx] = [0, 0];
        globalIndex = 0;
    }
    return [globalIndex, cleanAndSelectSectionAndOption(sectionIdx, optionIdx, filteredSections)];
}

/**
 * This is a Menu. It has sections and, once there, it has
 * options that will be rendered.
 * @param style The style to apply to the menu.
 * @param selectedIndex If set, an option that will be
 * selected by default. By default, this stands for the
 * first option of the first section.
 * @param children The children of this component.
 * @constructor
 */
export default function Menu({ style, children, selectedIndex }) {
    const [globalIndex, setGlobalIndex] = useState(selectedIndex);
    useEffect(() => {
        setGlobalIndex(selectedIndex);
    }, [selectedIndex]);

    const [filteredGlobalIndex, filteredSections] = getFilteredSectionsAndIndex(globalIndex, children);

    return <Panel style={{...(style || {})}}>
        {filteredSections}
    </Panel>
}