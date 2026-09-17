function isUserInputValid(
  userInput: Record<string, any>,
  optionalFields: string[] = [],
): boolean {
  for (const key of Object.keys(userInput)) {
    if (optionalFields.includes(key)) continue;

    const value = userInput[key];
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
  }

  return true;
}

export default isUserInputValid;
