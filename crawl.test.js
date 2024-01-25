const { describe, test, expect } = require('@jest/globals')
const { getURLsFromHTML, normalizeURL } = require('./crawl.js')

describe('normalizeURL', () => {
  test('strips scheme', () => {
    expect(normalizeURL('https://www.test.com')).toBe('test.com')
  })
  
  test('preserves subdomains', () => {
    expect(normalizeURL('https://sub.test.com')).toBe('sub.test.com')
  })
  
  test('preserves paths', () => {
    expect(normalizeURL('https://www.test.com/test')).toBe('test.com/test')
  })
  
  test('removes port', () => {
    expect(normalizeURL('https://www.test.com:80')).toBe('test.com')
  })
  
  test('removes query params', () => {
    expect(normalizeURL('https://www.test.com?query=test')).toBe('test.com')
  })
  
  test('removes fragments', () => {
    expect(normalizeURL('https://www.test.com#test')).toBe('test.com')
  })
  
  test('handles complex url', () => {
    expect(normalizeURL('https://sub.test.com/test?query=test#test')).toBe('sub.test.com/test')
  })
})

describe('getURLsFromHTML', () => {
  test('getURLsFromHTML absolute', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML relative', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML both', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one', 'https://other.com/path/one' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML handle error', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ ]
    expect(actual).toEqual(expected)
  })
})
