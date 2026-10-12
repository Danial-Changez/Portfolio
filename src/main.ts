import './style.css'

const SCRAPER_SAFE_EMAIL_PARTS = ['dchangez', 'uoguelph.ca']

document.querySelectorAll<HTMLAnchorElement>('[data-email]').forEach((link) => {
  const address = SCRAPER_SAFE_EMAIL_PARTS.join('@')
  link.href = `mailto:${address}`
  link.textContent = address
})

document.querySelector('#theme-toggle')?.addEventListener('click', () => {
  const root = document.documentElement
  const dark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches
  root.dataset.theme = dark ? 'light' : 'dark'
})
