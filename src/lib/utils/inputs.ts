export const shouldAcceptAsNumber = (value: string) => {
  const trimmed = value.trim().replace(/,/g, '.');
  const number = Number(trimmed);
  if (isNaN(number) || trimmed.includes('-')) return false;
  return true;
};
