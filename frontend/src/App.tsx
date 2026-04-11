import { Toaster } from 'sonner'
import { Navbar } from './components/Navbar'
import { Footer } from './sections/Footer'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AccountPage } from './pages/AccountPage'

function App() {
  return (
    <div className="min-h-svh bg-gradient-to-b from-brand-cream via-brand-mint to-brand-blush/90">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
      <Footer />
      <Toaster richColors theme="dark" position="top-center" />
    </div>
  )
}

export default App
