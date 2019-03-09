export const encode = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString('base64');
export const decode = (str) =>
  JSON.parse(Buffer.from(str, 'base64').toString());
