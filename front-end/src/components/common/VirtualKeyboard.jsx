import {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import Panel from "./Panel.jsx";
import {R1, R2} from "./icons/TextButton.jsx";
import * as React from "react";
import {useGamepad, usePressEffect} from "../hooks/gamepad";

const LAYOUTS = [
    // letters
    {
        name: "Letters",
        keys: [
            "A B C D E F G H I a b c d e f g h i".split(" "),
            "J K L M N O P Q R j k l m n o p q r".split(" "),
            "S T U V W X Y Z s t u v w x y z".split(" ")
        ]
    },
    // numbers,
    {
        name: "Numbers",
        keys: [
            "1 2 3 4 5 6 7 8 9 0 + - * / % # . , ^ ÷".split(" "),
            "× ¹ ² ³ ½ ⅓ ⅔ ¼ ¾ ⅕ ⅖ ⅗ ⅘ ⅙ ⅚ ⅐ ⅛ ⅜ ⅝ ⅞".split(" "),
            "⅑ ⅒ ↉ ⅟ ⁄"
        ]
    },
    // accented-letters,
    {
        name: "Accented Letters",
        keys: [
            "Á É Í Ó Ú À È Ì Ò Ù á é í ó ú à è ì ò ù".split(" "),
            "Ä Ë Ï Ö Ü Ã Ẽ Ĩ Õ Ũ ä ë ï ö ü ã ẽ ĩ õ ũ".split(" "),
            "Ñ Ç Å Ů ñ ç å ů".split(" ")
        ]
    },
    // other
    {
        name: "Other",
        keys: [
            "! @ # $ % ^ & * ( ) - _ + = [ ] { } | \\".split(" "),
            "\" ' ´ ¨ : ; < > ? / . , ¡ ¿ ¬ « » “ ” ¦".split(" "),
            "¶ ° ® þ ß ð œ ø æ © µ § ¥ £ € Ð Œ Ø Æ ¢".split(" ")
        ]
    }
];

/**
 * Properly clamps a position with respect to its layout.
 * @param position The position.
 * @param layoutIndex The layout index.
 * @returns {string|{x: number, y: number}} The new position.
 */
function clamp(position, layoutIndex) {
    switch(position) {
        case "SPACE":
        case "BACKSPACE":
        case "CONFIRM":
            return position;
        default:
            const length = LAYOUTS[layoutIndex].keys.length;
            const clampedY = Math.min(length - 1, Math.max(0, position.y));
            const rowLength = LAYOUTS[layoutIndex].keys[clampedY].length - 1;
            const clampedX = Math.min(rowLength - 1, Math.max(0, position.x));
            return {x: clampedX, y: clampedY};
    }
}

function VirtualKeyboardLayout({append, backspace, confirm, cancel}) {
    // R1 will be used to switch the keyboard layout.
    const { RB } = useGamepad();
    // A state will be used to track the current layout.
    const [layoutIndex, setLayoutIndex] = useState(0);
    // We install the pressed effect for it.
    const ref = useRef();
    ref.current = useCallback(() => {
        setLayoutIndex(layoutIndex >= LAYOUTS.length ? 0 : layoutIndex + 1);
    }, [layoutIndex]);
    usePressEffect(RB, 500, ref);

    // A position will be: "SPACE", "BACKSPACE" or "CONFIRM" (no "CANCEL" here).
    // Alternatively, a position will be {x: 0..(keys[y].length-1), y: 0..(keys.length-1)}.
    // In this scenario, the keys will be properly clamped, but the initial key
    // will always be valid: {x: 0, y: 0}. The clamped position will be used for
    // rendering and also as starting point of any movement.
    const [position, setPosition] = useState({x: 0, y: 0});
    const clampedPosition = useMemo(
        () => clamp(position, layoutIndex),
        [position, layoutIndex]
    );

    // There will be callbacks to move UP, DOWN, LEFT and RIGHT, but the
    // implementation is not trivial for these.

    // TODO Track position (x, y) and press effects.
    // TODO Adjust position depending on layout.
    // TODO Identify the current button.
    // TODO render.
    return <></>;
}

/**
 * Replaces a string with all asterisks except for the last character,
 * which is plain text.
 * @param v The value to secretize.
 * @returns {string} The secretized string.
 */
function secretize(v) {
    if (!v.length) {
        return "";
    } else {
        let chars = "";
        let l_ = v.length - 1;
        for(let i = 0; i < l_; i++) chars += "*";
        return chars + v[l_];
    }
}

/**
 * This is a virtual keyboard. It is triggered on a
 * @param fieldCaption The caption for the field, so the user knows what
 * are they editing.
 * @param value The initial value of the field (always a string).
 * @param onChange A callback that will be triggered when the value is
 * confirmed by the user.
 * @constructor
 */
export default forwardRef(({}, ref) => {
    const [caption, setCaption] = useState("");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [onChange, setOnChange] = useState({callback: null});
    const [isSecret, setIsSecret] = useState(false);
    const [closeReady, setCloseReady] = useState(false);
    const { RT } = useGamepad();
    const append = useCallback((chr) => {
        setValue(value + chr);
    }, [value]);
    const backspace = useCallback(() => {
        setValue(value.length ? value.substring(0, value.length - 1) : "");
    }, [value]);
    const confirm = useCallback(() => {
        try {
            onChange.callback(value);
        } catch {}
        setOpen(false);
    }, [value, onChange]);
    const cancel = useCallback(() => {
        // Closes the virtual keyboard, cancelling.
        setOpen(false);
    }, [setOpen]);
    const refClose = useRef();
    refClose.current = () => {
        if (closeReady) {
            setOpen(false);
        }
    }
    usePressEffect(RT, 500, refClose);
    useEffect(() => {
        setTimeout(() => setCloseReady(true), 1000);
    }, []);

    if (ref) {
        // The `ref` must set an object with methods such as:
        // - open(caption, isSecret, value, onChange) -> Opens the object for a component and its value.
        // - cancel() -> Cancels the edition.
        //
        // Confirming the keyboard will NOT be available by the red.
        ref.current = {
            open: (caption, isSecret, value, onChange) => {
                // Opens the virtual keyboard. Sets an initial value
                // and tracks a callback.
                setCaption(caption);
                setIsSecret(isSecret);
                setValue(value);
                setOnChange({callback: () => { onChange(value) }})
                setOpen(true);
            },
            cancel
        }
    }

    // Rendering the actual keyboard layout for good.
    if (!open) {
        return <></>;
    } else {
        return <Panel style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
            <div className="text-blue" style={{position: "absolute", right: "48px"}}>
                Press <R2/> to cancel<br />
                Press <R1/> to switch keyboard layout
            </div>
            <div className="text-soft" style={{
                position: "absolute",
                top: "48px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "20px"
            }}>Editing: {caption}</div>

            <Panel style={{
                position: "absolute",
                top: "96px",
                left: "50%",
                width: "400px",
                transform: "translateX(-50%)"
            }}>
                <input type="text" value={isSecret ? secretize(value) : value}
                       style={{width: "100%", fontSize: "20px"}} />
            </Panel>
            <VirtualKeyboardLayout confirm={confirm} cancel={cancel}
                                   append={append} backspace={backspace} />
        </Panel>;
    }
});