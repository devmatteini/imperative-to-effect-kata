/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    semi: false,
    trailingComma: "all",
    singleQuote: false,
    printWidth: 100,
    tabWidth: 4,
    overrides: [
        {
            files: ["*.yaml", "*.yml", "*.json"],
            options: {
                tabWidth: 2,
            },
        },
    ],
}

export default config
