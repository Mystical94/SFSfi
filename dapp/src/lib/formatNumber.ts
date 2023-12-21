const formatNumber = (balance: string, decimalPlaces = 4) => {
  const formatted = parseFloat(parseFloat(balance).toFixed(decimalPlaces));
  if (formatted === parseFloat(balance)) {
    return formatted;
  }
  return `~${formatted}`;
};

export default formatNumber;
