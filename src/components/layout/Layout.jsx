import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import DealTicker from './DealTicker.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />
      <DealTicker />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
