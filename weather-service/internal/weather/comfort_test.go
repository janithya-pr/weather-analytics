package weather

import "testing"

func TestCalculateComfortScore(t *testing.T) {
	tests := []struct {
		name      string
		tempK     float64
		humidity  float64
		windSpeed float64
		want      int
	}{
		{
			name:      "ideal conditions",
			tempK:     295.15,
			humidity:  45,
			windSpeed: 2,
			want:      100,
		},
		{
			name:      "comfortable conditions",
			tempK:     293.15,
			humidity:  50,
			windSpeed: 3,
			want:      80,
		},
		{
			name:      "hot conditions",
			tempK:     303.15,
			humidity:  45,
			windSpeed: 2,
			want:      50,
		},
		{
			name:      "high humidity",
			tempK:     295.15,
			humidity:  65,
			windSpeed: 2,
			want:      85,
		},
		{
			name:      "strong wind",
			tempK:     295.15,
			humidity:  45,
			windSpeed: 6,
			want:      84,
		},
		{
			name:      "very poor conditions",
			tempK:     313.15,
			humidity:  100,
			windSpeed: 20,
			want:      0,
		},
		{
			name:      "score cannot exceed 100",
			tempK:     295.15,
			humidity:  45,
			windSpeed: 0,
			want:      100,
		},
		{
			name:      "score cannot go below 0",
			tempK:     333.15,
			humidity:  100,
			windSpeed: 30,
			want:      0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, _ := CalculateComfortScore(tt.tempK, tt.humidity, tt.windSpeed)

			if got != tt.want {
				t.Errorf("score = %v; want %v", got, tt.want)
			}
		})
	}
}