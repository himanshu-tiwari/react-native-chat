export const isNonEmptyString = str => Boolean(str && typeof (str) === "string" && str.length)

export const isObject = obj => Boolean(obj && typeof(obj) === "object");

export const isArray = obj => Boolean(isObject(obj) && obj instanceof Array);

export const isNonEmptyArray = obj => Boolean(isArray(obj) && obj.length > 0);