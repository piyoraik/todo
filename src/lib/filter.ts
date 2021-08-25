export const noNull = <T>(value: T): value is Exclude<T, null> => {
  return value !== null
}
