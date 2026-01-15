import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-avatar',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  private supabase = inject(SupabaseService);

  avatarUrl = input<string | null>(null);
  size = input<'small' | 'large'>('large');
  upload = output<string>();
  
  protected uploading = signal(false);
  protected avatarImageUrl = computed(() => {
    const url = this.avatarUrl();
    if (!url) return null;
    
    // If it's already a full URL or base64, return as-is
    if (url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    
    // Otherwise, download from Supabase storage
    return this.getAvatarUrl(url);
  });

  protected async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;

    try {
      this.uploading.set(true);
      
      const { error: uploadError } = await this.supabase.uploadAvatar(filePath, file);
      
      if (uploadError) throw uploadError;

      this.upload.emit(filePath);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.uploading.set(false);
    }
  }

  private getAvatarUrl(path: string): string {
    const { data } = this.supabase.supabase
      .storage
      .from('avatars')
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}