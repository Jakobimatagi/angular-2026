import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'feature-animations',
  templateUrl: './animations.component.html',
  styleUrl: './animations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class AnimationsComponent {}
