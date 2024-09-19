import * as React from 'react';
import {useEffect, useState} from "react";

/**
 * This is a progress text. Just a caption with ellipsis.
 * @param caption The caption.
 * @param interval The ellipsis interval (1000 by default).
 */
export default function ProgressText({caption, interval = 1000}) {
    const [progressFrame, setProgressFrame] = useState(0);

    useEffect(() => {
        // Set a clock to animate "fetching".
        let frame = 0;
        setProgressFrame(0);
        const t = setInterval(() => {
            frame = (frame + 1) % 3;
            setProgressFrame(frame);
        }, 1000);
        return () => clearInterval(t);
    }, []);

    let ellipsis = "";
    for(let idx = 0; idx <= progressFrame; idx++) {
        ellipsis += ".";
    }

    return <>{caption}{ellipsis}</>
}