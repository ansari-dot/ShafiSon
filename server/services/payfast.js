import crypto from "crypto";

function pfEncode(value) {
    return encodeURIComponent(String(value))
        .replace(/%20/g, "+")
        .replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

export function buildSignatureString(data, passphrase = "", orderedKeys = null) {
    const keys = Array.isArray(orderedKeys) && orderedKeys.length ?
        orderedKeys :
        Object.keys(data);

    const query = keys
        .filter((k) => data[k] !== undefined && data[k] !== null && data[k] !== "")
        .map((key) => `${key}=${pfEncode(data[key])}`)
        .join("&");

    const trimmedPass = String(passphrase || "").trim();
    return trimmedPass ? `${query}&passphrase=${pfEncode(trimmedPass)}` : query;
}

export function generateSignature(data, passphrase = "", orderedKeys = null) {
    const str = buildSignatureString(data, passphrase, orderedKeys);
    return crypto.createHash("md5").update(str).digest("hex");
}