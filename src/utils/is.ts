export function isEmptyObject(obj: Record<string, any>) {
  if (obj instanceof Object) {
    return Object.keys(obj).length === 0;
  }
  return true;
}