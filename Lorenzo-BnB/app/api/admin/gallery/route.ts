import { NextRequest, NextResponse } from 'next/server'
import { readdir, unlink, stat } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    const categories = ['rooms', 'terrace', 'balcony', 'bathroom', 'common', 'branding']
    const photos: { path: string; category: string; name: string }[] = []

    for (const cat of categories) {
      const catDir = path.join(imagesDir, cat)
      try {
        const dirStat = await stat(catDir)
        if (!dirStat.isDirectory()) continue

        const items = await readdir(catDir)
        for (const item of items) {
          const itemStr = String(item)
          if (/\.(jpe?g|png|webp)$/i.test(itemStr)) {
            photos.push({
              path: `/images/${cat}/${itemStr}`,
              category: cat,
              name: itemStr,
            })
          }
        }
      } catch { /* directory doesn't exist, skip */ }
    }

    // Also get root images
    try {
      const rootItems = await readdir(imagesDir)
      for (const item of rootItems) {
        if (/\.(jpe?g|png|webp)$/i.test(item)) {
          photos.push({ path: `/images/${item}`, category: 'altro', name: item })
        }
      }
    } catch { /* skip */ }

    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Gallery error:', error)
    return NextResponse.json({ photos: [], error: 'Failed to list photos' })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { filepath } = await request.json()
    if (!filepath || !filepath.startsWith('/images/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const fullPath = path.join(process.cwd(), 'public', filepath)
    await unlink(fullPath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
