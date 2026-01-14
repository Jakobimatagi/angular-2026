import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Session } from '@supabase/supabase-js';
import { AvatarComponent } from "./features/user-page/avatar.component";
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatIconModule, MatButtonModule, MatProgressSpinnerModule, AvatarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  
  protected readonly title = signal('angular-practice');
  protected session = signal<Session | null>(null);
  protected loadingAuth = signal(true);
  protected avatarUrl = computed(() => {
    const currentSession = this.session();
    return currentSession?.user?.user_metadata?.['avatar_url'] ?? null;
  });

  constructor() {
    // Initialize session from Supabase
    this.supabaseService.supabase.auth.getSession().then(({ data: { session } }) => {
      this.session.set(session);
      this.loadingAuth.set(false);
    });

    // Listen for auth changes
    this.supabaseService.authChanges((_, session) => {
      this.session.set(session);
    });
  }

  protected async signOut(): Promise<void> {
    await this.supabaseService.signOut();
    this.router.navigate(['/']);
  }

  protected navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  protected navigateToLogin(): void {
    this.router.navigate(['/auth']);
  }
}