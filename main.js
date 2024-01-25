const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')

async function main(){
  const { argv } = require('node:process');

  if (argv.length < 3 || argv.length > 3) {
    throw new Error('Incorrect number of CLI arguments provided - exactly one (baseURL) is needed.')
  }
  const baseURL = argv[2]
  console.log(`Crawler starting at ${baseURL}...`)
  const pages = await crawlPage(baseURL, baseURL, {})
  
  printReport(pages)
}

main()
