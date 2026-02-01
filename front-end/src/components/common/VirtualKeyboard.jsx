import * as React from "react";
import {forwardRef, useCallback, useImperativeHandle, useMemo, useState, useRef} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../hooks/gamepad";
import Panel from "./Panel.jsx";
import {R1, R2} from "./icons/TextButton.jsx";
import {BLeft} from "./icons/RightPanelButton.jsx";

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
    // numbers
    {
        name: "Numbers",
        keys: [
            "1 2 3 4 5 6 7 8 9 0 + - * / % # . , ^ ÷".split(" "),
            "× ¹ ² ³ ½ ⅓ ⅔ ¼ ¾ ⅕ ⅖ ⅗ ⅘ ⅙ ⅚ ⅐ ⅛ ⅜ ⅝ ⅞".split(" "),
            "⅑ ⅒ ↉ ⅟ ⁄".split(" ")
        ]
    },
    // accented-letters
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
            const rowLength = LAYOUTS[layoutIndex].keys[clampedY].length;
            const clampedX = Math.min(rowLength - 1, Math.max(0, position.x));
            return {x: clampedX, y: clampedY};
    }
}

/**
 * Moves the position 1 box up. If the position is among SPACE,
 * BACKSPACE or CONFIRM, the new position will be among (0, r),
 * (3, r) or (6, r) where r is the index of the last row. If
 * the position is (_, 0), it will be unchanged. Otherwise, it
 * will be (x, y-1).
 * @param clampedPosition The current, clamped, position.
 * @param layoutIndex The current keyboard layout.
 * @returns {string|{x: number, y: number}} The new position.
 */
function up(clampedPosition, layoutIndex) {
    const nRows = LAYOUTS[layoutIndex].keys.length;
    switch(clampedPosition) {
        case "SPACE":
            return {x: 0, y: nRows - 1};
        case "BACKSPACE":
            return {x: 3, y: nRows - 1};
        case "CONFIRM":
            return {x: 6, y: nRows - 1};
        default:
            const {x, y} = clampedPosition;
            if (y === 0) {
                return {x, y};
            } else {
                return {x, y: y - 1};
            }
    }
}

/**
 * Moves the position 1 box down. If the position is among SPACE,
 * BACKSPACE or CONFIRM, it will be unchanged. If the position is
 * y=r then one of SPACE (x in 0..2), BACKSPACE (x in 2..5) or
 * CONFIRM (x >= 6) will be selected.
 * @param clampedPosition The current, clamped, position.
 * @param layoutIndex The current keyboard layout.
 * @returns {string|{x: number, y: number}} The new position.
 */
function down(clampedPosition, layoutIndex) {
    const nRows = LAYOUTS[layoutIndex].keys.length;
    switch(clampedPosition) {
        case "SPACE":
        case "BACKSPACE":
        case "CONFIRM":
            return clampedPosition;
        default:
            const {x, y} = clampedPosition;
            if (y === nRows - 1) {
                if (x >= 6) {
                    return "CONFIRM";
                } else if (x >= 3) {
                    return "BACKSPACE";
                } else {
                    return "SPACE";
                }
            } else {
                return {x, y: y + 1};
            }
    }
}

/**
 * Moves the position 1 box left. If the position is SPACE or the
 * x position is 0, it will be unchanged. CONFIRM becomes BACKSPACE
 * and BACKSPACE becomes SPACE. For other positions, (x-1, y) is
 * returned.
 * @param clampedPosition The current, clamped, position.
 * @param layoutIndex The current keyboard layout.
 * @returns {string|{x: number, y: number}} The new position.
 */
function left(clampedPosition, layoutIndex) {
    switch(clampedPosition) {
        case "SPACE":
        case "BACKSPACE":
            return "SPACE";
        case "CONFIRM":
            return "BACKSPACE";
        default:
            const {x, y} = clampedPosition;
            if (x === 0) {
                return {x, y};
            } else {
                return {x: x - 1, y};
            }
    }
}

/**
 * Moves the position 1 box right. If the position is CONFIRM or
 * x position is rows[y].length-1, it will be unchanged. BACKSPACE
 * becomes CONFIRM and SPACE becomes BACKSPACE. Other positions
 * become (x+1, y).
 * @param clampedPosition The current, clamped, position.
 * @param layoutIndex The current keyboard layout.
 * @returns {string|{x: number, y: number}} The new position.
 */
function right(clampedPosition, layoutIndex) {
    switch(clampedPosition) {
        case "SPACE":
            return "BACKSPACE";
        case "BACKSPACE":
        case "CONFIRM":
            return "CONFIRM";
        default:
            const {x, y} = clampedPosition;
            const {keys} = LAYOUTS[layoutIndex];
            const rowLength = keys[y].length;
            if (x >= rowLength) {
                return {x: rowLength, y};
            } else {
                return {x: x + 1, y};
            }
    }
}

function VirtualKeyboardLayout({append, backspace, confirm}) {
    // R1 will be used to switch the keyboard layout.
    const { RB } = useGamepad();
    // A state will be used to track the current layout.
    const [layoutIndex, setLayoutIndex] = useState(0);
    // We install the pressed effect for it.
    const f = useCallback(() => {
        setLayoutIndex(layoutIndex >= LAYOUTS.length - 1 ? 0 : layoutIndex + 1);
    }, [layoutIndex]);
    usePressEffect(RB, 500, f);

    // A position will be: "SPACE", "BACKSPACE" or "CONFIRM" (no "CANCEL" here).
    // Alternatively, a position will be {x: 0..(keys[y].length-1), y: 0..(keys.length-1)}.
    // In this scenario, the keys will be properly clamped, but the initial key
    // will always be valid: {x: 0, y: 0}. The clamped position will be used for
    // rendering and also as starting point of any movement.
    const [position, setPosition] = useState({x: 0, y: 0} || "");
    const clampedPosition = useMemo(
        () => clamp(position, layoutIndex),
        [position, layoutIndex]
    );
    const {joystick: [leftRightAxis, upDownAxis], buttonX: keyPressed} = useGamepad();
    const {down: leftPressed, up: rightPressed} = getDiscreteAxisStates(leftRightAxis);
    const {down: upPressed, up: downPressed} = getDiscreteAxisStates(upDownAxis);
    usePressEffect(leftPressed, 500, () => setPosition(left(clampedPosition, layoutIndex)));
    usePressEffect(rightPressed, 500, () => setPosition(right(clampedPosition, layoutIndex)));
    usePressEffect(upPressed, 500, () => setPosition(up(clampedPosition, layoutIndex)));
    usePressEffect(downPressed, 500, () => setPosition(down(clampedPosition, layoutIndex)));
    usePressEffect(keyPressed, 500, () => {
        switch(clampedPosition) {
            case "SPACE":
                append(" ");
                break;
            case "BACKSPACE":
                backspace();
                break;
            case "CONFIRM":
                confirm();
                break;
            default:
                const {x, y} = clampedPosition;
                const keys = LAYOUTS[layoutIndex].keys;
                append(keys[y][x]);
        }
    }, 1000);

    return <div className="keyboard">
        <div className="key">{LAYOUTS[layoutIndex].name}</div>
        <div>
            {LAYOUTS[layoutIndex].keys.map((row, y) => {
                return <div key={y}>
                    {row.map((char, x) => {
                        return <div key={x} className={`key ${(typeof clampedPosition !== "string" && (clampedPosition.x === x && clampedPosition.y === y) ? "selected" : "")}`}>{char}</div>
                    })}
                </div>;
            })}
            <div>
                <div className={`key ${clampedPosition === "SPACE" ? "selected" : ""}`}>SPACE</div>
                <div className={`key ${clampedPosition === "BACKSPACE" ? "selected" : ""}`}>BACKSPACE</div>
                <div className={`key ${clampedPosition === "CONFIRM" ? "selected" : ""}`}>CONFIRM</div>
            </div>
        </div>
    </div>;
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
 * This is a virtual keyboard. It is triggered by using a handle
 * and invoking .open(caption, isSecret, initialValue, onChange)
 * where caption is the visual hint of the edited field, isSecret
 * tells whether it's a password, initialValue tells the initial
 * value (typically, empty string) and onChange is the callback
 * for the edited value (a state setter, typically). The handle
 * also supports a manual .cancel() method to close the keyboard.
 * @param allowCancelWithRT tells whether the keyboard can be
 * cancelled / closed by pressing R2 or not.
 * @constructor
 */
export default forwardRef(({ allowCancelWithRT }, ref) => {
    const [caption, setCaption] = useState("");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [onChange, setOnChange] = useState({callback: null});
    const [isSecret, setIsSecret] = useState(false);
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
    usePressEffect(RT, 500, () => {
        if (allowCancelWithRT !== false) setOpen(false);
    });

    const r = useRef(null);
    r.current = value;

    // The `ref` must set an object with methods such as:
    // - open(caption, isSecret, value, onChange) -> Opens the object for a component and its value.
    // - cancel() -> Cancels the edition.
    //
    // Confirming the keyboard will NOT be available by the red.
    useImperativeHandle(ref, () => ({
        open: (caption, isSecret, value, onChange) => {
            // Opens the virtual keyboard. Sets an initial value
            // and tracks a callback.
            setCaption(caption);
            setIsSecret(isSecret);
            setValue(value);
            setOnChange({callback: () => {
                onChange(r.current);
            }});
            setOpen(true);
        },
        cancel
    }), [r]);

    // Rendering the actual keyboard layout for good.
    if (!open) {
        return <></>;
    } else {
        return <Panel style={{position: "absolute", left: "10%", right: "10%", bottom: "10%", top: "15%"}}>
            <div className="text-red" style={{position: "absolute", right: "48px", textAlign: "right"}}>
                Press <R2/> to cancel<br />
                Press <R1/> to switch keyboard layout<br />
                Press <BLeft/> to write/delete/confirm
            </div>
            <div className="text-soft" style={{
                position: "absolute",
                left: "48px"
            }}>Editing: {caption}</div>

            <Panel style={{
                position: "absolute",
                top: "64px",
                left: "48px",
                width: "400px"
            }}>
                <input type="text" value={isSecret ? secretize(value) : value}
                       style={{width: "100%", fontSize: "20px"}} />
            </Panel>
            <VirtualKeyboardLayout confirm={confirm} append={append} backspace={backspace} />
        </Panel>;
    }
});