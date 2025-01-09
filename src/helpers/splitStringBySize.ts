export function splitStringBySize(input: string, maxSize: number): string[] {
    return input
        .split(' ')
        .reduce((acc: string[], word: string) => {
            const lastChunk = acc.length > 0 ? acc[acc.length - 1] : undefined;
            if (!lastChunk || (lastChunk.length + word.length + 1) > maxSize) {
                acc.push(word);
            } else {
                acc[acc.length - 1] = `${lastChunk} ${word}`;
            }
            return acc;
        },
            []);
}
