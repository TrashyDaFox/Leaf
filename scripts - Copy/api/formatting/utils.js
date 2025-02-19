export function parseQuotedString(str) {
    const regex = /[^\s"]+|"([^"]*)"/gi;
    const results = [];
    let match;
    
    while ((match = regex.exec(str)) !== null) {
        results.push(match[1] || match[0]);
    }
    
    return results;
}

export function safeDivide(num1, num2) {
    if (num2 === 0) return num1 > 0 ? num1 : num1 === 0 ? 1 : -num2;
    return num1 / num2;
}

export function abbreviateNumber(number, decPlaces) {
    const suffixes = ['k', 'm', 'b', 't'];
    const decScale = Math.pow(10, decPlaces);
    
    for (let i = suffixes.length - 1; i >= 0; i--) {
        const size = Math.pow(10, (i + 1) * 3);
        if (size <= number) {
            number = Math.round((number * decScale) / size) / decScale;
            if (number === 1000 && i < suffixes.length - 1) {
                number = 1;
                i++;
            }
            number += suffixes[i];
            break;
        }
    }
    return number;
} 