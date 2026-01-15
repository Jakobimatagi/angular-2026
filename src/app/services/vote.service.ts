import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';

export interface Vote {
  id: string;
  user_id: string;
  button_path: string;
  vote_type: -1 | 1;
  created_at: string;
  updated_at: string;
}

export interface ButtonVoteCount {
  button_path: string;
  upvotes: number;
  downvotes: number;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private supabase = inject(SupabaseService).supabase;

  async getButtonVoteCounts(): Promise<ButtonVoteCount[]> {
    const { data, error } = await this.supabase
      .from('button_vote_counts')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async getUserVote(buttonPath: string, userId: string): Promise<Vote | null> {
    const { data, error } = await this.supabase
      .from('votes')
      .select('*')
      .eq('button_path', buttonPath)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async vote(buttonPath: string, userId: string, voteType: -1 | 1): Promise<void> {
    const existingVote = await this.getUserVote(buttonPath, userId);

    if (existingVote) {
      // If same vote type, remove vote (toggle off)
      if (existingVote.vote_type === voteType) {
        const { error } = await this.supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);

        if (error) throw error;
      } else {
        // Update to opposite vote
        const { error } = await this.supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);

        if (error) throw error;
      }
    } else {
      // Insert new vote
      const { error } = await this.supabase
        .from('votes')
        .insert({
          user_id: userId,
          button_path: buttonPath,
          vote_type: voteType
        });

      if (error) throw error;
    }
  }

  subscribeToVoteChanges(callback: (payload: any) => void) {
    return this.supabase
      .channel('votes_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        callback
      )
      .subscribe();
  }
}