import { useEffect, useRef, useState } from "react";

/**
 * The resize observer and the ref to return.
 * @returns {[ref, {width, height}]} The ref and the rect.
 */
export function useResizeObserver() {
    const ref = useRef(null);
    const [rect, setRect] = useState(null);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) setRect(entry.contentRect);
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return [ref, rect];
}
