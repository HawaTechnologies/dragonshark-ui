import {useEffect, useRef} from "react";

/**
 * Returns the previous value for the given state.
 * @param current The current/initial value of the state.
 * @returns {any} The previous value.
 */
export default function usePrevious(current) {
    const prevCountRef = useRef(current);
    const value = prevCountRef.current;
    useEffect(() => {
        prevCountRef.current = current;
    }, [current]); //run this code when the value of count changes
    return value;
}