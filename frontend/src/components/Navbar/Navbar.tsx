import { useState } from 'react'
import { Search } from 'lucide-react'
import ProfileMenu from './ProfileMenu'
import SearchBar from './SearchBar'

interface NavbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

const Navbar = ({searchQuery, onSearchChange}: NavbarProps) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] =
    useState(false)

  const handleLogoClick = () => {
    window.location.reload()
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex cursor-pointer items-center gap-2 text-lg font-semibold text-gray-900"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/9176/9176568.png"
              alt="Weather Analytics logo"
              className="h-7 w-7"
            />

            <span>Weather Analytics</span>
          </button>

          <div className="flex items-center md:gap-2">
            {/* Desktop search */}
            <div className="hidden sm:block">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
              />
            </div>

            {/* Mobile search button */}
            <button
              type="button"
              onClick={() =>
                setIsMobileSearchOpen((open) => !open)
              }
              className={`cursor-pointer rounded-full p-2 transition-colors sm:hidden ${
                isMobileSearchOpen
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-label="Search"
              aria-expanded={isMobileSearchOpen}
            >
              <Search className="h-5 w-5 stroke-[3]" />
            </button>

            <ProfileMenu />
          </div>
        </div>

        {/* Mobile search */}
        {isMobileSearchOpen && (
          <div className="pb-3 sm:hidden">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              autoFocus
            />
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
