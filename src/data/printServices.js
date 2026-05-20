const { serviceCatalog, createServiceItems, getCategoryItems } = require('./serviceCatalog');

const printServices = getCategoryItems('print');
const printCatalogCategories = serviceCatalog.filter((category) => category.slug !== 'souvenirs');
const printCatalogServices = printCatalogCategories.flatMap((category) => createServiceItems(category));

module.exports = { printServices, printCatalogCategories, printCatalogServices };
