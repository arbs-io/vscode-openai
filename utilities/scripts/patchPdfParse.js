const fs = require('fs')
const path = require('path')

// Patch package index
console.log('patch parse-pdf')
const pdfParseIndex = './node_modules/pdf-parse/index.js'
const patchedData = `const Fs = require('fs');
const Pdf = require('./lib/pdf-parse.js');
module.exports = Pdf;`
fs.writeFileSync(pdfParseIndex, patchedData)

function copyFolderSync(source, target) {
  // Check if source directory exists
  if (!fs.existsSync(source)) {
    console.log(`not found: source (${source})`)
    return
  }

  // Create target directory if it does not exist
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target)
  }

  // Get the list of items in the source directory
  const items = fs.readdirSync(source)

  for (let i = 0; i < items.length; i++) {
    let currentItemPath = path.join(source, items[i])
    let currentTargetPath = path.join(target, items[i])

    // Check if current item is a directory or a file
    let stat = fs.statSync(currentItemPath)
    if (stat.isDirectory()) {
      // Recursively copy the contents of the subdirectory
      copyFolderSync(currentItemPath, currentTargetPath)
    } else {
      // Copy the file
      fs.copyFileSync(currentItemPath, currentTargetPath)
    }
  }
}
console.log('copy pdf.js libs to out')
// if (!fs.existsSync('/out')) fs.mkdirSync('/out')
// if (!fs.existsSync('/out/pdf.js')) fs.mkdirSync('/out/pdf.js')
copyFolderSync('./utilities/libs/pdf.js', './out/pdf.js')
