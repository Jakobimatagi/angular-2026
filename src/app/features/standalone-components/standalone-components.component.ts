import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'feature-standalone-components',
  templateUrl: './standalone-components.component.html',
  styleUrl: './standalone-components.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class StandaloneComponentsComponent {}
