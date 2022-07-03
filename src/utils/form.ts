export const sanitizeInput = <T extends Record<string, string | number>>(data: T): T => {
  let sanitizedData: T = {} as T;
  for (let dataKey in data) {
    if (typeof data[dataKey] === "string") {
      sanitizedData = { ...sanitizedData, [dataKey]: trimInput(data[dataKey] as string) };
    }
    sanitizedData = { ...sanitizedData, [dataKey]: data[dataKey] };
  }
  return sanitizedData;
};
const trimInput = (input: string) => input.trim();
