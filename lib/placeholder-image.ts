// Lorem Picsum: a free placeholder image service, seeded so each
// product/category consistently shows the same photo instead of a random
// one every reload. Replace with real product photography by swapping the
// image_url field in the database once real photos are ready.
export function placeholderImage(seed: string, width = 600, height = 600) {
  const cleanSeed = seed.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `https://picsum.photos/seed/${cleanSeed}/${width}/${height}`
}
