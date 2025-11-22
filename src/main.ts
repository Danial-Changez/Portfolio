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

document.addEventListener('DOMContentLoaded', () => {
        // theme toggle removed
        setupMobileNav()
        setupScrollSpy()
        initSectionBleeds()
        setupContactForm()
})

function initSectionBleeds() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-section-bg]'))
  const bleedPresets: Record<string, string> = {
    subtle: '36px',
    medium: '60px',
    strong: '96px',
  }

  sections.forEach((sec) => {
    const bg = sec.dataset.sectionBg
    const bleed = sec.dataset.bleed || 'medium'
    if (bg) sec.style.setProperty('--section-bg', bg)
    const preset = bleedPresets[bleed] || bleedPresets.medium
    sec.style.setProperty('--section-bleed-height', preset)
    if (!sec.classList.contains('section-bleed-bottom') && !sec.classList.contains('section-bleed')) {
      sec.classList.add('section-bleed')
    }
  })
}

// Contact form handler: basic validation + mailto handoff
function setupContactForm() {
  const form = document.querySelector<HTMLFormElement>('#contact-form')
  const status = document.querySelector<HTMLParagraphElement>('#contact-status')
  const fields = {
    name: document.querySelector<HTMLInputElement>('#name'),
    email: document.querySelector<HTMLInputElement>('#email'),
    message: document.querySelector<HTMLTextAreaElement>('#message'),
  }

  if (!form) return

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    const name = (formData.get('name') || '').toString().trim()
    const email = (formData.get('email') || '').toString().trim()
    const message = (formData.get('message') || '').toString().trim()
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const invalidFields: Array<keyof typeof fields> = []
    if (!name) invalidFields.push('name')
    if (!email || !emailValid) invalidFields.push('email')
    if (!message) invalidFields.push('message')

    Object.entries(fields).forEach(([key, el]) => {
      if (!el) return
      el.classList.toggle('input-error', invalidFields.includes(key as keyof typeof fields))
    })

    if (invalidFields.length) {
      if (status) {
        status.textContent = 'Please add your name, a valid email, and a short message so I can get back to you.'
        status.classList.remove('text-emerald-500')
        status.classList.add('text-rose-500')
      }
      return
    }

    const subject = encodeURIComponent(`Portfolio contact from ${name}`)
    const body = encodeURIComponent(`${message}\n\nReply to: ${email}`)
    const mailto = `mailto:dchangez@uoguelph.ca?subject=${subject}&body=${body}`

    window.location.href = mailto

    if (status) {
      status.textContent = 'Opening your email client… if nothing happens, you can email me directly at dchangez@uoguelph.ca.'
      status.classList.remove('text-rose-500')
      status.classList.add('text-emerald-500')
    }

    form.reset()
  })
}