import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '../lib/scroll'
import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { Services } from '../sections/Services'
import { Blog } from '../sections/Blog'
import { ApplySection } from '../sections/ApplySection'

export function HomePage() {
  const location = useLocation()

  useEffect(() => {
    const id = location.hash?.replace(/^#/, '')
    if (!id) return
    const t = window.setTimeout(() => scrollToSection(id), 0)
    return () => window.clearTimeout(t)
  }, [location.hash])

  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Blog />
      <ApplySection />
    </main>
  )
}

