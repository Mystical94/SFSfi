export default (gasEstimate: string, cantoPrice: number) => {
  return ((Number(gasEstimate) / 1e6) * cantoPrice).toFixed(2);
};
