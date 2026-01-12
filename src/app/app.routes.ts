import { Routes } from '@angular/router';
import { routingGuardsCanActivate } from './features/routing-guards/routing.guard';
import { routingGuardsResolver } from './features/routing-guards/routing.resolver';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./home/home.component').then(m => m.HomeComponent),
	},
	{
		path: 'standalone-components',
		loadComponent: () =>
			import('./features/standalone-components/standalone-components.component')
				.then(m => m.StandaloneComponentsComponent),
	},
	{
		path: 'signals-reactivity',
		loadComponent: () =>
			import('./features/signals-reactivity/signals-reactivity.component')
				.then(m => m.SignalsReactivityComponent),
	},
	{
		path: 'reactive-forms',
		loadComponent: () =>
			import('./features/reactive-forms/reactive-forms.component')
				.then(m => m.ReactiveFormsComponent),
	},
	{
		path: 'routing-guards',
		loadComponent: () =>
			import('./features/routing-guards/routing-guards.component')
				.then(m => m.RoutingGuardsComponent),
		canActivate: [routingGuardsCanActivate],
		resolve: { data: routingGuardsResolver },
	},
	{
		path: 'http-interceptors',
		loadComponent: () =>
			import('./features/http-interceptors/http-interceptors.component')
				.then(m => m.HttpInterceptorsComponent),
	},
	{
		path: 'di-services',
		loadComponent: () =>
			import('./features/di-services/di-services.component')
				.then(m => m.DIServicesComponent),
	},
	{
		path: 'state-management',
		loadComponent: () =>
			import('./features/state-management/state-management.component')
				.then(m => m.StateManagementComponent),
	},
	{
		path: 'animations',
		loadComponent: () =>
			import('./features/animations/animations.component')
				.then(m => m.AnimationsComponent),
	},
	{
		path: 'pipes-directives',
		loadComponent: () =>
			import('./features/pipes-directives/pipes-directives.component')
				.then(m => m.PipesDirectivesComponent),
	},
	{
		path: 'testing',
		loadComponent: () =>
			import('./features/testing/testing.component')
				.then(m => m.TestingComponent),
	},
	{
		path: 'skill-point-distributor',
		loadComponent: () =>
			import('./features/skillpoint/skillpoint.component')
				.then(m => m.SkillpointComponent),
	},
	{
		path: 'weather-cast',
		loadComponent: () =>
			import('./features/weather-cast/weather-cast.component')
				.then(m => m.WeatherCastComponent),
	},
	{ path: '**', redirectTo: '' },
];
