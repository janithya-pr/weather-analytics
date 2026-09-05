import type { Ref } from 'react'
import WeatherIcon from './WeatherIcon'
import type { Weather } from '../../types/weather'

interface CityCardProps {
  city: Weather
  isSelected: boolean
  onSelect: () => void
  cardRef?: Ref<HTMLButtonElement>
}

const CityCard = ({city, isSelected, onSelect, cardRef}: CityCardProps) => {
  
  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      className={`relative flex min-w-30 shrink-0 cursor-pointer flex-col items-center rounded-xl border-3 bg-white p-2.5 transition sm:min-w-44 sm:p-5 lg:min-w-48 ${
        isSelected
          ? 'border-blue-400 shadow-md shadow-blue-100'
          : 'border-gray-200 shadow-sm hover:border-gray-400'
      }`}
    >
      <span className="absolute left-3 top-3 text-sm font-medium text-gray-500 sm:text-md">
        <span className="sm:hidden">
          #{city.rank}
        </span>

        <span className="hidden sm:inline">
          RANK #{city.rank}
        </span>
      </span>

      <WeatherIcon
        icon={city.icon}
        description={city.description}
        className="h-10 w-10 sm:h-14 sm:w-14"
      />

      <h3 className="text-md font-bold text-gray-900 sm:text-xl lg:text-xl">
        {city.name}
      </h3>

      <p className="mt-1 text-xs font-medium text-gray-600 md:text-sm">
        SCORE: {city.score}
      </p>
    </button>
  )
}

export default CityCard
