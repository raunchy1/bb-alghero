import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'comune'
    const roomSlug = formData.get('roomSlug') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine save path
    let dir: string
    if (roomSlug) {
      dir = path.join(process.cwd(), 'public', 'images', 'rooms', roomSlug)
    } else {
      dir = path.join(process.cwd(), 'public', 'images', category)
    }

    await mkdir(dir, { recursive: true })

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filepath = path.join(dir, filename)
    await writeFile(filepath, buffer)

    const publicPath = filepath.replace(path.join(process.cwd(), 'public'), '')

    return NextResponse.json({ success: true, path: publicPath, filename })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
