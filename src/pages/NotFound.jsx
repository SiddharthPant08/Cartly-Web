import { Link } from 'react-router-dom'
import { HiOutlineFaceFrown } from 'react-icons/hi2'
import Button from '../components/ui/Button.jsx'

export default function NotFound() {
  return (
    <div className="container-page py-24 flex flex-col items-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-500 mb-6">
        <HiOutlineFaceFrown size={40} />
      </div>
      <h1 className="text-6xl font-extrabold text-ink-900">404</h1>
      <p className="mt-3 text-lg font-semibold text-ink-800">Page not found</p>
      <p className="mt-2 text-sm text-ink-500 max-w-sm">
        The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
      </p>
      <Link to="/" className="mt-7">
        <Button size="lg">Back to home</Button>
      </Link>
    </div>
  )
}
