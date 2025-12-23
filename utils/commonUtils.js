import { randomInt } from "node:crypto";

/**
 * This function validates whether value is not empty or undefined
 * @param {string | undefined} value - The value to validate
 * @param {string} key - The key used to access the value
 * @returns {string} value - returns the value if it is valid
 */
export function validateEnvVar(value, key) {
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Environment variable ${key} is not set or is empty`);
    }
    return value;
}

/**
 * This function generates a random 6-digit OTP
 * @returns {string} OTP - A random 6-digit number
 */
export function generateOTP() {
    return randomInt(100000, 1000000).toString();
}
