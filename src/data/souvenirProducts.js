const { getCategoryItems } = require('./serviceCatalog');

const souvenirProducts = getCategoryItems('souvenirs').map((item) => ({
  ...item,
  branding: 'УФ-печать, гравировка, тампопечать или другая технология под материал',
  minOrder: 'по запросу'
}));

module.exports = { souvenirProducts };
