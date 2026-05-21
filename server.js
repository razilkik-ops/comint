const express = require('express');
const path = require('path');

const siteConfig = require('./src/config/siteConfig');
const { printServices, printCatalogCategories, printCatalogServices } = require('./src/data/printServices');
const { souvenirProducts } = require('./src/data/souvenirProducts');
const {
  serviceCatalog,
  createServiceItems,
  getServiceBySlug,
  getRelatedServices
} = require('./src/data/serviceCatalog');
const serviceContent = require('./src/data/serviceContent.json');
const { headerPrimaryMenu, createHeaderCatalogMenu } = require('./src/data/headerMenu');
const headerPages = require('./src/data/headerPages');
const { submitLeadToCRM } = require('./src/services/crmService');
const { searchServices, searchServiceCatalog } = require('./src/services/serviceSearch');

const app = express();
const PORT = process.env.PORT || 3000;
const pageMeta = {
  '/': {
    description: 'Comint: полиграфия, сувенирная продукция и брендированные материалы для бизнеса.'
  },
  '/services': {
    description: 'Каталог услуг типографии Comint: полиграфия, сувениры, наружная реклама, выставочные конструкции и POS-материалы.'
  },
  '/contacts': {
    description: 'Контакты Comint: телефоны, почта, адрес офиса, карта проезда и реквизиты компании.'
  },
  '/company': {
    description: 'О компании Comint: история, производство, сертификаты и оборудование типографии.'
  },
  '/cases': {
    description: 'Портфолио Comint: примеры комплексного оформления, брендирования и рекламных работ.'
  },
  '/oplata-i-dostavka': {
    description: 'Оплата и доставка заказов Comint: способы оплаты, ЕРИП, Webpay, самовывоз и доставка по Минску.'
  },
  '/news': {
    description: 'Блог Comint: статьи о полиграфии, этикетках, брендированной продукции и рекламных материалах.'
  },
  '/reviews': {
    description: 'Отзывы клиентов о работе типографии Comint.'
  },
  '/karta-sajta': {
    description: 'Карта сайта Comint со списком основных страниц, категорий и услуг.'
  }
};

function metaFor(pathname) {
  const meta = pageMeta[pathname] || {};
  return {
    pageDescription: meta.description,
    canonicalPath: pathname
  };
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.locals.requestPath = req.path;
  res.locals.searchQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  next();
});

app.locals.siteConfig = siteConfig;
app.locals.serviceCategories = serviceCatalog.map((category) => category.title);
app.locals.serviceCatalog = serviceCatalog;
app.locals.createServiceItems = createServiceItems;
app.locals.headerPrimaryMenu = headerPrimaryMenu;
app.locals.headerCatalogMenu = createHeaderCatalogMenu(serviceCatalog, createServiceItems);

app.get('/', (req, res) => {
  res.render('pages/home', {
    pageTitle: 'Comint — полиграфия и сувенирная продукция',
    ...metaFor('/'),
    currentPath: '/',
    printServices,
    souvenirProducts,
    serviceCatalog
  });
});

app.get('/services', (req, res) => {
  const searchQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const visibleServiceCatalog = searchQuery ? searchServiceCatalog(searchQuery) : serviceCatalog;
  const searchResultCount = visibleServiceCatalog.reduce((count, category) => (
    count + createServiceItems(category).length
  ), 0);

  res.render('pages/services', {
    pageTitle: 'Каталог услуг — Comint',
    ...metaFor('/services'),
    currentPath: '/services',
    pageBodyClass: 'catalog-page',
    serviceCatalog,
    visibleServiceCatalog,
    searchQuery,
    searchResultCount,
    createServiceItems
  });
});

app.get('/api/services/search', (req, res) => {
  const searchQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (!searchQuery) {
    return res.json({ query: searchQuery, results: [] });
  }

  const results = searchServices(searchQuery, { limit: 8 }).map((item) => ({
    title: item.title,
    url: item.url,
    category: item.category
  }));

  res.json({ query: searchQuery, results });
});

app.get('/service/:slug', (req, res) => {
  res.redirect(301, `/services/${req.params.slug}`);
});

app.get('/services/:slug', (req, res, next) => {
  const service = getServiceBySlug(req.params.slug);

  if (!service) {
    return next();
  }

  res.render('pages/service-detail', {
    pageTitle: `${serviceContent[service.slug]?.title || service.title} — Comint`,
    pageDescription: service.description,
    canonicalPath: `/services/${service.slug}`,
    currentPath: '/services',
    pageBodyClass: 'service-detail-body',
    service,
    content: serviceContent[service.slug] || null,
    relatedServices: getRelatedServices(service.slug)
  });
});

app.get('/print', (req, res) => {
  res.render('pages/print', {
    pageTitle: 'Полиграфия — Comint',
    pageDescription: 'Полиграфические услуги Comint: печать, подготовка макетов и рекламные материалы для бизнеса.',
    canonicalPath: '/print',
    currentPath: '/print',
    pageBodyClass: 'print-page',
    services: printCatalogServices,
    printCatalogCategories,
    serviceCatalog
  });
});

app.get('/souvenirs', (req, res) => {
  res.render('pages/souvenirs', {
    pageTitle: 'Сувенирная продукция — Comint',
    pageDescription: 'Сувенирная продукция Comint: брендированные подарки, мерч и нанесение логотипов.',
    canonicalPath: '/souvenirs',
    currentPath: '/souvenirs',
    pageBodyClass: 'souvenirs-page',
    products: souvenirProducts,
    serviceCatalog
  });
});

app.get('/contacts', (req, res) => {
  res.render('pages/contacts', {
    pageTitle: 'Контакты — Comint',
    ...metaFor('/contacts'),
    currentPath: '/contacts'
  });
});

app.get('/company', (req, res) => {
  res.render('pages/company', {
    pageTitle: 'О компании — Comint',
    ...metaFor('/company'),
    currentPath: '/company',
    pageBodyClass: 'company-page',
    equipment: headerPages.equipment
  });
});

app.get('/cases', (req, res) => {
  res.render('pages/cases', {
    pageTitle: 'Портфолио — Comint',
    ...metaFor('/cases'),
    currentPath: '/cases',
    portfolio: headerPages.portfolio
  });
});

app.get('/oplata-i-dostavka', (req, res) => {
  res.render('pages/buyer', {
    pageTitle: 'Покупателю - Comint',
    ...metaFor('/oplata-i-dostavka'),
    currentPath: '/oplata-i-dostavka',
    orderSteps: headerPages.orderSteps
  });
});

app.get('/news', (req, res) => {
  res.render('pages/news', {
    pageTitle: 'Блог — Comint',
    ...metaFor('/news'),
    currentPath: '/news',
    articles: headerPages.articles
  });
});

app.get('/reviews', (req, res) => {
  res.render('pages/reviews', {
    pageTitle: 'Отзывы — Comint',
    ...metaFor('/reviews'),
    currentPath: '/reviews',
    reviews: headerPages.reviews
  });
});

app.get('/karta-sajta', (req, res) => {
  res.render('pages/sitemap', {
    pageTitle: 'Карта сайта — Comint',
    ...metaFor('/karta-sajta'),
    currentPath: '/karta-sajta',
    headerPrimaryMenu,
    serviceCatalog,
    createServiceItems
  });
});

app.post('/api/leads', async (req, res) => {
  const lead = {
    name: req.body.name || '',
    phone: req.body.phone || '',
    email: req.body.email || '',
    company: req.body.company || '',
    category: req.body.category || '',
    productOrService: req.body.productOrService || '',
    quantity: req.body.quantity || '',
    comment: req.body.comment || '',
    sourcePage: req.body.sourcePage || req.get('referer') || 'unknown'
  };

  try {
    const result = await submitLeadToCRM(lead);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Не удалось отправить заявку. Попробуйте позже или свяжитесь с менеджером.',
      error: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).render('pages/not-found', {
    pageTitle: 'Страница не найдена — Comint',
    currentPath: req.path
  });
});

app.listen(PORT, () => {
  console.log(`Comint site is running on http://localhost:${PORT}`);
});
