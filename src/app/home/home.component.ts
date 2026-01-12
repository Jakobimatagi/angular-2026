import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class HomeComponent {
  protected readonly buttons = signal<ReadonlyArray<{ label: string; path: string }>>([
    { label: 'Skill Point Distributor', path: '/skill-point-distributor' },
    // { label: 'Standalone Components', path: '/standalone-components' },
    // { label: 'Signals & Reactivity', path: '/signals-reactivity' },
    // { label: 'Reactive Forms', path: '/reactive-forms' },
    // { label: 'Routing & Guards', path: '/routing-guards' },
    // { label: 'HTTP + Interceptors', path: '/http-interceptors' },
    // { label: 'DI & Services', path: '/di-services' },
    // { label: 'State Management', path: '/state-management' },
    // { label: 'Animations', path: '/animations' },
    // { label: 'Pipes & Directives', path: '/pipes-directives' },
    // { label: 'Testing', path: '/testing' },
  ]);
}
