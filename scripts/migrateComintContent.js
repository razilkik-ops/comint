const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const cheerio = require('cheerio');

const { getAllServiceItems } = require('../src/data/serviceCatalog');

const ROOT = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT, 'src', 'data', 'serviceContent.json');
const UPLOAD_ROOT = path.join(ROOT, 'public', 'uploads', 'services');
const SITE_ORIGIN = 'https://comint.by';

const imageCache = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url, attempt = 1) {
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Comint migration bot for new website'
      }
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    if (attempt < 3) {
      await sleep(500 * attempt);
      return fetchText(url, attempt + 1);
    }
    throw error;
  }
}

function absoluteUrl(rawUrl, baseUrl) {
  if (!rawUrl || rawUrl.startsWith('data:')) {
    return '';
  }

  return new URL(rawUrl, baseUrl).toString();
}

function imageExtension(url, contentType = '') {
  const ext = path.extname(new URL(url).pathname).toLowerCase();

  if (ext && ext.length <= 6) return ext;
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('gif')) return '.gif';
  if (contentType.includes('svg')) return '.svg';
  return '.jpg';
}

function imageName(url, contentType) {
  const parsed = new URL(url);
  const base = path.basename(parsed.pathname, path.extname(parsed.pathname))
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 8);
  return `${base || 'image'}-${hash}${imageExtension(url, contentType)}`;
}

async function downloadImage(url, serviceSlug) {
  if (!url) return '';

  const cacheKey = `${serviceSlug}:${url}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  const response = await fetch(url, {
    headers: {
      'user-agent': 'Comint migration bot for new website'
    }
  });

  if (!response.ok) {
    throw new Error(`Image ${response.status}: ${url}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const buffer = Buffer.from(await response.arrayBuffer());
  const dir = path.join(UPLOAD_ROOT, serviceSlug);
  const fileName = imageName(url, contentType);
  const filePath = path.join(dir, fileName);
  const publicPath = `/uploads/services/${serviceSlug}/${fileName}`;

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, buffer);
  imageCache.set(cacheKey, publicPath);

  return publicPath;
}

function cleanFragment($sourceFragment) {
  const $ = cheerio.load(`<div class="fragment">${$sourceFragment.html() || ''}</div>`, { decodeEntities: false });
  const fragment = $('.fragment');

  fragment.find('script, style, form, input, textarea, select, button, iframe').remove();
  fragment.find('[style], [onclick], [onload], [data-rocket-src], [srcset], [sizes]').removeAttr('style onclick onload data-rocket-src srcset sizes');
  fragment.find('a').each((_, element) => {
    const link = $(element);
    const href = link.attr('href');
    if (href && href.startsWith('/')) {
      link.attr('href', `${SITE_ORIGIN}${href}`);
    }
  });
  return fragment.html() || '';
}

async function rewriteImagesInHtml(html, baseUrl, serviceSlug) {
  if (!html) return html;

  const $ = cheerio.load(`<div class="fragment">${html}</div>`, { decodeEntities: false });

  for (const element of $('.fragment img').toArray()) {
    const img = $(element);
    const source = absoluteUrl(img.attr('data-lazy-src') || img.attr('src'), baseUrl);

    if (!source) {
      img.remove();
      continue;
    }

    try {
      img.attr('src', await downloadImage(source, serviceSlug));
      img.removeAttr('data-lazy-src srcset sizes');
    } catch {
      img.remove();
    }
  }

  return $('.fragment').html() || '';
}

function uniqueImages(images) {
  const seen = new Set();
  return images.filter((image) => {
    if (!image.src || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}

async function extractImages($, selector, baseUrl, serviceSlug) {
  const images = [];

  for (const element of $(selector).toArray()) {
    const img = $(element);
    const source = img.is('meta')
      ? absoluteUrl(img.attr('content'), baseUrl)
      : absoluteUrl(img.attr('data-lazy-src') || img.attr('src'), baseUrl);

    if (!source) continue;

    try {
      images.push({
        src: await downloadImage(source, serviceSlug),
        alt: img.attr('alt') || img.attr('title') || ''
      });
    } catch {
      // Some legacy images can be missing. Skip them and continue migration.
    }
  }

  return uniqueImages(images);
}

function textFrom($, selector) {
  return $(selector).first().text().replace(/\s+/g, ' ').trim();
}

async function fetchApiProduct(html) {
  const apiIdMatch = html.match(/wp-json\/wp\/v2\/product\/(\d+)/);
  const wpId = apiIdMatch ? Number(apiIdMatch[1]) : null;

  if (!wpId) return null;

  try {
    return JSON.parse(await fetchText(`${SITE_ORIGIN}/wp-json/wp/v2/product/${wpId}`));
  } catch {
    return null;
  }
}

async function migrateService(service, index, total) {
  const html = await fetchText(service.sourceUrl);
  const $ = cheerio.load(html, { decodeEntities: false });
  const apiContent = await fetchApiProduct(html);
  const title = textFrom($, '.banner h1') || service.title;
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const introBlock = $('.product_top .wrap > .content.single-product_content').first().clone();
  const priceBlock = $('#price .single-product-prices, #price .content').first().clone();
  const descriptionBlock = $('#desc .single-product_content, #desc .content').first().clone();
  const shortHtml = introBlock.length ? cleanFragment(introBlock) : (apiContent?.content?.rendered || '');
  const priceHtml = priceBlock.length ? cleanFragment(priceBlock) : '';
  const descriptionHtml = descriptionBlock.length ? cleanFragment(descriptionBlock) : '';
  const heroImages = await extractImages($, '.calculator_container_left_img img, meta[property="og:image"]', service.sourceUrl, service.slug);
  const galleryImages = await extractImages($, '.product-single_works img, .wp-block-gallery img', service.sourceUrl, service.slug);

  const content = {
    slug: service.slug,
    title,
    category: service.category,
    categorySlug: service.categorySlug,
    sourceUrl: service.sourceUrl,
    metaDescription,
    excerpt: apiContent?.excerpt?.rendered
      ? cheerio.load(apiContent.excerpt.rendered).text().replace(/\s+/g, ' ').trim()
      : metaDescription,
    heroImage: heroImages[0] || null,
    images: heroImages,
    gallery: galleryImages,
    sections: [
      {
        id: 'overview',
        title: 'Описание услуги',
        html: await rewriteImagesInHtml(shortHtml, service.sourceUrl, service.slug)
      },
      {
        id: 'price',
        title: 'Цены',
        html: await rewriteImagesInHtml(priceHtml, service.sourceUrl, service.slug)
      },
      {
        id: 'details',
        title: 'Подробное описание',
        html: await rewriteImagesInHtml(descriptionHtml, service.sourceUrl, service.slug)
      }
    ].filter((section) => section.html && cheerio.load(section.html).text().trim())
  };

  console.log(`[${index + 1}/${total}] ${service.slug}: ${content.sections.length} sections, ${content.gallery.length} gallery images`);
  await sleep(120);
  return content;
}

async function main() {
  const services = getAllServiceItems();
  const result = {};

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.mkdir(UPLOAD_ROOT, { recursive: true });

  for (let index = 0; index < services.length; index += 1) {
    const service = services[index];
    try {
      result[service.slug] = await migrateService(service, index, services.length);
    } catch (error) {
      console.error(`[${index + 1}/${services.length}] ${service.slug}: ${error.message}`);
      result[service.slug] = {
        slug: service.slug,
        title: service.title,
        category: service.category,
        categorySlug: service.categorySlug,
        sourceUrl: service.sourceUrl,
        error: error.message,
        sections: [],
        images: [],
        gallery: []
      };
    }
  }

  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Saved ${Object.keys(result).length} services to ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
