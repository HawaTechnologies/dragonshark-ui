import { useEffect, useState } from "react";

function getActiveNow() {
    // “Active enough” = visible + focused
    // You can tweak this rule if you prefer visibility-only.
    return document.visibilityState === "visible" && document.hasFocus();
}

/**
 * Tells whether the app is active or not.
 * @returns {*}
 */
export function useActive() {
    const [active, setActive] = useState(() => getActiveNow());

    useEffect(() => {
        const update = () => setActive(getActiveNow());

        // Focus/blur: window-level
        window.addEventListener("focus", update);
        window.addEventListener("blur", update);

        // Visibility: document-level
        document.addEventListener("visibilitychange", update);

        // Some Electron / Chromium edge cases
        window.addEventListener("pageshow", update);
        window.addEventListener("pagehide", update);

        // Initial sync
        update();

        return () => {
            window.removeEventListener("focus", update);
            window.removeEventListener("blur", update);
            document.removeEventListener("visibilitychange", update);
            window.removeEventListener("pageshow", update);
            window.removeEventListener("pagehide", update);
        };
    }, []);

    return active;
}
