import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CityCard from './CityCard'
import type { Weather } from '../../types/weather'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'

interface CityCarouselProps {
  weather: Weather[]
  selectedCity: Weather | null
  onSelectCity: (city: Weather) => void
  searchQuery: string
}

const CityCarousel = ({weather, selectedCity, onSelectCity, searchQuery}: CityCarouselProps) => {
  const {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  } = useHorizontalScroll()

  const cityRefs = useRef<Record<number, HTMLButtonElement | null>>({})

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return
    }

    const matchedCity = weather.find((city) =>
      city.name.toLowerCase().startsWith(query),
    )

    if (!matchedCity) {
      return
    }

    onSelectCity(matchedCity)

    cityRefs.current[matchedCity.id]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [searchQuery, weather, onSelectCity])

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full bg-white p-2 shadow-md transition hover:bg-gray-100 lg:block"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="scrollbar-hidden flex gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {weather.map((city) => (
          <CityCard
            key={city.id}
            city={city}
            isSelected={selectedCity?.id === city.id}
            onSelect={() => onSelectCity(city)}
            cardRef={(element) => {
              cityRefs.current[city.id] = element
            }}
          />
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full bg-white p-2 shadow-md transition hover:bg-gray-100 lg:block"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export default CityCarousel
