const typeOfSale = {
  //Important to maintain order
  //Example en: ['CASH', 'CREDIT', ...] -> The order in which they are added is maintained
  es: ['CONTADO', 'CRÉDITO'],
  en_us: ['CASH', 'CREDIT'], //This position 0 is always used for outputs already paid in the service class
};

module.exports = typeOfSale;
