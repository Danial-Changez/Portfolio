import './style.css'

const SCRAPER_SAFE_EMAIL_PARTS = ['dchangez', 'uoguelph.ca']

document.querySelectorAll<HTMLAnchorElement>('[data-email]').forEach((link) => {
  const address = SCRAPER_SAFE_EMAIL_PARTS.join('@')
  link.href = `mailto:${address}`
  if (link.dataset.email === 'show') link.textContent = address
})

document.querySelector('#theme-toggle')?.addEventListener('click', () => {
  const root = document.documentElement
  const dark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches
  root.dataset.theme = dark ? 'light' : 'dark'
})

const filters = document.querySelectorAll<HTMLButtonElement>('[data-filter]')
filters.forEach((button) => {
  button.addEventListener('click', () => {
    const kind = button.dataset.filter ?? 'all'
    filters.forEach((other) => other.setAttribute('aria-pressed', String(other === button)))
    document.querySelectorAll<HTMLElement>('[data-kind]').forEach((project) => {
      project.hidden = kind !== 'all' && !(project.dataset.kind ?? '').split(' ').includes(kind)
    })
  })
})
