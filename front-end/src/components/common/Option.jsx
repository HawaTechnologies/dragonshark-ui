import * as React from 'react';

/**
 * This is a menu option. It has an image and a caption.
 * @param style The extra style to the wrapper.
 * @param className The extra class name to the wrapper.
 * @param image The image to show.
 * @param caption The caption to use.
 * @constructor
 */
export default function Option({ style, className, image, caption }) {
    style ||= {};
    return <div className={className} style={{...style, textAlign: 'center'}}>
        <img className="option" src={image} alt={caption} />
        <div className="text-soft">{caption}</div>
    </div>
}