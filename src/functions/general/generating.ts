
export function getPastelColor() {
    return `hsl(${360 * Math.random()},100%,75%)` || "red";
}export const statementTitleToDisplay = (
    statement: string,
    titleLength: number
) => {
    const _title = statement.split("\n")[0].replace("*", "") || statement.replace("*", "");

    const titleToSet = _title.length > titleLength - 3
        ? _title.substring(0, titleLength) + "..."
        : _title;

    return { shortVersion: titleToSet, fullVersion: _title };
};
export function generateRandomLightColor(uuid: string) {
    // Generate a random number based on the UUID
    const seed = parseInt(uuid.replace(/[^\d]/g, ""), 10);
    const randomValue = (seed * 9301 + 49297) % 233280;

    // Convert the random number to a hexadecimal color code
    const hexColor = `#${((randomValue & 16777215) | 12632256)
        .toString(16)
        .toUpperCase()}`;

    return hexColor;
}

