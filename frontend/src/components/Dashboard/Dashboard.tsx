import { useState } from 'react'
import CityCarousel from '../Weather/CityCarousel'
import SelectedCity from '../Weather/SelectedCity'
import { useWeather } from '../../hooks/useWeather'
import type { Weather } from '../../types/weather'

interface DashboardProps {
  searchQuery: string
}

const Dashboard = ({ searchQuery }: DashboardProps) => {
  const {
    weather,
    loading,
    error,
  } = useWeather()

  const [selectedCity, setSelectedCity] =
    useState<Weather | null>(null)

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          Loading weather data...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          {error}
        </p>
      </main>
    )
  }

  const activeCity = selectedCity ?? weather[0] ?? null

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Weather Rankings
      </h2>

      <CityCarousel
        weather={weather}
        selectedCity={activeCity}
        onSelectCity={setSelectedCity}
        searchQuery={searchQuery}
      />

      {activeCity && (
        <SelectedCity city={activeCity} />
      )}
    </main>
  )
}

export default Dashboard
