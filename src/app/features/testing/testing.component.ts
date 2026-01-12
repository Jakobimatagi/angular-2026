import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'feature-testing',
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class TestingComponent {}
