import { Component, ChangeDetectionStrategy, OnInit, signal, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { WeatherResponse } from '../../services/service.interface';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-weather-cast',
  templateUrl: './weather-cast.component.html',
  styleUrls: ['./weather-cast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule, DatePipe, DecimalPipe, MatProgressSpinnerModule]
})
export class WeatherCastComponent implements OnInit, OnDestroy {
  private readonly weatherService = inject(WeatherService);
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();
  
  public weatherData = signal<WeatherResponse | null>(null);
  public loading = signal(false);
  public error = signal<string | null>(null);
  public locationGranted = signal(false);

  public ngOnInit(): void {
    this.getUserLocationAndFetchWeather();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getUserLocationAndFetchWeather(): void {
    if (isPlatformBrowser(this.platformId) && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.locationGranted.set(true);
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.fetchWeatherData(lat, lon);
        },
        (error) => {
          console.warn('Location permission denied or unavailable, using default location', error);
          this.locationGranted.set(false);
          this.fetchWeatherData();
        }
      );
    } else {
      console.warn('Geolocation not supported, using default location');
      this.fetchWeatherData();
    }
  }

  private fetchWeatherData(latitude?: number, longitude?: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.weatherService.fetchWeatherData(latitude, longitude)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (data: WeatherResponse) => {        
        if (latitude && longitude) {
          this.getCityName(latitude, longitude)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
            next: (cityName) => {
              this.weatherData.set({ ...data, cityName });
              this.loading.set(false);
            },
            error: () => {
              this.weatherData.set(data);
              this.loading.set(false);
            }
          });
        } else {
          this.weatherData.set(data);
          this.loading.set(false);
        }
      },
      error: (err: Error) => {
        this.error.set('Failed to fetch weather data');
        this.loading.set(false);
        console.error('Error fetching weather data:', err);
      }
    });
  }

  private getCityName(lat: number, lon: number): Observable<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        const city = response.address?.city || response.address?.town || response.address?.village || response.address?.county;
        const state = response.address?.state;
        return city && state ? `${city}, ${state}` : city || 'Unknown Location';
      })
    );
  }

  public isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
}
