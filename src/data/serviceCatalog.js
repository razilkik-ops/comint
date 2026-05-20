function service(title, sourceUrl) {
  const url = new URL(sourceUrl);
  const slug = url.pathname.split('/').filter(Boolean).pop();

  return {
    title,
    slug,
    sourceUrl
  };
}

const serviceCatalog = [
  {
    title: 'Полиграфия',
    slug: 'print',
    route: '/print',
    accent: 'teal',
    intro: 'Оперативная и рекламная полиграфия для продаж, офиса, мероприятий и ежедневной работы компании.',
    services: [
      service('Карточки с телефоном для машин', 'https://comint.by/cifrovaya-pechat/kartochki-s-telefonom-dlya-mashin/'),
      service('Фирменные конверты с логотипом', 'https://comint.by/cifrovaya-pechat/firmennye-konverty-s-logotipom/'),
      service('Магниты с блоком для записей', 'https://comint.by/cifrovaya-pechat/magnityi-blok/'),
      service('Папки', 'https://comint.by/cifrovaya-pechat/papki/'),
      service('Свадебная полиграфия', 'https://comint.by/cifrovaya-pechat/svadebnaya-poligraphiya/'),
      service('Блоки для записей', 'https://comint.by/cifrovaya-pechat/bloki-dlya-zapisej-kub-bloki/'),
      service('Ценники', 'https://comint.by/cifrovaya-pechat/cenniki/'),
      service('Бирки и ярлыки', 'https://comint.by/cifrovaya-pechat/izgotovlenie-birok-i-yarlykov/'),
      service('Сертификаты', 'https://comint.by/cifrovaya-pechat/sertifikaty-diplomy/'),
      service('Раздаточные материалы', 'https://comint.by/cifrovaya-pechat/razdatochnue_materialu/'),
      service('Гарантийные талоны', 'https://comint.by/cifrovaya-pechat/garantijnye-talony/'),
      service('Инструкции', 'https://comint.by/cifrovaya-pechat/instrukciya/'),
      service('Пропуска', 'https://comint.by/cifrovaya-pechat/propusk/'),
      service('Прайс-листы', 'https://comint.by/cifrovaya-pechat/price_list/'),
      service('Фирм. бланки', 'https://comint.by/cifrovaya-pechat/pechat-firmennyh-blankov/'),
      service('Плакаты и афиши', 'https://comint.by/cifrovaya-pechat/plakaty-afishy/'),
      service('Билеты', 'https://comint.by/cifrovaya-pechat/priglasheniya-bilety/'),
      service('Открытки', 'https://comint.by/cifrovaya-pechat/izgotovlenie-i-pechat-otkrytok/'),
      service('Блокноты', 'https://comint.by/cifrovaya-pechat/bloknoty/'),
      service('Меню', 'https://comint.by/cifrovaya-pechat/pechat-menyu/'),
      service('Каталоги', 'https://comint.by/cifrovaya-pechat/katalogi/'),
      service('Брошюры', 'https://comint.by/cifrovaya-pechat/broshury/'),
      service('Флаеры', 'https://comint.by/cifrovaya-pechat/flaery/'),
      service('Дизайн полиграфии', 'https://comint.by/cifrovaya-pechat/design-poligrafii/'),
      service('Буклеты', 'https://comint.by/cifrovaya-pechat/buklety/'),
      service('Листовки', 'https://comint.by/cifrovaya-pechat/pechat-listovok/'),
      service('Дисконтные карты', 'https://comint.by/cifrovaya-pechat/discount/'),
      service('Визитки', 'https://comint.by/cifrovaya-pechat/izgotovlenie-i-pechat-vizitok/'),
      service('Бейджи', 'https://comint.by/cifrovaya-pechat/bejdzh/')
    ]
  },
  {
    title: 'Сувенирная продукция',
    slug: 'souvenirs',
    route: '/souvenirs',
    accent: 'coral',
    intro: 'Брендированные подарки, мерч и предметы с логотипом для клиентов, сотрудников и мероприятий.',
    services: [
      service('Картонные коробки и пакеты для упаковки', 'https://comint.by/suveniryi/kartonnye-korobki-i-pakety-dlya-upakovki/'),
      service('УФ печать в Минске', 'https://comint.by/suveniryi/uf-pechat-v-minske/'),
      service('Ручки с логотипом', 'https://comint.by/suveniryi/ruchki-s-logotipom/'),
      service('Ежедневники и планинги', 'https://comint.by/suveniryi/ezhednevniki/'),
      service('Брелоки с логотипом', 'https://comint.by/suveniryi/breloki-s-logotipom/'),
      service('Печать на магнитах', 'https://comint.by/suveniryi/pechat-na-magnitax1/'),
      service('Сувенирные настенные часы с логотипом компании', 'https://comint.by/suveniryi/chasy/'),
      service('Тканевые, баннерные и бумажные флажки', 'https://comint.by/suveniryi/flazhki/'),
      service('Фирменные бумажные пакеты с логотипом', 'https://comint.by/suveniryi/bumazhnyie-paketyi/'),
      service('Полиэтиленовые пакеты с логотипом', 'https://comint.by/suveniryi/polietilenovyie-paketyi/'),
      service('Флешки с логотипом', 'https://comint.by/suveniryi/fleshki-s-logotipom/'),
      service('Зажигалки с логотипом', 'https://comint.by/suveniryi/zazhigalki/'),
      service('Подарочные наборы', 'https://comint.by/suveniryi/podarochnyie-naboryi/'),
      service('Печать на кружках', 'https://comint.by/suveniryi/firmennyie-kruzhki/'),
      service('Коврики для мыши', 'https://comint.by/suveniryi/kovriki-dlya-myishi/'),
      service('Печать на тарелках', 'https://comint.by/suveniryi/tarelki/'),
      service('Печать логотипов на пазлах', 'https://comint.by/suveniryi/pazlyi/'),
      service('Кепки с логотипом', 'https://comint.by/suveniryi/kepki/'),
      service('Печать на тканевых сумках', 'https://comint.by/suveniryi/eko-sumki/'),
      service('Подставки под кружку', 'https://comint.by/suveniryi/podstavki-iz-probki/'),
      service('Зеркала карманные', 'https://comint.by/suveniryi/zerkala-karmannye/'),
      service('Сувениры для медработников', 'https://comint.by/suveniryi/suveniry-dlya-medrabotnikov/')
    ]
  },
  {
    title: 'Самоклеющаяся продукция',
    slug: 'stickers',
    accent: 'mustard',
    intro: 'Наклейки, этикетки, пломбы и самоклеящиеся материалы для упаковки, навигации и рекламы.',
    services: [
      service('Изготовление и печать полноцветных наклеек из пленки', 'https://comint.by/samokleyushhayasya-produkcziya/naklejki-print/'),
      service('Печать наклеек из самоклеящейся бумаги', 'https://comint.by/samokleyushhayasya-produkcziya/naklejka-iz-bymagi/'),
      service('Самоклеящиеся этикетки', 'https://comint.by/samokleyushhayasya-produkcziya/etiketki/'),
      service('Изготовление наклеек на плоттере', 'https://comint.by/samokleyushhayasya-produkcziya/naklejki_plotter/'),
      service('Гарантийные пломбы печатные', 'https://comint.by/samokleyushhayasya-produkcziya/garantijnye-plomby-pechatnye/'),
      service('Знаки безопасности', 'https://comint.by/samokleyushhayasya-produkcziya/izgotovlenie-znakov-bezopasnosti/'),
      service('Напольные наклейки', 'https://comint.by/samokleyushhayasya-produkcziya/naklejki-na-pol/'),
      service('Трафареты. Изготовление самоклеющихся трафаретов для стен.', 'https://comint.by/samokleyushhayasya-produkcziya/trafarety/'),
      service('Плоттерная резка', 'https://comint.by/samokleyushhayasya-produkcziya/plotternaya-rezka/')
    ]
  },
  {
    title: 'Наружная реклама',
    slug: 'outdoor',
    accent: 'ink',
    intro: 'Вывески, таблички, лайтбоксы и рекламные конструкции для фасадов и городского пространства.',
    services: [
      service('Изготовление фасадных табличек и информационных указателей', 'https://comint.by/naruzhnaya-reklama/fasadnye-tablichki/'),
      service('Изготовление наружных рекламных вывесок', 'https://comint.by/naruzhnaya-reklama/vyveski/'),
      service('Световые короба (лайтбоксы)', 'https://comint.by/naruzhnaya-reklama/svetovye-koroba/'),
      service('Изготовление световых объемных букв', 'https://comint.by/naruzhnaya-reklama/obemnye-bukvy/'),
      service('Изготовление штендеров', 'https://comint.by/naruzhnaya-reklama/shtender/'),
      service('Рекламные пилоны, стеллы и другие отдельностоящие рекламные конструкции', 'https://comint.by/naruzhnaya-reklama/pilony/'),
      service('Оформление витрин магазинов, реклама на витринах', 'https://comint.by/naruzhnaya-reklama/oformlenie-vitrin-minsk/'),
      service('Оформление паспорта наружной рекламы', 'https://comint.by/naruzhnaya-reklama/oformlenie-naruzhnoj-reklamy/')
    ]
  },
  {
    title: 'Широкоформатная печать',
    slug: 'large-format',
    accent: 'teal',
    intro: 'Баннеры, растяжки, флаги, пресс-воллы и крупные рекламные материалы для улицы и помещений.',
    services: [
      service('Печать флагов, вымпелов, знамен в Минске', 'https://comint.by/shirokoformatnaya-pechat/flagi/'),
      service('Печать баннеров', 'https://comint.by/shirokoformatnaya-pechat/bannery/'),
      service('Рекламные баннеры-растяжки', 'https://comint.by/shirokoformatnaya-pechat/reklamnye-bannery-rastyazhki/'),
      service('Строительная сетка для ограждения', 'https://comint.by/shirokoformatnaya-pechat/setka/'),
      service('Пресс волл (press wall), брендволл, пресс стена, фоны, декорации', 'https://comint.by/shirokoformatnaya-pechat/fonyi-pressvolyi/')
    ]
  },
  {
    title: 'Оформление выставок',
    slug: 'exhibitions',
    accent: 'coral',
    intro: 'Оформление стендов, мобильные конструкции и графика для выставок и презентационных зон.',
    services: [
      service('Спецпредложение «Выставка под ключ»', 'https://comint.by/oformlenie-vystavok/expo-komplex/'),
      service('Мобильные выставочные конструкции для стендов', 'https://comint.by/oformlenie-vystavok/mobilnye-expo-konstrukcii/'),
      service('Дизайн и проектирование выставочных стендов', 'https://comint.by/oformlenie-vystavok/dizajn-expo-stendov/'),
      service('Оформление и оклейка выставочных стендов графикой', 'https://comint.by/oformlenie-vystavok/oformlenie-expo-stendov/')
    ]
  },
  {
    title: 'Печать и изготовление календарей',
    slug: 'calendars',
    accent: 'mustard',
    intro: 'Фирменные календари для клиентов, партнеров и внутренней коммуникации компании.',
    services: [
      service('Настольные календари-домики', 'https://comint.by/pechat-i-izgotovlenie-kalendarej/nastolnye-kalendari-domiki/'),
      service('Настенные перекидные календари', 'https://comint.by/pechat-i-izgotovlenie-kalendarej/perekidnye-nastennye-kalendari/'),
      service('Квартальные календари', 'https://comint.by/pechat-i-izgotovlenie-kalendarej/kvartalnye-kalendari/'),
      service('Карманные календари', 'https://comint.by/pechat-i-izgotovlenie-kalendarej/karmannye-kalendari/')
    ]
  },
  {
    title: 'Декор интерьера',
    slug: 'decor',
    accent: 'ink',
    intro: 'Фотообои, постеры, печать на холсте, матирование и декоративные решения для помещений.',
    services: [
      service('Изготовление фотообоев на заказ', 'https://comint.by/decor-interjera/fotooboi/'),
      service('Матирование стекла пленкой с эффектом «иней»', 'https://comint.by/decor-interjera/matirovanie-stekol/'),
      service('Печать на холсте репродукций картин и фотографий', 'https://comint.by/decor-interjera/pechat-na-xolste/'),
      service('Печать фотографий большого формата', 'https://comint.by/decor-interjera/fotografii/'),
      service('Декоративные наклейки на стены и мебель, стикеры на холодильник', 'https://comint.by/decor-interjera/naklejki-na-stenyi-i-mebel/'),
      service('Трафареты для декора', 'https://comint.by/decor-interjera/trafaretyi-dlya-okraski-sten/'),
      service('Печать постеров и плакатов большого формата', 'https://comint.by/decor-interjera/posteryi-i-plakatyi/'),
      service('Скинали для кухни', 'https://comint.by/decor-interjera/skinali/')
    ]
  },
  {
    title: 'Оформление мест продаж',
    slug: 'retail',
    accent: 'teal',
    intro: 'POS-материалы, навигация, воблеры, шелфтокеры и элементы оформления торгового зала.',
    services: [
      service('Комплексное оформление магазина, рекламное оформление торгового зала', 'https://comint.by/info-pos/kompleksnoe-oformlenie-mest-prodazh/'),
      service('Информационные и рекламные указатели, навигация в торговом зале', 'https://comint.by/info-pos/reklamnyie-ukazateli/'),
      service('Pos материалы', 'https://comint.by/info-pos/pos-materialy/'),
      service('Подставки под товары из оргстекла', 'https://comint.by/info-pos/podstavki-tovary/'),
      service('Подставки под полиграфическую продукцию из оргстекла', 'https://comint.by/info-pos/podstavki-pod-poligraficheskuyu-produkcziyu-iz-orgstekla/'),
      service('Ценникодержатели из пластика и оргстекла', 'https://comint.by/info-pos/czennikoderzhateli-iz-plastika-i-orgstekla/'),
      service('Рекламные воблеры', 'https://comint.by/info-pos/reklamnye-voblery/'),
      service('Печать шелфтокеров', 'https://comint.by/info-pos/pechat-shelftokerov/'),
      service('Хенгеры, изготовление и печать хенгеров', 'https://comint.by/info-pos/hengery-izgotovlenie-i-pechat-hengerov/'),
      service('Ростовые фигуры, хардпостеры, тантамарески', 'https://comint.by/info-pos/rostovye-figury-hardpostery-tantamareski/'),
      service('Изготовление муляжей продуктов и объемных макетов', 'https://comint.by/info-pos/mulyazhi-produktov/'),
      service('Изготовление рекламных мобайлов', 'https://comint.by/info-pos/izgotovlenie-reklamnyh-mobajlov/'),
      service('Изготовление стопперов в Минске', 'https://comint.by/info-pos/reklamnye-stoppery/'),
      service('Акрилайтовые панели, изготовление акрилайтов', 'https://comint.by/info-pos/akrilovye-paneli/'),
      service('Гардеробные номерки, бирки и номерки для ключей', 'https://comint.by/info-pos/garderobnye-nomerki-birki-i-nomerki-dlya-klyuchej/'),
      service('Торговая атрибутика из пластика', 'https://comint.by/info-pos/izgotovlenie-torgovoj-atributiki/')
    ]
  },
  {
    title: 'Мобильное рекламное оборудование',
    slug: 'mobile-equipment',
    accent: 'coral',
    intro: 'Roll up, pop up, промостойки, буклетницы и мобильные конструкции для промо и выставок.',
    services: [
      service('Мобильные баннерные стенды', 'https://comint.by/mobilnoe-reklamnoe-oborudovanie/mobilnye-stendy/'),
      service('Изготовление промо-стоек и промо-столов', 'https://comint.by/mobilnoe-reklamnoe-oborudovanie/promo-stojki/'),
      service('Fold-up (Фолд-ап) стенды-ширмы', 'https://comint.by/mobilnoe-reklamnoe-oborudovanie/fold-up/'),
      service('Металлические складные буклетницы и стойки для брошюр', 'https://comint.by/mobilnoe-reklamnoe-oborudovanie/bukletnicy/'),
      service('Roll up (Ролл ап) стенды', 'https://comint.by/mobilnoe-reklamnoe-oborudovanie/roll-ap-stendy/'),
      service('Pop up стенды (Поп Ап Системы)', 'https://comint.by/mobilnoe-reklamnoe-oborudovanie/pop-up-stendy/')
    ]
  },
  {
    title: 'Навигация',
    slug: 'navigation',
    accent: 'mustard',
    intro: 'Информационные стенды, офисные таблички и указатели для понятной среды внутри компании.',
    services: [
      service('Информационные стенды', 'https://comint.by/info-stendyi-tablichki/informaczionnye-stendy/'),
      service('Офисные таблички и указатели', 'https://comint.by/info-stendyi-tablichki/ofisnyie-tablichki/')
    ]
  },
  {
    title: 'Одежда и текстиль',
    slug: 'textile',
    accent: 'ink',
    intro: 'Печать на ткани и текстильные решения для формы, мерча, промо и корпоративных подарков.',
    services: [
      service('Печать на ткани', 'https://comint.by/odezhda-i-tekstil/pechat-na-tkani-i-sumkah/')
    ]
  },
  {
    title: 'Реклама на транспорте',
    slug: 'transport',
    accent: 'teal',
    intro: 'Наклейки и рекламные материалы для оформления автомобилей и корпоративного транспорта.',
    services: [
      service('Наклейки на автомобиль', 'https://comint.by/reklama-na-transporte/naklejki-na-avto/')
    ]
  }
];

function createServiceItems(category) {
  return category.services.map((item) => ({
    ...item,
    url: `/services/${item.slug}`,
    category: category.title,
    categorySlug: category.slug,
    description: `Выполним услугу «${item.title}» под задачу компании: подберем материал, технологию, формат и тираж.`,
    params: ['Формат и материал по задаче', 'Тираж рассчитывается индивидуально', 'Поможем подготовить макет']
  }));
}

function getCategoryBySlug(slug) {
  return serviceCatalog.find((category) => category.slug === slug);
}

function getCategoryItems(slug) {
  const category = getCategoryBySlug(slug);
  return category ? createServiceItems(category) : [];
}

function getAllServiceItems() {
  return serviceCatalog.flatMap((category) => createServiceItems(category));
}

function getServiceBySlug(slug) {
  return getAllServiceItems().find((item) => item.slug === slug);
}

function getRelatedServices(serviceSlug, limit = 6) {
  const current = getServiceBySlug(serviceSlug);

  if (!current) {
    return [];
  }

  const category = getCategoryBySlug(current.categorySlug);
  return createServiceItems(category)
    .filter((item) => item.slug !== serviceSlug)
    .slice(0, limit);
}

module.exports = {
  serviceCatalog,
  createServiceItems,
  getCategoryBySlug,
  getCategoryItems,
  getAllServiceItems,
  getServiceBySlug,
  getRelatedServices
};
