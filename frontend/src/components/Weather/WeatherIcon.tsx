interface WeatherIconProps {
  icon: string
  description: string
  className?: string
}

const WeatherIcon = ({
  icon,
  description,
  className = 'h-14 w-14',
}: WeatherIconProps) => {
  return (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt={description}
      className={className}
    />
  )
}

export default WeatherIcon
