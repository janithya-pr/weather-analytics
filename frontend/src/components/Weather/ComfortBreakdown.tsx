interface ComfortBreakdownProps {
    temp: number
    humidity: number
    windSpeed: number
    score: number
    comfort: ComfortFactors
}

interface ComfortFactors {
    temperature_score: number
    humidity_score: number
    wind_score: number
}

interface ComfortFactorProps {
    label: string
    displayValue: string
    ideal: string
    percentage: number
    status: string
}

const getStatus = (percentage: number) => {
    if (percentage >= 90) return 'Excellent'
    if (percentage >= 75) return 'Good'
    if (percentage >= 50) return 'Fair'
    return 'Poor'
}

const ComfortFactor = ({
    label,
    displayValue,
    ideal,
    percentage,
    status,
}: ComfortFactorProps) => {
    const safePercentage = Math.min(
        Math.max(percentage, 0),
        100,
    )

    return (
        <div>
            <div className="flex items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-700">
                        {label}
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                        {displayValue}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-400">
                        Ideal
                    </p>

                    <p className="text-sm font-medium text-gray-600">
                        {ideal}
                    </p>
                </div>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{
                        width: `${safePercentage}%`,
                    }}
                />
            </div>

            <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                    {status}
                </span>

                <span className="text-xs font-medium text-gray-400">
                    {Math.round(safePercentage)}%
                </span>
            </div>
        </div>
    )
}

const ComfortBreakdown = ({
    temp,
    humidity,
    windSpeed,
    score,
    comfort,
}: ComfortBreakdownProps) => {
    const overallStatus =
        score >= 85
            ? 'Excellent'
            : score >= 70
                ? 'Good'
                : score >= 50
                    ? 'Fair'
                    : 'Poor'

    return (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Comfort Score Breakdown
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        How each weather condition contributes
                        to the overall comfort score.
                    </p>
                </div>

                {/* Overall score */}
                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white px-4 py-3">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            SCORE
                        </p>

                        <p className="text-2xl font-bold text-blue-600">
                            {score}
                        </p>
                    </div>

                    <div className="h-10 w-px bg-gray-200" />

                    <p className="text-sm font-semibold text-gray-700">
                        {overallStatus}
                    </p>
                </div>
            </div>

            {/* Comfort factors */}
            <div className="mt-6 grid gap-6 md:grid-cols-3">
                <ComfortFactor
                    label="Temperature"
                    displayValue={`${temp}°C`}
                    ideal="22°C"
                    percentage={comfort.temperature_score}
                    status={getStatus(comfort.temperature_score)}
                />

                <ComfortFactor
                    label="Humidity"
                    displayValue={`${humidity}%`}
                    ideal="45%"
                    percentage={comfort.humidity_score}
                    status={getStatus(comfort.humidity_score)}
                />

                <ComfortFactor
                    label="Wind Speed"
                    displayValue={`${windSpeed} m/s`}
                    ideal="2 m/s"
                    percentage={comfort.wind_score}
                    status={getStatus(comfort.wind_score)}
                />
            </div>

            {/* Score weights */}
            <div className="mt-6 border-t border-gray-200 pt-5">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
                    <span>
                        Temperature <strong className="text-gray-700">50%</strong>
                    </span>

                    <span>
                        Humidity <strong className="text-gray-700">30%</strong>
                    </span>

                    <span>
                        Wind Speed <strong className="text-gray-700">20%</strong>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ComfortBreakdown
