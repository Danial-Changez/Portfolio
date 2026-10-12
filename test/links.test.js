import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = join(import.meta.dirname, '..')
const html = readFileSync(join(root, 'index.html'), 'utf8')
const urls = [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)].map((match) => match[1])

test('every local file referenced by index.html exists', () => {
  // Vite serves public/ at the site root and resolves /src/... from the project root.
  const toPath = (url) => join(root, url.startsWith('/src/') ? '' : 'public', url)
  const missing = urls.filter((url) => !/^(#|https:|mailto:)/.test(url) && !existsSync(toPath(url)))
  assert.deepEqual(missing, [])
})

test('every in-page link points at an existing id', () => {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]))
  const missing = urls.filter((url) => url.startsWith('#') && !ids.has(url.slice(1)))
  assert.deepEqual(missing, [])
})
