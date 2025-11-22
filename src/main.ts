import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav()
  setupScrollSpy()
  initSectionBleeds()
  setupContactForm()
})

function setupMobileNav() {
  const btn = document.querySelector<HTMLButtonElement>('#mobile-menu-btn')
  const menu = document.querySelector<HTMLDivElement>('#mobile-menu')
  if (!btn || !menu) return

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true'
    btn.setAttribute('aria-expanded', String(!expanded))
    menu.classList.toggle('hidden')
  })
}

function setupScrollSpy() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-scroll]'))
  const sections = links
    .map((anchor) => {
      const href = anchor.getAttribute('href') || ''
      return href.startsWith('#') ? document.querySelector<HTMLElement>(href) : null
    })
    .filter((el): el is HTMLElement => Boolean(el))

  if (!sections.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement
        if (!target.id) return

        const link = links.find((anchor) => anchor.getAttribute('href') === `#${target.id}`)
        if (!link) return

        if (entry.isIntersecting) {
          links.forEach((anchor) => anchor.classList.remove('text-indigo-600', 'dark:text-indigo-400'))
          link.classList.add('text-indigo-600', 'dark:text-indigo-400')
        }
      })
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] }
  )

  sections.forEach((section) => observer.observe(section))
}

function initSectionBleeds() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-section-bg]'))
  const bleedPresets: Record<string, string> = { subtle: '36px', medium: '60px', strong: '96px' }

  sections.forEach((section) => {
    const background = section.dataset.sectionBg
    const bleed = section.dataset.bleed || 'medium'
    const preset = bleedPresets[bleed] || bleedPresets.medium

    if (background) section.style.setProperty('--section-bg', background)
    section.style.setProperty('--section-bleed-height', preset)

    const hasBleedClass = section.classList.contains('section-bleed') || section.classList.contains('section-bleed-bottom')
    if (!hasBleedClass) section.classList.add('section-bleed')
  })
}

function setupContactForm() {
  const form = document.querySelector<HTMLFormElement>('#contact-form')
  if (!form) return

  const status = document.querySelector<HTMLParagraphElement>('#contact-status')
  const fields = {
    name: document.querySelector<HTMLInputElement>('#name'),
    email: document.querySelector<HTMLInputElement>('#email'),
    message: document.querySelector<HTMLTextAreaElement>('#message'),
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(form)
    const name = (formData.get('name') || '').toString().trim()
    const email = (formData.get('email') || '').toString().trim()
    const message = (formData.get('message') || '').toString().trim()

    const invalidFields = validateFields({ name, email, message })
    toggleFieldErrors(fields, invalidFields)

    if (invalidFields.length) {
      updateStatus(status, 'Please add your name, a valid email, and a short message so I can get back to you.', true)
      return
    }

    const subject = encodeURIComponent(`Portfolio contact from ${name}`)
    const body = encodeURIComponent(`${message}\n\nReply to: ${email}`)
    const mailto = `mailto:dchangez@uoguelph.ca?subject=${subject}&body=${body}`

    window.location.href = mailto
    updateStatus(
      status,
      'Opening your email client… if nothing happens, you can email me directly at dchangez@uoguelph.ca.',
      false
    )

    form.reset()
  })
}

function validateFields(values: { name: string; email: string; message: string }) {
  const invalid: Array<keyof typeof values> = []
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)

  if (!values.name) invalid.push('name')
  if (!values.email || !emailValid) invalid.push('email')
  if (!values.message) invalid.push('message')

  return invalid
}

function toggleFieldErrors(
  fields: Record<'name' | 'email' | 'message', HTMLInputElement | HTMLTextAreaElement | null>,
  invalidFields: Array<'name' | 'email' | 'message'>
) {
  Object.entries(fields).forEach(([key, el]) => {
    if (!el) return
    el.classList.toggle('input-error', invalidFields.includes(key as keyof typeof fields))
  })
}

function updateStatus(element: HTMLParagraphElement | null, message: string, isError: boolean) {
  if (!element) return
  element.textContent = message
  element.classList.toggle('text-rose-500', isError)
  element.classList.toggle('text-emerald-500', !isError)
}

