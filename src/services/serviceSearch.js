const {
  serviceCatalog,
  createServiceItems,
  getAllServiceItems
} = require('../data/serviceCatalog');
const serviceContent = require('../data/serviceContent.json');

const STOP_WORDS = new Set([
  'а', 'без', 'в', 'во', 'для', 'до', 'и', 'из', 'или', 'к', 'как', 'на', 'над',
  'о', 'об', 'от', 'по', 'под', 'при', 'с', 'со', 'у', 'что', 'это', 'за',
  'мне', 'нам', 'нужно', 'нужна', 'нужен', 'нужны', 'хочу', 'сделать',
  'изготовить', 'заказать', 'купить'
]);

const INTENTS = [
  {
    match: ['мерч', 'бренд', 'брендирование', 'сувенир', 'сувениры', 'подарок', 'подарки', 'промо', 'корпоративный', 'корпоративные'],
    terms: ['сувенирная продукция логотип подарочные наборы ручки кружки ежедневники флешки брелоки пакеты мерч'],
    categories: ['souvenirs', 'textile']
  },
  {
    match: ['логотип', 'лого', 'нанесение', 'напечатать на', 'брендировать'],
    terms: ['логотип брендирование уф печать сувениры ручки кружки пакеты футболки кепки флешки'],
    categories: ['souvenirs', 'textile'],
    slugs: ['uf-pechat-v-minske', 'ruchki-s-logotipom', 'firmennyie-kruzhki', 'fleshki-s-logotipom']
  },
  {
    match: ['листовка', 'листовки', 'раздатка', 'реклама в руки', 'промо материалы'],
    terms: ['листовки флаеры буклеты раздаточные материалы полиграфия'],
    categories: ['print'],
    slugs: ['pechat-listovok', 'flaery', 'buklety', 'razdatochnue_materialu']
  },
  {
    match: ['визитка', 'визитки', 'контакты', 'карточка компании'],
    terms: ['визитки карточки контактные данные полиграфия'],
    categories: ['print'],
    slugs: ['izgotovlenie-i-pechat-vizitok']
  },
  {
    match: ['стикер', 'стикеры', 'наклейка', 'наклейки', 'самоклейка', 'этикетка', 'этикетки', 'пломба', 'пломбы'],
    terms: ['самоклеющаяся продукция наклейки этикетки пломбы плоттерная резка пленка бумага'],
    categories: ['stickers'],
    slugs: ['naklejki-print', 'naklejka-iz-bymagi', 'etiketki', 'garantijnye-plomby-pechatnye']
  },
  {
    match: ['баннер', 'баннеры', 'растяжка', 'растяжки', 'большой формат', 'широкий формат', 'флаг', 'флаги', 'улица', 'уличная реклама'],
    terms: ['широкоформатная печать баннеры растяжки флаги сетка наружная реклама улица'],
    categories: ['large-format'],
    slugs: ['bannery', 'reklamnye-bannery-rastyazhki', 'flagi']
  },
  {
    match: ['пресс волл', 'прессволл', 'брендволл', 'бренд волл', 'фон для фото', 'фотозона'],
    terms: ['пресс волл брендволл пресс стена фоны декорации фотозона'],
    categories: ['large-format'],
    slugs: ['fonyi-pressvolyi']
  },
  {
    match: ['вывеска', 'вывески', 'наружная реклама', 'фасад', 'табличка на фасад', 'световые буквы', 'лайтбокс', 'штендер'],
    terms: ['наружная реклама вывески фасадные таблички световые короба объемные буквы штендер'],
    categories: ['outdoor'],
    slugs: ['vyveski', 'fasadnye-tablichki', 'svetovye-koroba', 'obemnye-bukvy', 'shtender']
  },
  {
    match: ['выставка', 'стенд', 'экспо', 'презентация', 'roll up', 'ролл ап', 'pop up', 'поп ап', 'промостойка'],
    terms: ['оформление выставок мобильные стенды roll up pop up промостойки буклетницы выставочные конструкции'],
    categories: ['exhibitions', 'mobile-equipment'],
    slugs: ['expo-komplex', 'mobilnye-expo-konstrukcii', 'roll-ap-stendy', 'pop-up-stendy', 'promo-stojki']
  },
  {
    match: ['магазин', 'торговый зал', 'витрина', 'витрины', 'pos', 'пос', 'полка', 'ценникодержатель', 'воблер', 'шелфтокер'],
    terms: ['оформление мест продаж POS материалы торговый зал витрины ценникодержатели воблеры шелфтокеры стопперы'],
    categories: ['retail'],
    slugs: ['kompleksnoe-oformlenie-mest-prodazh', 'pos-materialy', 'czennikoderzhateli-iz-plastika-i-orgstekla', 'reklamnye-voblery']
  },
  {
    match: ['офис', 'навигация', 'указатель', 'указатели', 'стенд информации', 'информационный стенд', 'табличка офис'],
    terms: ['навигация информационные стенды офисные таблички указатели'],
    categories: ['navigation', 'outdoor'],
    slugs: ['informaczionnye-stendy', 'ofisnyie-tablichki', 'fasadnye-tablichki']
  },
  {
    match: ['интерьер', 'декор', 'стена', 'стены', 'фотообои', 'холст', 'постер', 'плакат', 'скинали', 'стекло'],
    terms: ['декор интерьера фотообои холст постеры плакаты скинали матирование стекла наклейки на стены'],
    categories: ['decor'],
    slugs: ['fotooboi', 'pechat-na-xolste', 'posteryi-i-plakatyi', 'skinali', 'matirovanie-stekol']
  },
  {
    match: ['одежда', 'текстиль', 'ткань', 'футболка', 'футболки', 'сумка', 'сумки', 'шоппер', 'кепка', 'кепки'],
    terms: ['одежда текстиль печать на ткани сумках кепки эко сумки логотип'],
    categories: ['textile', 'souvenirs'],
    slugs: ['pechat-na-tkani-i-sumkah', 'eko-sumki', 'kepki']
  },
  {
    match: ['авто', 'машина', 'машину', 'автомобиль', 'транспорт'],
    terms: ['наклейки на автомобиль карточки с телефоном для машин реклама на транспорте'],
    categories: ['transport', 'print'],
    slugs: ['naklejki-na-avto', 'kartochki-s-telefonom-dlya-mashin']
  },
  {
    match: ['документ', 'документы', 'оформление документов', 'бланк', 'бланки', 'папка', 'папки', 'сертификат', 'сертификаты', 'инструкция'],
    terms: ['фирменные бланки папки сертификаты инструкции гарантийные талоны пропуска прайс листы'],
    categories: ['print'],
    slugs: ['pechat-firmennyh-blankov', 'papki', 'sertifikaty-diplomy', 'instrukciya', 'garantijnye-talony']
  },
  {
    match: ['еда', 'кафе', 'ресторан', 'меню'],
    terms: ['печать меню ценники наклейки таблички'],
    categories: ['print', 'stickers'],
    slugs: ['pechat-menyu', 'cenniki', 'etiketki']
  },
  {
    match: ['мероприятие', 'ивент', 'событие', 'билет', 'билеты', 'приглашение', 'приглашения', 'бейдж', 'бейджи'],
    terms: ['билеты приглашения бейджи флаеры буклеты баннеры сувениры'],
    categories: ['print', 'souvenirs'],
    slugs: ['priglasheniya-bilety', 'bejdzh', 'flaery', 'buklety']
  }
];

function stripHtml(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-zа-я0-9#]+;/gi, ' ');
}

function normalize(value = '') {
  return stripHtml(value)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stem(token) {
  if (token.length < 5) {
    return token;
  }

  return token.replace(/(иями|ями|ами|ого|ему|ыми|ими|ией|иях|ые|ий|ый|ой|ая|ое|ые|ие|ых|их|ам|ям|ах|ях|ом|ем|ов|ев|ей|ия|ья|ки|ка|ку|ой|ою|ую|юю|а|я|ы|и|е|у|ю)$/u, '');
}

function tokenize(value) {
  return normalize(value)
    .split(' ')
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
    .map(stem);
}

function uniqueTokens(value) {
  return Array.from(new Set(tokenize(value)));
}

function editDistanceAtMostOne(left, right) {
  if (Math.abs(left.length - right.length) > 1) {
    return false;
  }

  let edits = 0;
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      i += 1;
      j += 1;
      continue;
    }

    edits += 1;

    if (edits > 1) {
      return false;
    }

    if (left.length > right.length) {
      i += 1;
    } else if (right.length > left.length) {
      j += 1;
    } else {
      i += 1;
      j += 1;
    }
  }

  return true;
}

function contentTextFor(slug) {
  const content = serviceContent[slug];

  if (!content) {
    return '';
  }

  const sectionText = Array.isArray(content.sections)
    ? content.sections.map((section) => `${section.title || ''} ${section.html || ''}`).join(' ')
    : '';

  return [
    content.title,
    content.category,
    content.metaDescription,
    content.excerpt,
    sectionText
  ].filter(Boolean).join(' ');
}

function buildIntent(query) {
  const normalizedQuery = normalize(query);
  const queryTokens = uniqueTokens(normalizedQuery);
  const matched = INTENTS.filter((intent) => (
    intent.match.some((term) => {
      const normalizedTerm = normalize(term);
      const termTokens = uniqueTokens(normalizedTerm);

      return normalizedQuery.includes(normalizedTerm)
        || termTokens.every((token) => (
          queryTokens.some((queryToken) => queryToken === token || queryToken.startsWith(token) || token.startsWith(queryToken))
        ));
    })
  ));

  return {
    terms: matched.flatMap((intent) => intent.terms || []),
    categories: new Set(matched.flatMap((intent) => intent.categories || [])),
    slugs: new Set(matched.flatMap((intent) => intent.slugs || []))
  };
}

const searchIndex = getAllServiceItems().map((item) => {
  const category = serviceCatalog.find((entry) => entry.slug === item.categorySlug);
  const contentText = contentTextFor(item.slug);
  const aliasText = [
    item.title,
    item.category,
    category?.intro,
    item.description,
    contentText
  ].filter(Boolean).join(' ');

  return {
    item,
    category,
    title: normalize(item.title),
    categoryText: normalize(`${item.category} ${category?.intro || ''}`),
    fullText: normalize(aliasText),
    titleTokens: uniqueTokens(item.title),
    categoryTokens: uniqueTokens(`${item.category} ${category?.intro || ''}`),
    fullTokens: uniqueTokens(aliasText)
  };
});

function scoreDocument(document, rawQuery) {
  const intent = buildIntent(rawQuery);
  const normalizedQuery = normalize(rawQuery);
  const queryTokens = uniqueTokens([rawQuery, ...intent.terms].join(' '));

  if (!normalizedQuery || !queryTokens.length) {
    return 0;
  }

  let score = 0;

  if (document.item.slug === normalizedQuery) {
    score += 200;
  }

  if (document.title === normalizedQuery) {
    score += 160;
  } else if (document.title.includes(normalizedQuery)) {
    score += 95;
  }

  if (document.categoryText.includes(normalizedQuery)) {
    score += 38;
  }

  if (document.fullText.includes(normalizedQuery)) {
    score += 24;
  }

  if (intent.slugs.has(document.item.slug)) {
    score += 160;
  }

  if (intent.categories.has(document.item.categorySlug)) {
    score += 55;
  }

  queryTokens.forEach((token) => {
    const titleExact = document.titleTokens.includes(token);
    const titlePrefix = document.titleTokens.some((entry) => entry.startsWith(token) || token.startsWith(entry));
    const titleFuzzy = token.length >= 5 && document.titleTokens.some((entry) => editDistanceAtMostOne(token, entry));
    const categoryExact = document.categoryTokens.includes(token);
    const fullExact = document.fullTokens.includes(token);
    const fullPrefix = document.fullTokens.some((entry) => entry.startsWith(token) || token.startsWith(entry));
    const fullFuzzy = token.length >= 5 && document.fullTokens.some((entry) => editDistanceAtMostOne(token, entry));

    if (titleExact) {
      score += 50;
    } else if (titlePrefix) {
      score += 30;
    } else if (titleFuzzy) {
      score += 20;
    }

    if (categoryExact) {
      score += 14;
    }

    if (fullExact) {
      score += 8;
    } else if (fullPrefix) {
      score += 5;
    } else if (fullFuzzy) {
      score += 3;
    }
  });

  return score;
}

function searchServices(query, options = {}) {
  const limit = options.limit || 20;
  const minScore = options.minScore || 12;

  return searchIndex
    .map((document) => ({
      ...document.item,
      score: scoreDocument(document, query)
    }))
    .filter((item) => item.score >= minScore)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, 'ru'))
    .slice(0, limit);
}

function searchServiceCatalog(query) {
  const results = searchServices(query, { limit: 200, minScore: 12 });

  if (!normalize(query)) {
    return serviceCatalog;
  }

  return serviceCatalog
    .map((category) => {
      const services = results.filter((item) => item.categorySlug === category.slug);
      return { ...category, services };
    })
    .filter((category) => category.services.length > 0);
}

module.exports = {
  searchServices,
  searchServiceCatalog,
  normalize
};
