const printReport = (pages) => {
  console.log('Report is starting...')
  const sortedPages = sortPages(pages)
  for (const page in sortedPages) {
    if (Object.hasOwnProperty.call(sortedPages, page)) {
      const count = sortedPages[page];
      console.log(`Found ${count} links to ${page}`)
    }
  }
}

const sortPages = (pages) => 
  Object.fromEntries(
    Object.entries(pages).sort(([, a], [, b]) => a - b)
  )

module.exports = {
  printReport
}