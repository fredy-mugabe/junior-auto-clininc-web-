import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { PageFrame } from '../components/PageFrame'
import { Footer } from '../sections/Footer'

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.22 },
  },
}

export function SiteLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-svh bg-black">
      <PageFrame>
        <div className={isHome ? 'relative min-h-[100dvh]' : 'jac-frame-inner'}>
          <Navbar overHero={isHome} />
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              className={isHome ? 'min-h-0' : ''}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
      </PageFrame>
      <Footer />
    </div>
  )
}
