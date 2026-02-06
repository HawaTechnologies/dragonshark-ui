const fs = require("node:fs/promises");
const path = require("node:path");
const { XMLParser } = require("fast-xml-parser");

// Creating the parser.
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    trimValues: true,
    commentPropName: "#comment",
});

/**
 * Validates the app name.
 * @param app The name of the app.
 * @returns {boolean} Whether it's valid.
 */
function isJavaIdent(app) {
    return typeof app === "string" && /^[A-Za-z_][A-Za-z0-9_]*$/.test(app);
}

/**
 * Validates the package path.
 * @param pkg The package path.
 * @returns {boolean} Whether it's valid.
 */
function isPackageName(pkg) {
    return typeof pkg === "string" && /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/.test(pkg);
}

/**
 * Resolves a path to belong to a base directory.
 * Obtains the actual path. If it does not belong
 * to the base directory, raises an error.
 * @param baseDir The base directory.
 * @param rel The path to check.
 * @returns {string} The resolved directory.
 */
function resolveInside(baseDir, rel) {
    // Check it to be a string, and validate. It must not be empty.
    if (typeof rel !== "string") throw new Error("Path must be a string");
    const cleaned = rel.trim();
    if (!cleaned) throw new Error("Path cannot be empty");

    // Require the path to be relative, not absolute.
    // Also, require it to not have weird stuff (e.g.
    // null terminators).
    if (path.isAbsolute(cleaned)) throw new Error("Path must be relative, not absolute");
    if (cleaned.includes("\0")) throw new Error("Invalid path");

    // Resolve the cleaned string w.r.t. the base directory.
    // Also, resolve the base directory. Require the internal
    // path to belong to the parent path.
    const abs = path.resolve(baseDir, cleaned);
    const base = path.resolve(baseDir) + path.sep;
    if (!abs.startsWith(base)) throw new Error(`Path escapes base directory: ${rel}`);

    // Otherwise, return the resolved path.
    return abs;
}

/**
 * Tells whether the file exists (as a file).
 * @param p The path to validate.
 * @returns {Promise<boolean>} Whether it exists as a file (async function).
 */
async function fileExists(p) {
    try {
        const st = await fs.stat(p);
        return st.isFile();
    } catch {
        return false;
    }
}

/**
 * @typedef {{
 *   gameId: { package: string, app: string },
 *   command: string,
 *   gameData: { author: string, year: string, title: string, image?: string },
 *   paths: { commandAbs: string, imageAbs?: string }
 * }} GameManifest
 */

/**
 * Parses and validates a hawa-game manifest.xml. Returns the whole
 * manifest contents.
 * @param {string} manifestPath absolute or relative path to manifest.xml
 * @returns {Promise<GameManifest>} The manifest contents.
 */
async function readGameManifest(manifestPath) {
    // Load the manifest file and expect a root <hawa-game />
    // element exists.
    const xml = await fs.readFile(manifestPath, "utf8");
    const obj = parser.parse(xml);
    const root = obj["hawa-game"];
    if (!root) throw new Error("Invalid XML: missing <hawa-game> root");

    // Load the main elements. All the elements must be present.
    const gameId = root["game-id"];
    const gameData = root["game-data"];
    const command = root["command"];
    if (!gameId) throw new Error("Missing <game-id />");
    if (!gameData) throw new Error("Missing <game-data />");
    if (command == null) throw new Error("Missing <command>...</command>");

    // Validate the package name.
    const pkg = gameId.package;
    const app = gameId.app;
    if (!pkg || !app) throw new Error("<game-id> must have package and app attributes");
    if (!isPackageName(pkg)) throw new Error(`Invalid package name: ${pkg}`);
    if (!isJavaIdent(app)) throw new Error(`Invalid app id: ${app}`);

    // Recovering the command. It must be valid, and must
    // be inside the manifest's parent directory somehow.
    const cmdText = typeof command === "string" ? command : command["#text"];
    if (!cmdText || typeof cmdText !== "string") throw new Error("<command> must contain text");
    const baseDir = path.dirname(path.resolve(manifestPath));
    const commandAbs = resolveInside(baseDir, cmdText);
    if (!(await fileExists(commandAbs))) {
        throw new Error(`Command target does not exist or is not a file: ${cmdText}`);
    }

    // Recovering the metadata. It must be valid.
    // The difference is that the image is optional.
    const author = gameData.author;
    const year = gameData.year;
    const title = gameData.title;
    const image = gameData.image;
    if (!author || !year || !title) {
        throw new Error("<game-data> must have author, year, title attributes");
    }

    // Resolve image if present. If missing or invalid,
    // the image will not be included (will be null).
    let imageAbs;
    if (image != null && String(image).trim() !== "") {
        let candidate;
        try {
            candidate = resolveInside(baseDir, String(image));
            if (await fileExists(candidate)) {
                imageAbs = candidate;
            } else {
                imageAbs = null;
            }
        } catch(e) {
            imageAbs = null;
        }
    } else {
        imageAbs = null;
    }

    // Return everything by the end.
    return {
        gameId: { package: pkg, app },
        command: cmdText,
        gameData: { author, year: String(year), title, ...(imageAbs ? { image: String(image) } : {}) },
        paths: { commandAbs, ...(imageAbs ? { imageAbs } : {}) },
    };
}

module.exports = { readGameManifest }