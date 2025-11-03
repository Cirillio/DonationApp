import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Конфигурация размеров
const SIZES = [
  { width: 800, suffix: '-800' }, // Mobile
  { width: 1280, suffix: '-1280' }, // Tablet
  { width: 1920, suffix: '-1920' }, // Desktop
]

// Конфигурация форматов
const FORMATS = [
  {
    ext: 'avif',
    options: { quality: 65, effort: 6 }, // effort: 0-9 (выше = лучше сжатие, но медленнее)
  },
  {
    ext: 'webp',
    options: { quality: 75, effort: 6 },
  },
  {
    ext: 'jpg',
    options: { quality: 80, progressive: true, mozjpeg: true },
  },
]

async function optimizeImage(inputPath, outputDir, baseName) {
  const image = sharp(inputPath)
  const metadata = await image.metadata()

  console.log(`\n📸 Processing: ${baseName}`)
  console.log(
    `   Original: ${metadata.width}x${metadata.height}, ${(metadata.size / 1024 / 1024).toFixed(2)} MB`
  )

  let totalSaved = 0
  let filesCreated = 0

  // Генерация адаптивных версий
  for (const size of SIZES) {
    // Пропускаем если оригинал меньше целевого размера
    if (metadata.width < size.width) {
      console.log(`   ⏭️  Skipping ${size.width}px (original is smaller)`)
      continue
    }

    for (const format of FORMATS) {
      const outputPath = join(outputDir, `${baseName}${size.suffix}.${format.ext}`)

      const pipeline = sharp(inputPath).resize(size.width, null, {
        // null = сохранить пропорции
        withoutEnlargement: true,
        fit: 'cover',
      })

      // Применяем формат в зависимости от типа
      if (format.ext === 'avif') {
        await pipeline.avif(format.options).toFile(outputPath)
      } else if (format.ext === 'webp') {
        await pipeline.webp(format.options).toFile(outputPath)
      } else if (format.ext === 'jpg') {
        await pipeline.jpeg(format.options).toFile(outputPath)
      }

      const fileStats = await stat(outputPath)
      const fileSizeKB = fileStats.size / 1024
      totalSaved += metadata.size - fileStats.size

      console.log(
        `   ✓ ${baseName}${size.suffix}.${format.ext.padEnd(4)} - ${fileSizeKB.toFixed(2)} KB`
      )
      filesCreated++
    }
  }

  // Генерация blur placeholder (20px для LQIP - Low Quality Image Placeholder)
  const placeholderPath = join(outputDir, `${baseName}-placeholder.jpg`)
  await sharp(inputPath).resize(20, null).blur(10).jpeg({ quality: 50 }).toFile(placeholderPath)

  const placeholderStats = await stat(placeholderPath)
  console.log(`   ✓ ${baseName}-placeholder.jpg - ${(placeholderStats.size / 1024).toFixed(2)} KB`)
  filesCreated++

  console.log(
    `   💾 Saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB across ${filesCreated} files`
  )
}

async function main() {
  const projectRoot = join(__dirname, '..')
  const inputDir = join(projectRoot, 'public/img/original')
  const outputDir = join(projectRoot, 'public/img/optimized')

  // Проверяем существование директории с оригиналами
  try {
    await stat(inputDir)
  } catch (error) {
    console.error(`❌ Error: Directory "${inputDir}" does not exist.`)
    console.log(`   Please create it and place your original images there.`)
    process.exit(1)
  }

  // Создаём директорию для оптимизированных изображений если её нет
  try {
    await mkdir(outputDir, { recursive: true })
  } catch (error) {
    // Директория уже существует
  }

  // Получаем список изображений
  const files = await readdir(inputDir)
  const images = files.filter((f) => /\.(jpg|jpeg|png)$/i.test(f))

  if (images.length === 0) {
    console.log(`⚠️  No images found in "${inputDir}"`)
    console.log(`   Supported formats: .jpg, .jpeg, .png`)
    process.exit(0)
  }

  console.log(`\n🚀 Starting image optimization...`)
  console.log(`   Input: ${inputDir}`)
  console.log(`   Output: ${outputDir}`)
  console.log(`   Images found: ${images.length}`)

  for (const file of images) {
    const baseName = file.replace(/\.(jpg|jpeg|png)$/i, '')
    const inputPath = join(inputDir, file)

    await optimizeImage(inputPath, outputDir, baseName)
  }

  console.log('\n✅ Optimization complete!\n')
}

main().catch((error) => {
  console.error('\n❌ Error during optimization:')
  console.error(error)
  process.exit(1)
})
