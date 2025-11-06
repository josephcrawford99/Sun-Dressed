export function capitalizeAllWords(sentence: string): string {
    if (!sentence) {
        return "";
    }

    return sentence
        .split(" ")
        .map((word) => {
            if (!word) {
                return "";
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
}
