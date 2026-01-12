import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'feature-reactive-forms',
  templateUrl: './reactive-forms.component.html',
  styleUrl: './reactive-forms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ReactiveFormsComponent {}
