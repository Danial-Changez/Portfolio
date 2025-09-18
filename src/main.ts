import './style.css'

// Mobile nav toggle
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

// Scrollspy for active section
function setupScrollSpy() {
	const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-scroll]'))
	const sections = links
 		.map((a) => {
 			const href = a.getAttribute('href') || ''
 			if (!href.startsWith('#')) return null
 			return document.querySelector<HTMLElement>(href)
 		})
 		.filter((el): el is HTMLElement => !!el)

	if (!sections.length) return

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const target = entry.target as HTMLElement
				if (!target.id) return
				const id = '#' + target.id
				const link = links.find((l) => l.getAttribute('href') === id)
				if (!link) return
				if (entry.isIntersecting) {
					links.forEach((l) => l.classList.remove('text-indigo-600', 'dark:text-indigo-400'))
					link.classList.add('text-indigo-600', 'dark:text-indigo-400')
				}
			})
		},
		{ rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] }
	)

	sections.forEach((s) => observer.observe(s))
}

document.addEventListener('DOMContentLoaded', () => {
	// theme toggle removed
	setupMobileNav()
	setupScrollSpy()
	initSectionBleeds()
})

// Section bleed initializer: reads data attributes and sets CSS variables per-section
function initSectionBleeds() {
	const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-section-bg]'))
		const bleedPresets: Record<string, string> = {
		subtle: '36px',
		medium: '60px',
		strong: '96px'
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