const fs = require('fs')
const path = require('path')

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true })
  const entries = await fs.promises.readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else if (entry.isSymbolicLink()) {
      const link = await fs.promises.readlink(srcPath)
      try {
        await fs.promises.symlink(link, destPath)
      } catch (e) {
        // ignore
      }
    } else {
      await fs.promises.copyFile(srcPath, destPath)
    }
  }
}

async function main() {
  try {
    const harnessRoot = path.resolve(__dirname, '..')
    const src = path.resolve(harnessRoot, '../../../to be merged/faction-image/src')
    const dest = path.resolve(harnessRoot, 'src/donors/faction-image/fullsrc')

    console.log('Copying faction-image from', src)
    console.log('Destination:', dest)

    if (!fs.existsSync(src)) {
      console.error('Source folder does not exist:', src)
      process.exitCode = 2
      return
    }

    await copyDir(src, dest)
    console.log('Copy completed')
  } catch (err) {
    console.error('Copy failed:', err)
    process.exitCode = 1
  }
}

main()
