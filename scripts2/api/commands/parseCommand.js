/**
 * @function parseCommand find json, quotes, and words in strings and removes the prefix
 * @param {String} message 
 * @param {String} prefix 
 * @returns {String[]} 
 */
export function parseCommand(message, prefix) {
	const messageLength = message.length;
	let finding = false;
	let braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0;
	let started = false;
	let o = 0;
	const output = [];
	for (let i = prefix.length; i < messageLength; i++) {
		const char = message[i];
		switch (char) {
			case '{':
				switch (finding) {
					case 'json':
						break;
					default:
						braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
						output.push('');
						o++;
						finding = 'json';
						break;

				}
				output[o] += char;
				braceCount[0]++;
				break;
			case '}':
				output[o] += char;
				if (braceCount[0] !== ++braceCount[1] || bracketCount[0] !== bracketCount[1] || (quoteCount && quoteCount & 1)) break;
				braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
				break;
			case ']':
				output[o] += char;
				if (bracketCount[0] !== ++bracketCount[1] || braceCount[0] !== braceCount[1] || (quoteCount && quoteCount & 1)) break;
				braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
				break;
			case '"':
				switch (finding) {
					case 'json':
						output[o] += char;
						break;
					default:
						braceCount = [0, 0], bracketCount = [0, 0], quoteCount = 0, spaceCount = 0, finding = false;
						finding = 'string';
					case 'string':
						if (!(++quoteCount & 1)) { finding = false; break; };
						if (!output[o].length) break;
						output.push('');
						o++;
						break;
				}
				break;
			case '[':
				switch (finding) {
					case 'json':
						break;
					default:
						output.push('');
						o++;
						finding = 'json';
						break;

				}
				output[o] += char;
				bracketCount[0]++;
				break;
			case ' ':
				switch (finding) {
					case 'string':
					case 'json':
						if (!(quoteCount & 1)) break;
						output[o] += char;
						break;
					default:
						const nextChar = message?.[i + 1];
						switch (nextChar) {
							case ' ':
							case '[':
							case '{':
							case '"':
								break;
							default:
								output.push('');
								o++;
								finding = 'word';
								break;
						}
						break;
				}
				break;
			default:
				if (!started) {
					started = true;
					finding = 'word';
					output.push('');
					spaceCount = 1;
				}
				switch (char) {
					case '@':
						const nextChar = message?.[i + 1];
						switch (nextChar) {
							case '"':
								break;
							default:
								const afterNextChar = message?.[i + 2];
								switch (afterNextChar) {
									case '[':
										finding = 'json';
										output[o] += char;
										break;
								}
								break;
						}
						break;
					default:
						output[o] += char;
						break;
				}

				break;
		}
	}
	return output;
}