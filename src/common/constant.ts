export const getPriceWithComma = (price: number) => {
  return new Intl.NumberFormat().format(price);
};
