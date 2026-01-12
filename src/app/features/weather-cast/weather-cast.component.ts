import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-weather-cast',
  templateUrl: './weather-cast.component.html',
  styleUrl: './weather-cast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class WeatherCastComponent {
  constructor() {
  }
}
