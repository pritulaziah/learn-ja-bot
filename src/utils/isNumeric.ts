function isNumeric(n: unknown): n is number {
  const parse = parseFloat(String(n));

  return !isNaN(parse) && isFinite(parse);
};

export default isNumeric;
