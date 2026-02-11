
export const getFirstLetterCapital = (word: string): string => {
    if (!word || !word.length) throw new Error("Not String Received")
    const firstLetter = word.charAt(0).toUpperCase();
    if (word.length < 2) return firstLetter;
    const restOfLetters = word.slice(1);
    return `${firstLetter}${restOfLetters}`
}