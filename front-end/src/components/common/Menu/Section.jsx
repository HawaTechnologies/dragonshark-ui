import * as React from 'react';

/**
 * This is a menu section. It only conditionally shows a section's elements.
 * @param children The children to render.
 * @param visible Whether to render the section or not.
 * @constructor
 */
export default function Section({ children, visible }) {
    if (!visible) return null;
    return <div className="section">{children}</div>;
}