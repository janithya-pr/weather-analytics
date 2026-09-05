import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}

const SearchBar = ({value, onChange, autoFocus = false}: SearchBarProps) => {
  
  return (
    <div className="relative w-full">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 stroke-[2.5]"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search city..."
        autoFocus={autoFocus}
        className="h-9 w-full rounded-md border border-transparent bg-gray-100 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-500 focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-300 sm:w-64"
        aria-label="Search city"
      />
    </div>
  )
}

export default SearchBar
