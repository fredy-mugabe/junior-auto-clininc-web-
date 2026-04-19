import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PageFrame } from '../components/PageFrame'
import { Footer } from '../sections/Footer'

export function SiteLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-svh bg-black">
      <PageFrame variant={isHome ? 'fullBleed' : 'default'}>
        <div className={isHome ? 'relative min-h-dvh' : 'jac-frame-inner'}>
          <Navbar overHero={isHome} />
          <main className={isHome ? 'min-h-0' : ''}>
            <Outlet />
          </main>
        </div>
      </PageFrame>
      <Footer />
    </div>
  )
}
