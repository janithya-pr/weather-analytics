import ComfortBreakdown from './ComfortBreakdown'
import WeatherIcon from './WeatherIcon'
import type { Weather } from '../../types/weather'

interface SelectedCityProps {
  city: Weather
}

const SelectedCity = ({ city }: SelectedCityProps) => {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between sm:hidden">
          <p className="text-sm font-medium text-gray-500">
            Selected City
          </p>

          <p className="text-sm font-semibold text-gray-500">
            Rank #{city.rank}
          </p>
        </div>

        {/* City header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="hidden text-sm font-medium text-gray-500 sm:block">
                Selected City
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {city.name} ({city.country})
              </h2>

              <p className="mt-1 text-sm capitalize text-gray-500">
                {city.description}
              </p>
            </div>

            <WeatherIcon
              icon={city.icon}
              description={city.description}
              className="h-20 w-20"
            />
          </div>

          {/* Rank */}
          <div className="hidden rounded-xl border-2 border-blue-100 bg-white px-4 py-2 text-center sm:block sm:min-w-24">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Rank
            </p>

            <p className="mt-0.5 text-2xl font-bold text-gray-900">
              #{city.rank}
            </p>
          </div>
        </div>

        {/* Comfort score breakdown */}
        <ComfortBreakdown
          temp={city.temp}
          humidity={city.humidity}
          windSpeed={city.wind_speed}
          score={city.score}
          comfort={city.comfort}
        />
      </div>
    </section>
  )
}

export default SelectedCity