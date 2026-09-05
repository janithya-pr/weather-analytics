import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchWeatherData } from '../services/weatherApi'
import type { Weather } from '../types/weather'

export function useWeather() {
    const { getAccessTokenSilently } = useAuth0()

    const [weather, setWeather] = useState<Weather[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadWeather() {
            try {
                setLoading(true)
                setError(null)

                const token = await getAccessTokenSilently()
                const data = await fetchWeatherData(token)

                setWeather(data)
            } catch (error) {
                console.error('Failed to load weather:', error)
                setError('Failed to load weather data')
            } finally {
                setLoading(false)
            }
        }

        loadWeather()
    }, [getAccessTokenSilently])

    return {
        weather,
        loading,
        error,
    }
}
