export interface Weather {
  id: number
  name: string
  country: string
  description: string
  icon: string
  temp: number
  humidity: number
  pressure: number
  cloudiness: number
  wind_speed: number
  score: number
  rank: number
  comfort: ComfortFactors
}

export interface ComfortFactors {
  temperature_score: number
  humidity_score: number
  wind_score: number
}
