const changeCaseFirstLetter = (toCase) => (string) => string.charAt(0)[toCase]() + string.slice(1);

export const uppercaseFirstLetter = changeCaseFirstLetter('toUpperCase');
export const lowercaseFirstLetter = changeCaseFirstLetter('toLowerCase');