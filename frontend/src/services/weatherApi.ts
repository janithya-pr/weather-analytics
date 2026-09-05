import type { Weather } from '../types/weather'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchWeatherData(accessToken: string): Promise<Weather[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/weather`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch weather data (Status ${response.status})`
    )
  }

  return response.json()
}
