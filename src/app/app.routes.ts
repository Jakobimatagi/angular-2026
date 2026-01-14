import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'auth',
        loadComponent: () =>
            import('./features/auth/auth.component').then(m => m.AuthComponent),
    },
    {
        path: 'account',
        loadComponent: () =>
            import('./features/user-page/account.component').then(m => m.AccountComponent),
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
    {
        path: 'todo-list',
        loadComponent: () =>
            import('./features/todo-list/todo-list.component')
                .then(m => m.TodoListComponent),
    },
    { path: '**', redirectTo: '' },
];