import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Session } from '@supabase/supabase-js';
import { Profile, SupabaseService } from '../../supabase.service';
import { AvatarComponent } from './avatar.component';

@Component({
  selector: 'app-account',
  imports: [
    ReactiveFormsModule,
    AvatarComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  private supabase = inject(SupabaseService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  protected loading = signal(false);
  protected session = signal<Session | null>(null);
  protected profile = signal<Profile | null>(null);
  
  protected updateProfileForm: FormGroup = this.fb.group({
    display_name: ['', Validators.required],
    website: ['', Validators.pattern('https?://.+')],
    avatar_url: [''],
  });

  constructor() {
    this.supabase.supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session loaded:', session);
      if (session) {
        this.session.set(session);
        this.getProfile();
      } else {
        this.router.navigate(['/auth']);
      }
    });
  }

  protected get avatarUrl(): string {
    return this.updateProfileForm.value.avatar_url as string;
  }

  protected get userEmail(): string {
    return this.session()?.user?.email ?? '';
  }

  protected async updateAvatar(event: string): Promise<void> {
    console.log('Avatar updated:', event);
    this.updateProfileForm.patchValue({
      avatar_url: event,
    });
    await this.updateProfile();
  }

  private async getProfile(): Promise<void> {
    const currentSession = this.session();
    console.log('Getting profile for session:', currentSession);
    if (!currentSession?.user) return;

    try {
      this.loading.set(true);
      const { data: profile, error, status } = await this.supabase.profile(currentSession.user);
      
      console.log('Profile response:', { profile, error, status });

      // If profile doesn't exist (404 or 406), that's ok - we'll create it on save
      if (error && status !== 406) {
        throw error;
      }

      if (profile) {
        console.log('Profile data:', profile);
        this.profile.set(profile);
        this.updateProfileForm.patchValue({
          display_name: profile.display_name,
          website: profile.website,
          avatar_url: profile.avatar_url,
        });
        console.log('Form patched with:', this.updateProfileForm.value);
      } else {
        console.log('No profile found - will create on save');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading.set(false);
    }
  }

  protected async updateProfile(): Promise<void> {
    const currentSession = this.session();
    if (!currentSession?.user || this.updateProfileForm.invalid) {
      console.warn('Cannot update: invalid session or form');
      return;
    }

    try {
      this.loading.set(true);
      const { display_name, website, avatar_url } = this.updateProfileForm.value;
      
      const profileData: Profile = {
        id: currentSession.user.id,
        display_name,
        website: website || '',
        avatar_url: avatar_url || '',
      };
      
      console.log('Upserting profile with:', profileData);

      const { error, data } = await this.supabase.updateProfile(profileData);
      
      console.log('Upsert response:', { error, data });
      
      if (error) throw error;
      
      this.profile.set(profileData);
      console.log('Profile saved successfully');
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      }
    } finally {
      this.loading.set(false);
    }
  }

  protected async signOut(): Promise<void> {
    await this.supabase.signOut();
    this.router.navigate(['/']);
  }
}