import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { VoteService, type ButtonVoteCount } from '../services/vote.service';
import { SupabaseService } from '../supabase.service';

interface Button {
  label: string;
  path: string;
}

interface ButtonWithVotes extends Button {
  score: number;
  upvotes: number;
  downvotes: number;
  userVote: -1 | 1 | null;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressSpinnerModule],
})
export class HomeComponent {
  private voteService = inject(VoteService);
  private supabaseService = inject(SupabaseService);

  private readonly baseButtons = signal<ReadonlyArray<Button>>([
    { label: 'Skill Point', path: '/skill-point-distributor' },
    { label: 'Weather Cast', path: '/weather-cast' },
    { label: 'Todo List', path: '/todo-list' },
  ]);

  private voteCounts = signal<ButtonVoteCount[]>([]);
  private userVotes = signal<Map<string, -1 | 1>>(new Map());
  protected loading = signal(true);
  protected votingInProgress = signal(false);
  protected userId = signal<string | null>(null);

  protected buttons = computed<ButtonWithVotes[]>(() => {
    const votes = this.voteCounts();
    const userVoteMap = this.userVotes();

    return this.baseButtons().map(button => {
      const voteData = votes.find(v => v.button_path === button.path);
      return {
        ...button,
        score: voteData?.score ?? 0,
        upvotes: voteData?.upvotes ?? 0,
        downvotes: voteData?.downvotes ?? 0,
        userVote: userVoteMap.get(button.path) ?? null
      };
    }).sort((a, b) => b.score - a.score);
  });

  constructor() {
    this.initializeVotes();
    this.subscribeToVoteChanges();
  }

  private async initializeVotes(showLoading = true): Promise<void> {
    try {
      if (showLoading) {
        this.loading.set(true);
      }
      
      const [voteCounts, { data: { user } }] = await Promise.all([
        this.voteService.getButtonVoteCounts(),
        this.supabaseService.supabase.auth.getUser()
      ]);

      this.voteCounts.set(voteCounts);

      if (user) {
        this.userId.set(user.id);
        await this.loadUserVotes(user.id);
      }
    } catch (error) {
      console.error('Error loading votes:', error);
    } finally {
      if (showLoading) {
        this.loading.set(false);
      }
    }
  }

  private async loadUserVotes(userId: string): Promise<void> {
    const userVoteMap = new Map<string, -1 | 1>();

    for (const button of this.baseButtons()) {
      try {
        const vote = await this.voteService.getUserVote(button.path, userId);
        if (vote) {
          userVoteMap.set(button.path, vote.vote_type);
        }
      } catch (error) {
        console.error(`Error loading user vote for ${button.path}:`, error);
      }
    }

    this.userVotes.set(userVoteMap);
  }

  private subscribeToVoteChanges(): void {
    this.voteService.subscribeToVoteChanges(() => {
      this.initializeVotes(false);
    });
  }

  protected async toggleVote(buttonPath: string, voteType: -1 | 1): Promise<void> {
    const currentUserId = this.userId();

    if (!currentUserId) {
      console.error('User must be logged in to vote');
      return;
    }

    try {
      this.votingInProgress.set(true);
      
      // Optimistically update the UI
      const currentVote = this.userVotes().get(buttonPath);
      const newUserVotes = new Map(this.userVotes());
      
      if (currentVote === voteType) {
        newUserVotes.delete(buttonPath);
      } else {
        newUserVotes.set(buttonPath, voteType);
      }
      this.userVotes.set(newUserVotes);

      await this.voteService.vote(buttonPath, currentUserId, voteType);
      await this.initializeVotes(false);
    } catch (error) {
      console.error('Error voting:', error);
      // Revert optimistic update on error
      await this.initializeVotes(false);
    } finally {
      this.votingInProgress.set(false);
    }
  }
}