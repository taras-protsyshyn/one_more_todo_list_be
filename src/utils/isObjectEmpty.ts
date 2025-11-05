export const isObjectEmpty = (obj?: object): boolean => {
  return !!(obj && Object.keys(obj).length === 0 && obj.constructor === Object);
};
