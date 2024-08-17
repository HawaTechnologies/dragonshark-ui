import * as React from 'react';

/**
 * This is a menu option. These typically appear in
 * a group of 4 options and are triggered by the BUp/1,
 * BRight/2, BDown/3, BLeft/4 buttons.
 * @param style The extra style to the wrapper.
 * @param className The extra class name to the wrapper.
 * @param image The image to show.
 * @param button The button to associate. R2 cannot be
 * used for this purpose.
 * @param caption The caption to use.
 * @constructor
 */
export default function Option({ style, className, image, button, caption }) {
    style ||= {};
    return <div className={className} style={{...style, textAlign: 'center'}}>
        <img className="option" src={image} alt={caption} />
        <div className="text-soft">{button} {caption}</div>
    </div>
}