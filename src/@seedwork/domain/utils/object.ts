export function deepFreeze<T>(obj: T) {
  const properties = Object.getOwnPropertyNames(obj);
  for(const property of properties) {
    const value = obj[property as keyof T];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}