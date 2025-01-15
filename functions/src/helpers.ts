

export function logBase(x: number, b: number) {
    return Math.log(x) / Math.log(b);
}

//get top selections from selections
export function getTopSelectionKeys(
    selections: { [key: string]: number },
    limit = 1,
): string[] {
    const sortedSelections = Object.entries(selections)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);

    return sortedSelections.map(([key]) => key);
}

export const isEqualObjects = (objA: Object | undefined, objB: Object | undefined) => {
    return JSON.stringify(objA) === JSON.stringify(objB);
}



