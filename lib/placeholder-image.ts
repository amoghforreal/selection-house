// LoremFlickr: a free placeholder image service that returns real,
// Creative-Commons-licensed photos matching the keywords you give it,
// unlike purely random placeholder services. Pass the product or category
// name and this extracts a couple of meaningful keywords from it.
// Replace with real product photography via the admin photo upload
// whenever it's ready, this is just a relevant-looking stand-in until then.

const STOPWORDS = new Set([
  'the', 'and', 'for', 'of', 'a', 'an', 'set', 'items', 'item', 'wear',
  'goods', 'equipment', 'professional', 'quality', 'premium', 'genuine',
  'standard', 'primary', 'products', 'accessories',
])

function extractKeywords(name: string): string {
  const words = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w) && isNaN(Number(w)))

  const keywords = words.slice(0, 2)
  return keywords.length > 0 ? keywords.join(',') : 'sports,goods'
}

export function placeholderImage(name: string, width = 600, height = 600) {
  const keywords = extractKeywords(name)
  return `https://loremflickr.com/${width}/${height}/${keywords}`
}
