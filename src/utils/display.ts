export const capitalize = (value: string) => value.replace(value[0], value[0].toUpperCase());

export const formatEnum = (enumValue: string) => {
  if (enumValue.length <= 2) return enumValue;
  const splitted = enumValue.split("_");
  const formatted = splitted.map((word) => {
    const wordsAfterFirstLetter = word.slice(1);
    return word.replace(wordsAfterFirstLetter, wordsAfterFirstLetter.toLowerCase());
  });
  return formatted.join("-");
};
