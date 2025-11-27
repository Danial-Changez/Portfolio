import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav()
  setupScrollSpy()
  initSectionBleeds()
  initPointerGlow()
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

  const activateLink = (hash: string | null) => {
    links.forEach((link) => {
      link.classList.toggle('text-emerald-500', link.getAttribute('href') === hash)
    })
  }

  const onScroll = () => {
    const scrollPos = window.scrollY + window.innerHeight / 4
    const activeSection = sections.reduce<HTMLElement | null>((current, section) => {
      return section.offsetTop <= scrollPos ? section : current
    }, sections[0])

    activateLink(activeSection ? `#${activeSection.id}` : null)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

function initSectionBleeds() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-section-bg]'))
  const bleedPresets: Record<string, string> = {
    subtle: 'clamp(40px, 5vh, 72px)',
    medium: 'clamp(56px, 7vh, 124px)',
    strong: 'clamp(72px, 10vh, 168px)',
  }

  sections.forEach((sec) => {
    const bg = sec.dataset.sectionBg
    const bleed = sec.dataset.bleed || 'medium'
    if (bg) sec.style.setProperty('--section-bg', bg)
    const preset = bleedPresets[bleed] || bleedPresets.medium
    sec.style.setProperty('--section-bleed-height', preset)
    if (!sec.classList.contains('section-bleed')) {
      sec.classList.add('section-bleed')
    }
  })
}

function initPointerGlow() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const root = document.documentElement
  const glow = document.createElement('div')
  glow.className = 'pointer-glow'
  document.body.appendChild(glow)

  let targetX = window.innerWidth * 0.5
  let targetY = window.innerHeight * 0.32
  let raf = 0

  const render = () => {
    root.style.setProperty('--glow-x', `${targetX}px`)
    root.style.setProperty('--glow-y', `${targetY}px`)
    raf = 0
  }

  const queueRender = () => {
    if (raf) return
    raf = requestAnimationFrame(render)
  }

  const onPointerMove = (event: PointerEvent) => {
    targetX = event.clientX
    targetY = event.clientY
    glow.classList.add('is-visible')
    queueRender()
  }

  const resetPosition = () => {
    targetX = window.innerWidth * 0.5
    targetY = window.innerHeight * 0.32
    glow.classList.remove('is-visible')
    queueRender()
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerleave', resetPosition)

  queueRender()
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
