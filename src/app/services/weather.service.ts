import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { fetchWeatherApi } from 'openmeteo';
import { WeatherResponse } from './service.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly apiUrl = 'https://api.open-meteo.com/v1/forecast';
  private readonly defaultLatitude = 40.3916;
  private readonly defaultLongitude = -111.8508;

  public fetchWeatherData(latitude?: number, longitude?: number): Observable<WeatherResponse> {
    const params = {
      latitude: latitude ?? this.defaultLatitude,
      longitude: longitude ?? this.defaultLongitude,
      daily: ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset"],
      timezone: "auto",
      wind_speed_unit: "mph",
      temperature_unit: "fahrenheit",
      precipitation_unit: "inch",
    };

    return from(fetchWeatherApi(this.apiUrl, params)).pipe(
      map((responses) => {
        const response = responses[0];
        const daily = response.daily()!;
        const utcOffsetSeconds = response.utcOffsetSeconds();

        // Define Int64 variables so they can be processed accordingly
        const sunrise = daily.variables(2)!;
        const sunset = daily.variables(3)!;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
          daily: {
            time: Array.from(
              { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() }, 
              (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature_2m_max: daily.variables(0)!.valuesArray(),
            temperature_2m_min: daily.variables(1)!.valuesArray(),
            // Map Int64 values to according structure
            sunrise: [...Array(sunrise.valuesInt64Length())].map(
              (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            // Map Int64 values to according structure
            sunset: [...Array(sunset.valuesInt64Length())].map(
              (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
          },
        };

        return {
          latitude: response.latitude(),
          longitude: response.longitude(),
          elevation: response.elevation(),
          timezone: response.timezone(),
          timezoneAbbreviation: response.timezoneAbbreviation(),
          utcOffsetSeconds: utcOffsetSeconds,
          weatherData: weatherData,
        };
      })
    );
  }
}
