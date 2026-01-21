/**
 * @type {import("jest").Config}
 */
module.exports = {
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    testEnvironment: "jsdom"
}