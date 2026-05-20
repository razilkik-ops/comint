const headerPrimaryMenu = [
  { title: 'О компании', url: '/company' },
  { title: 'Каталог', url: '/services' },
  { title: 'Наши работы', url: '/cases' },
  { title: 'Покупателю', url: '/oplata-i-dostavka' },
  { title: 'Блог', url: '/news' },
  { title: 'Отзывы', url: '/reviews' },
  { title: 'Контакты', url: '/contacts' },
  { title: 'Карта сайта', url: '/karta-sajta' }
];

const hiddenMenuSourceUrls = new Set([
  'https://comint.by/shirokoformatnaya-pechat/flagi/'
]);

function createHeaderCatalogMenu(serviceCatalog, createServiceItems) {
  return serviceCatalog.map((category) => ({
    title: category.title,
    url: `/services#category-${category.slug}`,
    children: createServiceItems(category)
      .filter((item) => !hiddenMenuSourceUrls.has(item.sourceUrl))
      .map((item) => ({
        title: item.title,
        url: item.url,
        children: []
      }))
  }));
}

module.exports = {
  headerPrimaryMenu,
  createHeaderCatalogMenu
};
