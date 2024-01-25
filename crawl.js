const { JSDOM } = require('jsdom')

const normalizeURL = (url) => {
  const urlObj = new URL(url)
  
  const host = urlObj.hostname.startsWith('www') ? urlObj.hostname.slice(4) : urlObj.hostname
  return urlObj.pathname === '/' ? host : `${host}${urlObj.pathname}`
}

const getURLsFromHTML = (htmlBody, baseURL) => {
  const urls = []
  const dom = new JSDOM(htmlBody)
  const anchorElems = dom.window.document.querySelectorAll('a')
  for (const anchorElem of anchorElems) {
    if (anchorElem.href.slice(0, 1) === '/') {
      try {
        urls.push(new URL(anchorElem.href, baseURL).href)
      } catch (error) {
        console.log(`${error.message}: ${anchorElem.href}`)
      }
    } else {
      try {
        urls.push(new URL(anchorElem.href).href)
      } catch (error) {
        console.log(`${error.message}: ${anchorElem.href}`)
      }
    }
  }
  return urls
}

async function crawlPage(baseURL, currentURL, pages) {
  const normURL = normalizeURL(currentURL)
  // If we've already crawled this page, don't repeat the fetch request
  if (pages[normURL] > 0) {
    pages[normURL]++
    return pages
  } 
  // Otherwise, initialise it in the pages obj
  if (baseURL === currentURL) {
    // Don't count the base as a link to itself
    pages[normURL] = 0
  } else {
    pages[normURL] = 1
  }
  // if this is an offsite URL, count the link but don't crawl it
  const currentUrlObj = new URL(currentURL)
  const baseUrlObj = new URL(baseURL)
  if (currentUrlObj.hostname !== baseUrlObj.hostname){
    return pages
  }
  // Fetch and parse HTML of currentURL
  console.log(`Crawling ${currentURL}...`)
  let htmlBody = ''
  try {
    const response = await fetch(currentURL)
    if (!response.ok) {
      throw new Error(`HTTP error for ${currentURL}. Status = ${response.status}`);
    }
    const contentType = response.headers.get('Content-Type')
    if (!contentType.includes('text/html')) {
      throw new Error(`Non-HTML response error for ${currentURL}. Content-Type = ${contentType}`)
    }
    htmlBody = await response.text() 
  } catch (error) {
    console.log(error.message)
    return pages
  }
  // Recursively crawl the links in the currentURL's HTML
  const nextURLs = getURLsFromHTML(htmlBody, baseURL)
  for (const nextURL of nextURLs) {
    await crawlPage(baseURL, nextURL, pages)
  }
  return pages   
}

module.exports = {
  crawlPage,
  getURLsFromHTML,
  normalizeURL
}
