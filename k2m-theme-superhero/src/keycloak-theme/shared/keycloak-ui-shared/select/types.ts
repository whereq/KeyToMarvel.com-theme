export const propertyToString = (prop: string | number | undefined) =>
  typeof prop === "number" ? prop + "px" : prop;
