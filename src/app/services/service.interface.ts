export interface WeatherData {
  daily: {
    time: Date[];
    temperature_2m_max: Float32Array | null;
    temperature_2m_min: Float32Array | null;
    sunrise: Date[];
    sunset: Date[];
  };
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string | null;
  timezoneAbbreviation: string | null;
  utcOffsetSeconds: number;
  cityName?: string;
  weatherData: WeatherData;
}
