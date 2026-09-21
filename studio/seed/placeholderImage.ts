import type { SanityClient } from '@sanity/client'

// Deterministic placeholder art, uploaded once per slug and reused across a
// seed run. Real course/lesson art can replace these later — the point here
// is a real Sanity asset with alt text, not a broken image field.
// (picsum.photos is unreachable from this environment — placehold.co is
// used instead, with a deterministic color per seed and the seed's own
// short label as the text, so images are still visually distinct.)
const uploadCache = new Map<string, Promise<string>>()

const PALETTE = [
  '2f6f5e', '1e3a5f', '7c2d12', '4c1d95', '164e63', '831843', '365314', '78350f',
]

function seededIndex(key: string, mod: number): number {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % mod
}

export async function uploadPlaceholderImage(
  client: SanityClient,
  seed: string,
  width: number,
  height: number,
  alt: string
): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string }; alt: string }> {
  const cacheKey = `${seed}-${width}x${height}`

  let uploadPromise = uploadCache.get(cacheKey)
  if (!uploadPromise) {
    uploadPromise = (async () => {
      const bg = PALETTE[seededIndex(seed, PALETTE.length)]
      const label = encodeURIComponent(seed.split('-').slice(0, 3).join(' '))
      const url = `https://placehold.co/${width}x${height}/${bg}/ffffff.jpg?text=${label}`
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Failed to fetch placeholder image for ${seed}: ${res.status}`)
      }
      const buffer = Buffer.from(await res.arrayBuffer())
      const asset = await client.assets.upload('image', buffer, {
        filename: `${cacheKey}.jpg`,
        contentType: 'image/jpeg',
      })
      return asset._id
    })()
    uploadCache.set(cacheKey, uploadPromise)
  }

  const assetId = await uploadPromise
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt,
  }
}
