import { inject } from '@angular/core';
import { Router, Routes, type CanActivateFn } from '@angular/router';
import { SupabaseService } from './supabase.service';
export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService).supabase;
  const router = inject(Router);

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // User is logged in, redirect to home
    router.navigate(['/']);
    return false;
  }

  return true;
};

export const requireAuthGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService).supabase;
  const router = inject(Router);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // User is not logged in, redirect to auth
    router.navigate(['/auth']);
    return false;
  }

  return true;
};

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'auth',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/auth/auth.component').then(m => m.AuthComponent),
    },
    {
        path: 'account',
        canActivate: [requireAuthGuard],
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