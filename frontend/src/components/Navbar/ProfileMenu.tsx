import { useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { LogOut, UserCircle } from 'lucide-react'

const ProfileMenu = () => {
  const { user, logout } = useAuth0()

  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="cursor-pointer rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        <UserCircle className="h-8 w-8" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div className="border-b border-gray-200 pb-3">
            <p className="text-sm font-medium text-gray-900">
              Profile: {user?.email ?? 'No email available'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />

            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
